<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Contacter;
use Illuminate\Http\Request;

class ContacterController extends Controller
{
    public function index()
    {
        return Contacter::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        return Contacter::create($validated);
    }

    public function destroy($id)
    {
        return Contacter::destroy($id);
    }
}

