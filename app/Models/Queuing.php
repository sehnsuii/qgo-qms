<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Queuing extends Model
{
    protected $guarded = [];

    public function scopeCounter($query)
    {
        return $query->whereNotNull('counter_id');
    }

    public function counter()
    {
        return $this->belongsTo(Counter::class);
    }
}
