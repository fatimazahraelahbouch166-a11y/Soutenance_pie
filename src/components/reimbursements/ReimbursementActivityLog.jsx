/**
 * ReimbursementActivityLog.jsx
 * Full history of actions performed on a reimbursement.
 */
import { History } from 'lucide-react'

const ACTION_CONFIG = {
  created:    { label: 'Demande créée',              color: 'var(--silver)',  bg: 'var(--pearl)',        icon: '📝' },
  submitted:  { label: 'Soumise pour approbation',   color: 'var(--accent)',  bg: 'var(--accent-light)', icon: '📤' },
  approved:   { label: 'Approuvée',                  color: 'var(--success)', bg: 'var(--success-bg)',   icon: '✅' },
  rejected:   { label: 'Rejetée',                    color: 'var(--danger)',  bg: 'var(--danger-bg)',    icon: '❌' },
  reimbursed: { label: 'Remboursée intégralement',   color: 'var(--accent)',  bg: 'var(--accent-light)', icon: '💸' },
  partial:    { label: 'Remboursement partiel',       color: 'var(--gold)',    bg: 'var(--gold-light)',   icon: '🔄' },
  edited:     { label: 'Modifiée',                   color: 'var(--slate)',   bg: 'var(--ivory)',        icon: '✏️' },
  comment:    { label: 'Commentaire ajouté',          color: 'var(--slate)',   bg: 'var(--ivory)',        icon: '💬' },
}

export default function ReimbursementActivityLog({ activity_log = [] }) {
  const entries = [...activity_log].reverse()

  if (entries.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '28px 0', gap: 8,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 14,
          background: 'var(--ivory)', color: 'var(--champagne)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <History size={18} />
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--silver)' }}>Aucune activité enregistrée</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {entries.map((entry, i) => {
        const cfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.edited
        const isLast = i === entries.length - 1

        return (
          <div key={entry.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {/* Left: icon + vertical line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: cfg.bg, border: `1.5px solid ${cfg.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, flexShrink: 0,
              }}>
                {cfg.icon}
              </div>
              {!isLast && (
                <div style={{ width: 1.5, flex: 1, minHeight: 20, background: 'var(--pearl)', marginTop: 3 }} />
              )}
            </div>

            {/* Right: content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16, paddingTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: cfg.color }}>
                  {cfg.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--silver)' }}>
                  par <strong style={{ color: 'var(--slate)' }}>{entry.user}</strong>
                </span>
              </div>
              {entry.note && (
                <p style={{ fontSize: 12, color: 'var(--slate)', marginTop: 3, lineHeight: 1.5 }}>
                  {entry.note}
                </p>
              )}
              <p style={{ fontSize: 10.5, color: 'var(--silver)', marginTop: 4 }}>
                {new Date(entry.date).toLocaleString('fr-FR', {
                  day: '2-digit', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
