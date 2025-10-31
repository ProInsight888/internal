<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\marketing;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class update_submit_marketing_task extends Controller
{
    public function update(Request $request, marketing $marketing)
    {

        $validated = $request->validate([
            'link' => 'required|string|max:255',
            'sended_by' => 'required|string'
            // 'checked_by' => 'required|max:255',
            // 'status' => 'required|max:255',
            // 'revision' => 'required|max:255',
        ]);

        $uuid = $marketing->uuid;
        // dd($uuid);

        $date = Carbon::now()->toDateString();
        $time = Carbon::now()->toTimeString();

        $user = Auth::user();

        $uuid_new = Str::uuid()->toString();

        $date_audit = Carbon::now();

        audit::create([
            'uuid' => $uuid_new,
            'action' => 'Submit',
            'change_section' => "Submitted " . $marketing->task_title . " Task from Creative Task.",
            'created_by' => $user->name,
            'date' => $date_audit->format('d F Y'),
            'time' => $date_audit->format('H:i'),
        ]);

        $update_task = marketing::where('uuid', $uuid);
        $update_task->update([
            'result_link' => $validated['link'],
            'sended_by' => $validated['sended_by'],
            'status' => 'In Review',
            'send_time' => $time,
            'send_date' => $date,
        ]);
        return redirect()->route('marketing.index')->with('success', 'Task Updated');
    }
}
