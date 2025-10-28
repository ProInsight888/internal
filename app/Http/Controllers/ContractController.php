<?php

namespace App\Http\Controllers;

use App\Models\cicilan;
use App\Models\contract;
use App\Models\contract_pic;
use App\Models\newClient;
// use Barryvdh\DomPDF\PDF;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function edit(newclient $contract)
    {
        $client = newClient::where('uuid', $contract);
        // dd($client);
        return Inertia::render('NewClient/Contract/edit', [
            'clients' => $contract,
        ]);
    }

    public function update(Request $request, newClient $newClient)
    {
        // dd($request->pics);

        $validated = $request->validate([
            // 'company_name' => 'string|nullable',
            'reference_num' => 'string|nullable',
            'tlp_num' => 'string|nullable',
            'contract_start' => 'string|nullable',
            'contract_end' => 'string|nullable',
            'full_address' => 'string|nullable',
            'pic_name' => 'string|nullable',
            'pic_tlp_num' => 'string|nullable',
            // 'pic_title' => 'string|nullable',
            'pic_position' => 'string|nullable',
            'price' => 'string|nullable',   
        ]);

        $today = now('Asia/Jakarta');

        $uuid = $request->uuid;

        $pics = $request->pics;

        foreach ($pics as $pic) {
            // dd($pic);
            contract_pic::create([
                'new_client_contract_uuid' => $uuid,
                'pic_name' => $pic['pic_name'],
                'pic_tlp_num' => $pic['pic_tlp_num'],
                'pic_position' => $pic['pic_position'],
            ]);
        }

        $update_client = newClient::where('uuid', $uuid);
        $update_client->update([
            'reference_num' => $validated['reference_num'],
            'today' => $today,
            'tlp_num' => $validated['tlp_num'],
            'contract_start' => $validated['contract_start'],
            'contract_end' => $validated['contract_end'],
            'full_address' => $validated['full_address'],
            'price' => $validated['price'],
        ]);

        return Redirect::to('new_client')->with('success', 'Client Updated Successfully');
    }

    public function clientContract(Request $request)
    {
        $uuid = $request->clientsUuid;
        $client = newClient::where('uuid', $uuid)->first();
        $imageLogo = public_path('logo/logo.png');
        $pics = contract_pic::where('new_client_contract_uuid', $uuid)->get();
        // dd($client);
        $pdf = Pdf::loadView('pdfs.contract', compact('imageLogo', 'client', 'pics'))
            ->setPaper('a4', 'portrait');

        return $pdf->stream('client_contract.pdf'); 
    }
}
