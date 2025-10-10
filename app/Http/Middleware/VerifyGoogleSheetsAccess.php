<?php

namespace App\Http\Middleware;

use Closure;

class VerifyGoogleSheetsAccess
{
    public function handle($request, Closure $next)
    {
        if (!config('services.google.sheet_id')) {
            abort(403, 'Google Sheets access not configured');
        }
        return $next($request);
    }
}