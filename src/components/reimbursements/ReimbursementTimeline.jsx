/**
 * ReimbursementTimeline.jsx
 * Visual workflow timeline: Created → Submitted → Approved/Rejected → Paid
 */

const STEPS = [
  { key: 'draft',      label: 'Créée',     icon: '📝' },
  { key: 'pending',    label: 'Soumise',   icon: '📤' },
  { key: 'approved',   label: 'Approuvée', icon: '✅', altKey: 'rejected' },
  { key: 'reimbursed', label: 'Payée',     icon: '💸', altKey: 'partial' },
]

const STATUS_ORDER = {
  draft:      0,
  pending:    1,
  approved:   2,
  rejected:   2,
  reimbursed: 3,
  partial:    3,
}

function stepState(stepKey, currentStatus, stepAltKey) {
  const current = STATUS_ORDER[currentStatus] ?? 0
  const stepIdx = STATUS_ORDER[stepKey] ?? 0

  if (currentStatus === 'rejected' && stepKey === 'approved') return 'rejected'
  if ((currentStatus === 'partial' || currentStatus === 'reimbursed') && stepKey === 'reimbursed') return 'done'
  if (current > stepIdx) return 'done'
  if (current === stepIdx) return 'active'
  return 'pending'
}

export default function ReimbursementTimeline({ status, activity_log = [] }) {
  return (
    <div style={{ padding: '0 4px' }}>
      {/* Step indicators */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
        {STEPS.map((step, i) => {
          const state = stepState(step.key, status, step.altKey)
          const isLast = i === STEPS.length - 1

          const dotColor =
            state === 'done'     ? 'var(--success)' :
            state === 'active'   ? 'var(--accent)'  :
            state === 'rejected' ? 'var(--danger)'  :
            'var(--pearl)'

          const dotBg =
            state === 'done'     ? 'var(--success-bg)' :
            state === 'active'   ? 'var(--accent-light)' :
            state === 'rejected' ? 'var(--danger-bg)'  :
            'var(--ivory)'

          const lineColor =
            state === 'done'     ? 'var(--success-mid)' :
            state === 'active'   ? 'var(--accent-mid)'  :
            'var(--pearl)'

          return (
            <div key={step.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Dot + connector row */}
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                {/* Left connector */}
                {i > 0 && (
                  <div style={{
                    flex: 1, height: 2,
                    background: lineColor,
                    transition: 'background 0.3s',
                  }} />
                )}

                {/* Dot */}
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: dotBg,
                  border: `2px solid ${dotColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                  boxShadow: state === 'active' ? '0 0 0 4px var(--accent-light)' : 'none',
                  transition: 'all 0.3s',
                  zIndex: 1,
                }}>
                  {state === 'rejected' && step.key === 'approved'
                    ? <span style={{ fontSize: 16 }}>❌</span>
                    : <span>{step.icon}</span>
                  }
                </div>

                {/* Right connector */}
                {!isLast && (
                  <div style={{
                    flex: 1, height: 2,
                    background: STATUS_ORDER[status] > STATUS_ORDER[step.key] ? 'var(--success-mid)' : 'var(--pearl)',
                    transition: 'background 0.3s',
                  }} />
                )}
              </div>

              {/* Label */}
              <p style={{
                marginTop: 8,
                fontSize: 11.5,
                fontWeight: state === 'active' ? 700 : 500,
                color: state === 'done'     ? 'var(--success)' :
                       state === 'active'   ? 'var(--accent)'  :
                       state === 'rejected' ? 'var(--danger)'  :
                       'var(--silver)',
                textAlign: 'center',
                transition: 'color 0.3s',
              }}>
                {state === 'rejected' && step.key === 'approved' ? 'Rejetée' : step.label}
              </p>

              {/* Date from activity log */}
              {(() => {
                const entry = activity_log.find(a =>
                  step.key === 'draft'      ? a.action === 'created'    :
                  step.key === 'pending'    ? a.action === 'submitted'  :
                  step.key === 'approved'   ? ['approved','rejected'].includes(a.action) :
                  step.key === 'reimbursed' ? ['reimbursed','partial'].includes(a.action) :
                  false
                )
                if (!entry) return null
                return (
                  <p style={{ fontSize: 10, color: 'var(--silver)', marginTop: 2, textAlign: 'center' }}>
                    {new Date(entry.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}
                  </p>
                )
              })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
