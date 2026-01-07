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
        Schema::create('packages', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('client_uuid');
            $table->string('package_name');
            $table->string('term_start');
            $table->string('term_end');
            $table->string('payment_date')->nullable();
            $table->string('payment_status');
            $table->string('total_installment')->nullable();
            $table->string('add_ons')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
