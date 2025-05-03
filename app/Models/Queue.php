<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    protected $fillable = [
        'created_at',
        'updated_at',
        'queue_number',
        'customer_type',
        'service_id',
        'status',
        'counter_id',
    ];
    /** @use HasFactory<\Database\Factories\QueueFactory> */
    use HasFactory;

    public function counter()
    {
        return $this->belongsTo(Counters::class);
    }

    public function service()
    {
        return $this->belongsTo(Services::class);
    }
}
