/**
 * WorkflowActions.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable cross-module "Related Records" panel.
 * Renders linked records (with navigation) and quick-action buttons.
 *
 * Usage:
 *   <WorkflowActions
 *     title="Éléments liés"
 *     items={[
 *       { type: 'reimbursement', label: 'REM-2025-001', sub: 'En attente', to: '/app/reimbursements/1', amount: 3600 },
 *       { type: 'budget', label: 'Déplacements annuels', sub: '25% consommé', to: '/app/budgets', badge: 'Actif' },
 *       { type: 'accounting', label: 'ACC-2025-002', sub: 'Écriture comptable', to: '/app/accounting/journal' },
 *     ]}
 *     actions={[
 *       { icon: RefreshCw, label: 'Demander remboursement', onClick: () => {}, color: '#3D5A80' },
 *     ]}
 *   />
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const TYPE_META = {
  reimbursement: { color: '#3D5A80', bg: '#EBF0F7', label: 'Remboursement' },
  budget:        { color: '#3D7A5F', bg: '#EBF4EF', label: 'Budget'         },
  accounting:    { color: '#7C3AED', bg: '#F3F0FF', label: 'Comptabilité'   },
  invoice:       { color: '#0891B2', bg: '#E0F7FA', label: 'Facture'        },
  revenue:       { color: '#3D7A5F', bg: '#EBF4EF', label: 'Revenu'         },
  expense:       { color: '#8A6A2E', bg: '#F5EDD8', label: 'Dépense'        },
  customer:      { color: '#0891B2', bg: '#E0F7FA', label: 'Client'         },
  quote:         { color: '#6366f1', bg: '#EEF2FF', label: 'Devis'          },
  payment:       { color: '#0891B2', bg: '#E0F7FA', label: 'Paiement'       },
}

/* ── Linked-record row ─────────────────────────────────────────────────────── */
function RecordLink({ item }) {
  const meta = TYPE_META[item.type] ?? { color: 'var(--accent)', bg: 'var(--accent-light)', label: item.type ?? '' }
  return (
    <Link
      to={item.to}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 10,
        background: meta.bg,
        border: `1px solid ${meta.color}22`,
        textDecoration: 'none', transition: 'filter 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.96)'}
      onMouseLeave={e => e.currentTarget.style.filter = 'none'}
    >
      {/* Left: type pill + label + sub */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontSize: 9.5, fontWeight: 700, color: meta.color,
            textTransform: 'uppercase', letterSpacing: '.07em',
          }}>
            {meta.label}
          </span>
          {item.ref && (
            <span style={{ fontSize: 10.5, color: meta.color, opacity: 0.65 }}>· {item.ref}</span>
          )}
        </div>
        <p style={{
          fontSize: 13, fontWeight: 500, color: 'var(--charcoal)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.label}
        </p>
        {item.sub && (
          <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 1 }}>{item.sub}</p>
        )}
      </div>

      {/* Right: amount | badge */}
      {item.amount != null && (
        <span style={{
          fontSize: 13, fontWeight: 600, color: meta.color,
          flexShrink: 0, fontVariantNumeric: 'tabular-nums',
        }}>
          {item.amount.toLocaleString('fr-MA')} MAD
        </span>
      )}
      {item.badge && (
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 100,
          background: meta.color, color: '#fff', fontWeight: 600, flexShrink: 0,
        }}>
          {item.badge}
        </span>
      )}
      <ArrowRight size={12} style={{ color: meta.color, flexShrink: 0, opacity: 0.55 }} />
    </Link>
  )
}

/* ── Progress bar (for budget items) ──────────────────────────────────────── */
export function BudgetLink({ budget, to }) {
  if (!budget) return null
  const pct  = budget.allocated_amount > 0
    ? Math.round((budget.spent_amount / budget.allocated_amount) * 100)
    : 0
  const color = pct >= 90 ? '#8A3A3A' : pct >= 75 ? '#8A6A2E' : '#3D7A5F'
  const bg    = pct >= 90 ? '#F5E6E6' : pct >= 75 ? '#F5EDD8' : '#EBF4EF'

  return (
    <Link
      to={to ?? '/app/budgets'}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', borderRadius: 10,
        background: bg, border: `1px solid ${color}22`,
        textDecoration: 'none', transition: 'filter 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.96)'}
      onMouseLeave={e => e.currentTarget.style.filter = 'none'}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '.07em' }}>
            Budget
          </span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)', marginBottom: 6 }}>
          {budget.name}
        </p>
        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 2, background: `${color}22`, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${Math.min(pct, 100)}%`,
            background: color, borderRadius: 2, transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10.5, color: 'var(--silver)' }}>
            {budget.spent_amount?.toLocaleString('fr-MA')} / {budget.allocated_amount?.toLocaleString('fr-MA')} MAD
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 600, color }}>{pct}%</span>
        </div>
      </div>
      <ArrowRight size={12} style={{ color, flexShrink: 0, opacity: 0.55, marginLeft: 4 }} />
    </Link>
  )
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function WorkflowActions({
  title   = 'Éléments liés',
  items   = [],
  actions = [],
  children,
}) {
  const hasContent = items.length > 0 || actions.length > 0 || children

  if (!hasContent) return null

  return (
    <div className="card-static" style={{ padding: '20px 24px' }}>
      <h3 style={{
        fontSize: 11, fontWeight: 700, color: 'var(--silver)',
        textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 14,
      }}>
        {title}
      </h3>

      {/* Linked record rows */}
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: (actions.length > 0 || children) ? 14 : 0 }}>
          {items.map((item, i) => <RecordLink key={i} item={item} />)}
        </div>
      )}

      {/* Slot for custom content (e.g. BudgetLink) */}
      {children && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: actions.length > 0 ? 14 : 0 }}>
          {children}
        </div>
      )}

      {/* Quick-action buttons */}
      {actions.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {actions.map((act, i) => {
            const Icon = act.icon
            return (
              <button
                key={i}
                onClick={act.onClick}
                disabled={act.disabled}
                title={act.title}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '0 14px', height: 34, borderRadius: 8,
                  background: act.bg ?? 'var(--ivory)',
                  color: act.color ?? 'var(--charcoal)',
                  border: `1px solid ${act.color ? act.color + '30' : 'var(--pearl)'}`,
                  fontSize: 12.5, fontWeight: 500,
                  cursor: act.disabled ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)', transition: 'filter 0.15s',
                  opacity: act.disabled ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (!act.disabled) e.currentTarget.style.filter = 'brightness(0.94)' }}
                onMouseLeave={e => e.currentTarget.style.filter = 'none'}
              >
                {Icon && <Icon size={13} />}
                {act.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
