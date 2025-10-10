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
        Schema::create('creatives', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('task_title');
            $table->longText('description');
            $table->string('penanggung_jawab');
            $table->string('task_format');
            $table->string('status');
            $table->string('company');
            $table->string('sended_by')->nullable();
            $table->string('send_time')->nullable();
            $table->string('send_date')->nullable();
            $table->string('checked_by')->nullable();
            $table->string('revision')->nullable();
            $table->string('result_link')->nullable();
            $table->string('category');
            $table->string('deadline');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creatives');
    }
};
