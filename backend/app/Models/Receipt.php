<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model {
    protected $fillable = ['expense_id','original_name','file_path','mime_type','file_size'];
    public function expense() { return $this->belongsTo(Expense::class); }
    public function getUrlAttribute(): string {
        return asset('storage/' . $this->file_path);
    }
}