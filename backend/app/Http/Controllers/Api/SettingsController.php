<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
            'name'          => 'sometimes|string|max:150',
            'email'         => 'nullable|email',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:200',
            'currency'      => 'sometimes|string|max:5',
            'timezone'      => 'sometimes|string|max:60',
            'ice'           => 'nullable|string|max:20',
            'if_num'        => 'nullable|string|max:20',
            'rc'            => 'nullable|string|max:50',
            'cnss'          => 'nullable|string|max:20',
            'limit_manager' => 'sometimes|numeric|min:0',
            'limit_admin'   => 'sometimes|numeric|min:0',
        ]);

        $user->company->update($data);
        return response()->json($user->company->fresh());
    }
}