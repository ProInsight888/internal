<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\items;
use App\Models\newClient;
use App\Models\ToolDataCollection;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ToolDataCollectionController extends Controller
{
    public function create()
    {
        $users = User::all();
        $items = items::all();
        return inertia('Items/data_collections', [
            'users' => $users,
            'items' => $items,
        ]);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'event_name' => 'string',
            'tanggal_event' => 'string',
        ]);
        
        $items = $request->items;

        $uuid = Str::uuid()->toString();

        $date = Carbon::now();

        audit::create([
            'uuid' => $uuid,
            'action' => 'Create',
            'change_section' => "Add New Tool Data Collections.",
            'created_by' => $request->created_by,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);
        
        // dd($items, $request);
        foreach ($items as $index => $item) {
            // dd($item['checked']);
            # code...
            if(!empty($item['checked']) && $item['checked'] === true){
                $itemData = items::find($item['id']); // shorter than $itemData = (items::where('id', $item['id'])->first());
                ToolDataCollection::create([
                    'event_name' => $validatedData['event_name'],
                    'items' => $itemData->name,
                    'category'=>$itemData->category,
                    'quantity' => !empty($item['quantity']) ? $item['quantity'] : 1,
                    'tanggal' => $validatedData['tanggal_event'],
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
        $items = items::all();
        // dd($dataEvent);

        return inertia('Items/edit_data_collection', [
            'userName' => Auth::user()->name,
            'dataEvent' => $dataEvent,
            'event' => $event,
            'tanggal' => $eventDate,
            'items' => $items
        ]);
    }
    
    public function destroy($dataCollection)
    {
        
        $user = Auth::user();
        // dd( $user);
        $uuid = Str::uuid()->toString();
        
        $date = Carbon::now();
        
        audit::create([
            'uuid' => $uuid,
            'action' => 'Deleted',
            'change_section' => "Deleted Collections.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        $del_daat_collection = ToolDataCollection::where('event_name', $dataCollection);
        // $del_status= task_status::where('task_uuid', $uuid);
        $del_daat_collection->delete();
        // $del_status->delete();
        // return redirect()->route('items.index')->with('message', 'Task deleted successfully.');
    }
}
