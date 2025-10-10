<?php

use App\Http\Controllers\SpreadsheetController;

Route::middleware('api')->group(function () {
    Route::get('export-data', [SpreadsheetController::class, 'export']);
});