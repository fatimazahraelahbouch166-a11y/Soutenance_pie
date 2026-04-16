<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Reimbursement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ══════════════════════════════════════════════════════════════
// ReimbursementController
// ══════════════════════════════════════════════════════════════
class ReimbursementController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth('api')->user();

        $expenses = Expense::forUser($user)
            ->whereIn('status', ['approved', 'paid'])
            ->with(['user', 'category', 'team', 'reimbursement'])
            ->orderByDesc('approved_at')
            ->get()
            ->map(function (Expense $e) {
                return array_merge($e->toArray(), [
                    'amount' => (float) $e->amount,
                    'status' => $e->status,
                ]);
            });

        return response()->json(['data' => $expenses]);
    }

    public function markPaid(Request $request, int $id): JsonResponse
    {
        $user    = auth('api')->user();
        $expense = Expense::forUser($user)->findOrFail($id);

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        if ($expense->status !== 'approved') {
            return response()->json(['message' => 'La dépense doit être approuvée.'], 422);
        }

        $request->validate([
            'payment_method' => 'nullable|string|max:60',
        ]);

        \DB::transaction(function () use ($expense, $user, $request) {
            $expense->update(['status' => 'paid']);
            Reimbursement::create([
                'expense_id'     => $expense->id,
                'paid_by'        => $user->id,
                'payment_method' => $request->payment_method ?? 'Virement bancaire',
                'paid_at'        => now(),
            ]);
        });

        return response()->json($expense->fresh(['user', 'category', 'reimbursement']));
    }
}

// ══════════════════════════════════════════════════════════════
// ReportsController
// ══════════════════════════════════════════════════════════════
class ReportsController extends Controller
{
    public function index(): JsonResponse
    {
        $user      = auth('api')->user();
        $companyId = $user->company_id;
        $year      = now()->year;

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

// ══════════════════════════════════════════════════════════════
// SettingsController
// ══════════════════════════════════════════════════════════════
class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        $user    = auth('api')->user();
        $company = $user->company;
        return response()->json($company);
    }

    public function update(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'name'            => 'sometimes|string|max:150',
            'email'           => 'nullable|email',
            'phone'           => 'nullable|string|max:20',
            'address'         => 'nullable|string|max:200',
            'currency'        => 'sometimes|string|max:5',
            'timezone'        => 'sometimes|string|max:60',
            'ice'             => 'nullable|string|max:20',
            'if_num'          => 'nullable|string|max:20',
            'rc'              => 'nullable|string|max:50',
            'cnss'            => 'nullable|string|max:20',
            'limit_manager'   => 'sometimes|numeric|min:0',
            'limit_admin'     => 'sometimes|numeric|min:0',
        ]);

        $user->company->update($data);
        return response()->json($user->company->fresh());
    }
}