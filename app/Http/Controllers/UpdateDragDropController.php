<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatekalenderRequest;
use App\Models\audit;
use App\Models\kalender;
use Carbon\Carbon;
use Google\Service\Calendar\Calendar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Event;
use Spatie\GoogleCalendar\Event as GoogleCalendarEvent;

class UpdateDragDropController extends Controller
{
    public function update(Request $request, Calendar $calenda)
    {
        // dd($request->all());
        $calendarId = config('google-calendar.calendar_id');
        $id = $request->id;

        $event = GoogleCalendarEvent::find($id, $calendarId); // ✅ CORRECT way to fetch existing event

        $dateStart = $request->start;
        $timeStart = $request->start_time;
        $dateEnd = $request->end;
        $timeEnd = $request->end_time;

        if (!$event) {
            return back()->withErrors(['event' => 'Event not found']);
        }

        $timezone = 'Asia/Jakarta';

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Updated',
            'change_section' => "Updated A Event.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        // Update fields
        $event->name = $request->title;
        $event->startDateTime = Carbon::parse("{$request->start} {$request->start_time}", $timezone);
        $event->endDateTime = Carbon::parse("{$request->end} {$request->end_time}", $timezone);
        $event->description = $request->description;

        $event->save(); // ✅ Save back to Google Calendar
        return redirect()->route('calendar.index');
    }

}
