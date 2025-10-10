<?php

namespace App\Http\Controllers;

use App\Models\it;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class itReviewController extends Controller
{
    public function index()
    {
        $tasks = it::all();
        $users = User::all();
        return Inertia('Result/IT/it_result', [
            'tasks' => $tasks,
            'users' => $users,
            'userName' => Auth::user()->name,
        ]);
    }

    public function update(Request $request, it $it)
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

        $update_task = it::where('uuid', $uuid);
        $update_task->update([
            'result_link' => $validated['status'] === 'Rejected' ?? "",
            'checked_by' => $validated['checked_by'],
            'status' => $validated['status'],
            'revision' => $validated['revision'],
            'send_time' => $time,
            'send_date' => $date,
        ]);
        return redirect()->route('it_review.index')->with('success', 'Task Updated');
    }
}
