<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user      = auth('api')->user();
        $companyId = $user->company_id;
        $now       = now();
        $monthStart = $now->copy()->startOfMonth()->toDateString();
        $monthEnd   = $now->copy()->endOfMonth()->toDateString();

        // Base query filtrée selon le rôle
        $baseQ = Expense::forUser($user);

        // KPI 1 — Total ce mois (approuvées + payées)
        $totalThisMonth = (clone $baseQ)
            ->whereIn('status', ['approved', 'paid'])
            ->whereBetween('expense_date', [$monthStart, $monthEnd])
            ->sum('amount');

        // KPI 2 — En attente de validation
        $pendingCount = (clone $baseQ)
            ->where('status', 'pending')
            ->count();

        // KPI 3 — Remboursements en attente (approuvées non payées)
        $reimbursementPending = (clone $baseQ)
            ->where('status', 'approved')
            ->sum('amount');

        // Tendance 6 mois
        $trend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $total = (clone $baseQ)
                ->whereIn('status', ['approved', 'paid'])
                ->whereYear('expense_date', $month->year)
                ->whereMonth('expense_date', $month->month)
                ->sum('amount');
            $trend[] = [
                'month' => $month->locale('fr')->isoFormat('MMM'),
                'total' => (float) $total,
            ];
        }

        // Par catégorie (ce mois)
        $byCategory = (clone $baseQ)
            ->whereIn('status', ['approved', 'paid'])
            ->whereBetween('expense_date', [$monthStart, $monthEnd])
            ->whereNotNull('category_id')
            ->with('category')
            ->get()
            ->groupBy('category_id')
            ->map(function ($group) {
                $cat = $group->first()->category;
                return [
                    'name'  => $cat?->name ?? 'Autre',
                    'color' => $cat?->color ?? '#d1d5db',
                    'total' => (float) $group->sum('amount'),
                ];
            })
            ->values();

        // Budgets
        $budgets = Budget::where('company_id', $companyId)
            ->with(['category', 'team'])
            ->get()
            ->map(fn($b) => $this->budgetData($b));

        // Dépenses récentes
        $recent = (clone $baseQ)
            ->with(['user', 'category', 'team'])
            ->orderByDesc('expense_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get();

        return response()->json([
            'totalThisMonth'       => (float) $totalThisMonth,
            'pendingCount'         => $pendingCount,
            'reimbursementPending' => (float) $reimbursementPending,
            'budgets'              => $budgets,
            'trend'                => $trend,
            'byCategory'           => $byCategory,
            'recent'               => $recent,
        ]);
    }

    private function budgetData(Budget $b): array
    {
        $spent = $b->spent;
        return [
            'id'         => $b->id,
            'label'      => $b->label,
            'amount'     => (float) $b->amount,
            'spent'      => (float) $spent,
            'remaining'  => (float) ($b->amount - $spent),
            'percentage' => $b->percentage,
            'period'     => $b->period,
            'category'   => $b->category,
            'team'       => $b->team,
        ];
    }
}