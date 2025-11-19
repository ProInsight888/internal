<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class absen extends Model
{
    /** @use HasFactory<\Database\Factories\AbsenFactory> */
    use HasFactory;

    protected $fillable = [
        'id',
        'user',
        'status',
        'tanggal',
        'jam_datang',
        'jam_balek',
        'user_id',
    ];
}
