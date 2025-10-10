<?php

namespace App\Http\Controllers;

use App\Models\addAccount;
use App\Http\Requests\StoreaddAccountRequest;
use App\Http\Requests\UpdateaddAccountRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AddAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();
        return Inertia::render('AddAccount/index', [
            'users' => $users,
            'userName' => Auth::user()->name,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreaddAccountRequest $request)
    {

        // dd($request);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required', // or default to 'user
            'team' => 'required', // or default to 'user
        ]);
        
        // dd($request->role);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role, // or just 'user'
            'team' => $request->team, // or just 'user'
        ]);



        // Auth::login($user); // This Line is for Automaticlly Login when make an Account

        return Redirect::to('add_account')->with('success', 'Account Added!'); // Or anywhere else
    }

    /**
     * Display the specified resource.
     */
    public function show(addAccount $addAccount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(user $user)
    {
        return Inertia::render('AddAccount/edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateaddAccountRequest $request, user $user)
    {
        $validated = $request->validate(
            [
                'name' => 'required|string|max:50',
                'role' => 'required|string|max:50',
                'team' => 'required|string|max:50',
                'email' => 'required|email',
                'password' => 'nullable|string|max:50', 
                ]
            );
            
            // dd($request, $user);  
        $id = $user->id;

        $update_user = User::where('id', $id);
        $update_user->update([
            'name' => $validated['name'],
            'role' => $validated['role'],
            'team' => $validated['team'],
            'email' => $validated['email'],
            'password' => $validated['password']
                ? Hash::make($validated['password'])
                : $user->password
        ]);

        // dd($update_user);
        return Redirect::to('/add_account')->with('success', 'Account Edited!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        // $user->session()->invalidate();
        // $user->session()->regenerateToken();

        return Redirect::to('/add_account')->with('deleted', 'Account Deleted');
    }
}
