<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // Get all payments
    public function index()
    {
        return response()->json(Payment::with('user')->get());
    }

    // Create a new payment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'      => 'required|exists:users,id',
            'plan_id'      => 'required|exists:plans,id',
            'amount'       => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'status'       => 'in:Paid,Pending,Failed',
        ]);

        DB::beginTransaction();

        try {
            $payment = Payment::create($validated);

            // If payment status is 'Paid', activate or create subscription
            if ($validated['status'] === 'Paid') {
                $this->activateSubscription($validated['user_id'], $validated['plan_id']);
            }

            DB::commit();

            return response()->json($payment, 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Payment creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get a single payment
    public function show($id)
    {
        $payment = Payment::with('user')->findOrFail($id);

        return response()->json($payment);
    }

    // Update a payment
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'user_id'      => 'sometimes|exists:users,id',
            'plan_id'      => 'sometimes|exists:plans,id',
            'amount'       => 'sometimes|numeric|min:0',
            'payment_date' => 'sometimes|date',
            'status'       => 'sometimes|in:Paid,Pending,Failed',
        ]);

        DB::beginTransaction();

        try {
            $oldStatus = $payment->status;
            $payment->update($validated);

            // If payment status changed to 'Paid', activate subscription
            if (isset($validated['status']) && $validated['status'] === 'Paid' && $oldStatus !== 'Paid') {
                $this->activateSubscription(
                    $validated['user_id'] ?? $payment->user_id,
                    $validated['plan_id'] ?? $payment->plan_id
                );
            }

            DB::commit();

            return response()->json($payment);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Payment update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate or create subscription for a user
     */
    private function activateSubscription($userId, $planId)
    {
        $plan = Plan::findOrFail($planId);
        
        // Update any expired subscriptions first
        Subscription::updateExpiredSubscriptions();
        
        // Check if user has an existing subscription
        $existingSubscription = Subscription::where('user_id', $userId)->first();
        
        if ($existingSubscription) {
            // Update existing subscription - always extend from current date
            $startDate = now()->toDateString();
            $endDate = now()->addDays($plan->duration)->toDateString();
            
            $existingSubscription->update([
                'plan_id' => $planId,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active'
            ]);
        } else {
            // Create new subscription
            Subscription::create([
                'user_id' => $userId,
                'plan_id' => $planId,
                'start_date' => now()->toDateString(),
                'end_date' => now()->addDays($plan->duration)->toDateString(),
                'status' => 'active'
            ]);
        }
    }

    // Delete a payment
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}

