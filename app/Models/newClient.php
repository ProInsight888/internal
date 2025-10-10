<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class newClient extends Model
{
    /** @use HasFactory<\Database\Factories\NewClientFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid',
        'company_name',
        'type',
        'location',
        'contract',
        'package',
        'status',
        'contract_end',
        'payment_month',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public function cicilans()
    {
        return $this->hasMany(cicilan::class, 'client_uuid', 'uuid');
    }
}
