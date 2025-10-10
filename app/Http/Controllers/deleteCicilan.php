<?php

namespace App\Http\Controllers;

use App\Models\cicilan;
use App\Models\newClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as FacadesRequest;

class deleteCicilan extends Controller
{
    public function store(Request $request, $uuid){

        // dd($request);
        $array = [];
        foreach ($request->fase_pembayaran as $fase) {
            array_push($array, $fase);
        }
        ;

        // dd($array);

        foreach ($array as $index => $fase) {
            // dd($fase['status_cicilan']);
            cicilan::create([
                'client_uuid' => $uuid,
                'cicilan' => $fase['cicilan'],
                'tanggal' => $fase['tanggal'],
                'status_cicilan' => $fase['status_cicilan'],
            ]);
        }

        return Redirect::to('new_client')->with('success', 'New Client Edited Successfully');
    }
    public function destroy($uuid)
    {
        // dd($uuid);
        cicilan::where('client_uuid', $uuid)->delete();;

        // return Redirect::to('new_client');
    }
}
