<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        return Subscription::with(['user', 'plan'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'in:active,expired,cancelled',
        ]);

        return Subscription::create($validated);
    }

    public function show($id)
    {
        return Subscription::with(['user', 'plan'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $subscription = Subscription::findOrFail($id);
        
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'plan_id' => 'sometimes|exists:plans,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
            'status' => 'sometimes|in:active,expired,cancelled',
        ]);
        
        $subscription->update($validated);
        return $subscription->fresh(['user', 'plan']);
    }

    public function destroy($id)
    {
        return Subscription::destroy($id);
    }
}
