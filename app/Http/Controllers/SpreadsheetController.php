<?php
// app/Http/Controllers/SpreadsheetController.php
namespace App\Http\Controllers;

use App\Models\absen;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\BatchClearValuesRequest;
use Google\Service\Sheets\ValueRange;
use Illuminate\Http\Request;
use Inertia\Inertia;

use function PHPSTORM_META\map;

class SpreadsheetController extends Controller
{
    public function export(Request $request)
    {
        try {
            $client = new Client();
            $client->setAuthConfig(storage_path('app/credentials/google-sheets.json'));
            $client->addScope(Sheets::SPREADSHEETS);
            $service = new Sheets($client);
            $spreadsheetId = env('GOOGLE_SHEETS_ID');
            $users_id = explode(',', $request->users);
            $startDate = $request->date_from;
            $endDate = $request->date_end;
            $period = CarbonPeriod::create($startDate, $endDate);
            
            // 1. FIRST CLEAR THE EXISTING DATA
            $this->clearSheetData($service, $spreadsheetId, 'Sheet3');
            $sortId = $request->sortUserId;
            
            // 2. GET NEW DATA FROM DATABASE
            // dd($request->sortUserId);
            $absens = Absen::whereBetween('tanggal', [
                $startDate,
                $endDate
                ])
                ->orderBy('tanggal', 'asc')
                ->get();
                
                // dd($absens);
                
                // 3. PREPARE NEW DATA
                $values = [];
                $values[] = ['Attendance Report: ' . $startDate . ' to ' . $endDate];
                function formatDurasi($menit)
                {
                    if ($menit <= 0)
                        return '';
                    $jam = str_pad(floor($menit / 60), 2, '0', STR_PAD_LEFT);
                    $menitSisa = str_pad($menit % 60, 2, '0', STR_PAD_LEFT);
                    if ($menitSisa === "00")
                        return "$jam Jam";
                    if ($jam === "00")
                        return "$menitSisa Menit";
                    if ($jam === '00' && $menitSisa === '00')
                        return '';
                    return "$jam Jam $menitSisa Menit";
                }
                
            if($sortId === null){
                foreach($users_id as $userIndex => $user_id) {
                    // dd($user_id);

                    $real_user = User::where('id', $user_id)->first();
                    // dd($real_user->name);

                    
                    $values[] = [''];
                    $values[] = [$real_user->name];
                    $values[] = ['Date', 'Day', 'Working Hour', 'Activity', 'Check-in', 'Check-out', 'Overtime', 'Notes', 'Status'] ;

                    $absenSortUser = $absens->where('user_id', $user_id);
                    // dd($user_id, $absenSortUser, $period);
                    
                    // $absenSortUser = $absens->where('user', $user); 
                    foreach ($period as $date){
                        $daysName = Carbon::parse($date)->locale('id')->dayName;
                        if ($daysName === 'Minggu') {
                            $working_hour = '00:00 - 23:59';
                        } elseif ($daysName === 'Sabtu') {
                            $working_hour = '08:00 - 12:00';
                        } else {
                            $working_hour = '09:00 - 17:00';
                        }
                        $periodSortUser = $absenSortUser->where('tanggal', $date->format('Y-m-d'));
                        if ($periodSortUser->isNotEmpty()) {
                            foreach ($periodSortUser as $userIndex => $user) {
                                $jam_balek = $user->jam_balek ? Carbon::parse($user->jam_balek) : null;
                                $jam_datang = $user->jam_datang ? Carbon::parse($user->jam_datang) : null;
                                $weekDayBalek = Carbon::parse('17:00');
                                $weekEndBalek = Carbon::parse('12:00');

                                $durasi_weekDay = $jam_balek ? formatDurasi($weekDayBalek->diffInMinutes($jam_balek)) : '';
                                $durasi_weekEnd = $jam_balek ? formatDurasi($weekEndBalek->diffInMinutes($jam_balek)) : '';

                                $jamDatangFormatted = $jam_datang ? "'" . $jam_datang->format('H:i') : '';
                                $jamBalekFormatted = $jam_balek ? "'" . $jam_balek->format('H:i') : '';

                                $values[] = [
                                    $date->format('Y-m-d'),
                                    $daysName,
                                    $working_hour,
                                    $daysName === 'Minggu' ? 'Work-Over Time' : 'Work',
                                    $jamDatangFormatted,
                                    $jamBalekFormatted,
                                    $daysName === 'Sabtu' ? $durasi_weekEnd : $durasi_weekDay,
                                    '',
                                    $user->status ?? 'N/A',
                                ];
                            }
                        } else {
                            $values[] = [
                                $date->format('Y-m-d'),
                                $daysName,
                                $working_hour,
                                $daysName === 'Minggu' ? 'Work-Over Time' : 'Work',
                            ];
                        }

                        // dd($periodSortUser, $date->format('Y-m-d'));
                    }
                    $values[] = [''];
                    $values[] = ['-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'];
                    $values[] = [''];
                }
            }
            else{
                $real_user = User::where('id', $sortId)->first();
                // dd($real_user);
                $values[] = [''];
                $values[] = [$real_user->name];
                $values[] = ['Date', 'Day', 'Working Hour', 'Activity', 'Check-in', 'Check-out', 'Overtime', 'Notes', 'Status'];

                $absenSortUser = $absens->where('user_id', $sortId);

                // $absenSortUser = $absens->where('user', $user); 
                foreach ($period as $date) {
                    $daysName = Carbon::parse($date)->locale('id')->dayName;
                    if ($daysName === 'Minggu') {
                        $working_hour = '00:00 - 23:59';
                    } elseif ($daysName === 'Sabtu') {
                        $working_hour = '08:00 - 12:00';
                    } else {
                        $working_hour = '09:00 - 17:00';
                    }

                    // dd($absenSortUser, $date->format('Y-m-d'));
                    $periodSortUser = $absenSortUser->where('tanggal', $date->format('Y-m-d'));
                    // dd($periodSortUser);
                    if ($periodSortUser->isNotEmpty()) {
                        foreach ($periodSortUser as $userIndex => $user) {
                            $jam_balek = $user->jam_balek ? Carbon::parse($user->jam_balek) : null;
                            $jam_datang = $user->jam_datang ? Carbon::parse($user->jam_datang) : null;
                            $weekDayBalek = Carbon::parse('17:00');
                            $weekEndBalek = Carbon::parse('12:00');

                            $durasi_weekDay = $jam_balek ? formatDurasi($weekDayBalek->diffInMinutes($jam_balek)) : '';
                            $durasi_weekEnd = $jam_balek ? formatDurasi($weekEndBalek->diffInMinutes($jam_balek)) : '';

                            $jamDatangFormatted = $jam_datang ? "'" . $jam_datang->format('H:i') : '';
                            $jamBalekFormatted = $jam_balek ? "'" . $jam_balek->format('H:i') : '';

                            $values[] = [
                                $date->format('Y-m-d'),
                                $daysName,
                                $working_hour,
                                $daysName === 'Minggu' ? 'Work-Over Time' : 'Work',
                                $jamDatangFormatted,
                                $jamBalekFormatted,
                                $daysName === 'Sabtu' ? $durasi_weekEnd : $durasi_weekDay,
                                '',
                                $user->status ?? 'N/A',
                            ];
                        }
                    } else {
                        $values[] = [
                            $date->format('Y-m-d'),
                            $daysName,
                            $working_hour,
                            $daysName === 'Minggu' ? 'Work-Over Time' : 'Work',
                        ];
                    }

                    // dd($periodSortUser, $date->format('Y-m-d'));
                }
            }
            // dd($values);
            
            // 4. UPDATE WITH NEW DATA
            $body = new ValueRange(['values' => $values]);
            // dd($body);
            $service->spreadsheets_values->update(
                $spreadsheetId,
                'Sheet3!A1',
                $body,
                ['valueInputOption' => 'USER_ENTERED'] // Better for dates
            );

            return Inertia::location("https://docs.google.com/spreadsheets/d/{$spreadsheetId}/view");

        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Export failed: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Clears all data from specified sheet
     */
    private function clearSheetData($service, $spreadsheetId, $sheetName)
    {
        $requestBody = new BatchClearValuesRequest([
            'ranges' => [$sheetName] // Clears entire sheet
        ]);

        $service->spreadsheets_values->batchClear(
            $spreadsheetId,
            $requestBody
        );
    }
}