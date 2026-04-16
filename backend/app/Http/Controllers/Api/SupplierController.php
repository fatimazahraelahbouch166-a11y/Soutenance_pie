<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $q    = Supplier::where('company_id', $user->company_id);
        if ($request->search) {
            $q->where('name', 'like', '%' . $request->search . '%');
        }
        return response()->json(['data' => $q->orderBy('name')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $data = $request->validate([
            'name'          => 'required|string|max:150',
            'category'      => 'nullable|string|max:60',
            'ice'           => 'nullable|string|max:20',
            'if_num'        => 'nullable|string|max:20',
            'rc'            => 'nullable|string|max:50',
            'rib'           => 'nullable|string|max:30',
            'email'         => 'nullable|email',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:200',
            'payment_terms' => 'nullable|integer|min:0',
            'rating'        => 'nullable|integer|min:1|max:5',
        ]);
        $supplier = Supplier::create(array_merge($data, ['company_id' => $user->company_id]));
        return response()->json($supplier, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user     = auth('api')->user();
        $supplier = Supplier::where('company_id', $user->company_id)->findOrFail($id);
        $supplier->update($request->except('company_id'));
        return response()->json($supplier);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth('api')->user();
        Supplier::where('company_id', $user->company_id)->findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}