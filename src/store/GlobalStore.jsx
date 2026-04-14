/**
 * GlobalStore.jsx — Single source of truth for the entire ERP.
 * ─────────────────────────────────────────────────────────────────────────────
 * Every module reads from and writes to this store.
 * Cross-module side-effects (expense → budget, invoice → revenue, etc.) are
 * handled inside compound action creators so pages stay thin.
 *
 * Derived selectors (computedBudgets, computedCustomers) auto-recalculate
 * whenever related state changes — no manual cache invalidation needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import {
  CENTRAL_EXPENSES, CENTRAL_REVENUES, CENTRAL_INVOICES,
  CENTRAL_CUSTOMERS, CENTRAL_SUPPLIERS, CENTRAL_PRODUCTS,
  CENTRAL_BUDGETS, CENTRAL_QUOTES, CENTRAL_REIMBURSEMENTS,
  CENTRAL_PAYMENTS, CENTRAL_TAXES, CENTRAL_ACCOUNTING_ENTRIES,
  CENTRAL_MONTHLY_STATS,
} from '../lib/centralData'

// ─── Helpers ────────────────────────────────────────────────────────────────
const nextId = (arr) => (arr.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1)
const today  = () => new Date().toISOString().split('T')[0]
const ref    = (prefix) => `${prefix}-${Date.now()}`

// ─── Action types ────────────────────────────────────────────────────────────
const A = {
  // Bulk-set (initial load)
  SET_EXPENSES:       'SET_EXPENSES',
  SET_REVENUES:       'SET_REVENUES',
  SET_INVOICES:       'SET_INVOICES',
  SET_CUSTOMERS:      'SET_CUSTOMERS',
  SET_SUPPLIERS:      'SET_SUPPLIERS',
  SET_PRODUCTS:       'SET_PRODUCTS',
  SET_BUDGETS:        'SET_BUDGETS',
  SET_QUOTES:         'SET_QUOTES',
  SET_REIMBURSEMENTS: 'SET_REIMBURSEMENTS',
  SET_PAYMENTS:       'SET_PAYMENTS',
  SET_TAXES:          'SET_TAXES',
  SET_ACCOUNTING:     'SET_ACCOUNTING',
  SET_LOADING:        'SET_LOADING',

  // Expenses
  ADD_EXPENSE:    'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',

  // Revenues
  ADD_REVENUE:    'ADD_REVENUE',
  UPDATE_REVENUE: 'UPDATE_REVENUE',
  DELETE_REVENUE: 'DELETE_REVENUE',

  // Invoices
  ADD_INVOICE:    'ADD_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  DELETE_INVOICE: 'DELETE_INVOICE',

  // Quotes
  ADD_QUOTE:    'ADD_QUOTE',
  UPDATE_QUOTE: 'UPDATE_QUOTE',
  DELETE_QUOTE: 'DELETE_QUOTE',

  // Budgets
  ADD_BUDGET:    'ADD_BUDGET',
  UPDATE_BUDGET: 'UPDATE_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',

  // Customers
  ADD_CUSTOMER:    'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',

  // Suppliers
  ADD_SUPPLIER:    'ADD_SUPPLIER',
  UPDATE_SUPPLIER: 'UPDATE_SUPPLIER',
  DELETE_SUPPLIER: 'DELETE_SUPPLIER',

  // Products / Stock
  ADD_PRODUCT:    'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  ADJUST_STOCK:   'ADJUST_STOCK',   // { id, delta }

  // Reimbursements
  ADD_REIMBURSEMENT:    'ADD_REIMBURSEMENT',
  UPDATE_REIMBURSEMENT: 'UPDATE_REIMBURSEMENT',
  DELETE_REIMBURSEMENT: 'DELETE_REIMBURSEMENT',

  // Payments & Accounting
  ADD_PAYMENT:          'ADD_PAYMENT',
  ADD_ACCOUNTING_ENTRY: 'ADD_ACCOUNTING_ENTRY',

  // ── Compound workflow actions (multi-entity) ──
  // APPROVE_EXPENSE  → expense.status='approved' + accounting entry
  // REJECT_EXPENSE   → expense.status='rejected' + reason
  // PAY_INVOICE      → invoice.status='paid' + revenue + accounting
  // CONVERT_QUOTE    → quote.status='accepted' + new invoice + stock decrease
  // MARK_REIMB_PAID  → reimbursement.status='paid' + expense.reimbursement_id + accounting
  APPROVE_EXPENSE:  'APPROVE_EXPENSE',
  REJECT_EXPENSE:   'REJECT_EXPENSE',
  PAY_INVOICE:      'PAY_INVOICE',
  CONVERT_QUOTE:    'CONVERT_QUOTE',
  MARK_REIMB_PAID:  'MARK_REIMB_PAID',
  APPROVE_REIMB:    'APPROVE_REIMB',
  REJECT_REIMB:     'REJECT_REIMB',
}

// ─── Initial state ───────────────────────────────────────────────────────────
const initialState = {
  expenses:          [],
  revenues:          [],
  invoices:          [],
  customers:         [],
  suppliers:         [],
  products:          [],
  budgets:           [],
  quotes:            [],
  reimbursements:    [],
  payments:          [],
  taxes:             [],
  accountingEntries: [],
  monthlyStats:      [],
  loading:           true,
}

// ─── Pure helpers used inside reducer ────────────────────────────────────────
const upsert = (arr, item) => arr.map(x => x.id === item.id ? item : x)
const remove = (arr, id)   => arr.filter(x => x.id !== id)
const prepend = (arr, item) => [item, ...arr]

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, { type, payload }) {
  switch (type) {
    // ── Bulk-load ────────────────────────────────────────────────────────────
    case A.SET_EXPENSES:       return { ...state, expenses:          payload }
    case A.SET_REVENUES:       return { ...state, revenues:          payload }
    case A.SET_INVOICES:       return { ...state, invoices:          payload }
    case A.SET_CUSTOMERS:      return { ...state, customers:         payload }
    case A.SET_SUPPLIERS:      return { ...state, suppliers:         payload }
    case A.SET_PRODUCTS:       return { ...state, products:          payload }
    case A.SET_BUDGETS:        return { ...state, budgets:           payload }
    case A.SET_QUOTES:         return { ...state, quotes:            payload }
    case A.SET_REIMBURSEMENTS: return { ...state, reimbursements:    payload }
    case A.SET_PAYMENTS:       return { ...state, payments:          payload }
    case A.SET_TAXES:          return { ...state, taxes:             payload }
    case A.SET_ACCOUNTING:     return { ...state, accountingEntries: payload }
    case A.SET_LOADING:        return { ...state, loading:           payload }

    // ── Expenses ─────────────────────────────────────────────────────────────
    case A.ADD_EXPENSE:    return { ...state, expenses: prepend(state.expenses, payload) }
    case A.UPDATE_EXPENSE: return { ...state, expenses: upsert(state.expenses, payload) }
    case A.DELETE_EXPENSE: return { ...state, expenses: remove(state.expenses, payload) }

    // ── Revenues ─────────────────────────────────────────────────────────────
    case A.ADD_REVENUE:    return { ...state, revenues: prepend(state.revenues, payload) }
    case A.UPDATE_REVENUE: return { ...state, revenues: upsert(state.revenues, payload) }
    case A.DELETE_REVENUE: return { ...state, revenues: remove(state.revenues, payload) }

    // ── Invoices ─────────────────────────────────────────────────────────────
    case A.ADD_INVOICE:    return { ...state, invoices: prepend(state.invoices, payload) }
    case A.UPDATE_INVOICE: return { ...state, invoices: upsert(state.invoices, payload) }
    case A.DELETE_INVOICE: return { ...state, invoices: remove(state.invoices, payload) }

    // ── Quotes ───────────────────────────────────────────────────────────────
    case A.ADD_QUOTE:    return { ...state, quotes: prepend(state.quotes, payload) }
    case A.UPDATE_QUOTE: return { ...state, quotes: upsert(state.quotes, payload) }
    case A.DELETE_QUOTE: return { ...state, quotes: remove(state.quotes, payload) }

    // ── Budgets ──────────────────────────────────────────────────────────────
    case A.ADD_BUDGET:    return { ...state, budgets: prepend(state.budgets, payload) }
    case A.UPDATE_BUDGET: return { ...state, budgets: upsert(state.budgets, payload) }
    case A.DELETE_BUDGET: return { ...state, budgets: remove(state.budgets, payload) }

    // ── Customers ────────────────────────────────────────────────────────────
    case A.ADD_CUSTOMER:    return { ...state, customers: prepend(state.customers, payload) }
    case A.UPDATE_CUSTOMER: return { ...state, customers: upsert(state.customers, payload) }
    case A.DELETE_CUSTOMER: return { ...state, customers: remove(state.customers, payload) }

    // ── Suppliers ────────────────────────────────────────────────────────────
    case A.ADD_SUPPLIER:    return { ...state, suppliers: prepend(state.suppliers, payload) }
    case A.UPDATE_SUPPLIER: return { ...state, suppliers: upsert(state.suppliers, payload) }
    case A.DELETE_SUPPLIER: return { ...state, suppliers: remove(state.suppliers, payload) }

    // ── Products / Stock ─────────────────────────────────────────────────────
    case A.ADD_PRODUCT:    return { ...state, products: prepend(state.products, payload) }
    case A.UPDATE_PRODUCT: return { ...state, products: upsert(state.products, payload) }
    case A.DELETE_PRODUCT: return { ...state, products: remove(state.products, payload) }
    case A.ADJUST_STOCK:   return {
      ...state,
      products: state.products.map(p =>
        p.id === payload.id
          ? { ...p, stock: Math.max(0, (p.stock ?? 0) + payload.delta) }
          : p
      ),
    }

    // ── Reimbursements ───────────────────────────────────────────────────────
    case A.ADD_REIMBURSEMENT:    return { ...state, reimbursements: prepend(state.reimbursements, payload) }
    case A.UPDATE_REIMBURSEMENT: return { ...state, reimbursements: upsert(state.reimbursements, payload) }
    case A.DELETE_REIMBURSEMENT: return { ...state, reimbursements: remove(state.reimbursements, payload) }

    // ── Payments & Accounting ────────────────────────────────────────────────
    case A.ADD_PAYMENT:          return { ...state, payments: prepend(state.payments, payload) }
    case A.ADD_ACCOUNTING_ENTRY: return { ...state, accountingEntries: prepend(state.accountingEntries, payload) }

    // ────────────────────────────────────────────────────────────────────────
    // ── Compound workflow actions ────────────────────────────────────────────
    // ────────────────────────────────────────────────────────────────────────

    // APPROVE_EXPENSE: mark approved + create accounting entry
    case A.APPROVE_EXPENSE: {
      const { expense, approvedBy } = payload
      const updated = {
        ...expense,
        status:      'approved',
        approved_by: approvedBy ?? 'Manager',
        approved_at: today(),
      }
      const entry = {
        id:             ref('ACC-EXP'),
        reference:      ref('ACC'),
        date:           today(),
        description:    `Approbation dépense ${expense.reference ?? expense.id} — ${expense.employee_name ?? expense.title}`,
        source_module:  'expense',
        source_id:      expense.id,
        source_ref:     expense.reference ?? `EXP-${expense.id}`,
        debit_account:  '6xxx',
        credit_account: '4xxx',
        amount:         expense.amount,
        status:         'posted',
      }
      return {
        ...state,
        expenses:          upsert(state.expenses, updated),
        accountingEntries: prepend(state.accountingEntries, entry),
      }
    }

    // REJECT_EXPENSE: mark rejected + record reason
    case A.REJECT_EXPENSE: {
      const { expense, reason } = payload
      const updated = {
        ...expense,
        status:           'rejected',
        rejection_reason: reason ?? '',
        rejected_at:      today(),
      }
      return { ...state, expenses: upsert(state.expenses, updated) }
    }

    // PAY_INVOICE: mark paid + auto-create revenue + accounting entry + payment record
    case A.PAY_INVOICE: {
      const { invoice, method = 'bank_transfer', paymentRef } = payload
      const updatedInvoice = {
        ...invoice,
        status:           'paid',
        paid_amount:      invoice.total,
        remaining_amount: 0,
      }
      const revenue = {
        id:           ref('REV-INV'),
        reference:    ref('REV'),
        title:        `Paiement facture ${invoice.reference ?? invoice.ref}`,
        amount:       invoice.total,
        category:     'Ventes',
        source:       'invoice',
        invoice_id:   invoice.id,
        customer_id:  invoice.customer_id,
        customer_name:invoice.customer_name,
        status:       'received',
        date:         today(),
        description:  `Encaissement ${invoice.reference ?? invoice.ref}`,
      }
      const payment = {
        id:            ref('PAY'),
        invoice_id:    invoice.id,
        invoice_ref:   invoice.reference ?? invoice.ref,
        customer_name: invoice.customer_name,
        amount:        invoice.total,
        method,
        date:          today(),
        reference:     paymentRef ?? ref('VIR'),
        status:        'completed',
      }
      const entry = {
        id:             ref('ACC-INV'),
        reference:      ref('ACC'),
        date:           today(),
        description:    `Encaissement facture ${invoice.reference ?? invoice.ref} — ${invoice.customer_name}`,
        source_module:  'invoice',
        source_id:      invoice.id,
        source_ref:     invoice.reference ?? invoice.ref,
        debit_account:  '1120',
        credit_account: '7110',
        amount:         invoice.total,
        status:         'posted',
      }
      return {
        ...state,
        invoices:          upsert(state.invoices, updatedInvoice),
        revenues:          prepend(state.revenues, revenue),
        payments:          prepend(state.payments, payment),
        accountingEntries: prepend(state.accountingEntries, entry),
      }
    }

    // CONVERT_QUOTE: accept quote + create invoice + decrease product stock
    case A.CONVERT_QUOTE: {
      const { quote, customers: _c } = payload
      const invoiceId = nextId(state.invoices)
      const invoiceNum = String(invoiceId).padStart(3, '0')
      const year = new Date().getFullYear()
      const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
      const newInvoice = {
        id:               invoiceId,
        reference:        `FAC-${year}-${invoiceNum}`,
        customer_id:      quote.customer_id,
        customer_name:    quote.customer_name,
        quote_id:         quote.id,
        date:             today(),
        due_date:         dueDate,
        status:           'draft',
        items:            quote.items,
        subtotal:         quote.subtotal,
        tax_amount:       quote.tax_amount,
        total:            quote.total,
        paid_amount:      0,
        remaining_amount: quote.total,
        notes:            quote.notes ?? '',
      }
      const updatedQuote = {
        ...quote,
        status:     'accepted',
        invoice_id: invoiceId,
      }
      // Decrease stock for each product line item
      let products = state.products
      for (const item of (quote.items ?? [])) {
        if (item.product_id) {
          products = products.map(p =>
            p.id === item.product_id && p.stock !== null
              ? { ...p, stock: Math.max(0, p.stock - item.qty) }
              : p
          )
        }
      }
      return {
        ...state,
        quotes:   upsert(state.quotes, updatedQuote),
        invoices: prepend(state.invoices, newInvoice),
        products,
      }
    }

    // APPROVE_REIMB: approve a reimbursement request
    case A.APPROVE_REIMB: {
      const { reimbursement, approvedBy } = payload
      const updated = {
        ...reimbursement,
        status:         'approved',
        approval_date:  today(),
        approved_by:    approvedBy ?? 'Manager',
        approved_amount:reimbursement.requested_amount,
        remaining_amount:reimbursement.requested_amount,
      }
      return { ...state, reimbursements: upsert(state.reimbursements, updated) }
    }

    // REJECT_REIMB: reject a reimbursement request
    case A.REJECT_REIMB: {
      const { reimbursement, reason } = payload
      const updated = {
        ...reimbursement,
        status:           'rejected',
        rejection_reason: reason ?? '',
        rejected_at:      today(),
      }
      return { ...state, reimbursements: upsert(state.reimbursements, updated) }
    }

    // MARK_REIMB_PAID: mark reimbursement as paid + link expense + create accounting entry
    case A.MARK_REIMB_PAID: {
      const { reimbursement, method = 'bank_transfer', paymentRef } = payload
      const updatedReimb = {
        ...reimbursement,
        status:              'paid',
        reimbursed_amount:   reimbursement.approved_amount ?? reimbursement.requested_amount,
        remaining_amount:    0,
        reimbursement_date:  today(),
        payment_method:      method,
        payment_reference:   paymentRef ?? ref('VIR'),
      }
      // Link expense to this reimbursement if present
      let expenses = state.expenses
      if (reimbursement.expense_id) {
        expenses = expenses.map(e =>
          e.id === reimbursement.expense_id
            ? { ...e, reimbursement_id: reimbursement.id, status: 'paid' }
            : e
        )
      }
      const entry = {
        id:             ref('ACC-REM'),
        reference:      ref('ACC'),
        date:           today(),
        description:    `Remboursement ${reimbursement.reference} — ${reimbursement.employee_name ?? reimbursement.employee ?? ''}`,
        source_module:  'reimbursement',
        source_id:      reimbursement.id,
        source_ref:     reimbursement.reference,
        debit_account:  '4xxx',
        credit_account: '1120',
        amount:         reimbursement.approved_amount ?? reimbursement.requested_amount,
        status:         'posted',
      }
      return {
        ...state,
        reimbursements:    upsert(state.reimbursements, updatedReimb),
        expenses,
        accountingEntries: prepend(state.accountingEntries, entry),
      }
    }

    default: return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const GlobalStoreContext = createContext(null)

export function GlobalStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // ── Initial data load ─────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: A.SET_EXPENSES,       payload: CENTRAL_EXPENSES })
      dispatch({ type: A.SET_REVENUES,       payload: CENTRAL_REVENUES })
      dispatch({ type: A.SET_INVOICES,       payload: CENTRAL_INVOICES })
      dispatch({ type: A.SET_CUSTOMERS,      payload: CENTRAL_CUSTOMERS })
      dispatch({ type: A.SET_SUPPLIERS,      payload: CENTRAL_SUPPLIERS })
      dispatch({ type: A.SET_PRODUCTS,       payload: CENTRAL_PRODUCTS })
      dispatch({ type: A.SET_BUDGETS,        payload: CENTRAL_BUDGETS })
      dispatch({ type: A.SET_QUOTES,         payload: CENTRAL_QUOTES })
      dispatch({ type: A.SET_REIMBURSEMENTS, payload: CENTRAL_REIMBURSEMENTS })
      dispatch({ type: A.SET_PAYMENTS,       payload: CENTRAL_PAYMENTS })
      dispatch({ type: A.SET_TAXES,          payload: CENTRAL_TAXES })
      dispatch({ type: A.SET_ACCOUNTING,     payload: CENTRAL_ACCOUNTING_ENTRIES })
      dispatch({ type: A.SET_LOADING,        payload: false })
    }, 150)
    return () => clearTimeout(t)
  }, [])

  // ── Derived / computed selectors ──────────────────────────────────────────
  // These are recomputed via useMemo whenever the relevant state slices change.
  // Pages should prefer these over raw state when cross-module data is needed.

  const computedBudgets = useMemo(() =>
    state.budgets.map(budget => {
      const spent = state.expenses
        .filter(e =>
          String(e.budget_id) === String(budget.id) &&
          ['approved', 'paid'].includes(e.status)
        )
        .reduce((s, e) => s + (e.amount ?? 0), 0)
      const alloc   = budget.allocated_amount ?? budget.amount ?? 1
      const pct     = Math.min(Math.round((spent / alloc) * 100), 999)
      return {
        ...budget,
        // Normalised field names (both old and new consumers)
        allocated_amount: alloc,
        spent_amount:     spent,
        remaining_amount: alloc - spent,
        label:            budget.name ?? budget.label,
        amount:           alloc,
        spent,
        remaining:        alloc - spent,
        percentage:       pct,
        status:           pct >= 100 ? 'exceeded' : pct >= 80 ? 'alert' : 'active',
      }
    }),
    [state.budgets, state.expenses]
  )

  const computedCustomers = useMemo(() =>
    state.customers.map(customer => {
      const customerInvoices = state.invoices.filter(i => i.customer_id === customer.id)
      const total_billed = customerInvoices.reduce((s, i) => s + (i.total ?? 0), 0)
      const total_paid   = customerInvoices
        .filter(i => i.status === 'paid')
        .reduce((s, i) => s + (i.total ?? 0), 0)
      return {
        ...customer,
        total_billed,
        total_paid,
        balance: total_billed - total_paid,
        invoices_count: customerInvoices.length,
      }
    }),
    [state.customers, state.invoices]
  )

  const computedProducts = useMemo(() =>
    state.products.map(p => ({
      ...p,
      low_stock: p.stock !== null && p.min_stock !== null && p.stock <= p.min_stock,
    })),
    [state.products]
  )

  // ── Selectors ─────────────────────────────────────────────────────────────
  const selectors = useMemo(() => ({
    // Computed / derived
    computedBudgets,
    computedCustomers,
    computedProducts,

    // Finance KPIs
    totalRevenue: () =>
      state.revenues.filter(r => r.status === 'received')
                    .reduce((s, r) => s + r.amount, 0),

    totalExpenses: () =>
      state.expenses.filter(e => ['approved', 'paid'].includes(e.status))
                    .reduce((s, e) => s + e.amount, 0),

    netResult: () =>
      state.revenues.filter(r => r.status === 'received').reduce((s, r) => s + r.amount, 0) -
      state.expenses.filter(e => ['approved', 'paid'].includes(e.status)).reduce((s, e) => s + e.amount, 0),

    pendingExpensesCount: () =>
      state.expenses.filter(e => e.status === 'pending').length,

    totalUnpaidInvoices: () =>
      state.invoices.filter(i => ['sent', 'overdue'].includes(i.status))
                    .reduce((s, i) => s + i.total, 0),

    totalOverdueInvoices: () =>
      state.invoices.filter(i => i.status === 'overdue')
                    .reduce((s, i) => s + i.total, 0),

    tvaToPay: () => {
      const collected   = state.invoices.filter(i => i.status === 'paid')
                                        .reduce((s, i) => s + (i.tax_amount ?? 0), 0)
      const recoverable = state.expenses.filter(e => ['approved', 'paid'].includes(e.status))
                                        .reduce((s, e) => s + (e.amount * 0.18), 0)
      return Math.max(0, collected - recoverable)
    },

    budgetConsumption: () => {
      const total = computedBudgets.reduce((s, b) => s + b.allocated_amount, 0)
      const spent = computedBudgets.reduce((s, b) => s + b.spent_amount, 0)
      return total > 0 ? Math.round((spent / total) * 100) : 0
    },

    overBudgetAlerts: () =>
      computedBudgets.filter(b => b.percentage >= 80),

    lowStockProducts: () =>
      computedProducts.filter(p => p.low_stock),

    topCustomers: (n = 5) =>
      [...computedCustomers]
        .sort((a, b) => (b.total_billed ?? 0) - (a.total_billed ?? 0))
        .slice(0, n),

    // Cross-module lookups
    reimbursementForExpense: (expenseId) =>
      state.reimbursements.find(r =>
        String(r.expense_id) === String(expenseId)
      ),

    accountingEntriesFor: (sourceModule, sourceId) =>
      state.accountingEntries.filter(
        e => e.source_module === sourceModule && String(e.source_id) === String(sourceId)
      ),

    invoicesForCustomer: (customerId) =>
      state.invoices.filter(i => i.customer_id === customerId),

    revenueForInvoice: (invoiceId) =>
      state.revenues.find(r => r.invoice_id === invoiceId),

    productsForSupplier: (supplierId) =>
      computedProducts.filter(p => p.supplier_id === supplierId),

    pendingReimbursementsTotal: () =>
      state.reimbursements
        .filter(r => r.status === 'approved')
        .reduce((s, r) => s + (r.remaining_amount ?? 0), 0),

    // Activity feed: most recent across all modules
    recentActivity: (limit = 10) => {
      const items = [
        ...state.expenses.map(e => ({
          id: `exp-${e.id}`, type: 'expense',
          label:  e.title ?? e.description,
          amount: e.amount, status: e.status,
          date:   e.date ?? e.expense_date,
          link:   `/app/expenses/${e.id}`,
          module: 'Dépenses',
        })),
        ...state.invoices.map(i => ({
          id: `inv-${i.id}`, type: 'invoice',
          label:  i.reference ?? i.ref,
          amount: i.total, status: i.status,
          date:   i.date ?? i.issue_date,
          link:   `/app/quotes`,
          module: 'Factures',
        })),
        ...state.revenues.map(r => ({
          id: `rev-${r.id}`, type: 'revenue',
          label:  r.title ?? r.description,
          amount: r.amount, status: r.status,
          date:   r.date,
          link:   `/app/incomes`,
          module: 'Revenus',
        })),
        ...state.reimbursements.filter(r => r.status === 'approved').map(r => ({
          id: `rmb-${r.id}`, type: 'reimbursement',
          label:  r.reference,
          amount: r.remaining_amount,
          status: r.status,
          date:   r.created_at ?? today(),
          link:   `/app/reimbursements`,
          module: 'Remboursements',
        })),
      ]
      return items
        .filter(i => i.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
    },

    // Global search across all entities
    globalSearch: (query) => {
      if (!query || query.length < 2) return []
      const q = query.toLowerCase()
      const results = []

      state.expenses.forEach(e => {
        if ((e.title ?? '').toLowerCase().includes(q) || (e.reference ?? '').toLowerCase().includes(q))
          results.push({ type: 'expense', label: e.title, sub: e.reference, link: `/app/expenses/${e.id}`, amount: e.amount, status: e.status, module: 'Dépense' })
      })
      state.invoices.forEach(i => {
        if ((i.reference ?? i.ref ?? '').toLowerCase().includes(q) || (i.customer_name ?? '').toLowerCase().includes(q))
          results.push({ type: 'invoice', label: i.reference ?? i.ref, sub: i.customer_name, link: `/app/quotes`, amount: i.total, status: i.status, module: 'Facture' })
      })
      state.quotes.forEach(q_ => {
        if ((q_.reference ?? '').toLowerCase().includes(q) || (q_.customer_name ?? '').toLowerCase().includes(q))
          results.push({ type: 'quote', label: q_.reference, sub: q_.customer_name, link: `/app/quotes`, amount: q_.total, status: q_.status, module: 'Devis' })
      })
      computedCustomers.forEach(c => {
        if (c.name.toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q))
          results.push({ type: 'customer', label: c.name, sub: c.email, link: `/app/customers`, amount: c.balance, module: 'Client' })
      })
      state.revenues.forEach(r => {
        if ((r.title ?? '').toLowerCase().includes(q) || (r.reference ?? '').toLowerCase().includes(q))
          results.push({ type: 'revenue', label: r.title, sub: r.reference, link: `/app/incomes`, amount: r.amount, module: 'Revenu' })
      })
      computedProducts.forEach(p => {
        if (p.name.toLowerCase().includes(q) || (p.ref ?? '').toLowerCase().includes(q))
          results.push({ type: 'product', label: p.name, sub: p.ref, link: `/app/stock`, module: 'Produit' })
      })
      state.suppliers.forEach(s => {
        if (s.name.toLowerCase().includes(q))
          results.push({ type: 'supplier', label: s.name, sub: s.category, link: `/app/suppliers`, module: 'Fournisseur' })
      })
      state.reimbursements.forEach(r => {
        if ((r.reference ?? '').toLowerCase().includes(q) || (r.employee_name ?? r.employee ?? '').toLowerCase().includes(q))
          results.push({ type: 'reimbursement', label: r.reference, sub: r.employee_name ?? r.employee, link: `/app/reimbursements`, amount: r.requested_amount, status: r.status, module: 'Remboursement' })
      })

      return results.slice(0, 14)
    },
  }), [state, computedBudgets, computedCustomers, computedProducts])

  // ── Action creators ────────────────────────────────────────────────────────
  const actions = useMemo(() => ({
    // ── Simple CRUD ──
    // Expenses
    addExpense:    (e)   => dispatch({ type: A.ADD_EXPENSE,    payload: { ...e, id: e.id ?? nextId(state.expenses), reference: e.reference ?? ref('EXP'), date: e.date ?? today() } }),
    updateExpense: (e)   => dispatch({ type: A.UPDATE_EXPENSE, payload: e }),
    deleteExpense: (id)  => dispatch({ type: A.DELETE_EXPENSE, payload: id }),

    // Revenues
    addRevenue:    (r)   => dispatch({ type: A.ADD_REVENUE,    payload: { ...r, id: r.id ?? ref('REV-NEW'), reference: r.reference ?? ref('REV') } }),
    updateRevenue: (r)   => dispatch({ type: A.UPDATE_REVENUE, payload: r }),
    deleteRevenue: (id)  => dispatch({ type: A.DELETE_REVENUE, payload: id }),

    // Invoices
    addInvoice:    (i)   => dispatch({ type: A.ADD_INVOICE,    payload: { ...i, id: i.id ?? nextId(state.invoices) } }),
    updateInvoice: (i)   => dispatch({ type: A.UPDATE_INVOICE, payload: i }),
    deleteInvoice: (id)  => dispatch({ type: A.DELETE_INVOICE, payload: id }),

    // Quotes
    addQuote:    (q)   => dispatch({ type: A.ADD_QUOTE,    payload: { ...q, id: q.id ?? nextId(state.quotes), reference: q.reference ?? ref('DEV') } }),
    updateQuote: (q)   => dispatch({ type: A.UPDATE_QUOTE, payload: q }),
    deleteQuote: (id)  => dispatch({ type: A.DELETE_QUOTE, payload: id }),

    // Budgets
    addBudget:    (b)   => dispatch({ type: A.ADD_BUDGET,    payload: { ...b, id: b.id ?? nextId(state.budgets) } }),
    updateBudget: (b)   => dispatch({ type: A.UPDATE_BUDGET, payload: b }),
    deleteBudget: (id)  => dispatch({ type: A.DELETE_BUDGET, payload: id }),

    // Customers
    addCustomer:    (c)  => dispatch({ type: A.ADD_CUSTOMER,    payload: { ...c, id: c.id ?? nextId(state.customers) } }),
    updateCustomer: (c)  => dispatch({ type: A.UPDATE_CUSTOMER, payload: c }),
    deleteCustomer: (id) => dispatch({ type: A.DELETE_CUSTOMER, payload: id }),

    // Suppliers
    addSupplier:    (s)  => dispatch({ type: A.ADD_SUPPLIER,    payload: { ...s, id: s.id ?? nextId(state.suppliers) } }),
    updateSupplier: (s)  => dispatch({ type: A.UPDATE_SUPPLIER, payload: s }),
    deleteSupplier: (id) => dispatch({ type: A.DELETE_SUPPLIER, payload: id }),

    // Products
    addProduct:    (p)   => dispatch({ type: A.ADD_PRODUCT,    payload: { ...p, id: p.id ?? nextId(state.products) } }),
    updateProduct: (p)   => dispatch({ type: A.UPDATE_PRODUCT, payload: p }),
    deleteProduct: (id)  => dispatch({ type: A.DELETE_PRODUCT, payload: id }),
    adjustStock:   (id, delta) => dispatch({ type: A.ADJUST_STOCK, payload: { id, delta } }),

    // Reimbursements
    addReimbursement:    (r)  => dispatch({ type: A.ADD_REIMBURSEMENT,    payload: { ...r, id: r.id ?? nextId(state.reimbursements), reference: r.reference ?? ref('REM'), created_at: r.created_at ?? today() } }),
    updateReimbursement: (r)  => dispatch({ type: A.UPDATE_REIMBURSEMENT, payload: r }),
    deleteReimbursement: (id) => dispatch({ type: A.DELETE_REIMBURSEMENT, payload: id }),

    // Accounting entries
    addAccountingEntry: (e) => dispatch({ type: A.ADD_ACCOUNTING_ENTRY, payload: { ...e, id: e.id ?? ref('ACC-MAN') } }),

    // ── Compound workflow actions ──
    approveExpense:  (expense, approvedBy) => dispatch({ type: A.APPROVE_EXPENSE,  payload: { expense, approvedBy } }),
    rejectExpense:   (expense, reason)     => dispatch({ type: A.REJECT_EXPENSE,   payload: { expense, reason } }),
    payInvoice:      (invoice, method, paymentRef)   => dispatch({ type: A.PAY_INVOICE,   payload: { invoice, method, paymentRef } }),
    convertQuote:    (quote)               => dispatch({ type: A.CONVERT_QUOTE,    payload: { quote } }),
    approveReimb:    (reimbursement, approvedBy) => dispatch({ type: A.APPROVE_REIMB, payload: { reimbursement, approvedBy } }),
    rejectReimb:     (reimbursement, reason) => dispatch({ type: A.REJECT_REIMB,   payload: { reimbursement, reason } }),
    markReimbPaid:   (reimbursement, method, paymentRef) => dispatch({ type: A.MARK_REIMB_PAID, payload: { reimbursement, method, paymentRef } }),
  }), [state.expenses, state.invoices, state.quotes, state.budgets, state.customers, state.suppliers, state.products, state.reimbursements])

  const value = useMemo(() => ({ state, dispatch, selectors, actions }), [state, selectors, actions])

  return (
    <GlobalStoreContext.Provider value={value}>
      {children}
    </GlobalStoreContext.Provider>
  )
}

export const useGlobalStore = () => {
  const ctx = useContext(GlobalStoreContext)
  if (!ctx) throw new Error('useGlobalStore must be used inside GlobalStoreProvider')
  return ctx
}
