<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $user     = auth('api')->user();
        $products = Product::where('company_id', $user->company_id)->orderBy('name')->get();
        return response()->json(['data' => $products]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $data = $request->validate([
            'ref'        => 'nullable|string|max:30',
            'name'       => 'required|string|max:200',
            'category'   => 'nullable|string|max:60',
            'buy_price'  => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'tva'        => 'required|integer|in:0,7,10,14,20',
            'unit'       => 'required|string|max:20',
            'stock'      => 'nullable|integer|min:0',
            'min_stock'  => 'nullable|integer|min:0',
        ]);
        $product = Product::create(array_merge($data, ['company_id' => $user->company_id]));
        return response()->json($product, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user    = auth('api')->user();
        $product = Product::where('company_id', $user->company_id)->findOrFail($id);
        $product->update($request->except('company_id'));
        return response()->json($product);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth('api')->user();
        Product::where('company_id', $user->company_id)->findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function addMovement(Request $request, int $id): JsonResponse
    {
        $user    = auth('api')->user();
        $product = Product::where('company_id', $user->company_id)->findOrFail($id);

        $data = $request->validate([
            'type'   => 'required|in:in,out',
            'qty'    => 'required|integer|min:1',
            'date'   => 'required|date',
            'reason' => 'nullable|string|max:200',
        ]);

        DB::transaction(function () use ($product, $user, $data) {
            StockMovement::create(array_merge($data, [
                'product_id' => $product->id,
                'user_id'    => $user->id,
            ]));
            $delta = $data['type'] === 'in' ? $data['qty'] : -$data['qty'];
            $product->increment('stock', $delta);
        });

        return response()->json($product->fresh());
    }

    public function movements(int $id): JsonResponse
    {
        $user    = auth('api')->user();
        $product = Product::where('company_id', $user->company_id)->findOrFail($id);
        $moves   = StockMovement::where('product_id', $id)
            ->with('user')
            ->orderByDesc('date')
            ->get();
        return response()->json(['data' => $moves]);
    }
}