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
            'status' => 'in:active,pending,cancelled',
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
        $subscription->update($request->all());
        return $subscription;
    }

    public function destroy($id)
    {
        return Subscription::destroy($id);
    }
}
