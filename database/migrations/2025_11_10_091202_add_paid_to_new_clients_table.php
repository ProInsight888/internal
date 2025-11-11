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
            $table->string('paid') -> nullable();
            $table->boolean('add_ons_drone') -> nullable();
            $table->boolean('add_ons_production') -> nullable();
        });
    }            

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('new_clients', function (Blueprint $table) {
            $table->dropColumn('paid');
            $table->dropColumn('add_ons_drone');
            $table->dropColumn('add_ons_production');
        });
    }
};