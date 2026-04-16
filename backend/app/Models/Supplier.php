<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model {
    use SoftDeletes;
    protected $fillable = [
        'company_id','name','category','ice','if_num','rc','rib',
        'email','phone','address','payment_terms','balance','rating',
    ];
    protected $casts = ['balance' => 'decimal:2'];
    public function company()        { return $this->belongsTo(Company::class); }
    public function purchaseOrders() { return $this->hasMany(PurchaseOrder::class); }
}