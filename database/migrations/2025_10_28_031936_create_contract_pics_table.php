<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contract_pics', function (Blueprint $table) {
            $table->id();
            $table->string('contract_uuid');
            $table->string('pic_name');
            $table->string('pic_tlp_num');
            $table->string('pic_position');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_pics');
    }
};
