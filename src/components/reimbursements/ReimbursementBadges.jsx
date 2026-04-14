/**
 * ReimbursementBadges.jsx
 * Status and Priority badge components for the Reimbursement module.
 */

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  draft:      { label: 'Brouillon',   bg: 'var(--pearl)',        color: 'var(--slate)',   dot: 'var(--silver)' },
  pending:    { label: 'En attente',  bg: 'var(--warn-bg)',      color: 'var(--warn)',    dot: 'var(--warn)' },
  approved:   { label: 'Approuvée',   bg: 'var(--success-bg)',   color: 'var(--success)', dot: 'var(--success)' },
  rejected:   { label: 'Rejetée',     bg: 'var(--danger-bg)',    color: 'var(--danger)',  dot: 'var(--danger)' },
  reimbursed: { label: 'Remboursée',  bg: 'var(--accent-light)', color: 'var(--accent)',  dot: 'var(--accent)' },
  partial:    { label: 'Partielle',   bg: 'var(--gold-light)',   color: 'var(--gold)',    dot: 'var(--gold)' },
}

export function ReimbursementStatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  const isLg = size === 'lg'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isLg ? 6 : 5,
      padding: isLg ? '4px 12px' : '3px 10px',
      borderRadius: 20,
      fontSize: isLg ? 12.5 : 11.5,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-sans)',
    }}>
      <span style={{
        width: isLg ? 6 : 5,
        height: isLg ? 6 : 5,
        borderRadius: '50%',
        background: cfg.dot,
        flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  )
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  low:    { label: 'Faible',  bg: 'var(--pearl)',        color: 'var(--slate)',   icon: '↓' },
  medium: { label: 'Moyen',   bg: 'var(--accent-light)', color: 'var(--accent)',  icon: '→' },
  high:   { label: 'Haute',   bg: 'var(--warn-bg)',      color: 'var(--warn)',    icon: '↑' },
  urgent: { label: 'Urgent',  bg: 'var(--danger-bg)',    color: 'var(--danger)',  icon: '⚡' },
}

export function ReimbursementPriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.low
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      fontFamily: 'var(--font-sans)',
    }}>
      <span style={{ fontSize: 10 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

// ─── Payment Method Badge ─────────────────────────────────────────────────────

const PAYMENT_CONFIG = {
  bank_transfer: { label: 'Virement',  bg: 'var(--accent-light)', color: 'var(--accent)' },
  cash:          { label: 'Espèces',   bg: 'var(--success-bg)',   color: 'var(--success)' },
  cheque:        { label: 'Chèque',    bg: 'var(--warn-bg)',      color: 'var(--warn)' },
}

export function PaymentMethodBadge({ method }) {
  if (!method) return <span style={{ color: 'var(--silver)', fontSize: 12 }}>—</span>
  const cfg = PAYMENT_CONFIG[method] ?? { label: method, bg: 'var(--pearl)', color: 'var(--slate)' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 500,
      background: cfg.bg,
      color: cfg.color,
      fontFamily: 'var(--font-sans)',
    }}>
      {cfg.label}
    </span>
  )
}

// ─── SLA / Delay indicator ────────────────────────────────────────────────────

export function SLABadge({ due_date, status }) {
  if (!due_date || ['reimbursed', 'rejected'].includes(status)) return null

  const today = new Date()
  const due   = new Date(due_date)
  const diffMs = due - today
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 6, fontSize: 10.5, fontWeight: 600,
        background: 'var(--danger-bg)', color: 'var(--danger)',
      }}>
        ⚠ {Math.abs(diffDays)}j de retard
      </span>
    )
  }
  if (diffDays <= 3) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 6, fontSize: 10.5, fontWeight: 600,
        background: 'var(--warn-bg)', color: 'var(--warn)',
      }}>
        ⏱ {diffDays}j restants
      </span>
    )
  }
  return null
}
