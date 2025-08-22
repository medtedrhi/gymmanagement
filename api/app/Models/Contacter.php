<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacter extends Model
{
    /** @use HasFactory<\Database\Factories\ContacterFactory> */
    use HasFactory;

    protected $table = 'contacter';

    protected $fillable = [
        'email',
        'message',
    ];
}
