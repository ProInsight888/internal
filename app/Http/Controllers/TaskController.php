<?php

namespace App\Http\Controllers;

use App\Models\newClient;
use App\Models\task;
use App\Http\Requests\StoretaskRequest;
use App\Http\Requests\UpdatetaskRequest;
use App\Models\User;
use GrahamCampbell\ResultType\Success;
use Illuminate\Console\View\Components\Task as ComponentsTask;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {        
        $tasks = Task::all();
        
        $users = User::select('id', 'name', 'avatar')

        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'avatar_url' => $user->avatar
                ? asset('storage/' . $user->avatar)
                : null,
            ];
        });
        

        return inertia('Task/index', [
            'tasks' => $tasks,
            'users' => $users,
            'auth' => [
                'user' => [
                    'id' => Auth::user()->id,
                    'name' => Auth::user()->name,
                    'avatar_url' => Auth::user()->avatar
                        ? asset('storage/' . Auth::user()->avatar)
                        : null,
                ],
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();
        $companies = newClient::all();
        $task_title = task::select('task_title')
            ->distinct()
            ->orderBy('task_title')
            ->get();
        $task_format = task::select('task_format')
            ->distinct()
            ->orderBy('task_format')
            ->get();
        $description = task::select('description')
            ->distinct()
            ->orderBy('task_title')
            ->orderBy('description')
            ->get();
        return inertia('Task/create', [
            'users' => $users,
            'companies' => $companies,
            'task_title' => $task_title,
            'task_format' => $task_format,
            'description' => $description
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoretaskRequest $request)
    {
        $validatedData = $request->validate([
            'task_title' => 'string|required',
            'description' => 'string|required',
            'penanggung_jawab' => 'required',
            'task_format' => 'string|required',
            'status' => 'string|required',
            'company' => 'required',
            'category' => 'string|required',
            'deadline' => 'string|required',
        ]);
        // dd($request);


        $formUuid = Str::uuid()->toString();

        task::create([
            'uuid' => $formUuid,
            'task_title' => $validatedData['task_title'],
            'description' => $validatedData['description'],
            'penanggung_jawab' => $validatedData['penanggung_jawab'],
            'task_format' => $validatedData['task_format'],
            'status' => $validatedData['status'],  // Use validated data here
            'company' => $validatedData['company'],
            'category' => $validatedData['category'],
            'deadline' => $validatedData['deadline'],
        ]);
        return redirect()->route('task.index')->with('success', 'Task saved successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(task $task)
    {
        $users = User::all();
        $companies = newClient::all();
        $task_title = task::select('task_title')
            ->distinct()
            ->orderBy('task_title')
            ->get();
        $task_format = task::select('task_format')
            ->distinct()
            ->orderBy('task_format')
            ->get();
        $description = task::select('description')
            ->distinct()
            ->orderBy('task_title')
            ->orderBy('description')
            ->get();
        return inertia('Task/edit', [
            'users' => $users,
            'task' => $task,
            'companies' => $companies,
            'task_title' => $task_title,
            'task_format' => $task_format,
            'description' => $description
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatetaskRequest $request, task $task)
    {
        // dd( $request);
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

        $uuid = $task->uuid;
        // dd($uuid);

        $update_task = task::where('uuid', $uuid);
        $update_task->update($validated);
        return redirect()->route('task.index')->with('success', 'Task Updated');
    }

    /**
     * Remove the specified resource  from storage.
     */
    public function destroy(task $task)
    {
        $uuid = $task->uuid;
        // dd($uuid);

        $del_task = task::where('uuid', $uuid);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_task->delete();
        // $del_status->delete();
        return redirect()->route('task.index')->with('message', 'Task deleted successfully.');
    }
}
