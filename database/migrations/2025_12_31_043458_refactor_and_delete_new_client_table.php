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
    Schema::table('new_clients', function (Blueprint $table) {
        $table->dropColumn([
            'contract', 
            'package', 
            'status', 
            'payment_month', 
            'contract_end', 
            'paid', 
            'add_ons_drone', 
            'add_ons_production'
        ]);
    });
}

/**
 * Reverse the migrations.
 */
public function down(): void
{
    Schema::table('new_clients', function (Blueprint $table) {
        // Re-create the columns exactly as they were before they were dropped
        $table->string('contract')->nullable();
        $table->string('package')->nullable();
        $table->string('status')->nullable();
        $table->string('payment_month')->nullable();
        $table->date('contract_end')->nullable();
        $table->boolean('paid')->default(false);
        $table->string('add_ons_drone')->nullable();
        $table->string('add_ons_production')->nullable();
    });
}
};
