<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\cicilan;
use App\Models\newClient;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    public function index(){
        $audits = audit::orderBy('id', 'desc')->paginate(50);
        // dd($audits);
        return inertia('Audit/index', [
            'audits' => $audits,
        ]);
    }
}