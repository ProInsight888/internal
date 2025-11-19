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
        $absens = absen::select('id', 'user', 'user_id', 'status', 'tanggal', 'jam_datang', 'jam_balek')
            ->get()
            ->map(function ($a) {

                $user = User::find($a->user_id);

                if (!$user) {
                    $user = User::where('name', $a->user)->first();
                }

                return [
                    'id'         => $a->id,
                    'user_id'    => $user ? $user->id : null,
                    'user_name'  => $user ? $user->name : $a->user,
                    'status'     => $a->status,
                    'tanggal'    => $a->tanggal,
                    'jam_datang' => $a->jam_datang,
                    'jam_balek'  => $a->jam_balek
                ];
            });

            // dd($absens); 

        $users = User::select('id', 'name')->get();

        return inertia('Absen/index', [
            'absens' => $absens,
            'users'  => $users
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
        $user = Auth::user();
        $nowDate = now('Asia/Jakarta')->toDateString();
        $nowTime = now('Asia/Jakarta')->toTimeString();
        
        $validated = $request->validate([
            'absence' => 'required|string'
        ]);
        
        $todayAbsen = absen::where('user_id', $user->id)
        ->where('tanggal', $nowDate)
        ->first();

        // dd($todayAbsen); 
        
        if ($validated['absence'] === 'CheckOut') {
            if ($todayAbsen && !$todayAbsen->jam_balek) {
                $todayAbsen->update([
                    'status'=> 'CheckOut',
                    'jam_balek' => $nowTime
                ]);
            } else {
                return Redirect::back()->withErrors(['absence' => 'Cannot Checkout without Checking In or already Checked Out.']);
            }
        }
        
        // dd($request, $nowTime, $validated['absence'],  $user->id);

        if ($validated['absence'] === 'CheckIn') {
            if ($todayAbsen === null) {
                 absen::create([
                'user' => $user->name,
                'status' => $validated['absence'],
                'tanggal' => $nowDate,
                'jam_datang' => $nowTime,
                'jam_balek' => '',
                'user_id' => $user->id
            ]);
            if($todayAbsen !==null){
                if($todayAbsen->jam_balek=== ''){
                    $todayAbsen->update([
                        'jam_balek' => $nowTime
                    ]);
                }
            }
            } else {
                return Redirect::back()->withErrors(['absence' => 'Cannot Checkout without Checking In or already Checked Out.']);
            }
        }

       

        // $todayLembur = absen::where('user_id', $user->id)
        //     ->where('tanggal', $nowDate)
        //     ->where('status', 'Lembur')
        //     ->first();

        // if (in_array($validated['absence'], ['CheckIn', 'Ketemu Client'])) {
        //     if (!$todayAbsen) {
        //         absen::create([
        //             'user_id' => $user->id,
        //             'status' => $validated['absence'],
        //             'tanggal' => $nowDate,
        //             'jam_datang' => $nowTime,
        //         ]);
        //     } else {
        //         return Redirect::back()->withErrors(['absence' => 'You already Checked In.']);
        //     }
        // }

        // if ($validated['absence'] === 'Lembur') {
        //     if (!$todayLembur) {
        //         absen::create([
        //             'user_id' => $user->id,
        //             'status' => 'Lembur',
        //             'tanggal' => $nowDate,
        //             'jam_datang' => $nowTime,
        //         ]);
        //     } else {
        //         return Redirect::back()->withErrors(['absence' => 'You already submitted Lembur today.']);
        //     }
        // }

        

        // if ($validated['absence'] === 'Pulang Lembur') {
        //     if ($todayLembur && !$todayLembur->jam_balek) {
        //         $todayLembur->update([
        //             'jam_balek' => $nowTime
        //         ]);
        //     } else {
        //         return Redirect::back()->withErrors(['absence' => 'Cannot Pulang Lembur without Lembur or already done.']);
        //     }
        // }

        // if ($validated['absence'] === 'Izin' || $validated['absence'] === 'Sakit' || $validated['absence'] === 'Cuti') {
            
        // }

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
