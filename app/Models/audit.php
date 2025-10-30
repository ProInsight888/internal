<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class audit extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'action',
        'change_section',
        'old_values',
        'new_values',
        'created_by',
        'date',
        'time',
    ];
}
