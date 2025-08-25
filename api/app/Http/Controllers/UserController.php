<?php


namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Get all users
    public function index()
    {
        // Update expired subscriptions first
        \App\Models\Subscription::updateExpiredSubscriptions();
        
        $users = User::with(['subscriptions' => function($query) {
            $query->latest()->limit(1);
        }])->get();

        // Add subscription status to each user
        $users->each(function($user) {
            $latestSubscription = $user->subscriptions->first();
            if ($latestSubscription) {
                // Check if subscription is expired
                $currentDate = now()->toDateString();
                if ($latestSubscription->status === 'active' && $latestSubscription->end_date < $currentDate) {
                    // Update to expired status
                    $latestSubscription->update(['status' => 'expired']);
                    $user->subscription_status = 'expired';
                } else {
                    $user->subscription_status = $latestSubscription->status;
                }
                
                // Add subscription end date for display
                $user->subscription_end_date = $latestSubscription->end_date;
            } else {
                $user->subscription_status = null;
                $user->subscription_end_date = null;
            }
            // Remove the subscriptions relation from the response to keep it clean
            unset($user->subscriptions);
        });

        return $users;
    }

    // Create a new user (Admin only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,trainer,member',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    // Show user details
    public function show($id)
    {
        return User::findOrFail($id);
    }

    // Update user info
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role'     => 'sometimes|in:admin,trainer,member',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // Delete user
    public function destroy($id)
    {
        return User::destroy($id);
    }
}

