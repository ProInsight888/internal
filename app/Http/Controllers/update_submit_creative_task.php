<?php

namespace App\Http\Controllers;

use App\Models\creative;
use Illuminate\Http\Request;

class update_submit_creative_task extends Controller
{
    public function update(Request $request, creative $creative)
    {

        dd($creative);
        $validated = $request->validate([
            'task_title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'penanggung_jawab' => 'nullable|string',
            'task_format' => 'nullable|string',
            'status' => 'nullable|string',
            'company' => 'nullable|string',
            'category' => 'nullable|string',
            'deadline' => 'nullable|date',
        ]);

        // dd( $request);
        $uuid = $creative->uuid;
        // dd($uuid);

        $update_task = creative::where('uuid', $uuid);
        $update_task->update($validated);
        // dd($update_task->update($validated));
        return redirect()->route('creative.index')->with('success', 'Task Updated');
    }
}
