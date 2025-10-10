<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class task_status extends Model
{
    /** @use HasFactory<\Database\Factories\TaskStatusFactory> */
    use HasFactory;

    protected $fillable = [
        'task_uuid',
        'status'
    ];

    public $timestamps = false;
    public function getRouteKeyName()
    {
        return 'task_uuid';
    }
}
