<?php

use App\Http\Controllers\AbsenController;
use App\Http\Controllers\AddAccountController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CheckDataCollectionController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\CreativeController;
use App\Http\Controllers\creativeReviewController;
use App\Http\Controllers\deleteCicilan;
use App\Http\Controllers\GoogleCalendarController;
use App\Http\Controllers\it_review;
use App\Http\Controllers\ItController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\itReviewController;
use App\Http\Controllers\KalenderController;
use App\Http\Controllers\MarketingController;
use App\Http\Controllers\marketingReviewController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\mediaReviewController;
use App\Http\Controllers\NewClientController;
use App\Http\Controllers\PersonalDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RejectedRevisionController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskStatusController;
use App\Http\Controllers\ToolDataCollectionController;
use App\Http\Controllers\update_submit_creative_task;
use App\Http\Controllers\update_submit_media_task;
use App\Http\Controllers\UpdateDragDropController;
use App\Http\Controllers\UpdateTaskSubmit;
use App\Models\absen;
use App\Models\it;
use App\Models\marketing;
use App\Models\newClient;
use App\Models\task;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SpreadsheetController;
use App\Http\Controllers\update_submit_it_task;
use App\Http\Controllers\update_submit_marketing_task;
use App\Models\creative;
use App\Models\media;

Route::redirect('/', '/dashboard');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        $absens = absen::all();
        $clients = newClient::all();
        $it = it::all();
        $media = media::all();
        $creative = creative::all();
        $marketing = marketing::all();
        return Inertia::render('Dashboard', [
            'userName' => Auth::user()->name,
            'absens' => $absens,
            'clients' => $clients,
            'tasks' => [
                'it' => $it,
                'media' => $media,
                'creative' => $creative,
                'marketing' => $marketing,
            ],
        ]);
    })->name('dashboard');

    Route::get('contract/{clientsUuid}/contract', [ContractController::class, 'clientContract'])->name('contract.export');
    Route::resource('contract', ContractController::class);

    // Route::resource('/result', ResultController::class);

    // Route::resource('/personal_dashboard', PersonalDashboardController::class);
    Route::resource('absen', AbsenController::class);

    Route::resource('calendar', GoogleCalendarController::class);
    // Route::get('/calendar/{calendar}', [GoogleCalendarController::class, 'show'])->name('calendar.show');


    // Route::resource('kalender', KalenderController::class);
    Route::put('calendar', [UpdateDragDropController::class, 'update'])->name('drag_and_drop_update.update');
    Route::resource('items', ItemsController::class);
    Route::resource('data_collection', ToolDataCollectionController::class);
    Route::resource('check', CheckDataCollectionController::class);

    Route::resource('it', ItController::class);
    Route::put('it_submit/{it}', [update_submit_it_task::class, 'update'])->name('it_submit.update'); // admin check and pass to user
    Route::resource('it_review', itReviewController::class);

    Route::resource('marketing', MarketingController::class);
    Route::put('marketing_submit/{marketing}', [update_submit_marketing_task::class, 'update'])->name('marketing_submit.update');
    Route::resource('marketing_review', marketingReviewController::class);

    Route::resource('creative', CreativeController::class);
    Route::put('creative_submit/{creative}', [update_submit_creative_task::class, 'update'])->name('creative_submit.update');
    Route::resource('creative_review', creativeReviewController::class);
    // Route::get('/export-absences', [SpreadsheetController::class, 'exportToSheet'])
    //     ->name('export.absences');
    Route::resource('media', MediaController::class)->parameters([
        'media' => 'media' // pastikan bukan 'medium'

    ]);
    Route::get('profile', [ProfileController::class, 'index'])->middleware('auth')->name('profile');
    Route::post('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('profile.avatar.remove');

    Route::put('media_submit/{media}', [update_submit_media_task::class, 'update'])->name('media_submit.update');
    Route::resource('media_review', mediaReviewController::class);
    // Route::delete('/media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');
});


Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('add_account', [AddAccountController::class, 'index'])->name('add_account.index');
    Route::post('add_account', [AddAccountController::class, 'store'])->name('add_account.store');
    Route::get('add_account/{user}/edit', [AddAccountController::class, 'edit'])->name('add_account.edit');
    Route::put('add_account/{user}', [AddAccountController::class, 'update'])->name('add_account.update');
    Route::delete('add_account/{user}', [AddAccountController::class, 'destroy'])->name('add_account.destroy');
    Route::delete('deleteCicilan/{uuid}', [deleteCicilan::class, 'destroy'])->name('deleteCicilan.destroy');
    Route::post('storeCicilan/{uuid}', [deleteCicilan::class, 'store'])->name('storeCicilan.store');
    Route::get('media/create', [MediaController::class, 'create'])->name('media.create');
    Route::get('creative/create', [CreativeController::class, 'create'])->name('creative.create');
    Route::get('marketing/create', [MarketingController::class, 'create'])->name('marketing.create');
    Route::get('it/create', [ItController::class, 'create'])->name('it.create');

    Route::resource('new_client', NewClientController::class);

    Route::get('result', [ResultController::class, 'index'])->name('result.index');
    Route::post('rejectedRevision', [RejectedRevisionController::class, 'store'])->name('rejectedRevision.store');
});



// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__ . '/auth.php';
