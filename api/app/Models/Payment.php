<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

     protected $table = 'payments';

    // Mass assignable fields
    protected $fillable = [
        'user_id',
        'plan_id',
        'amount',
        'payment_date',
        'status',
    ];

    // Optional: Casts
    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
