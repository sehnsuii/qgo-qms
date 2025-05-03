<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    protected $fillable = [
        'queue_number',
        'customer_type',
        // 'service_id',
        'status',
        // 'counter_id',
    ];
    /** @use HasFactory<\Database\Factories\QueueFactory> */
    use HasFactory;
}
