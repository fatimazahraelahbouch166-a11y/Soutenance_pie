/* ─────────────────────────────────────────────────────────────
   UpgradeBanner.jsx
   Sticky top-of-page warning when trial is about to expire
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, X } from 'lucide-react'
import { useSubscription } from '../../contexts/SubscriptionContext'

export default function UpgradeBanner() {
  const { isTrialing, isAlmostExpired, isExpired, daysLeft, loading } = useSubscription()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(false)

  // Show only when: data loaded, almost expired (≤3 days) but not yet expired, and not dismissed
  if (loading || !isTrialing || isExpired || !isAlmostExpired || dismissed) return null

  const urgency = daysLeft <= 1 ? 'danger' : 'warn'
  const colors = {
    danger: { bg: 'var(--danger-bg)', border: 'var(--danger-mid)', text: 'var(--danger)' },
    warn:   { bg: 'var(--warn-bg)',   border: 'var(--warn-mid)',   text: 'var(--warn)'   },
  }[urgency]

  const message = daysLeft <= 1
    ? 'Dernier jour ! Votre essai gratuit expire aujourd\'hui.'
    : `Plus que ${daysLeft} jours d'essai gratuit.`

  return (
    <div style={{
      width: '100%',
      padding: '9px 20px',
      background: colors.bg,
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'fadeIn .4s ease',
    }}>
      <AlertTriangle size={14} style={{ color: colors.text, flexShrink: 0 }} />

      <p style={{ flex: 1, fontSize: 12.5, color: colors.text, fontWeight: 500 }}>
        {message}{' '}
        <span style={{ fontWeight: 400, opacity: 0.8 }}>
          Passez à un plan payant pour ne pas perdre l'accès.
        </span>
      </p>

      <button
        onClick={() => navigate('/app/subscription')}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 14px', borderRadius: 'var(--r-md)',
          background: colors.text, color: '#fff',
          border: 'none', cursor: 'pointer', flexShrink: 0,
          fontSize: 12, fontWeight: 500, letterSpacing: '.02em',
          transition: 'opacity .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Upgrader <ArrowRight size={11} />
      </button>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: colors.text, opacity: 0.5, padding: 2, flexShrink: 0,
          transition: 'opacity .18s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '.5'}
      >
        <X size={14} />
      </button>
    </div>
  )
}
