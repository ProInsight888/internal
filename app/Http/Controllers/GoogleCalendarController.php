<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\GoogleCalendar\Event;

// use Illuminate\Support\Facades\Event;

class GoogleCalendarController extends Controller
{
    public function index(Request $request)
    {
        $team = $request->query('team', 'proinsight');
        $calendars = config('google-calendar.calendars');

        $events = collect();

        if ($team === 'proinsight') {
            // ALL calendars
            foreach ($calendars as $calendarId) {
                $events = $events->merge(
                    Event::get(Carbon::now()->subYears(10), null, [], $calendarId)
                );
            }
        } else {
            abort_unless(isset($calendars[$team]), 404);

            $events = Event::get(
                Carbon::now()->subYears(10),
                null,
                [],
                $calendars[$team]
            );
        }

        return inertia('Calendar/index', [
            'ev' => $events->values(),
            'selectedTeams' => $team,
            'team' => [
                ['id' => 'proinsight', 'name' => 'All Teams'],
                ['id' => 'it', 'name' => 'IT'],
                ['id' => 'media', 'name' => 'Media'],
                ['id' => 'creative', 'name' => 'Creative'],
            ],
        ]);
    }


    public function create(Request $request)
    {
        // $schedule = kalender::all();
        return inertia('Calendar/create', [
            // 'schedule' => $schedule,
            'selectedTeams' => $request->query("team", "proinsight"),
        ]);
    }

    public function store(Request $request)
    {
        // dd($request);
        $dateStart = $request->start;
        $timeStart = $request->start_time;
        $dateEnd = $request->end;
        $timeEnd = $request->end_time;

        $calendarId = config("google-calendar.calendars.{$request->team}");

        $event = new Event;

        $timezone = 'Asia/Jakarta';

        $event->name = $request->title;
        $event->startDateTime = Carbon::parse("{$dateStart} {$timeStart}", $timezone);
        $event->endDateTime = Carbon::parse("{$dateEnd} {$timeEnd}", $timezone);
        $event->description = $request->description;
        // dd($request->$calendarId);
        // dd($event->startDateTime);
        // dd($event->endDateTime);
        // dd($calendarId);
        // Gunakan static method `create()` dengan parameter kedua untuk calendarId
        Event::create([
            'name' => $request->title,
            'startDateTime' => Carbon::parse("{$dateStart} {$timeStart}", 'Asia/Jakarta'),
            'endDateTime' => Carbon::parse("{$dateEnd} {$timeEnd}", 'Asia/Jakarta'),
            'description' => $request->description,
        ], $calendarId);

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Created',
            'change_section' => "Add New Event.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        return redirect()->route('calendar.index')->with('success', 'Event Noted!');
    }

    public function show($calendar)
    {
        $calendarId = $this->resolveCalendarId($calendar);
        $events = Event::get(Carbon::now()->subYears(10), null, [], $calendarId);
        // dd($events, $calendarId);

        return inertia('Calendar/index', [
            'ev' => $events,
            'ca' => $calendar
        ]);;
    }


    private function resolveCalendarId(string $team): string
    {
        $calendars = config('google-calendar.calendars');

        abort_unless(isset($calendars[$team]), 404);

        return $calendars[$team];
    }


    public function edit(Request $request, $calendar)
    {
        $calendarId = $this->resolveCalendarId($request->team);
        // dd($calendarId, $calendar);
        $events = Event::get(Carbon::now()->subYears(10), null, [], $calendarId);

        // Find the event by ID
        $selectedEvent = null;
        foreach ($events as $event) {
            if ($event->googleEvent->id === $calendar) {
                $selectedEvent = $event;
                break;
            }
        }

        if (!$selectedEvent) {
            return abort(404, 'Event not found in this calendar');
        }

        return inertia('Calendar/edit', [
            'event' => $selectedEvent,
        ]);
    }

    public function update(Request $request, $id)
    {

        // $calendarId = $this->resolveCalendarId($calendar);
        $calendarId = config("google-calendar.calendars.{$request->team}");
        
        // dd($request, $id);

        // Fetch the event from Google Calendar by ID + calendarId
        $event = Event::find($id, $calendarId); // ✅ CORRECT way to fetch existing event

        $dateStart = $request->start;
        $timeStart = $request->start_time;
        $dateEnd = $request->end;
        $timeEnd = $request->end_time;

        if (!$event) {
            return back()->withErrors(['event' => 'Event not found']);
        }
        $timezone = 'Asia/Jakarta';

        // Update fields
        $event->name = $request->title;
        $event->startDateTime = Carbon::parse("{$request->start} {$request->start_time}", $timezone);
        $event->endDateTime = Carbon::parse("{$request->end} {$request->end_time}", $timezone);
        $event->description = $request->description;

        $event->save(); // ✅ Save back to Google Calendar

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Updated',
            'change_section' => "Updated A Event.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        return redirect()->route('calendar.index', ['team' => 'proinsight']);
    }



    public function destroy(Request $request, $eventId)
    {
        $calendarId = config("google-calendar.calendars.{$request->team}");

        abort_unless($calendarId, 404);

        $event = Event::find($eventId, $calendarId);

        abort_unless($event, 404);

        $event->delete();

        audit::create([
            'action' => 'Deleted',
            'change_section' => "Deleted an Event.",
            'created_by' => Auth::user()->name,
            'date' => now('Asia/Jakarta')->format('d F Y'),
            'time' => now('Asia/Jakarta')->format('H:i'),
        ]);

        return redirect()
            ->route('calendar.index', ['team' => $request->team])
            ->with('deleted', 'Event deleted!');
    }
}

