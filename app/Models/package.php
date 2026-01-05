<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class package extends Model
{
    use HasFactory;
    protected $fillable = [
        'uuid',
        'client_uuid',
        'package_name',
        'payment_date',
        'payment_status',
        'total_installment',
        'payment_phase',
        'add_ons',
    ];

    public function getRouteKeyName()
    {
        return 'uuid';
    }

    public $incrementing = false;
    protected $keyType = "string";

}
