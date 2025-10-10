<?php

namespace App\Http\Controllers;

use App\Models\it;
use Carbon\Carbon;
use Illuminate\Http\Request;

class update_submit_it_task extends Controller
{
    public function update(Request $request, it $it)
    {
        // dd($it, $request);
        $validated = $request->validate([
            'link' => 'required|string|max:255',
            'sended_by' => 'required|string'
            // 'checked_by' => 'required|max:255',
            // 'status' => 'required|max:255',
            // 'revision' => 'required|max:255',
        ]);
        
        $uuid = $it->uuid;
        // dd($uuid);

        $date = Carbon::now()->toDateString();
        $time = Carbon::now()->toTimeString();

        $update_task = it::where('uuid', $uuid);
        $update_task->update([
            'result_link' => $validated['link'],
            'sended_by' => $validated['sended_by'],
            'status' =>  'In Review',
            'send_time' => $time,
            'send_date' => $date,
        ]);
        return redirect()->route('it.index')->with('success', 'Task Updated');
    }
}
