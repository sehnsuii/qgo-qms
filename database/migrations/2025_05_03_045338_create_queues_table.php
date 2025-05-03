<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Queue;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('queue_number');
            $table->enum('customer_type', ['Priority', 'Regular']);
            // $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->enum('status', ['Waiting', 'Served', 'Completed', 'Cancelled'])->default('Waiting');
            // $table->foreignId('counter_id')->nullable()->constrained('counters')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
