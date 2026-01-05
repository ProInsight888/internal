<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\creative;
use App\Models\newClient;
use App\Models\task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CreativeController extends Controller
{
    public function index(){
        $tasks = creative::with('company')->get();
        $users = User::all();
        return Inertia::render('Task/Creative/index', [
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
        $task_title = creative::select('task_title')
            ->distinct()
            ->orderBy('task_title')
            ->get();
        $task_format = creative::select('task_format')
            ->distinct()
            ->orderBy('task_format')
            ->get();
        $description = creative::select('description')
            ->distinct()
            ->orderBy('task_title')
            ->orderBy('description')
            ->get();
        return inertia('Task/Creative/create', [
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

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Created',
            'change_section' => "Created Creative Task.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        $formUuid = Str::uuid()->toString();

        creative::create([
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

        return redirect()->route('creative.index')->with('success', 'Task saved successfully!');
    }

    public function edit(creative $creative)
    {
        // dd($creative);
        $users = User::all();
        $companies = newClient::all();
        $task_title = creative::select('task_title')
            ->distinct()
            ->orderBy('task_title')
            ->get();
        $task_format = creative::select('task_format')
            ->distinct()
            ->orderBy('task_format')
            ->get();
        $description = creative::select('description')
            ->distinct()
            ->orderBy('task_title')
            ->orderBy('description')
            ->get();
        return inertia('Task/Creative/edit', [
            'users' => $users,
            'task' => $creative,
            'companies' => $companies,
            'task_title' => $task_title,
            'task_format' => $task_format,
            'description' => $description
        ]);
    }

    public function update(Request $request, creative $creative)
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

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Updated',
            'change_section' => "Updated Creative Task.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);


        $uuid = $creative->uuid;
        // dd($uuid);

        $update_task = creative::where('uuid', $uuid);
        $update_task->update($validated);
        // dd($update_task->update($validated));
        return redirect()->route('creative.index')->with('success', 'Task Updated');
    }

    public function destroy(creative $creative)
    {
        $uuid = $creative->uuid;
        // dd($uuid);

        $user = Auth::user();
        // dd($dataCollection, $user->name);
        $uuid_new = Str::uuid()->toString();

        $date = Carbon::now();

        audit::create([
            'uuid' => $uuid_new,
            'action' => 'Deleted',
            'change_section' => "Deleted Creative Task.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        $del_task = creative::where('uuid', $uuid);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_task->delete();
        // $del_status->delete();
        return redirect()->route('creative.index')->with('message', 'Task deleted successfully.');
    }
}