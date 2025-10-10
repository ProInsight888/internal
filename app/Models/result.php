<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class result extends Model
{
    /** @use HasFactory<\Database\Factories\ResultFactory> */
    use HasFactory;

    protected $fillable = [
        'task_uuid',
        'link',
    ];

    public function getRouteKeyName(){
        return 'task_uuid';
    }

    public function task(){
        return $this->belongsTo(Task::class,'task_uuid', 'uuid');
    }
    
}
