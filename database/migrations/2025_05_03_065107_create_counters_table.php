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
        Schema::create('counters', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->timestamps();
            $table->enum('status', ['ready', 'busy', 'offline'])->default('ready');
            $table->foreignId('queue_id')->nullable()->constrained('queues')->onDelete('set null')->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('counters');
    }
};
