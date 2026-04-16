<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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