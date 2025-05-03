<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Counters extends Model
{
    protected $fillable = [
        'status',
        'queue_id',
    ];
    /** @use HasFactory<\Database\Factories\CountersFactory> */
    use HasFactory;

    public function queue()
    {
        return $this->belongsTo(Queue::class);
    }
}
