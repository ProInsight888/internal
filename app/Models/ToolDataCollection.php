<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToolDataCollection extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'event_name',
        'items',
        'category',
        'quantity',
        'tanggal',
    ];

}
