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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->time('class_time');
            $table->date('class_date');
            $table->unsignedBigInteger('trainer_id')->nullable();
            $table->foreign('trainer_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');
            $table->unsignedInteger('participants_count')->default(0);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
