<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Task Model
 *
 * Represents a single to-do item.
 * Compatible with Laravel 13 / PHP 8.3+.
 *
 * @property int                 $id
 * @property string              $title
 * @property string|null         $description
 * @property bool                $is_completed
 * @property \Carbon\Carbon      $created_at
 * @property \Carbon\Carbon      $updated_at
 */
class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'is_completed',
    ];

    /**
     * Attribute casting — Laravel 13 preferred method syntax.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'created_at'   => 'datetime',
            'updated_at'   => 'datetime',
        ];
    }
}
