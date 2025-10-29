<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('uuid_new_client')->nullable();
            $table->string('reference_num')->nullable();
            $table->string('package')->nullable();
            $table->string('platform')->nullable();
            $table->string('today')->nullable();
            $table->string('contract_start')->nullable();
            $table->string('contract_end')->nullable();
            $table->string('full_address')->nullable();
            $table->string('tlp_num')->nullable();
            $table->string('price')->nullable();
            $table->timestamps(); // 👈 This adds created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
