<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Profile/Index', [
            'auth' => [
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar_url' => $request->user()->avatar
                        ? asset('storage/' . $request->user()->avatar)
                        : null,
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        
        \Log::info('ProfileController@update hit');
        // dd('controller hit', $request->all(), $request->file('avatar'));

        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|file|image|max:8192',
            'current_password' => 'nullable|string',
            'new_password' => 'nullable|string|min:8|confirmed',
        ]);
        

        // Handle avatar upload
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

        // dd($request);

        // Handle password change
        if (!empty($validated['current_password']) && !empty($validated['new_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'Current password is incorrect.']);
            }

            $user->password = Hash::make($validated['new_password']);
        }
        
        $user->name = $validated['name'];
        $user->save();

        return redirect()->route('profile.index');
    }



    public function removeAvatar(Request $request)
    {
        $user = $request->user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = null;
        $user->save();

        return back()->with('success', 'Avatar removed.');
    }
    
}
