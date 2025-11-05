<?php

namespace App\Http\Controllers;

use App\Models\audit;
use App\Models\cicilan;
use App\Models\newClient;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    public function index(){
        $audits = audit::paginate(50);
        return inertia('Audit/index', [
            'audits' => $audits,
        ]);
    }
}