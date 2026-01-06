<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\cicilan;
use App\Models\package;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon as SupportCarbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;

class PackageController extends Controller
{
    public function create(Request $package){
        // dd($package);
        return inertia("NewClient/Package/create", [
            'uuid'=> $package,
        ]);
    }
    public function store(Request $request)
    {
       $validated = $request->validate([
            "client_uuid" => "string|required",
            "package_name" => "string|required",
            "term_start" => "string|required",
            "term_end" => "string|required",
            "payment_date" => "string|nullable",
            "payment_status" => "string|required",
            "total_installment" => "string|nullable",
            "payment_phase" => "nullable",
            "add_ons" => "string|nullable",
        ]);

        $today = now('Asia/Jakarta');

        // Map the status for internal storage

        $packageUuid = Str::uuid()->toString();

        if($validated["payment_status"] === 'installment'){
            foreach ($validated['payment_phase'] as $phase) {
                cicilan::create([
                    'client_uuid' => $packageUuid,
                    'cicilan' => $phase['installment'],
                    'tanggal' => $phase['date'],
                ]);
            }
        }

        $payment_month = $validated['payment_status'] === 'paid' ?  $today->format('d F Y') . '✅' : "-";
        
        

        $user = Auth::user();
        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Created',
            'change_section' => "Added new package.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        // $formUuid = Str::uuid()->toString();

        package::create([
            'uuid'=> $packageUuid,
            'client_uuid'=> $validated['client_uuid'],
            'package_name' => $validated['package_name'],
            'term_start' => SupportCarbon::parse($validated['term_start'])->format("d M Y"),
            'term_end' => SupportCarbon::parse($validated['term_end'])->format("d M Y"),
            'payment_date' => $payment_month,
            'payment_status' => $validated['payment_status'],
            'total_installment' => $validated['total_installment'] ?? "",
            'add_ons' => $validated['add_ons']
        ]);

        return Redirect::to('new_client')->with('success', 'Client Updated Successfully');
    }

    public function edit(package $package){
        $cicilan_package = cicilan::where('client_uuid', $package->uuid)->get();
        // dd($cicilan_package);
        return inertia("NewClient/Package/edit", [
            "packages"=> $package,
            "cicilan_package"=> $cicilan_package,
        ]);
    }

    public function update(Request $request,package $package){
        $validated = $request->validate([
            // "client_uuid" => "string|required",
            "package_name" => "string|required",
            "payment_date" => "string|nullable",
            "term_start" => "string|nullable",
            "term_end" => "string|nullable",
            "payment_status" => "string|required",
            "total_installment" => "string|nullable",
            "payment_phase" => "nullable",
            "add_ons" => "string|nullable",
        ]);

        $today = now('Asia/Jakarta');

        // Map the status for internal storage

        // dd($package->uuid);

        // $packageUuid = Str::uuid()->toString();

        cicilan::where('client_uuid', $package->uuid)->delete();

        // dd($validated['payment_phase']);
        if($validated["payment_status"] === 'installment'){
            // dd($validated['payment_phase']);
            foreach ($validated['payment_phase'] as $phase) {
                cicilan::create([
                    'client_uuid' => $package->uuid,
                    'cicilan' => $phase['installment'],
                    'tanggal' => $phase['date'],
                    'status_cicilan' => $phase['installment_status'] ?? "false",
                ]);
            }
        }

        $payment_month = $validated['payment_status'] === 'paid' ?  $today->format('d F Y') . '✅' : "-";
        
        

        $user = Auth::user();
        $date = Carbon::now('Asia/Jakarta');

        audit::create([
            'action' => 'Update',
            'change_section' => "Updated package.",
            'created_by' => $user->name,
            'date' => $date->format('d F Y'),
            'time' => $date->format('H:i'),
        ]);

        // $formUuid = Str::uuid()->toString();
        $update_package = package::where('uuid', $package->uuid);

        $update_package->update([
            'package_name' => $validated['package_name'],
            'payment_date' => $payment_month,
            'term_start' => SupportCarbon::parse($validated["term_start"])->format("d M Y"),
            'term_end' => SupportCarbon::parse($validated['term_end'])->format("d M Y"),
            'payment_status' => $validated['payment_status'],
            'total_installment' => $validated['total_installment'] ?? "",
            'add_ons' => $validated['add_ons']
        ]);

        return Redirect::to('new_client')->with('success', 'Client Updated Successfully');

    }

    public function destroy(Request $request, $id){
        // dd($id);

        $package = package::where('uuid', $id);
        $cicilan = cicilan::where('client_uuid', $id);
        $package->delete();
        $cicilan->delete();

        return Redirect::to('new_client')->with('deleted', 'Package Deleted');
    }
}
