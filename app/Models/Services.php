<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];
    /** @use HasFactory<\Database\Factories\ServicesFactory> */
    use HasFactory;

    public function queues()
    {
        return $this->hasMany(Queue::class);
    }
}
