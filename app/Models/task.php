<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;
    protected $fillable = [
        'uuid',
        'task_title',
        'description',
        'penanggung_jawab',
        'task_format',
        'status',
        'company',
        'category',
        'deadline',
        // add other fields as needed
    ];
    
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function result()
    {
        return $this->hasOne(result::class, 'task_uuid', 'uuid')->latestOfMany();
    }

    public function rejectedRevision(){
        return $this->hasOne(rejectedRevision::class, 'task_uuid', 'uuid')->latestOfMany();
    }
}
