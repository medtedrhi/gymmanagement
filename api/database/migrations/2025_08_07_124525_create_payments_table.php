<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); // id (AUTO_INCREMENT + PRIMARY KEY)

            $table->unsignedBigInteger('user_id'); // Foreign key
            $table->unsignedBigInteger('plan_id');
            $table->decimal('amount', 10, 2);      // amount
            $table->date('payment_date');          // payment_date

            $table->enum('status', ['Paid', 'Pending', 'Failed'])->default('Paid'); // status

            $table->foreign('user_id')
                    ->references('id')->on('users')
                    ->onDelete('cascade'); // cascade on delete



            $table->foreign('plan_id')
                    ->references('id')
                    ->on('plans')
                    ->onDelete('cascade');

            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
