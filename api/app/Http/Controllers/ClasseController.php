<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;

class ClasseController extends Controller
{


    public function index()
    {
        return Classe::with('trainer')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'session_time' => 'required|date_format:H:i:s',
            'class_date' => 'required|date',
            'trainer_id' => 'nullable|exists:users,id',
            'participants_count' => 'nullable|integer|min:0',
        ]);

        return Classe::create($validated);
    }

    public function show($id)
    {
        return Classe::with('trainer')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $session = Classe::findOrFail($id);
        $session->update($request->all());
        return $session;
    }

    public function destroy($id)
    {
        return Classe::destroy($id);
    }
}


