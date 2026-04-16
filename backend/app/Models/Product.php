<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model {
    use SoftDeletes;
    protected $fillable = [
        'company_id','ref','name','category',
        'buy_price','sell_price','tva','unit','stock','min_stock',
    ];
    protected $casts = [
        'buy_price'  => 'decimal:2',
        'sell_price' => 'decimal:2',
    ];
    public function company()         { return $this->belongsTo(Company::class); }
    public function stockMovements()  { return $this->hasMany(StockMovement::class); }

    public function getLowStockAttribute(): bool {
        return $this->stock !== null
            && $this->min_stock !== null
            && $this->stock <= $this->min_stock;
    }
}

class StockMovement extends Model {
    protected $fillable = ['product_id','user_id','type','qty','date','reason'];
    protected $casts    = ['date' => 'date'];
    public function product() { return $this->belongsTo(Product::class); }
    public function user()    { return $this->belongsTo(User::class); }
}