<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Customer, Supplier, Product, StockMovement, Quote, QuoteItem, Invoice, InvoiceItem, PurchaseOrder, PurchaseOrderItem};
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

// ══════════════════════════════════════════════════════════════
// CustomerController
// ══════════════════════════════════════════════════════════════
class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $q    = Customer::where('company_id', $user->company_id);
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
            'type'          => 'required|in:enterprise,individual,public',
            'ice'           => 'nullable|string|max:20',
            'if_num'        => 'nullable|string|max:20',
            'rc'            => 'nullable|string|max:50',
            'cnss'          => 'nullable|string|max:20',
            'email'         => 'nullable|email',
            'phone'         => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:200',
            'payment_terms' => 'nullable|integer|min:0',
            'credit_limit'  => 'nullable|numeric|min:0',
        ]);
        $customer = Customer::create(array_merge($data, ['company_id' => $user->company_id]));
        return response()->json($customer, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user     = auth('api')->user();
        $customer = Customer::where('company_id', $user->company_id)->findOrFail($id);
        $customer->update($request->except('company_id'));
        return response()->json($customer);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = auth('api')->user();
        Customer::where('company_id', $user->company_id)->findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}

// ══════════════════════════════════════════════════════════════
// SupplierController
// ══════════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════════
// ProductController (catalogue + stock)
// ══════════════════════════════════════════════════════════════
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

    // POST /api/products/{id}/movements
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

    // GET /api/products/{id}/movements
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

// ══════════════════════════════════════════════════════════════
// QuoteController
// ══════════════════════════════════════════════════════════════
class QuoteController extends Controller
{
    private function nextRef(int $companyId): string {
        $count = Quote::where('company_id', $companyId)->withTrashed()->count() + 1;
        return 'DEV-' . now()->year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);
    }

    public function index(): JsonResponse
    {
        $user   = auth('api')->user();
        $quotes = Quote::where('company_id', $user->company_id)
            ->with(['customer', 'items'])
            ->orderByDesc('date')
            ->get();
        return response()->json(['data' => $quotes]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth('api')->user();
        $data = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'date'        => 'required|date',
            'valid_until' => 'nullable|date',
            'notes'       => 'nullable|string',
            'items'       => 'required|array|min:1',
            'items.*.name'       => 'required|string|max:200',
            'items.*.qty'        => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.tva'        => 'required|integer|in:0,7,10,14,20',
            'items.*.discount'   => 'nullable|integer|min:0|max:100',
            'items.*.product_id' => 'nullable|exists:products,id',
        ]);

        $quote = DB::transaction(function () use ($user, $data) {
            $q = Quote::create([
                'company_id'  => $user->company_id,
                'customer_id' => $data['customer_id'],
                'ref'         => $this->nextRef($user->company_id),
                'date'        => $data['date'],
                'valid_until' => $data['valid_until'] ?? null,
                'notes'       => $data['notes'] ?? null,
            ]);
            foreach ($data['items'] as $item) {
                QuoteItem::create(array_merge($item, ['quote_id' => $q->id]));
            }
            $q->load('items');
            $q->recalcTotals();
            return $q;
        });

        return response()->json($quote->load(['customer', 'items']), 201);
    }

    public function show(int $id): JsonResponse
    {
        $user  = auth('api')->user();
        $quote = Quote::where('company_id', $user->company_id)
            ->with(['customer', 'items.product'])
            ->findOrFail($id);
        return response()->json($quote);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $user  = auth('api')->user();
        $quote = Quote::where('company_id', $user->company_id)->findOrFail($id);
        $data  = $request->validate(['status' => 'required|in:draft,sent,accepted,refused,expired']);
        $quote->update($data);
        return response()->json($quote);
    }

    // POST /api/quotes/{id}/convert — convertir en facture
    public function convertToInvoice(int $id): JsonResponse
    {
        $user  = auth('api')->user();
        $quote = Quote::where('company_id', $user->company_id)
            ->with('items')
            ->findOrFail($id);

        $invoice = DB::transaction(function () use ($user, $quote) {
            $count = Invoice::where('company_id', $user->company_id)->withTrashed()->count() + 1;
            $ref   = 'FAC-' . now()->year . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

            $inv = Invoice::create([
                'company_id'  => $user->company_id,
                'customer_id' => $quote->customer_id,
                'quote_id'    => $quote->id,
                'ref'         => $ref,
                'date'        => now()->toDateString(),
                'due_date'    => now()->addDays(30)->toDateString(),
            ]);

            foreach ($quote->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $inv->id,
                    'product_id' => $item->product_id,
                    'name'       => $item->name,
                    'qty'        => $item->qty,
                    'unit_price' => $item->unit_price,
                    'tva'        => $item->tva,
                    'discount'   => $item->discount,
                ]);
            }

            $inv->load('items');
            $inv->recalcTotals();
            $quote->update(['status' => 'accepted']);
            return $inv;
        });

        return response()->json($invoice->load(['customer', 'items']), 201);
    }
}

// ══════════════════════════════════════════════════════════════
// InvoiceController
// ══════════════════════════════════════════════════════════════
class InvoiceController extends Controller
{
    public function index(): JsonResponse
    {
        $user     = auth('api')->user();
        $invoices = Invoice::where('company_id', $user->company_id)
            ->with(['customer', 'items'])
            ->orderByDesc('date')
            ->get();
        return response()->json(['data' => $invoices]);
    }

    public function show(int $id): JsonResponse
    {
        $user    = auth('api')->user();
        $invoice = Invoice::where('company_id', $user->company_id)
            ->with(['customer', 'items.product', 'quote'])
            ->findOrFail($id);
        return response()->json($invoice);
    }

    public function markPaid(int $id): JsonResponse
    {
        $user    = auth('api')->user();
        $invoice = Invoice::where('company_id', $user->company_id)->findOrFail($id);

        $invoice->update([
            'status'  => 'paid',
            'paid_at' => now(),
        ]);

        // Mettre à jour l'encours client
        $invoice->customer->decrement('balance', $invoice->total_ttc);

        return response()->json($invoice->load(['customer', 'items']));
    }
}

// ══════════════════════════════════════════════════════════════
// PurchaseOrderController
// ══════════════════════════════════════════════════════════════
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
            'supplier_id'   => 'required|exists:suppliers,id',
            'date'          => 'required|date',
            'expected_date' => 'nullable|date',
            'notes'         => 'nullable|string',
            'items'         => 'required|array|min:1',
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

        // Si réception → mettre à jour le stock
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