<?php

namespace App\Http\Controllers;

use App\Models\it;
use App\Models\result;
use App\Http\Requests\StoreresultRequest;
use App\Http\Requests\UpdateresultRequest;
use App\Models\task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResultController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $tasks = Task::with('result')->get();
        $tasks = it::with(['result', 'rejectedRevision'])->get();
        $users = User::all();
        return inertia('Result/index', [
            'tasks' => $tasks,
            'users' => $users,
            'userName' => Auth::user()->name,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreresultRequest $request)
    {
        $validatedData = $request->validate([
            'uuid' => 'required|string',
            'link' => 'required|string',
        ]);

        

        result::create([
            'task_uuid' => $validatedData['uuid'],
            'link' => $validatedData['link'],
        ]);

        return redirect()->route('task.index')->with('success', 'Congrats! You Finish Your Task!😍');
    }

    /**
     * Display the specified resource.
     */
    public function show(result $result)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(result $result)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateresultRequest $request, result $result)
    {
        
        // dd($request);    
        $updated_task = task::where('uuid', $request->uuid);
        
        $updated_task->update([
            'status' => $request->status
        ]);


        return redirect()->route('result.index')->with('success', 'Congrats! You Finish Your Task!😍');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Result $result)
    {

        // dd($result);
        $uuid = $result->task_uuid;
        // dd($uuid);
        
        $del_result = result::where('task_uuid', $uuid);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_result->delete();
        // dd($del_result);
        // $del_status->delete();
        // return redirect()->route('task.index')->with('message', 'Task deleted successfully.');
    }
}
