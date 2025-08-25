<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Subscription;

class CheckSubscriptionExpiry
{
    /**
     * Handle an incoming request.
     * This middleware automatically updates expired subscriptions
     */
    public function handle(Request $request, Closure $next)
    {
        // Update expired subscriptions
        Subscription::updateExpiredSubscriptions();
        
        return $next($request);
    }
}
