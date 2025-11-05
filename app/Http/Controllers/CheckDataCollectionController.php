<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\items;
use App\Models\ToolDataCollection;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CheckDataCollectionController extends Controller
{

    public function store(Request $request)
    {
        // $validatedData = $request->validate([
        //     'event_name' => 'string',
        //     'tanggal_event' => 'string',
        // ]);

        dd($request);
        $items = $request->items;
        foreach ($items as $index => $item) {
            // dd($item['checked']);
            # code...
            if (!empty($item['checked']) && $item['checked'] === true) {
                $itemData = items::find($item['id']); // shorter than $itemData = (items::where('id', $item['id'])->first());
                ToolDataCollection::create(
                    [
                        'event_name' => $request->event_name,
                        'items' => $itemData->name,
                        'category' => $itemData->category,
                        'quantity' => !empty($item['quantity']) ? $item['quantity'] : 1,
                        'tanggal' => $request->tanggal_event[0],
                    ]
                );
            }
        }
        return redirect()->route('items.index')->with('success', 'Task saved successfully!');
    }

    public function edit($event)
    {
        // $user = User::all();
        // $items = items::all();
        $dataEvent = ToolDataCollection::all()->where('event_name', $event);
        // dd($dataEvent);

        $eventDate = ToolDataCollection::select('tanggal')
            ->distinct()
            ->pluck('tanggal');
        
        // dd($dataEvent);

        return inertia('Items/check', [
            'userName' => Auth::user()->name,
            'dataEvent' => $dataEvent,
            'event' => $event,
            'tanggal' => $eventDate,
        ]);
    }   

    public function destroy($dataCollection)
    {
        $user = Auth::user();
        // dd($dataCollection, $user->name);
        $uuid = Str::uuid()->toString();

        $date = Carbon::now();

        audit::create([
            'uuid' => $uuid,
            'action' => 'Checked',
            'change_section' => "Data Tool Collections checked.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        $del_data_collection = ToolDataCollection::where('event_name', $dataCollection);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_data_collection->delete();
        // $del_status->delete();
        return redirect()->route('items.index')->with('message', 'Task deleted successfully.');
    }
}