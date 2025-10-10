<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatetaskRequest;
use App\Models\task;
use Illuminate\Http\Request;

class UpdateTaskSubmit extends Controller
{
    public function update(UpdatetaskRequest $request, task $task)
    {
        // $uuid = $task->uuid;
        // dd($request, $task->status);

        $update_task = task::where('uuid', $request->uuid); 
        $update_task->update([
            'status' => 'In Review'
        ]);
        return redirect()->route('task.index')->with('success', 'Task Updated');
    }
}