<?php

namespace App\Http\Controllers;

use App\Models\addAccount;
use App\Http\Requests\StoreaddAccountRequest;
use App\Http\Requests\UpdateaddAccountRequest;
use App\Models\audit;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
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
    public function create() {}

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
            'created_by' => 'required',
            'avatar' => 'nullable|file|image|max:8192',
        ]);

        $user = $request->user();
        
        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');

            // Debug line — check if file exists in disk
            // dd([
            //     'stored_path' => $path,
            //     'exists_in_storage' => Storage::disk('public')->exists($path),
            //     'full_path' => Storage::disk('public')->path($path),
            // ]);

            $user->avatar = $path;
        }

        // dd($user,$request->avatar, $user->avatar,$request->user()->avatar);

        // dd($request->role);
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role, // or just 'user'
            'team' => $request->team, // or just 'user'
            'avatar' => $user->avatar,
        ]);



        $date = Carbon::now('Asia/Jakarta');

        // dd($date->format('d F Y'));

        audit::create([
            'action' => 'Created',
            'change_section' => 'Add new Account named ' . $request->name,
            'created_by' => $request->created_by,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
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
        // dd($request, $user);mn
        $validated = $request->validate(
            [
                'name' => 'required|string|max:50',
                'role' => 'required|string|max:50',
                'team' => 'required|string|max:50',
                'email' => 'required|email',
                'password' => 'nullable|string|max:50',
                'created_by' => 'nullable|string|max:50',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',   
            ]
        );

        // dd($request, $user);  
        $id = $user->id;


        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Updated',
            'change_section' => 'Updated Account named ' . $validated['name'],
            'created_by' => $validated['created_by'],
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

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
