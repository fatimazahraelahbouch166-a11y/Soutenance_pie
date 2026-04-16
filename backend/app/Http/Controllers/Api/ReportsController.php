<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;

class ReportsController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth('api')->user();
        $year = now()->year;

        // Mensuel
        $monthly = [];
        for ($m = 1; $m <= 12; $m++) {
            $total = Expense::forUser($user)
                ->whereIn('status', ['approved', 'paid'])
                ->whereYear('expense_date', $year)
                ->whereMonth('expense_date', $m)
                ->sum('amount');
            $monthly[] = [
                'month' => \Carbon\Carbon::create($year, $m, 1)->locale('fr')->isoFormat('MMM'),
                'total' => (float) $total,
            ];
        }

        // Par catégorie
        $byCategory = Expense::forUser($user)
            ->whereIn('status', ['approved', 'paid'])
            ->whereYear('expense_date', $year)
            ->whereNotNull('category_id')
            ->with('category')
            ->get()
            ->groupBy('category_id')
            ->map(function ($group) {
                $cat = $group->first()->category;
                return [
                    'category' => $cat?->name ?? 'Autre',
                    'color'    => $cat?->color ?? '#d1d5db',
                    'total'    => (float) $group->sum('amount'),
                    'count'    => $group->count(),
                ];
            })
            ->values();

        // Par équipe
        $byTeam = Expense::forUser($user)
            ->whereIn('status', ['approved', 'paid'])
            ->whereYear('expense_date', $year)
            ->whereNotNull('team_id')
            ->with('team')
            ->get()
            ->groupBy('team_id')
            ->map(function ($group) {
                return [
                    'team'  => $group->first()->team?->name ?? 'Inconnu',
                    'total' => (float) $group->sum('amount'),
                    'count' => $group->count(),
                ];
            })
            ->values();

        return response()->json(compact('monthly', 'byCategory', 'byTeam'));
    }
}