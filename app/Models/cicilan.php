<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class cicilan extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_uuid',
        'cicilan',
        'tanggal',
        'status_cicilan',
    ];

    public function client()
    {
        return $this->belongsTo(newClient::class, 'client_uuid', 'uuid');
    }

}
