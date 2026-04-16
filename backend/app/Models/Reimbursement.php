<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Reimbursement extends Model {
    protected $fillable = ['expense_id','paid_by','payment_method','paid_at'];
    protected $casts    = ['paid_at' => 'datetime'];

    public function expense() { return $this->belongsTo(Expense::class); }
    public function paidBy()  { return $this->belongsTo(User::class, 'paid_by'); }
}