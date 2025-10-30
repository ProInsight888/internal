<?php

namespace App\Http\Controllers;

use App\Models\cicilan;
use App\Models\contract;
use App\Models\contract_pic;
use App\Models\newClient;
// use Barryvdh\DomPDF\PDF;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
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
        // dd($request->uuid);

        $validated = $request->validate([
            // 'company_name' => 'string|nullable',
            'reference_num' => 'string|nullable',
            'package' => 'string|nullable',
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

        $uuid = Str::uuid()->toString();

        $pics = $request->pics;

        foreach ($pics as $pic) {
            // dd($pic);
            contract_pic::create([
                'contract_uuid' => $uuid,
                'pic_name' => $pic['pic_name'],
                'pic_tlp_num' => $pic['pic_tlp_num'],
                'pic_position' => $pic['pic_position'],
            ]);
        };

        // dd($uuid);

        // $update_client = newClient::where('uuid', $uuid);
        contract::create([
            'uuid' => $uuid,
            'uuid_new_client' => $request->uuid,
            'reference_num' => $validated['reference_num'],
            'package' => $validated['package'],
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
        $contract = contract::where('uuid_new_client', $uuid)->latest('created_at')->first();
        $pics = contract_pic::where('contract_uuid', $contract->uuid)->get();
        $package = [
            'Protall' => [
                'feeds' => '16 (enam belas)',
                'x_per_minggu' => '4 (empat)',
                'story' => '8 (delapan)',
                'hari' => 'Senin, Selasa, Kamis dan Jumat',
                'reel' => '4 (empat)',
                'reel_post' => 'seminggu sekali',
                'motion_graphic' => '1 (satu)'
            ],
        ];
        $start = Carbon::parse($contract->contract_start);
        $end = Carbon::parse($contract->contract_end);
        $diff = $start->diff($end);

        $durationParts = [];

        // dd($package[$contract->package]);

        if ($diff->y > 0)
            $durationParts[] = $diff->y . ' Tahun';
        if ($diff->m > 0)
            $durationParts[] = $diff->m . ' Bulan';

        $duration = count($durationParts) ? implode(' ', $durationParts) : '0 Bulan';

        $client->duration = $duration;
    
        // dd($pics[0]->pic_name);
        $pdf = Pdf::loadView('pdfs.contract', compact('imageLogo', 'client', 'pics', 'contract', 'package'))
            ->setPaper('a4', 'portrait');

        return $pdf->stream('client_contract.pdf');
    }
    public function viewClientContract(Request $request)
    {
        $uuid = $request->clientsUuid;
        $contract = contract::where('uuid', $uuid)->first();
        $pics = contract_pic::where('contract_uuid', $uuid)->get();
        // dd($contract[0]->uuid_new_client);
        $client = newClient::where('uuid', $contract->uuid_new_client)->first();
        $imageLogo = public_path('logo/logo.png');
        $package = [
            'Protall' => [
                'feeds' => '16 (enam belas)',
                'x_per_minggu' => '4 (empat)',
                'story' => '8 (delapan)',
                'hari' => 'Senin, Selasa, Kamis dan Jumat',
                'reel' => '4 (empat)',
                'reel_post' => 'seminggu sekali',
                'motion_graphic' => '1 (satu)'
            ],
        ];
        $start = Carbon::parse($contract->contract_start);
        $end = Carbon::parse($contract->contract_end);
        $diff = $start->diff($end);

        $durationParts = [];
        
        // dd($package[$contract->package]);
        
        if ($diff->y > 0)
            $durationParts[] = $diff->y . ' Tahun';
        if ($diff->m > 0)
            $durationParts[] = $diff->m . ' Bulan';

        $duration = count($durationParts) ? implode(' ', $durationParts) : '0 Bulan';

        $client->duration = $duration;
    
        // dd($pics[0]->pic_name);
        $pdf = Pdf::loadView('pdfs.contract', compact('imageLogo', 'client', 'pics', 'contract', 'package'))
            ->setPaper('a4', 'portrait');

        return $pdf->stream('client_contract.pdf');
    }
}
