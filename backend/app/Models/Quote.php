<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ── Trait pour calcul des totaux ─────────────────────────────
trait HasDocumentTotals {
    public function recalcTotals(): void {
        $ht = $tva = 0;
        foreach ($this->items as $item) {
            $lineHt  = $item->qty * $item->unit_price * (1 - ($item->discount ?? 0) / 100);
            $lineTva = $lineHt * ($item->tva / 100);
            $ht  += $lineHt;
            $tva += $lineTva;
        }
        $this->update([
            'total_ht'  => round($ht, 2),
            'total_tva' => round($tva, 2),
            'total_ttc' => round($ht + $tva, 2),
        ]);
    }
}

// ── Quote ─────────────────────────────────────────────────────
class Quote extends Model {
    use SoftDeletes, HasDocumentTotals;

    protected $fillable = [
        'company_id','customer_id','ref','date','valid_until',
        'status','notes','total_ht','total_tva','total_ttc',
    ];
    protected $casts = [
        'date'        => 'date',
        'valid_until' => 'date',
        'total_ht'    => 'decimal:2',
        'total_tva'   => 'decimal:2',
        'total_ttc'   => 'decimal:2',
    ];

    public function company()  { return $this->belongsTo(Company::class); }
    public function customer() { return $this->belongsTo(Customer::class); }
    public function items()    { return $this->hasMany(QuoteItem::class); }
    public function invoices() { return $this->hasMany(Invoice::class); }
}

class QuoteItem extends Model {
    public $timestamps = false;
    protected $fillable = ['quote_id','product_id','name','qty','unit_price','tva','discount'];
    protected $casts    = ['unit_price' => 'decimal:2'];
    public function quote()   { return $this->belongsTo(Quote::class); }
    public function product() { return $this->belongsTo(Product::class); }
}

// ── Invoice ──────────────────────────────────────────────────
class Invoice extends Model {
    use SoftDeletes, HasDocumentTotals;

    protected $fillable = [
        'company_id','customer_id','quote_id','ref','date','due_date',
        'status','notes','total_ht','total_tva','total_ttc','paid_at',
    ];
    protected $casts = [
        'date'      => 'date',
        'due_date'  => 'date',
        'paid_at'   => 'datetime',
        'total_ht'  => 'decimal:2',
        'total_tva' => 'decimal:2',
        'total_ttc' => 'decimal:2',
    ];

    public function company()  { return $this->belongsTo(Company::class); }
    public function customer() { return $this->belongsTo(Customer::class); }
    public function quote()    { return $this->belongsTo(Quote::class); }
    public function items()    { return $this->hasMany(InvoiceItem::class); }
}

class InvoiceItem extends Model {
    public $timestamps = false;
    protected $fillable = ['invoice_id','product_id','name','qty','unit_price','tva','discount'];
    protected $casts    = ['unit_price' => 'decimal:2'];
    public function invoice() { return $this->belongsTo(Invoice::class); }
    public function product() { return $this->belongsTo(Product::class); }
}

// ── PurchaseOrder ────────────────────────────────────────────
class PurchaseOrder extends Model {
    use SoftDeletes, HasDocumentTotals;

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
}

class PurchaseOrderItem extends Model {
    public $timestamps = false;
    protected $fillable = ['purchase_order_id','product_id','name','qty','unit_price','tva'];
    protected $casts    = ['unit_price' => 'decimal:2'];
    public function purchaseOrder() { return $this->belongsTo(PurchaseOrder::class); }
    public function product()       { return $this->belongsTo(Product::class); }
}