<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model {
    public $timestamps = false;
    protected $fillable = ['purchase_order_id','product_id','name','qty','unit_price','tva'];
    protected $casts    = ['unit_price' => 'decimal:2'];
    public function purchaseOrder() { return $this->belongsTo(PurchaseOrder::class); }
    public function product()       { return $this->belongsTo(Product::class); }
}