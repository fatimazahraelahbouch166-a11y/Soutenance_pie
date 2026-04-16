<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Category extends Model {
    protected $fillable = ['company_id','name','color'];
    public function company()  { return $this->belongsTo(Company::class); }
    public function expenses() { return $this->hasMany(Expense::class); }
    public function budgets()  { return $this->hasMany(Budget::class); }
}