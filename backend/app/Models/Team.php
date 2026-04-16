<?php
// ══════════════════════════════════════════════════════════════
// app/Models/Team.php
// ══════════════════════════════════════════════════════════════
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Team extends Model {
    protected $fillable = ['company_id','name','manager_id'];
    public function company()  { return $this->belongsTo(Company::class); }
    public function manager()  { return $this->belongsTo(User::class, 'manager_id'); }
    public function users()    { return $this->hasMany(User::class); }
    public function expenses() { return $this->hasMany(Expense::class); }
    public function budgets()  { return $this->hasMany(Budget::class); }
}