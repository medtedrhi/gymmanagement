<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Subscription extends Model
{
    /** @use HasFactory<\Database\Factories\SubscriptionsFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_id',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Check if the subscription is expired
     */
    public function isExpired()
    {
        return $this->end_date < Carbon::today();
    }

    /**
     * Check if the subscription is active and not expired
     */
    public function isActiveAndValid()
    {
        return $this->status === 'active' && !$this->isExpired();
    }

    /**
     * Get days remaining in subscription
     */
    public function daysRemaining()
    {
        if ($this->isExpired()) {
            return 0;
        }
        
        return Carbon::today()->diffInDays($this->end_date, false);
    }

    /**
     * Update expired subscriptions
     * Returns the number of subscriptions that were expired
     */
    public static function updateExpiredSubscriptions()
    {
        return self::where('status', 'active')
            ->where('end_date', '<', Carbon::today())
            ->update(['status' => 'expired']);
    }
}
