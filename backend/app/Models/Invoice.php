<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model {
    use SoftDeletes;
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

    public function recalcTotals(): void {
        $ht = $tva = 0;
        foreach ($this->items as $item) {
            $lineHt  = $item->qty * $item->unit_price * (1 - ($item->discount ?? 0) / 100);
            $lineTva = $lineHt * ($item->tva / 100);
            $ht += $lineHt; $tva += $lineTva;
        }
        $this->update(['total_ht' => round($ht,2), 'total_tva' => round($tva,2), 'total_ttc' => round($ht+$tva,2)]);
    }
}