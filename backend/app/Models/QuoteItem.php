<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class QuoteItem extends Model {
    public $timestamps = false;
    protected $fillable = ['quote_id','product_id','name','qty','unit_price','tva','discount'];
    protected $casts    = ['unit_price' => 'decimal:2'];
    public function quote()   { return $this->belongsTo(Quote::class); }
    public function product() { return $this->belongsTo(Product::class); }
}