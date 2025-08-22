<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\ContacterController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me',     [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

Route::apiResource('users', UserController::class);

Route::apiResource('classes', ClasseController::class);

Route::apiResource('testimonials', TestimonialController::class);

Route::get('/contacter', [ContacterController::class, 'index']);
Route::post('/contacter', [ContacterController::class, 'store']);
Route::delete('/contacter/{id}', [ContacterController::class, 'destroy']);

Route::apiResource('faq', FaqController::class);

Route::apiResource('plans', PlanController::class);

Route::apiResource('subscriptions', SubscriptionController::class);

Route::apiResource('payments', PaymentController::class);



