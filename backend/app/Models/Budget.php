<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model {
    protected $fillable = [
        'company_id','category_id','team_id',
        'label','amount','period','start_date','end_date',
    ];
    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
        'amount'     => 'decimal:2',
    ];

    public function company()  { return $this->belongsTo(Company::class); }
    public function category() { return $this->belongsTo(Category::class); }
    public function team()     { return $this->belongsTo(Team::class); }

    // Calcul dynamique des dépenses consommées
    public function getSpentAttribute(): float {
        return Expense::where('company_id', $this->company_id)
            ->whereIn('status', ['approved','paid'])
            ->when($this->category_id, fn($q) => $q->where('category_id', $this->category_id))
            ->when($this->team_id,     fn($q) => $q->where('team_id',     $this->team_id))
            ->whereBetween('expense_date', [$this->start_date, $this->end_date])
            ->sum('amount');
    }

    public function getPercentageAttribute(): int {
        if ($this->amount <= 0) return 0;
        return (int) min(round(($this->spent / $this->amount) * 100), 999);
    }

    public function getRemainingAttribute(): float {
        return $this->amount - $this->spent;
    }
}