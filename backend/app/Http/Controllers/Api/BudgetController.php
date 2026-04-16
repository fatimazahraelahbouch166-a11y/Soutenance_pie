<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Category;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

// ══════════════════════════════════════════════════════════════
// BudgetController
// ══════════════════════════════════════════════════════════════
class BudgetController extends Controller
{
    public function index(): JsonResponse
    {
        $user    = auth('api')->user();
        $budgets = Budget::where('company_id', $user->company_id)
            ->with(['category', 'team'])
            ->get()
            ->map(function (Budget $b) {
                $spent = $b->spent;
                return array_merge($b->toArray(), [
                    'spent'      => (float) $spent,
                    'remaining'  => (float) ($b->amount - $spent),
                    'percentage' => $b->percentage,
                ]);
            });

        return response()->json(['data' => $budgets]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'label'       => 'required|string|max:150',
            'amount'      => 'required|numeric|min:1',
            'period'      => 'required|in:monthly,quarterly,yearly',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after:start_date',
            'category_id' => 'nullable|exists:categories,id',
            'team_id'     => 'nullable|exists:teams,id',
        ]);

        $budget = Budget::create(array_merge($data, ['company_id' => $user->company_id]));
        $budget->load(['category', 'team']);

        return response()->json($budget, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user   = auth('api')->user();
        $budget = Budget::where('company_id', $user->company_id)->findOrFail($id);

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'label'      => 'sometimes|string|max:150',
            'amount'     => 'sometimes|numeric|min:1',
            'period'     => 'sometimes|in:monthly,quarterly,yearly',
            'start_date' => 'sometimes|date',
            'end_date'   => 'sometimes|date',
        ]);

        $budget->update($data);
        return response()->json($budget->load(['category', 'team']));
    }

    public function destroy(int $id): JsonResponse
    {
        $user   = auth('api')->user();
        $budget = Budget::where('company_id', $user->company_id)->findOrFail($id);

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $budget->delete();
        return response()->json(null, 204);
    }
}

// ══════════════════════════════════════════════════════════════
// CategoryController
// ══════════════════════════════════════════════════════════════
class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth('api')->user();
        $cats = Category::where('company_id', $user->company_id)
            ->orderBy('name')
            ->get();
        return response()->json(['data' => $cats]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'name'  => 'required|string|max:80',
            'color' => 'required|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $cat = Category::create(array_merge($data, ['company_id' => $user->company_id]));
        return response()->json($cat, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = auth('api')->user();
        $cat  = Category::where('company_id', $user->company_id)->findOrFail($id);

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'name'  => 'sometimes|string|max:80',
            'color' => 'sometimes|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $cat->update($data);
        return response()->json($cat);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth('api')->user();
        $cat  = Category::where('company_id', $user->company_id)->findOrFail($id);

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $cat->delete();
        return response()->json(null, 204);
    }
}

// ══════════════════════════════════════════════════════════════
// UserController
// ══════════════════════════════════════════════════════════════
class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $user  = auth('api')->user();
        $users = User::where('company_id', $user->company_id)
            ->with(['team'])
            ->orderBy('first_name')
            ->get();
        return response()->json(['data' => $users]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $auth   = auth('api')->user();
        $target = User::where('company_id', $auth->company_id)->findOrFail($id);

        if (!$auth->isOwner() && $auth->id !== $id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'first_name' => 'sometimes|string|max:80',
            'last_name'  => 'sometimes|string|max:80',
            'email'      => 'sometimes|email|unique:users,email,' . $id,
            'phone'      => 'nullable|string|max:20',
            'role'       => 'sometimes|in:owner,chef_equipe,equipe',
            'team_id'    => 'nullable|exists:teams,id',
            'is_active'  => 'sometimes|boolean',
        ]);

        $target->update($data);
        return response()->json($target->load('team'));
    }

    public function destroy(int $id): JsonResponse
    {
        $auth   = auth('api')->user();
        $target = User::where('company_id', $auth->company_id)->findOrFail($id);

        if (!$auth->isOwner() || $auth->id === $id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $target->delete();
        return response()->json(null, 204);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $data = $request->validate([
            'first_name' => 'sometimes|string|max:80',
            'last_name'  => 'sometimes|string|max:80',
            'email'      => 'sometimes|email|unique:users,email,' . $user->id,
            'phone'      => 'nullable|string|max:20',
        ]);

        $user->update($data);
        return response()->json($user->load(['company', 'team']));
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = auth('api')->user();

        $request->validate([
            'current'  => 'required|string',
            'new'      => ['required', 'min:8'],
            'confirm'  => 'required|same:new',
        ]);

        if (!Hash::check($request->current, $user->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $user->update(['password' => $request->new]);
        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }
}

// ══════════════════════════════════════════════════════════════
// TeamController
// ══════════════════════════════════════════════════════════════
class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        $user  = auth('api')->user();
        $teams = Team::where('company_id', $user->company_id)
            ->with(['manager', 'users'])
            ->get();
        return response()->json(['data' => $teams]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'name'       => 'required|string|max:100',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        $team = Team::create(array_merge($data, ['company_id' => $user->company_id]));
        return response()->json($team->load('manager'), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = auth('api')->user();
        $team = Team::where('company_id', $user->company_id)->findOrFail($id);

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $data = $request->validate([
            'name'       => 'sometimes|string|max:100',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        $team->update($data);
        return response()->json($team->load('manager'));
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth('api')->user();
        $team = Team::where('company_id', $user->company_id)->findOrFail($id);

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $team->delete();
        return response()->json(null, 204);
    }
}