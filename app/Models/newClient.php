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
        'code',
        'type',
        'location',
        'contract',
        'package',
        'status',
        'contract_end',
        'payment_month',
        'code',
        'reference_num',
        'today',
        'contract_start',
        'contract_end',
        'full_address',
        'tlp_num',
        'pic_tlp_num',
        'pic_name',
        'pic_title',
        'pic_position',
        'price',
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
