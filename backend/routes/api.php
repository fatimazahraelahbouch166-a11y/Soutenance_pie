<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    DashboardController,
    ExpenseController,
    BudgetController,
    CategoryController,
    ReimbursementController,
    ReportsController,
    SettingsController,
    UserController,
    TeamController,
    CustomerController,
    SupplierController,
    ProductController,
    QuoteController,
    InvoiceController,
    PurchaseOrderController,
};

// ── Auth publique ─────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// ── Routes protégées JWT ──────────────────────────────────────
Route::middleware('jwt.auth')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout',  [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me',       [AuthController::class, 'me']);
    });

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Dépenses
    Route::apiResource('expenses', ExpenseController::class);
    Route::post('expenses/{id}/approve', [ExpenseController::class, 'approve']);
    Route::post('expenses/{id}/reject',  [ExpenseController::class, 'reject']);

    // Budgets
    Route::apiResource('budgets', BudgetController::class);

    // Catégories
    Route::apiResource('categories', CategoryController::class);

    // Remboursements
    Route::get('reimbursements',              [ReimbursementController::class, 'index']);
    Route::post('reimbursements/{id}/mark-paid', [ReimbursementController::class, 'markPaid']);

    // Rapports
    Route::get('reports', [ReportsController::class, 'index']);

    // Paramètres entreprise
    Route::get('settings',  [SettingsController::class, 'show']);
    Route::put('settings',  [SettingsController::class, 'update']);

    // Utilisateurs
    Route::get('users',                        [UserController::class, 'index']);
    Route::put('users/{id}',                   [UserController::class, 'update']);
    Route::delete('users/{id}',                [UserController::class, 'destroy']);
    Route::put('profile',                      [UserController::class, 'updateProfile']);
    Route::post('profile/change-password',     [UserController::class, 'changePassword']);

    // Équipes
    Route::apiResource('teams', TeamController::class);

    // ── ERP ────────────────────────────────────────────────────
    // Clients
    Route::apiResource('customers', CustomerController::class);

    // Fournisseurs
    Route::apiResource('suppliers', SupplierController::class);

    // Produits & Stock
    Route::apiResource('products', ProductController::class);
    Route::post('products/{id}/movements', [ProductController::class, 'addMovement']);
    Route::get('products/{id}/movements',  [ProductController::class, 'movements']);

    // Devis
    Route::get('quotes',                      [QuoteController::class, 'index']);
    Route::post('quotes',                     [QuoteController::class, 'store']);
    Route::get('quotes/{id}',                 [QuoteController::class, 'show']);
    Route::patch('quotes/{id}/status',        [QuoteController::class, 'updateStatus']);
    Route::post('quotes/{id}/convert',        [QuoteController::class, 'convertToInvoice']);

    // Factures
    Route::get('invoices',                    [InvoiceController::class, 'index']);
    Route::get('invoices/{id}',               [InvoiceController::class, 'show']);
    Route::post('invoices/{id}/mark-paid',    [InvoiceController::class, 'markPaid']);

    // Bons de commande
    Route::get('purchase-orders',             [PurchaseOrderController::class, 'index']);
    Route::post('purchase-orders',            [PurchaseOrderController::class, 'store']);
    Route::patch('purchase-orders/{id}/status', [PurchaseOrderController::class, 'updateStatus']);
});