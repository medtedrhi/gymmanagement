<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    /** @use HasFactory<\Database\Factories\PlansFactory> */
    use HasFactory;


    protected $fillable = [
        'title',
        'price',
        'duration',
        'description',
        'is_recommended',
    ];

    protected $casts = [
        'is_recommended' => 'boolean',
        'price' => 'float',
    ];

    public function subscriptions()
    {
        return $this->hasMany(\App\Models\Subscription::class);
    }

}
