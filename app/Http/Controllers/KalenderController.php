<?php

namespace App\Http\Controllers;

use App\Models\kalender;
use App\Http\Requests\StorekalenderRequest;
use App\Http\Requests\UpdatekalenderRequest;

class KalenderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schedule = kalender::all();
        return inertia('Kalender/index',[
            'schedule' => $schedule,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // $schedule = kalender::all();
        return inertia('Kalender/create', [
            // 'schedule' => $schedule,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorekalenderRequest $request)
    {
        // dd($request);
        $validated = $request->validate([
            'event_title' => 'required|string|max:255',
            'start' => 'required|string|max:255',
            'start_time' => 'required|string|max:255',
            'end' => 'required|string|max:255',
            'end_time' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        kalender::create([
            'title' => $validated['event_title'],
            'start' => $validated['start'] . ' ' . $validated['start_time'],
            'end' => $validated['end'] . ' ' . $validated['end_time'],
            'description' => $validated['description'],
        ]);

        return redirect()->route('kalender.index')->with('success', 'Event Noted!');
    }

    /**
     * Display the specified resource.
     */
    public function show(kalender $kalender)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(kalender $kalender)
    {
        // dd($kalender->id);
        return inertia('Kalender/edit', [
            'schedule' => $kalender,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatekalenderRequest $request, kalender $kalender)
    {
        // dd($kalender);
        $validated = $request->validate([
            'event_title' => 'required|string|max:255',
            'start' => 'required|string|max:255',
            'start_time' => 'required|string|max:255',
            'end' => 'required|string|max:255',
            'end_time' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        $id = $request->id;
        // dd($uuid);

        $kalender->update([
            'title' => $validated['event_title'],
            'start' => $validated['start'] . ' ' . $validated['start_time'],
            'end' => $validated['end'] . ' ' . $validated['end_time'],
            'description' => $validated['description'],
        ]);
        return redirect()->route('kalender.index')->with('success', 'Event Edited');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(kalender $kalender)
    {
        // dd($kalender);
        $id = $kalender->id;

        $del_task= kalender::where('id', $id);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_task->delete();
        // $del_status->delete();
        return redirect()->route('kalender.index')->with('deleted', 'Event deleted successfully.');
    }
}
