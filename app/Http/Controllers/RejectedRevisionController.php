<?php

namespace App\Http\Controllers;

use App\Models\rejectedRevision;
use Illuminate\Http\Request;

class RejectedRevisionController extends Controller
{
    //
    public function store(Request $request)
    {
        // dd($request);
        $validated = $request->validate([
            'uuid' => 'required|string',
            'revision' => 'required|string'
        ]) ;

        rejectedRevision::create([
            'task_uuid' => $validated['uuid'],
            'revision' => $validated['revision']
        ]);
    }
    
}
