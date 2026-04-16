<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Receipt;
use App\Models\Reimbursement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ExpenseController extends Controller
{
    // ── GET /api/expenses ─────────────────────────────────────
    public function index(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $q = Expense::forUser($user)
            ->with(['user', 'team', 'category', 'approver', 'receipts', 'reimbursement'])
            ->orderByDesc('expense_date')
            ->orderByDesc('id');

        if ($request->status) {
            $q->where('status', $request->status);
        }
        if ($request->category_id) {
            $q->where('category_id', $request->category_id);
        }
        if ($request->team_id && $user->isOwner()) {
            $q->where('team_id', $request->team_id);
        }
        if ($request->search) {
            $q->where('title', 'like', '%' . $request->search . '%');
        }

        $expenses = $q->paginate($request->per_page ?? 50);
        return response()->json($expenses);
    }

    // ── POST /api/expenses ────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $data = $request->validate([
            'title'        => 'required|string|max:200',
            'amount'       => 'required|numeric|min:0.01',
            'category_id'  => 'nullable|exists:categories,id',
            'team_id'      => 'nullable|exists:teams,id',
            'expense_date' => 'required|date',
            'description'  => 'nullable|string|max:1000',
            'project'      => 'nullable|string|max:100',
            'submit'       => 'nullable|boolean',
            'receipt'      => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        DB::beginTransaction();
        try {
            $expense = Expense::create([
                'company_id'   => $user->company_id,
                'user_id'      => $user->id,
                'team_id'      => $data['team_id'] ?? $user->team_id,
                'category_id'  => $data['category_id'] ?? null,
                'title'        => $data['title'],
                'amount'       => $data['amount'],
                'expense_date' => $data['expense_date'],
                'description'  => $data['description'] ?? null,
                'project'      => $data['project'] ?? null,
                'status'       => ($data['submit'] ?? true) ? 'pending' : 'draft',
            ]);

            // Upload justificatif
            if ($request->hasFile('receipt')) {
                $file = $request->file('receipt');
                $path = $file->store('receipts', 'public');
                Receipt::create([
                    'expense_id'    => $expense->id,
                    'original_name' => $file->getClientOriginalName(),
                    'file_path'     => $path,
                    'mime_type'     => $file->getMimeType(),
                    'file_size'     => $file->getSize(),
                ]);
            }

            DB::commit();
            return response()->json(
                $expense->load(['user','team','category','receipts']),
                201
            );
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ── GET /api/expenses/{id} ────────────────────────────────
    public function show(int $id): JsonResponse
    {
        $expense = $this->findForUser($id);
        return response()->json(
            $expense->load(['user','team','category','approver','receipts','reimbursement'])
        );
    }

    // ── PUT /api/expenses/{id} ────────────────────────────────
    public function update(Request $request, int $id): JsonResponse
    {
        $expense = $this->findForUser($id);
        $user    = auth('api')->user();

        // Seul le créateur peut modifier un brouillon ou en attente
        if ($expense->user_id !== $user->id || !in_array($expense->status, ['draft','pending'])) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'title'        => 'sometimes|string|max:200',
            'amount'       => 'sometimes|numeric|min:0.01',
            'category_id'  => 'nullable|exists:categories,id',
            'expense_date' => 'sometimes|date',
            'description'  => 'nullable|string|max:1000',
            'project'      => 'nullable|string|max:100',
        ]);

        $expense->update($data);
        return response()->json($expense->load(['user','team','category','receipts']));
    }

    // ── DELETE /api/expenses/{id} ─────────────────────────────
    public function destroy(int $id): JsonResponse
    {
        $expense = $this->findForUser($id);
        $user    = auth('api')->user();

        if ($expense->user_id !== $user->id || $expense->status !== 'draft') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $expense->receipts->each(fn($r) => Storage::disk('public')->delete($r->file_path));
        $expense->delete();
        return response()->json(null, 204);
    }

    // ── POST /api/expenses/{id}/approve ──────────────────────
    public function approve(int $id): JsonResponse
    {
        $expense = $this->findForUser($id);
        $user    = auth('api')->user();

        if (!$user->canApprove()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        if ($expense->status !== 'pending') {
            return response()->json(['message' => 'Statut invalide.'], 422);
        }

        $expense->update([
            'status'      => 'approved',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);

        return response()->json($expense->load(['user','team','category','approver','receipts']));
    }

    // ── POST /api/expenses/{id}/reject ────────────────────────
    public function reject(Request $request, int $id): JsonResponse
    {
        $expense = $this->findForUser($id);
        $user    = auth('api')->user();

        if (!$user->canApprove()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        if ($expense->status !== 'pending') {
            return response()->json(['message' => 'Statut invalide.'], 422);
        }

        $expense->update([
            'status'           => 'rejected',
            'approved_by'      => $user->id,
            'approved_at'      => now(),
            'rejection_reason' => $request->reason ?? null,
        ]);

        return response()->json($expense->load(['user','team','category','approver','receipts']));
    }

    // ── Helpers ───────────────────────────────────────────────
    private function findForUser(int $id): Expense
    {
        $user = auth('api')->user();
        return Expense::forUser($user)->findOrFail($id);
    }
}