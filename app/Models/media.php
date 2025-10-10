<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class media extends Model
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
        'category',
        'deadline',
    ];

    public function getRouteKeyName() {
        return 'uuid';
    }
}
