<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuoteController extends Controller
{
    private function nextRef(int $companyId): string
    {
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
            'customer_id'        => 'required|exists:customers,id',
            'date'               => 'required|date',
            'valid_until'        => 'nullable|date',
            'notes'              => 'nullable|string',
            'items'              => 'required|array|min:1',
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

    public function convertToInvoice(int $id): JsonResponse
    {
        $user  = auth('api')->user();
        $quote = Quote::where('company_id', $user->company_id)->with('items')->findOrFail($id);

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