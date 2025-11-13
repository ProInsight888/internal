<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\items;
use App\Http\Requests\StoreitemsRequest;
use App\Http\Requests\UpdateitemsRequest;
use App\Models\newClient;
use App\Models\ToolDataCollection;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::all();
        $items = items::all();
        $toolDataCollection = ToolDataCollection::all();
        $eventNames = ToolDataCollection::select('event_name')
            ->distinct()
            ->pluck('event_name');
        $category = items::distinct()->pluck('category');
        // dd($category);

        return inertia('Items/index', [
            'userName' => Auth::user()->name,
            'items' => $items,
            'tool_data_collection' => $toolDataCollection,
            'events_name' =>$eventNames,
            'category' => $category,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all();
        $companies = newClient::all();
        $category = items::pluck('category')
            ->unique()
            ->sort()
            ->values()
            ->toArray();
        // dd($category);
        return inertia('Items/create', [
            'users' => $users,
            'category' => $category,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreitemsRequest $request)
    {
        // dd($request);
        $validatedData = $request->validated();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Created',
            'change_section' => "New item '{$request->items}' added to category '{$request->category}' (Qty: {$request->quantity}).",
            'created_by' => $request->created_by,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);


        items::create([
            'name' => $validatedData['items'],
            'category' => $validatedData['category'],
            'quantity' => $validatedData['quantity'],
        ]);
        return redirect()->route('items.index')->with('success', 'Task saved successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(items $items)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(items $items, $id)
    {
        // dd($items, $id);
        $items_select = items::all()->where('id', $id);
        return Inertia('Items/edit', [
            'items_select' => $items_select,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateitemsRequest $request, items $items, $id)
    {

        $validatedData = $request->validated();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Updated',
            'change_section' => "New item '{$request->items}' added to category '{$request->category}' (Qty: {$request->quantity}).",
            'created_by' => $request->created_by,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        $items = items::where('id', $id);
        // Update existing record
        // $items->update($validatedData);
        $items->update([
            'name' => $validatedData['items'], // or whatever field name you use
            'category' => $validatedData['category'],
            'quantity' => $validatedData['quantity'],
        ]);

        return redirect()->route('items.index')->with('success', 'Task updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(items $items, $id)
    {
        // dd($items, $id);
        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Deleted',
            'change_section' => "Data Tool Collections checked.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        $del_data_collection = items::where('id', $id);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_data_collection->delete();
        // $del_status->delete();
        return redirect()->route('items.index')->with('message', 'Task deleted successfully.');
    }
}
