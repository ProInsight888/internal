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
        Schema::table('new_clients', function (Blueprint $table) {
            $table->string('reference_num')->nullable();
            $table->string('today')->nullable();
            $table->string('contract_start')->nullable();
            $table->string('contract_end')->nullable();
            $table->string('full_address')->nullable();
            $table->string('tlp_num')->nullable();
            $table->string('price')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('new_clients', function (Blueprint $table) {
            $table->dropColumn('reference_num');
            $table->dropColumn('today');
            $table->dropColumn('contract_start'); //don
            $table->dropColumn('contract_end'); //don
            $table->dropColumn('full_address'); //don
            $table->dropColumn('tlp_num'); //don
            $table->dropColumn('price');
        });
    }
};
