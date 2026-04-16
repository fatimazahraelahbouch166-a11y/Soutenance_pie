<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model {
    use SoftDeletes;
    protected $fillable = [
        'company_id','supplier_id','ref','date','expected_date',
        'status','notes','total_ht','total_tva','total_ttc',
    ];
    protected $casts = [
        'date'          => 'date',
        'expected_date' => 'date',
        'total_ht'      => 'decimal:2',
        'total_tva'     => 'decimal:2',
        'total_ttc'     => 'decimal:2',
    ];
    public function company()  { return $this->belongsTo(Company::class); }
    public function supplier() { return $this->belongsTo(Supplier::class); }
    public function items()    { return $this->hasMany(PurchaseOrderItem::class); }

    public function recalcTotals(): void {
        $ht = $tva = 0;
        foreach ($this->items as $item) {
            $lineHt  = $item->qty * $item->unit_price;
            $lineTva = $lineHt * ($item->tva / 100);
            $ht += $lineHt; $tva += $lineTva;
        }
        $this->update(['total_ht' => round($ht,2), 'total_tva' => round($tva,2), 'total_ttc' => round($ht+$tva,2)]);
    }
}

class PurchaseOrderItem extends Model {
    public $timestamps = false;
    protected $fillable = ['purchase_order_id','product_id','name','qty','unit_price','tva'];
    protected $casts    = ['unit_price' => 'decimal:2'];
    public function purchaseOrder() { return $this->belongsTo(PurchaseOrder::class); }
    public function product()       { return $this->belongsTo(Product::class); }
}