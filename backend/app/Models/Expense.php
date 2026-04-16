<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model {
    use SoftDeletes;

    protected $fillable = [
        'company_id','user_id','team_id','category_id','approved_by',
        'title','description','amount','expense_date','project',
        'status','rejection_reason','approved_at',
    ];

    protected $casts = [
        'expense_date' => 'date',
        'approved_at'  => 'datetime',
        'amount'       => 'decimal:2',
    ];

    public function company()      { return $this->belongsTo(Company::class); }
    public function user()         { return $this->belongsTo(User::class); }
    public function team()         { return $this->belongsTo(Team::class); }
    public function category()     { return $this->belongsTo(Category::class); }
    public function approver()     { return $this->belongsTo(User::class, 'approved_by'); }
    public function receipts()     { return $this->hasMany(Receipt::class); }
    public function reimbursement(){ return $this->hasOne(Reimbursement::class); }

    // Scopes
    public function scopeForUser($q, User $user) {
        return match($user->role) {
            'owner'       => $q->where('company_id', $user->company_id),
            'chef_equipe' => $q->where('company_id', $user->company_id)
                               ->where('team_id', $user->team_id),
            default       => $q->where('company_id', $user->company_id)
                               ->where('team_id', $user->team_id),
        };
    }

    public function scopeStatus($q, string $status) { return $q->where('status', $status); }
}