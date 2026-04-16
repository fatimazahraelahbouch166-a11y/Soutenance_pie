<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;

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

        $invoice->customer->decrement('balance', $invoice->total_ttc);

        return response()->json($invoice->load(['customer', 'items']));
    }
}