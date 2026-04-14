/**
 * NotificationCenter.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Smart notification panel aggregating live alerts from all modules:
 *   • Pending expenses awaiting approval
 *   • Overdue invoices
 *   • Low-stock products
 *   • Budget over-alert thresholds
 *   • Pending reimbursements
 *
 * Reads directly from GlobalStore — no extra fetching.
 * Can be embedded anywhere or used as a dropdown.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, Clock, TrendingDown, Package,
  CreditCard, X, CheckCircle, Bell,
} from 'lucide-react'
import { useGlobalStore } from '../store/GlobalStore'
import { budgetPct } from '../lib/centralData'

/* ── Severity → visual config ───────────────────────────────────────────────── */
const SEV = {
  critical: { color: '#8A3A3A', bg: '#F5E6E6', border: '#8A3A3A22', dot: '#8A3A3A' },
  warn:     { color: '#8A6A2E', bg: '#F5EDD8', border: '#8A6A2E22', dot: '#8A6A2E' },
  info:     { color: '#3D5A80', bg: '#EBF0F7', border: '#3D5A8022', dot: '#3D5A80' },
  success:  { color: '#3D7A5F', bg: '#EBF4EF', border: '#3D7A5F22', dot: '#3D7A5F' },
}

/* ── Build notifications from GlobalStore state ─────────────────────────────── */
function buildNotifications(state) {
  const notifs = []

  // 1. Pending expenses
  const pending = state.expenses.filter(e => e.status === 'pending')
  if (pending.length > 0) {
    notifs.push({
      id:       'pending-expenses',
      severity: pending.length > 5 ? 'critical' : 'warn',
      icon:     Clock,
      title:    `${pending.length} dépense${pending.length > 1 ? 's' : ''} en attente`,
      body:     `Total : ${pending.reduce((s, e) => s + e.amount, 0).toLocaleString('fr-MA')} MAD à valider`,
      to:       '/app/validation',
      tag:      'Dépenses',
    })
  }

  // 2. Overdue invoices
  const overdue = state.invoices.filter(i => i.status === 'overdue')
  if (overdue.length > 0) {
    notifs.push({
      id:       'overdue-invoices',
      severity: 'critical',
      icon:     AlertTriangle,
      title:    `${overdue.length} facture${overdue.length > 1 ? 's' : ''} en retard`,
      body:     `Montant dû : ${overdue.reduce((s, i) => s + i.total, 0).toLocaleString('fr-MA')} MAD`,
      to:       '/app/quotes',
      tag:      'Facturation',
    })
  }

  // 3. Low stock products
  const lowStock = state.products.filter(
    p => p.stock !== null && p.min_stock !== null && p.stock <= p.min_stock
  )
  if (lowStock.length > 0) {
    notifs.push({
      id:       'low-stock',
      severity: 'warn',
      icon:     Package,
      title:    `${lowStock.length} produit${lowStock.length > 1 ? 's' : ''} en rupture de stock`,
      body:     lowStock.slice(0, 2).map(p => p.name).join(', ') + (lowStock.length > 2 ? `… +${lowStock.length - 2}` : ''),
      to:       '/app/stock',
      tag:      'Stock',
    })
  }

  // 4. Budget alerts (≥ 80%)
  const budgetAlerts = state.budgets.filter(b => budgetPct(b) >= 80)
  budgetAlerts.forEach(b => {
    const pct = budgetPct(b)
    notifs.push({
      id:       `budget-${b.id}`,
      severity: pct >= 100 ? 'critical' : 'warn',
      icon:     TrendingDown,
      title:    `Budget « ${b.name} » à ${pct}%`,
      body:     `${b.spent_amount?.toLocaleString('fr-MA')} / ${b.allocated_amount?.toLocaleString('fr-MA')} MAD consommés`,
      to:       '/app/budgets',
      tag:      'Budgets',
    })
  })

  // 5. Pending reimbursements
  const pendingReimb = state.reimbursements.filter(r => r.status === 'approved')
  if (pendingReimb.length > 0) {
    notifs.push({
      id:       'pending-reimb',
      severity: 'info',
      icon:     CreditCard,
      title:    `${pendingReimb.length} remboursement${pendingReimb.length > 1 ? 's' : ''} à décaisser`,
      body:     `Total : ${pendingReimb.reduce((s, r) => s + r.remaining_amount, 0).toLocaleString('fr-MA')} MAD`,
      to:       '/app/reimbursements',
      tag:      'Remboursements',
    })
  }

  return notifs
}

