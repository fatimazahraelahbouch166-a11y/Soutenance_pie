<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class PurchaseOrderController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth('api')->user();
        $pos  = PurchaseOrder::where('company_id', $user->company_id)
            ->with(['supplier', 'items'])
            ->orderByDesc('date')
            ->get();
        return response()->json(['data' => $pos]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $data = $request->validate([
            'supplier_id'        => 'required|exists:suppliers,id',
            'date'               => 'required|date',
            'expected_date'      => 'nullable|date',
            'notes'              => 'nullable|string',
            'items'              => 'required|array|min:1',
            'items.*.name'       => 'required|string|max:200',
            'items.*.qty'        => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tva'        => 'required|integer|in:0,7,10,14,20',
            'items.*.product_id' => 'nullable|exists:products,id',
        ]);

        $po = DB::transaction(function () use ($user, $data) {
            $count = PurchaseOrder::where('company_id', $user->company_id)->withTrashed()->count() + 1;
            $ref   = 'BC-' . now()->year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

            $order = PurchaseOrder::create([
                'company_id'    => $user->company_id,
                'supplier_id'   => $data['supplier_id'],
                'ref'           => $ref,
                'date'          => $data['date'],
                'expected_date' => $data['expected_date'] ?? null,
                'notes'         => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                PurchaseOrderItem::create(array_merge($item, ['purchase_order_id' => $order->id]));
            }

            $order->load('items');
            $order->recalcTotals();
            return $order;
        });

        return response()->json($po->load(['supplier', 'items']), 201);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $user  = auth('api')->user();
        $order = PurchaseOrder::where('company_id', $user->company_id)->findOrFail($id);
        $data  = $request->validate(['status' => 'required|in:draft,sent,pending,received,cancelled']);

        if ($data['status'] === 'received' && $order->status !== 'received') {
            $order->load('items');
            foreach ($order->items as $item) {
                if ($item->product_id) {
                    Product::where('id', $item->product_id)->increment('stock', $item->qty);
                    StockMovement::create([
                        'product_id' => $item->product_id,
                        'user_id'    => auth('api')->id(),
                        'type'       => 'in',
                        'qty'        => $item->qty,
                        'date'       => now()->toDateString(),
                        'reason'     => 'Réception ' . $order->ref,
                    ]);
                }
            }
        }

        $order->update($data);
        return response()->json($order->load(['supplier', 'items']));
    }
}