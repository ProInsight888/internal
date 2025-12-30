<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\cicilan;
use App\Models\contract;
use App\Models\newClient;
use App\Http\Requests\StorenewClientRequest;
use App\Http\Requests\UpdatenewClientRequest;
use App\Models\task;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
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
    //     public function index()
    //     {
    //         $clients = newClient::orderByRaw("
    //     STR_TO_DATE(
    //         LEFT(contract, INSTR(contract, ' - ') - 1),
    //         '%d %b %Y'
    //     ) DESC
    // ")
    //             ->orderBy('company_name')
    //             ->paginate(20);

    //         $total_clients = newClient::count();
    //         $cicilans = cicilan::all();

    //         return inertia('NewClient/index', [
    //             'clients' => $clients,
    //             'cicilans' => $cicilans,
    //             'total_clients' => $total_clients,
    //         ]);
    //     }

    public function index()
    {
        $clients = newClient::all()
            ->sortByDesc(function ($client) {
                // Ambil tanggal awal sebelum " - "
                $startDate = explode(' - ', $client->contract)[0];

                // Parse manual
                try {
                    return Carbon::createFromFormat('d M Y', $startDate);
                } catch (\Exception $e) {
                    return Carbon::minValue();
                }
            })
            ->sortBy('company_name')
            ->values();

        // Manual pagination
        $perPage = 20;
        $currentPage = request('page', 1);

        $paginatedClients = new \Illuminate\Pagination\LengthAwarePaginator(
            $clients->forPage($currentPage, $perPage),
            $clients->count(),
            $perPage,
            $currentPage,
            ['path' => request()->url()]
        );

        return inertia('NewClient/index', [
            'clients' => $paginatedClients,
            'cicilans' => cicilan::all(),
            'total_clients' => newClient::count(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('NewClient/create', []);
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
            'Installments' => 'cicil'
        ];


        $validated = $request->validate([
            'company_name' => 'string|required',
            'code' => 'required|string|max:4|unique:new_clients,code',
            'type' => 'string|required',
            'location' => 'string|required',
            'contract_start' => 'string|required',
            'contract_end' => 'string|required',
            'paid' => 'nullable|date', // Changed to nullable date
            'package' => 'string|required',
            'status' => 'required',
            'cicil' => '',
            'fase_pembayaran.*.cicilan' => 'string',
            'fase_pembayaran.*.tanggal' => 'date',
            'add_ons_drone' => 'nullable',
            'add_ons_production' => 'nullable',
        ]);

        // dd($validated['add_ons_drone'], $validated['add_ons_production']);
        $today = now('Asia/Jakarta');
        $contract_start = \Carbon\Carbon::parse($validated['contract_start']);
        $contract_end = \Carbon\Carbon::parse($validated['contract_end']);

        $contract = $contract_start->format('d M Y') . ' - ' . $contract_end->format('d M Y');

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
        }

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Created',
            'change_section' => "Created New Client.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        newClient::create([
            'uuid' => $clientUuid,
            'company_name' => $validated['company_name'],
            'code' => $validated['code'],
            'type' => $validated['type'],
            'location' => $validated['location'],
            'contract' => $contract,
            'package' => $validated['package'],
            'status' => $internalStatus,
            'payment_month' => $payment_month,
            'paid' => $validated['paid'] ?? null,
            'add_ons_drone' => $validated['add_ons_drone'],
            'add_ons_production' => $validated['add_ons_production'],
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
            'cicil' => 'Installments'
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
            'Installments' => 'cicil'
        ];

        $validated = $request->validate([
            'company_name' => 'string|required',
            'code' => 'string|required',
            'type' => 'string|required',
            'location' => 'string|required',
            'contract_start' => 'string|required',
            'contract_end' => 'string|required',
            'package' => 'string|required',
            'paid' => 'nullable|date', // Changed to nullable date
            'status' => 'string|required',
            'add_ons_drone' => 'nullable',
            'add_ons_production' => 'nullable',
        ]);

        $today = now('Asia/Jakarta');

        $contract_start = \Carbon\Carbon::parse($validated['contract_start']);
        $contract_end = \Carbon\Carbon::parse($validated['contract_end']);

        // dd($request);

        $contract = $contract_start->format('d M Y') . ' - ' . $contract_end->format('d M Y');

        // Map the status for internal storage
        $internalStatus = $statusMapping[$validated['status']] ?? $validated['status'];
        $status = Str::lower($internalStatus);
        $payment_month = $status === 'lunas' ? $today->format('F') . '✅' : "-";

        $uuid = $newClient->uuid;

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Updated',
            'change_section' => "Updated New Client.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        cicilan::where('client_uuid', $uuid)->delete();

        $array = [];
        foreach ($request->fase_pembayaran as $fase) {
            array_push($array, $fase);
        }

        foreach ($array as $index => $fase) {
            cicilan::create([
                'client_uuid' => $uuid,
                'cicilan' => $fase['cicilan'],
                'tanggal' => $fase['tanggal'],
                'status_cicilan' => $fase['status_cicilan'],
            ]);
        }

        $update_client = newClient::where('uuid', $uuid);

        // FIXED: Added 'paid' field here
        $update_client->update([
            'company_name' => $validated['company_name'],
            'code' => $validated['code'],
            'type' => $validated['type'],
            'location' => $validated['location'],
            'contract' => $contract,
            'package' => $validated['package'],
            'status' => $internalStatus,
            'payment_month' => $payment_month,
            'paid' => $validated['paid'] ?? null,
            'add_ons_drone' => $validated['add_ons_drone'],
            'add_ons_production' => $validated['add_ons_production'],
        ]);

        return Redirect::to('new_client')->with('success', 'Client Updated Successfully');
    }

    public function show(newClient $newClient)
    {
        $client = $newClient->load('cicilans');

        $statusMapping = [
            'lunas' => 'Paid',
            'belum bayar' => 'Unpaid',
            'cicil' => 'Installments'
        ];

        $client->display_status = $statusMapping[$client->status] ?? $client->status;
        $contracts = contract::where('uuid_new_client', $newClient->uuid)->get();

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

        $user = Auth::user();

        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Deleted',
            'change_section' => "Deleted New Client.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        $newClient = newClient::where('uuid', $uuid);
        $cicilan = cicilan::where('client_uuid', $uuid);
        $newClient->delete();
        $cicilan->delete();

        return Redirect::to('new_client')->with('deleted', 'Client Deleted');
    }
}
