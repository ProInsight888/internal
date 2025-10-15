<?php

namespace App\Http\Controllers;

use App\Models\media;
use App\Models\newClient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index()
    {
        // $tasks = Task::with('result')->get();
        $tasks = media::with('companyCode')->get();
        $users = User::all();
        // dd($users);
        return inertia('Task/Media/index', [
            'tasks' => $tasks,
            'users' => $users,
            'userName' => Auth::user()->name,
        ]);
    }
    public function create()
    {
        $users = User::all();
        // dd($users);
        $companies = newClient::all();
        $task_title = media::select('task_title')
            ->distinct()
            ->orderBy('task_title')
            ->get();
        $task_format = media::select('task_format')
            ->distinct()
            ->orderBy('task_format')
            ->get();
        $description = media::select('description')
            ->distinct()
            ->orderBy('task_title')
            ->orderBy('description')
            ->get();
        return inertia('Task/Media/create', [
            'users' => $users,
            'companies' => $companies,
            'task_title' => $task_title,
            'task_format' => $task_format,
            'description' => $description
        ]);
    }

    public function store(Request $request)
    {
        // dd($request);
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

        media::create([
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

        return redirect()->route('media.index')->with('success', 'Task saved successfully!');
    }

    public function edit(media $media)
    {
        // dd($task);
        $users = User::all();
        $companies = newClient::all();
        $task_title = media::select('task_title')
            ->distinct()
            ->orderBy('task_title')
            ->get();
        $task_format = media::select('task_format')
            ->distinct()
            ->orderBy('task_format')
            ->get();
        $description = media::select('description')
            ->distinct()
            ->orderBy('task_title')
            ->orderBy('description')
            ->get();
        return inertia('Task/Media/edit', [
            'users' => $users,
            'task' => $media,
            'companies' => $companies,
            'task_title' => $task_title,
            'task_format' => $task_format,
            'description' => $description
        ]);
    }

    public function update(Request $request, media $media)
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

        $uuid = $media->uuid;
        // dd($uuid);

        $update_task = media::where('uuid', $uuid);
        $update_task->update($validated);
        // dd($update_task->update($validated));
        return redirect()->route('media.index')->with('success', 'Task Updated');
    }

    public function destroy(media $media)
    {
        $uuid = $media->uuid;
        // dd($uuid);  

        $del_task = media::where('uuid', $uuid);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_task->delete();
        // $del_status->delete();
        return redirect()->route('media.index')->with('message', 'Task deleted successfully.');
    }
}
