<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\GoogleCalendar\Event;

// use Illuminate\Support\Facades\Event;

class GoogleCalendarController extends Controller
{
    public function index(Request $request){
        $calendarId = config('google-calendar.calendar_id');
        $events = Event::get(Carbon::now()->subYears(10), null, [], $calendarId);
        
        // dd($request);
        return inertia('Calendar/index', [
            'ev' => $events,
        ]);
    }

    public function create()
    {
        // $schedule = kalender::all();
        return inertia('Calendar/create', [
            // 'schedule' => $schedule,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request);
        $dateStart = $request->start;
        $timeStart = $request->start_time;
        $dateEnd = $request->end;
        $timeEnd = $request->end_time;
        
        $calendarId = config('google-calendar.calendar_id');


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
            'name' => $event->name,
            'startDateTime' => $event->startDateTime,
            'endDateTime' => $event->endDateTime,
            'description' => $event->description,
        ], $calendarId);

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


    private function resolveCalendarId($alias)
    {
        $calendars = config('google-calendar.calendar_id');

        // dd($alias, $calendars);
        return $calendars;
    }

    public function edit(Request $request, $calendar)
    {
        $calendarId = $this->resolveCalendarId($request->calendar_id);
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
        $calendars = config('google-calendar.calendar_id');
        
        // dd($request, $id);

        // Fetch the event from Google Calendar by ID + calendarId
        $event = Event::find($id, $calendars); // ✅ CORRECT way to fetch existing event

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

        return redirect()->route('calendar.index', 'proinsight888@gmail.com')->with('success', 'Event updated!');
    }



    public function destroy($eventId)
    {
        $event = Event::find($eventId);

        if ($event) {
            $event->delete();
            return redirect()->route('calendar.index')->with('deleted', 'Event deleted!');
        }

        return response()->json(['message' => 'Not found'], 404);
    }
}

