<?php

namespace App\Http\Controllers;

use App\Models\absen;
use App\Http\Requests\StoreabsenRequest;
use App\Http\Requests\UpdateabsenRequest;
use App\Models\newClient;
use App\Models\task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Redirect;
use PhpParser\Node\Stmt\Return_;

class AbsenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $absens = absen::all();
        $user = User::all();
        return inertia('Absen/index',  [
            'absens' => $absens,
            'user' => $user
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
    public function store(StoreabsenRequest $request)
    {
        // dd($request);
        $user = Auth::user();
        $nowDate = now('Asia/Jakarta')->toDateString();
        $nowTime = now('Asia/Jakarta')->toTimeString();

        $validated = $request->validate([
            'absence' => 'required|string'
        ]);

        $todayAbsen = absen::where('user', $user->name)
            ->where('tanggal', $nowDate)
            ->where('status', '!=', 'Lembur') // hanya status utama
            ->first();

        $todayLembur = absen::where('user', $user->name)
            ->where('tanggal', $nowDate)
            ->where('status', 'Lembur')
            ->first();

        if (in_array($validated['absence'], ['Hadir', 'Ketemu Client'] )) {
            if (!$todayAbsen) {
                absen::create([
                    'user' => $user->name,
                    'status' => $validated['absence'],
                    'tanggal' => $nowDate,
                    'jam_datang' => $nowTime,
                ]);
            } else {
                return Redirect::back()->withErrors(['absence' => 'You already submitted Hadir today.']);
            }
        }
        
        if ($validated['absence'] === 'Lembur') {
            if (!$todayLembur) {
                absen::create([
                    'user' => $user->name,
                    'status' => 'Lembur',
                    'tanggal' => $nowDate,
                    'jam_datang' => $nowTime,
                ]);
            } else {
                return Redirect::back()->withErrors(['absence' => 'You already submitted Lembur today.']);
            }
        }

        if ($validated['absence'] === 'Balek') {
            if ($todayAbsen && !$todayAbsen->jam_balek) {
                $todayAbsen->update([
                    'jam_balek' => $nowTime
                ]);
            } else {
                return Redirect::back()->withErrors(['absence' => 'Cannot Balek without Hadir or already Balek.']);
            }
        }

        if ($validated['absence'] === 'Pulang Lembur') {
            if ($todayLembur && !$todayLembur->jam_balek) {
                $todayLembur->update([
                    'jam_balek' => $nowTime
                ]);
            } else {
                return Redirect::back()->withErrors(['absence' => 'Cannot Pulang Lembur without Lembur or already done.']);
            }
        }

        if($validated['absence'] === 'Izin' || $validated['absence'] === 'Sakit' || $validated['absence'] === 'Cuti'){
            absen::create([
                'user' => $user->name,
                'status' => $validated['absence'],
                'tanggal' => $nowDate,
                'jam_datang' => $nowTime,
                'jam_balek' => $nowTime
            ]);
        }


        return Redirect::to('');
    }


    /**
     * Display the specified resource.
     */
    public function show(absen $absen)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(absen $absen)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateabsenRequest $request, absen $absen)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(absen $absen)
    {
        //
    }
}
