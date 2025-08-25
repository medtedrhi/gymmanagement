<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Plan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;



class AuthController
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|in:admin,trainer,member'
        ]);

        if ($validator->fails()) return response()->json($validator->errors(), 422);

        DB::beginTransaction();

        try {
            // Create the user
            $user = User::create([
                'name' => $request->name,
                'email'=> $request->email,
                'password'=> Hash::make($request->password),
                'role' => $request->role ?? 'member'
            ]);

            // If the user is a member, create an inactive subscription
            if (($request->role ?? 'member') === 'member') {
                // Get the cheapest plan as default, or create a basic plan if none exists
                $defaultPlan = Plan::orderBy('price')->first();
                
                if (!$defaultPlan) {
                    // Create a basic plan if none exists
                    $defaultPlan = Plan::create([
                        'title' => 'Basic Plan',
                        'price' => 29.99,
                        'duration' => 30,
                        'description' => 'Basic gym membership - 1 month',
                        'is_recommended' => false
                    ]);
                }

                // Create inactive subscription
                Subscription::create([
                    'user_id' => $user->id,
                    'plan_id' => $defaultPlan->id,
                    'start_date' => now()->toDateString(),
                    'end_date' => now()->addDays($defaultPlan->duration)->toDateString(),
                    'status' => 'cancelled' // Inactive until payment
                ]);
            }

            DB::commit();

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => $user->role === 'member' ? 
                    'Registration successful! Please make a payment to activate your membership.' : 
                    'Registration successful!'
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json(compact('token'));
    }

    public function me()
    {
        $user = JWTAuth::user();
        
        // Load subscription status for members
        if ($user->role === 'member') {
            $subscription = $user->subscriptions()->latest()->first();
            
            if ($subscription) {
                // Check if subscription has expired
                $currentDate = now()->toDateString();
                
                if ($subscription->status === 'active' && $subscription->end_date < $currentDate) {
                    // Subscription has expired, update status
                    $subscription->update(['status' => 'expired']);
                    $user->subscription_status = 'expired';
                } else {
                    $user->subscription_status = $subscription->status;
                }
            } else {
                $user->subscription_status = 'cancelled';
            }
        } else {
            $user->subscription_status = 'active'; // Non-members always have access
        }
        
        return response()->json($user);
    }

    public function logout()
    {
        JWTAuth::logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return response()->json([
            'token' => JWTAuth::refresh()
        ]);
    }
}

