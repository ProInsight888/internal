<?php

namespace App\Http\Controllers;

use App\Models\creative;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class creativeReviewController extends Controller
{
    public function index()
    {
        $tasks = creative::all();
        $users = User::all();
        return Inertia('Result/Creative/creative_result', [
            'tasks' => $tasks,
            'users' => $users,
            'userName' => Auth::user()->name,
        ]);
    }

    public function update(Request $request, creative $creative)
    {
        // dd($it, $request);
        $validated = $request->validate([
            // 'link' => 'required|string|max:255',
            'checked_by' => 'required|max:255',
            'status' => 'required|max:255',
            'revision' => 'nullable|max:255',
        ]);

        $uuid = $request->uuid;
        // dd($uuid);

        $date = Carbon::now()->toDateString();
        $time = Carbon::now()->toTimeString();

        $update_task = creative::where('uuid', $uuid);
        $update_task->update([
            'result_link' => $validated['status'] === 'Rejected' ?? "",
            'checked_by' => $validated['checked_by'],
            'status' => $validated['status'],
            'revision' => $validated['revision'],
            'send_time' => $time,
            'send_date' => $date,
        ]);
        return redirect()->route('creative_review.index')->with('success', 'Task Updated');
    }
}
