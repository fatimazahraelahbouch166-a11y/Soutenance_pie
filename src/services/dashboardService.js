/**
 * dashboardService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Aggregates data from ALL modules to produce the dashboard payload.
 * Accepts the GlobalStore state as input so it works with centralized state.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { CENTRAL_MONTHLY_STATS, budgetPct } from '../lib/centralData'

const delay = (ms = 150) => new Promise(r => setTimeout(r, ms))

/**
 * Build full dashboard stats from global store state.
 * @param {object} state - GlobalStore state
 */
export function buildDashboardStats(state) {
  const {
    expenses, revenues, invoices, budgets,
    reimbursements, products, customers, accountingEntries,
  } = state

  // ── Revenue KPIs ──
  const totalRevenue  = revenues.filter(r => r.status === 'received')
                                .reduce((s, r) => s + r.amount, 0)
  const thisMonthRevenue = revenues.filter(r => r.status === 'received' && r.date >= '2025-04-01')
                                   .reduce((s, r) => s + r.amount, 0)

  // ── Expense KPIs ──
  const totalExpenses  = expenses.filter(e => ['approved','paid'].includes(e.status))
                                 .reduce((s, e) => s + e.amount, 0)
  const pendingExpenses= expenses.filter(e => e.status === 'pending').length
  const pendingAmount  = expenses.filter(e => e.status === 'pending')
                                 .reduce((s, e) => s + e.amount, 0)

  // ── Invoice KPIs ──
  const unpaidInvoices = invoices.filter(i => ['sent','overdue'].includes(i.status))
                                 .reduce((s, i) => s + i.total, 0)
  const overdueInvoices= invoices.filter(i => i.status === 'overdue')
                                 .reduce((s, i) => s + i.total, 0)
  const paidInvoices   = invoices.filter(i => i.status === 'paid')
                                 .reduce((s, i) => s + i.total, 0)

  // ── TVA ──
  const tvaCollected   = invoices.filter(i => i.status === 'paid')
                                 .reduce((s, i) => s + (i.tax_amount ?? 0), 0)
  const tvaRecoverable = 11240 // simplified from accounting module
  const tvaToPay       = Math.max(0, tvaCollected - tvaRecoverable)

  // ── Reimbursement KPIs ──
  const pendingReimb   = reimbursements.filter(r => r.status === 'approved')
                                       .reduce((s, r) => s + r.remaining_amount, 0)

  // ── Budget KPIs (accepts both raw and computedBudgets shape) ──
  const totalBudget    = budgets.reduce((s, b) => s + (b.allocated_amount ?? b.amount ?? 0), 0)
  const totalSpent     = budgets.reduce((s, b) => s + (b.spent_amount ?? b.spent ?? 0), 0)
  const budgetUsagePct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const budgetAlerts   = budgets.filter(b => (b.percentage ?? budgetPct(b)) >= 80)

  // ── Stock KPIs ──
  const lowStock = products.filter(
    p => p.stock !== null && p.min_stock !== null && p.stock <= p.min_stock
  )

  // ── Net result ──
  const netResult = totalRevenue - totalExpenses

  // ── Charts ──
  // Expense by category
  const byCategory = expenses
    .filter(e => ['approved','paid'].includes(e.status))
    .reduce((acc, e) => {
      const key = e.category ?? 'Autre'
      const existing = acc.find(c => c.name === key)
      if (existing) existing.total += e.amount
      else acc.push({ name: key, color: e.category_color ?? '#6366f1', total: e.amount })
      return acc
    }, [])
    .sort((a, b) => b.total - a.total)

  // Invoice status breakdown
  const invoiceStatus = [
    { name: 'Payées',    value: paidInvoices,   color: '#3D7A5F', count: invoices.filter(i => i.status === 'paid').length },
    { name: 'En attente',value: unpaidInvoices - overdueInvoices, color: '#3D5A80', count: invoices.filter(i => i.status === 'sent').length },
    { name: 'En retard', value: overdueInvoices, color: '#8A3A3A', count: invoices.filter(i => i.status === 'overdue').length },
  ]

  // ── Top customers (sorted by live-computed total_billed) ──
  const topCustomers = [...customers]
    .sort((a, b) => (b.total_billed ?? b.balance ?? 0) - (a.total_billed ?? a.balance ?? 0))
    .slice(0, 4)

  // ── Recent activity ──
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
  const recentInvoices = [...invoices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)
  const recentRevenues = [...revenues]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)
  const recentAccounting = [...accountingEntries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4)

  return {
    // KPI Cards
    totalRevenue,
    totalExpenses,
    netResult,
    pendingExpenses,
    pendingAmount,
    unpaidInvoices,
    overdueInvoices,
    tvaToPay,
    pendingReimb,
    totalBudget,
    totalSpent,
    budgetUsagePct,
    budgetAlerts,
    lowStockCount: lowStock.length,
    lowStock,

    // Charts
    byCategory,
    invoiceStatus,
    monthly: CENTRAL_MONTHLY_STATS,

    // Lists
    topCustomers,
    recentExpenses,
    recentInvoices,
    recentRevenues,
    recentAccounting,
    budgets,
  }
}

export default { buildDashboardStats }
