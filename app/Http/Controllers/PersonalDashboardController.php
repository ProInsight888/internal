<?php

namespace App\Http\Controllers;

use App\Models\absen;
use App\Models\personalDashboard;
use App\Http\Requests\StorepersonalDashboardRequest;
use App\Http\Requests\UpdatepersonalDashboardRequest;
use App\Models\task;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PersonalDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $absens = absen::all();
        $tasks = task::all();
        return Inertia::render('PersonalDashboard/index',[
            'absens' => $absens,
            'userName' => Auth::user()->name,
            'users' => Auth::user(),
            'tasks' => $tasks,
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
    public function store(StorepersonalDashboardRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(personalDashboard $personalDashboard)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(personalDashboard $personalDashboard)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatepersonalDashboardRequest $request, personalDashboard $personalDashboard)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(personalDashboard $personalDashboard)
    {
        //
    }
}
