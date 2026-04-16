<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // ── POST /api/auth/register ───────────────────────────────
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name'   => 'required|string|max:80',
            'last_name'    => 'required|string|max:80',
            'email'        => 'required|email|unique:users,email',
            'password'     => ['required', Password::min(8)],
            'password_confirmation' => 'required|same:password',
            'role'         => 'required|in:owner,chef_equipe,equipe',
            'company_name' => 'required|string|max:150',
            'company_email'=> 'nullable|email',
            'currency'     => 'nullable|string|max:5',
            'timezone'     => 'nullable|string|max:60',
        ]);

        // Créer l'entreprise
        $company = Company::create([
            'name'     => $data['company_name'],
            'email'    => $data['company_email'] ?? null,
            'currency' => $data['currency'] ?? 'MAD',
            'timezone' => $data['timezone'] ?? 'Africa/Casablanca',
        ]);

        // Créer l'utilisateur
        $user = User::create([
            'company_id' => $company->id,
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'password'   => $data['password'],
            'role'       => $data['role'],
        ]);

        // Créer catégories par défaut
        $this->seedDefaultCategories($company->id);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user'  => $this->userResponse($user),
        ], 201);
    }

    // ── POST /api/auth/login ──────────────────────────────────
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Identifiants incorrects.'], 401);
        }

        $user = auth('api')->user();

        if (!$user->is_active) {
            auth('api')->logout();
            return response()->json(['message' => 'Compte désactivé.'], 403);
        }

        return response()->json([
            'token' => $token,
            'user'  => $this->userResponse($user),
        ]);
    }

    // ── POST /api/auth/logout ─────────────────────────────────
    public function logout(): JsonResponse
    {
        auth('api')->logout();
        return response()->json(['message' => 'Déconnecté.']);
    }

    // ── POST /api/auth/refresh ────────────────────────────────
    public function refresh(): JsonResponse
    {
        $token = auth('api')->refresh();
        return response()->json(['token' => $token]);
    }

    // ── GET /api/auth/me ──────────────────────────────────────
    public function me(): JsonResponse
    {
        $user = auth('api')->user()->load(['company', 'team']);
        return response()->json($this->userResponse($user));
    }

    // ── Helpers ───────────────────────────────────────────────
    private function userResponse(User $user): array
    {
        $user->load(['company', 'team']);
        return [
            'id'         => $user->id,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'email'      => $user->email,
            'phone'      => $user->phone,
            'role'       => $user->role,
            'is_active'  => $user->is_active,
            'company'    => $user->company ? [
                'id'       => $user->company->id,
                'name'     => $user->company->name,
                'currency' => $user->company->currency,
            ] : null,
            'team'       => $user->team ? [
                'id'   => $user->team->id,
                'name' => $user->team->name,
            ] : null,
        ];
    }

    private function seedDefaultCategories(int $companyId): void
    {
        $defaults = [
            ['name' => 'Déplacement',  'color' => '#6366f1'],
            ['name' => 'Hébergement',  'color' => '#10b981'],
            ['name' => 'Restauration', 'color' => '#f59e0b'],
            ['name' => 'Informatique', 'color' => '#3b82f6'],
            ['name' => 'Formation',    'color' => '#ef4444'],
            ['name' => 'Fournitures',  'color' => '#8b5cf6'],
        ];
        foreach ($defaults as $cat) {
            \App\Models\Category::create(array_merge($cat, ['company_id' => $companyId]));
        }
    }
}