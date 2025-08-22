<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        return Plan::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'price' => 'required|numeric',
            'duration' => 'required|string',
            'description' => 'nullable|string',
            'is_recommended' => 'boolean',
        ]);

        return Plan::create($validated);
    }

    public function show($id)
    {
        return Plan::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);
        $plan->update($request->all());
        return $plan;
    }

    public function destroy($id)
    {
        return Plan::destroy($id);
    }
}
