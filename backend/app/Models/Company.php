<?php
// ══════════════════════════════════════════════════════════════
// app/Models/Company.php
// ══════════════════════════════════════════════════════════════
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name','email','phone','address','currency','timezone',
        'ice','if_num','rc','cnss','limit_manager','limit_admin',
    ];

    public function users(): HasMany    { return $this->hasMany(User::class); }
    public function teams(): HasMany    { return $this->hasMany(Team::class); }
    public function categories(): HasMany { return $this->hasMany(Category::class); }
    public function expenses(): HasMany { return $this->hasMany(Expense::class); }
    public function budgets(): HasMany  { return $this->hasMany(Budget::class); }
    public function customers(): HasMany { return $this->hasMany(Customer::class); }
    public function suppliers(): HasMany { return $this->hasMany(Supplier::class); }
    public function products(): HasMany { return $this->hasMany(Product::class); }
}