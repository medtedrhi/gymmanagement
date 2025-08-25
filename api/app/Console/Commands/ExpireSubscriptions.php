<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;

class ExpireSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'subscriptions:expire';

    /**
     * The console command description.
     */
    protected $description = 'Mark expired subscriptions as expired';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredCount = Subscription::updateExpiredSubscriptions();
        
        $this->info("Checked for expired subscriptions. Updated {$expiredCount} expired subscriptions.");
        
        return 0;
    }
}