/* ── Single notification row ─────────────────────────────────────────────────── */
function NotifRow({ notif, onNavigate }) {
  const cfg  = SEV[notif.severity] ?? SEV.info
  const Icon = notif.icon

  return (
    <button
      onClick={() => onNavigate(notif.to)}
      style={{
        width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 16px', border: 'none', textAlign: 'left', cursor: 'pointer',
        background: cfg.bg, borderBottom: `1px solid ${cfg.border}`,
        transition: 'filter 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
      onMouseLeave={e => e.currentTarget.style.filter = 'none'}
    >
      {/* Icon bubble */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: `${cfg.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={14} style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.3 }}>
            {notif.title}
          </p>
          <span style={{
            fontSize: 9.5, padding: '1px 7px', borderRadius: 100,
            background: cfg.color, color: '#fff', fontWeight: 700, flexShrink: 0,
          }}>
            {notif.tag}
          </span>
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--silver)', lineHeight: 1.5 }}>{notif.body}</p>
      </div>

      {/* Severity dot */}
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: cfg.dot, flexShrink: 0, marginTop: 5,
      }} />
    </button>
  )
}

/* ── NotificationCenter (dropdown mode) ─────────────────────────────────────── */
export default function NotificationCenter({ onClose }) {
  const { state }  = useGlobalStore()
  const navigate   = useNavigate()
  const ref        = useRef(null)
  const notifs     = buildNotifications(state)

  const handleNavigate = (to) => {
    navigate(to)
    onClose?.()
  }

  return (
    <div
      ref={ref}
      className="animate-fade-up"
      style={{
        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
        width: 360,
        background: '#fff', border: '1px solid var(--pearl)',
        borderRadius: 'var(--r-lg)',
        boxShadow: '0 16px 48px rgba(24,23,21,0.14)',
        zIndex: 200, overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderBottom: '1px solid var(--ivory)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={14} style={{ color: 'var(--accent)' }} />
          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)' }}>
            Alertes système
          </p>
          {notifs.length > 0 && (
            <span style={{
              fontSize: 10.5, fontWeight: 700, padding: '1px 7px',
              borderRadius: 100, background: 'var(--danger)', color: '#fff', lineHeight: '16px',
            }}>{notifs.length}</span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', padding: 4, borderRadius: 6 }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Notification list */}
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {notifs.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <CheckCircle size={28} style={{ color: 'var(--pearl)', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 13, color: 'var(--silver)', fontWeight: 500 }}>Tout est en ordre !</p>
            <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 4 }}>Aucune alerte active pour le moment.</p>
          </div>
        ) : (
          notifs.map(notif => (
            <NotifRow key={notif.id} notif={notif} onNavigate={handleNavigate} />
          ))
        )}
      </div>

      {/* Footer */}
      {notifs.length > 0 && (
        <div style={{
          padding: '10px 16px', borderTop: '1px solid var(--ivory)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontSize: 11, color: 'var(--silver)' }}>
            {notifs.filter(n => n.severity === 'critical').length} critique{notifs.filter(n => n.severity === 'critical').length !== 1 ? 's' : ''},&nbsp;
            {notifs.filter(n => n.severity === 'warn').length} avertissement{notifs.filter(n => n.severity === 'warn').length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => handleNavigate('/app/dashboard')}
            style={{
              fontSize: 12, color: 'var(--accent)', background: 'none',
              border: 'none', cursor: 'pointer', fontWeight: 500,
            }}
          >
            Voir le tableau de bord →
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Inline variant (for embedding in pages) ─────────────────────────────────── */
export function NotificationPanel() {
  const { state }  = useGlobalStore()
  const navigate   = useNavigate()
  const notifs     = buildNotifications(state)

  if (notifs.length === 0) return null

  return (
    <div style={{
      borderRadius: 'var(--r-lg)', overflow: 'hidden',
      border: '1px solid var(--pearl)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    }}>
      {notifs.map(notif => (
        <NotifRow key={notif.id} notif={notif} onNavigate={navigate} />
      ))}
    </div>
  )
}

/* ── Badge count only (for Topbar bell icon) ─────────────────────────────────── */
export function useNotificationCount() {
  const { state } = useGlobalStore()
  return buildNotifications(state).length
}
