<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatekalenderRequest;
use App\Models\kalender;
use Illuminate\Http\Request;

class UpdateDragDropController extends Controller
{
    public function update(UpdatekalenderRequest $request, kalender $kalender)
    {
        // dd($request->all());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|string|max:255',
            'end' => 'required|string|max:255',
            'description' => 'required|string|max:255',
        ]);

        $id = $request->id;
        // dd($uuid);

        $update_task = kalender::where('id', $id);
        $update_task->update($validated);
        return redirect()->route('kalender.index');
    }

}
