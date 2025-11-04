<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'uuid_new_client',
        'reference_num',
        'package',
        'platform',
        'today',
        'contract_start',
        'contract_end',
        'full_address',
        'tlp_num',
        'price',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
