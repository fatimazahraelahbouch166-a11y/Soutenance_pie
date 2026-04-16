<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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