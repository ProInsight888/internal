<?php

namespace App\Http\Controllers;

use App\Models\cicilan;
use App\Models\contract;
use App\Models\newClient;
use App\Http\Requests\StorenewClientRequest;
use App\Http\Requests\UpdatenewClientRequest;
use App\Models\task;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Number;
use Inertia\Inertia;

class NewClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = newClient::paginate(10);
        $cicilans = cicilan::all(); 
        return inertia('NewClient/index', [
            'clients' => $clients,
            'cicilans' => $cicilans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('NewClient/create',[
            
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorenewClientRequest $request)
    {
        // Map the status values
        $statusMapping = [
            'Paid' => 'lunas',
            'Unpaid' => 'belum bayar', 
            'Instalments' => 'cicil'
        ];

        $validated = $request->validate([
            'company_name' => 'string|required',
            'code' => 'required|string|max:4|unique:new_clients,code',
            'type' => 'string|required',
            'location' => 'string|required',
            'contract_tahun' => 'string|nullable',
            'contract_bulan' => 'string|required',
            'contract_hari' => 'string|required',
            'package' => 'string|required',
            'status' => 'required',
            'cicil' => '',
            'fase_pembayaran.*.cicilan' => 'string',
            'fase_pembayaran.*.tanggal' => 'date',
        ]);
        
        $today = now('Asia/Jakarta');
        
        $contract = $validated['contract_tahun'] . ' Tahun ' . $validated['contract_bulan'] . ' Bulan ' . $validated['contract_hari'] . ' Hari';

        $month = (int) $validated['contract_bulan'];
        $year = (int) $validated['contract_tahun'];

        $extraYears = intdiv($month, 12);
        $remainingMonths = $month % 12;
        $totalYears = $year + $extraYears;

        $contractEnd = now()->addYears($totalYears)->addMonths($remainingMonths);

        // Map the status for internal storage
        $internalStatus = $statusMapping[$validated['status']] ?? $validated['status'];
        $status = Str::lower($internalStatus);
        $payment_month = $status === 'lunas' ?  $today->format('F') . '✅' : "-";
        
        $clientUuid = Str::uuid()->toString();

        foreach ($request->fase_pembayaran as $fase) {
            cicilan::create([
                'client_uuid' => $clientUuid,
                'cicilan' => $fase['cicilan'],
                'tanggal' => $fase['tanggal'],
            ]);
        };
        
        newClient::create([
            'uuid' => $clientUuid,
            'company_name' => $validated['company_name'],
            'code' => $validated['code'],
            'type' => $validated['type'],
            'location' => $validated['location'],
            'contract' => $contract,
            'package' => $validated['package'],
            'status' => $internalStatus, // Store the internal status
            'contract_end' => $contractEnd->toDateString(),
            'payment_month' => $payment_month,
        ]);

        return Redirect::to('new_client')->with("success", 'New Client Created Successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(newClient $newClient)
    {
        $client = $newClient->load('cicilans');
        
        // Map internal status to display status for the frontend
        $statusMapping = [
            'lunas' => 'Paid',
            'belum bayar' => 'Unpaid',
            'cicil' => 'Instalments'
        ];
        
        $client->display_status = $statusMapping[$client->status] ?? $client->status;
        
        return inertia('NewClient/edit', [
            'clients' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatenewClientRequest $request, newClient $newClient)
    {
        // Map the status values
        $statusMapping = [
            'Paid' => 'lunas',
            'Unpaid' => 'belum bayar',
            'Instalments' => 'cicil'
        ];

        $validated = $request->validate([
            'company_name' => 'string|required',
            'code' => 'string|required',
            'type' => 'string|required',
            'location' => 'string|required',
            'contract_tahun' => 'string|nullable',
            'contract_bulan' => 'string|required',
            'contract_hari' => 'string|required',
            'package' => 'string|required',
            'status' => 'string|required',
        ]);

        $today = now('Asia/Jakarta');

        $contract = $validated['contract_tahun'] . ' Tahun ' . $validated['contract_bulan'] . ' Bulan ' . $validated['contract_hari'] . ' Hari';

        $month = (int) $validated['contract_bulan'];
        $year = (int) $validated['contract_tahun'];

        $extraYears = intdiv($month, 12);
        $remainingMonths = $month % 12;
        $totalYears = $year + $extraYears;

        $contractEnd = now()->addYears($totalYears)->addMonths($remainingMonths);

        // Map the status for internal storage
        $internalStatus = $statusMapping[$validated['status']] ?? $validated['status'];
        $status = Str::lower($internalStatus);
        $payment_month = $status === 'lunas' ? $today->format('F').'✅' : "-";

        $uuid = $newClient->uuid;

        $update_client = newClient::where('uuid', $uuid);
        $update_client->update([
            'company_name' => $validated['company_name'],
            'code' => $validated['code'],
            'type' => $validated['type'],
            'location' => $validated['location'],
            'contract' => $contract,
            'package' => $validated['package'],
            'status' => $internalStatus, // Store the internal status
            'contract_end' => $contractEnd->toDateString(),
            'payment_month' => $payment_month,
        ]);

        return Redirect::to('new_client')->with('success','Client Updated Successfully');
    }

    public function show(newClient $newClient)
    {
        $client = $newClient->load('cicilans');
        // dd($newClient);
        // Map internal status to display status for the frontend
        $statusMapping = [
            'lunas' => 'Paid',
            'belum bayar' => 'Unpaid',
            'cicil' => 'Instalments'
        ];

        
        $client->display_status = $statusMapping[$client->status] ?? $client->status;
        $contracts = contract::where('uuid_new_client', $newClient->uuid)->get();
        
        // dd( $contracts);
        
        return Inertia('NewClient/show', [
            'client' => $client,
            'contracts' => $contracts
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(newClient $newClient)
    {
        $uuid = $newClient->uuid;
        $newClient = newClient::where('uuid', $uuid);
        $cicilan = cicilan::where('client_uuid', $uuid);
        $newClient->delete();
        $cicilan->delete();

        return Redirect::to('new_client')->with('deleted','Client Deleted');
    }

    
}