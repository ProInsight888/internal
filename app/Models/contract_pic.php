<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class contract_pic extends Model
{
    use HasFactory;

    protected $fillable = [
        'new_client_contract_uuid',
        'pic_name',
        'pic_tlp_num',
        'pic_position',
    ];
}
