<?php

namespace App\Http\Controllers;

use App\Models\creative;
use Carbon\Carbon;
use Illuminate\Http\Request;

class update_submit_creative_task extends Controller
{
    public function update(Request $request, creative $creative)
    {

        // dd($creative);
        $validated = $request->validate([
            'link' => 'required|string|max:255',
            'sended_by' => 'required|string'
            // 'checked_by' => 'required|max:255',
            // 'status' => 'required|max:255',
            // 'revision' => 'required|max:255',
        ]);

        $uuid = $creative->uuid;

        $date = Carbon::now()->toDateString();
        $time = Carbon::now()->toTimeString();

        $update_task = creative::where('uuid', $uuid);
        $update_task->update([
            'result_link' => $validated['link'],
            'sended_by' => $validated['sended_by'],
            'status' => 'In Review',
            'send_time' => $time,
            'send_date' => $date,
        ]);
        return redirect()->route('creative.index')->with('success', 'Task Updated');
    }
}
