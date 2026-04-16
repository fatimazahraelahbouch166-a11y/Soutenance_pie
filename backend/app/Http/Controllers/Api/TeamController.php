<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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