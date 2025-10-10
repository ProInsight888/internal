<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class rejectedRevision extends Model
{
    use HasFactory;
    protected $fillable = [
        'task_uuid',
        'revision',
    ];

    public function task(){
        return $this->belongsTo(Task::class, 'task_uuid', 'uuid');
    }
}
