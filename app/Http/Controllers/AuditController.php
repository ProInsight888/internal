<?php

namespace App\Http\Controllers;

use App\Models\cicilan;
use App\Models\newClient;
use Illuminate\Http\Request;

class AuditController extends Controller
{
    public function index(){
        return inertia('Audit/index', [
        ]);
    }
}
