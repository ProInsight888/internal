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
            foreach ($calendars as $teamSlug => $calendarId) {
                $events = $events->merge(
                    Event::get(Carbon::now()->subYears(10), null, [], $calendarId)
                        ->map(function ($event) use ($teamSlug) {
                            $event->team_slug = $teamSlug;
                            return $event;
                        })
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
            'selectedTeams' => $request->query("team", "proinsight"),
        ]);
    }

    public function store(Request $request)
    {
        $currentView = $request->team; // what user is viewing

        $storeTeam = $currentView === 'proinsight'
            ? 'it'
            : $currentView;

        $calendarId = config("google-calendar.calendars.{$storeTeam}");
        abort_unless($calendarId, 404);

        $timezone = 'Asia/Jakarta';

        Event::create([
            'name' => $request->title,
            'startDateTime' => Carbon::parse(
                "{$request->start} {$request->start_time}",
                $timezone
            ),
            'endDateTime' => Carbon::parse(
                "{$request->end} {$request->end_time}",
                $timezone
            ),
            'description' => $request->description,
        ], $calendarId);

        audit::create([
            'action' => 'Created',
            'change_section' => "Add New Event ({$storeTeam})",
            'created_by' => Auth::user()->name,
            'date' => now('Asia/Jakarta')->format('d F Y'),
            'time' => now('Asia/Jakarta')->format('H:i'),
        ]);

        return redirect()
            ->route('calendar.index', ['team' => $currentView])
            ->with('success', 'Event Noted!');
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

    private function findEventInAnyCalendar(string $eventId): array
    {
        $calendars = config('google-calendar.calendars');

        foreach ($calendars as $team => $calendarId) {
            try {
                $event = Event::find($eventId, $calendarId);
                if ($event) {
                    return [$event, $team, $calendarId];
                }
            } catch (\Exception $e) {
                // Ignore and continue
            }
        }

        abort(404, 'Event not found in any calendar');
    }


    private function resolveCalendarId(string $team): string
    {
        $calendars = config('google-calendar.calendars');

        abort_unless(isset($calendars[$team]), 404);

        return $calendars[$team];
    }

    public function edit(Request $request, $id)
    {
        [$event, $team] = $this->findEventInAnyCalendar($id);

        return inertia('Calendar/edit', [
            'event' => $event,
            'team' => $team, // real team
        ]);
    }


    public function update(Request $request, $id)
    {
        [$event, $team, $calendarId] = $this->findEventInAnyCalendar($id);

        $timezone = 'Asia/Jakarta';

        $event->name = $request->title;
        $event->startDateTime = Carbon::parse(
            "{$request->start} {$request->start_time}",
            $timezone
        );
        $event->endDateTime = Carbon::parse(
            "{$request->end} {$request->end_time}",
            $timezone
        );
        $event->description = $request->description;

        $event->save();

        audit::create([
            'action' => 'Updated',
            'change_section' => "Updated Event ({$team})",
            'created_by' => Auth::user()->name,
            'date' => now('Asia/Jakarta')->format('d F Y'),
            'time' => now('Asia/Jakarta')->format('H:i'),
        ]);

        return redirect()->route('calendar.index', ['team' => 'proinsight']);
    }

    public function destroy(Request $request, $eventId)
    {
        [$event, $team] = $this->findEventInAnyCalendar($eventId);

        $event->delete();

        audit::create([
            'action' => 'Deleted',
            'change_section' => "Deleted Event ({$team})",
            'created_by' => Auth::user()->name,
            'date' => now('Asia/Jakarta')->format('d F Y'),
            'time' => now('Asia/Jakarta')->format('H:i'),
        ]);

        return redirect()
            ->route('calendar.index', ['team' => 'proinsight'])
            ->with('deleted', 'Event deleted!');
    }
}
