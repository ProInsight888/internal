<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class it extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'task_title',
        'description',
        'penanggung_jawab',
        'task_format',
        'status',
        'company',
        'sened_by',
        'send_time',
        'send_date',
        'checked_by',
        'revision',
        'result_link',
        'category',
        'deadline',
    ];

    public function getRouteKeyName(){
        return 'uuid';
    }

    public function result(){
        return $this->hasOne(result::class, 'task_uuid', 'uuid')->latestOfMany();
    }
    
    public function company(){
        return $this->belongsTo(newClient::class, 'company', 'uuid');
    }
    
    public function rejectedRevision()
    {
        return $this->hasOne(rejectedRevision::class, 'task_uuid', 'uuid')->latestOfMany();
    }
}
