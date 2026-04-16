<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ── Customer ─────────────────────────────────────────────────
class Customer extends Model {
    use SoftDeletes;
    protected $fillable = [
        'company_id','name','type','ice','if_num','rc','cnss',
        'email','phone','address','payment_terms','credit_limit','balance',
    ];
    protected $casts = ['credit_limit' => 'decimal:2', 'balance' => 'decimal:2'];
    public function company()  { return $this->belongsTo(Company::class); }
    public function invoices() { return $this->hasMany(Invoice::class); }
    public function quotes()   { return $this->hasMany(Quote::class); }
}