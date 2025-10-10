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
        Schema::create('new_clients', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('company_name');
            $table->string('type');
            $table->string('location');
            $table->string('contract');
            $table->string('package');
            $table->string('status');
            $table->string('contract_end')->nullable();
            $table->string('payment_month')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('new_clients');
    }
};
