/* ─────────────────────────────────────────────────────────────
   TrialCountdown.jsx
   Shows remaining trial days with a green/orange/red colour system
───────────────────────────────────────────────────────────── */
import { Clock } from 'lucide-react'
import { useSubscription } from '../../contexts/SubscriptionContext'

/**
 * Colour token mapping:
 *   > 7 days  → green  (success)
 *   1–7 days  → orange (warn)
 *   0 days    → red    (danger)
 */
function getColors(days) {
  if (days <= 0) return { text: 'var(--danger)', bg: 'var(--danger-bg)', border: 'var(--danger-mid)' }
  if (days <= 7)  return { text: 'var(--warn)',   bg: 'var(--warn-bg)',   border: 'var(--warn-mid)'   }
  return              { text: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-mid)' }
}

/** Compact pill variant (for sidebar / topbar) */
export function TrialPill() {
  const { isTrialing, isExpired, daysLeft, loading } = useSubscription()
  if (loading) return null
  if (!isTrialing && !isExpired) return null

  const { text, bg, border } = getColors(daysLeft)
  const label = daysLeft <= 0 ? 'Expiré' : `${daysLeft}j`

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 100,
      background: bg, border: `1px solid ${border}`,
      fontSize: 10.5, fontWeight: 600, color: text,
      flexShrink: 0, lineHeight: 1.4,
    }}>
      <Clock size={9} />
      {label}
    </span>
  )
}

/** Full-size countdown card (for dashboard) */
export function TrialCountdownCard() {
  const { isTrialing, isExpired, daysLeft, subscription, loading } = useSubscription()
  if (loading) return null
  if (!isTrialing && !isExpired) return null

  const { text, bg, border } = getColors(daysLeft)

  return (
    <div style={{
      padding: '16px 20px', borderRadius: 'var(--r-lg)',
      background: bg, border: `1px solid ${border}`,
      borderLeft: `3px solid ${text}`,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      {/* Circle gauge */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
        background: '#fff', border: `2px solid ${border}`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: text, lineHeight: 1 }}>
          {daysLeft <= 0 ? '!' : daysLeft}
        </span>
        {daysLeft > 0 && (
          <span style={{ fontSize: 9, color: text, opacity: 0.7, letterSpacing: '.02em' }}>JOURS</span>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: text, marginBottom: 3 }}>
          {daysLeft <= 0
            ? 'Votre période d\'essai a expiré'
            : daysLeft === 1
            ? 'Dernier jour d\'essai !'
            : `${daysLeft} jours d'essai restants`}
        </p>
        <p style={{ fontSize: 12, color: text, opacity: 0.75 }}>
          {daysLeft <= 0
            ? 'Passez à un plan payant pour continuer à utiliser Taadbiir.'
            : daysLeft <= 3
            ? 'Votre essai se termine très bientôt. Choisissez un plan maintenant !'
            : `Essai jusqu'au ${subscription?.trial_end_date
                ? new Date(subscription.trial_end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                : '—'}`}
        </p>
      </div>
    </div>
  )
}

export default TrialCountdownCard
