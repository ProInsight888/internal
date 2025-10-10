<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(User $user): Response
    {
        // dd($user->email);
        
        return Inertia::render('AddAccount/edit', [
            'user'=>$user
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request, user $user)
    {
        // dd($request);
        $validated = $request->validate(
            [
                'name' => 'required|string|max:50',
                'role' => 'required|string|max:50',
                'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
                'password' => 'nullable|string|max:50',
            ]
        );

        $id = $user->id;
        
        $update_user = User::where('id', $id);
        $update_user->update([
            'name' => $validated['name'],
            'role' => $validated['role'],
            'email' => $validated['email'],
            'password' => $validated['password'] 
                ? Hash::make($validated['password']) 
                : $user->password,
        ]);
        return Redirect::to('/add_account')->with('success', 'Account Edited!');

    }

    /**
     * Delete the user's account.
     */
    public function destroy(User $user): RedirectResponse
    {
        // dd($user);
        // $request->validate([
        //     'password' => ['required', 'current_password'],
        // ]);

        // $userSelected = $user->user();

        // Auth::logout();

        $user->delete();

        // $user->session()->invalidate();
        // $user->session()->regenerateToken();

        return Redirect::to('/add_account')->with('deleted', 'Account Deleted');
    }
}
