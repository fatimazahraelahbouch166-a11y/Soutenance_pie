<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'company_id','team_id','first_name','last_name',
        'email','phone','password','role','is_active',
    ];

    protected $hidden = ['password','remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'is_active'         => 'boolean',
    ];

    // ── JWT ─────────────────────────────────────────────────
    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'role'       => $this->role,
            'company_id' => $this->company_id,
            'team_id'    => $this->team_id,
        ];
    }

    // ── Relations ───────────────────────────────────────────
    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function team(): BelongsTo   { return $this->belongsTo(Team::class); }
    public function expenses(): HasMany { return $this->hasMany(Expense::class); }
    public function approvedExpenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'approved_by');
    }

    // ── Helpers rôles ────────────────────────────────────────
    public function isOwner(): bool      { return $this->role === 'owner'; }
    public function isChefEquipe(): bool { return $this->role === 'chef_equipe'; }
    public function isEquipe(): bool     { return $this->role === 'equipe'; }
    public function canApprove(): bool   { return in_array($this->role, ['owner', 'chef_equipe']); }
    public function canAccessErp(): bool { return in_array($this->role, ['owner', 'chef_equipe']); }

    // ── Scope actifs ─────────────────────────────────────────
    public function scopeActive($query) { return $query->where('is_active', true); }
}