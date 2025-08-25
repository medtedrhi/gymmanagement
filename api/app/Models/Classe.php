<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    /** @use HasFactory<\Database\Factories\ClassesFactory> */
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'class_time',
        'class_date',
        'trainer_id',
        'participants_count',
    ];

    protected $attributes = [
        'participants_count' => 0,
    ];

    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }
}
