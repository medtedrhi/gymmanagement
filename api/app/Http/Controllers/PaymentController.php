<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

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

        $payment = Payment::create($validated);

        return response()->json($payment, 201);
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

        $payment->update($validated);

        return response()->json($payment);
    }

    // Delete a payment
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}

