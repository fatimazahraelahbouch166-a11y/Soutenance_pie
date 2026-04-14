/* ─────────────────────────────────────────────────────────────
   SubscriptionBadge.jsx
   Status pill — trial / active / expired / canceled
───────────────────────────────────────────────────────────── */
import { Zap, Crown, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { useSubscription } from '../../contexts/SubscriptionContext'

const STATUS_CONFIG = {
  trial: {
    label: 'Essai gratuit',
    icon: Clock,
    color: 'var(--warn)',
    bg: 'var(--warn-bg)',
    border: 'var(--warn-mid)',
  },
  active: {
    label: 'Actif',
    icon: Crown,
    color: 'var(--success)',
    bg: 'var(--success-bg)',
    border: 'var(--success-mid)',
  },
  expired: {
    label: 'Expiré',
    icon: AlertTriangle,
    color: 'var(--danger)',
    bg: 'var(--danger-bg)',
    border: 'var(--danger-mid)',
  },
  canceled: {
    label: 'Annulé',
    icon: XCircle,
    color: 'var(--silver)',
    bg: 'var(--ivory)',
    border: 'var(--pearl)',
  },
}

/**
 * size: 'sm' | 'md' (default md)
 * showPlan: bool — append plan name beside status
 */
export default function SubscriptionBadge({ size = 'md', showPlan = false }) {
  const { status, isExpired, isTrialing, daysLeft, currentPlan, loading } = useSubscription()
  if (loading) return null

  // If trialing but days expired, show as expired
  const resolvedStatus = isExpired && isTrialing ? 'expired' : status
  const cfg = STATUS_CONFIG[resolvedStatus] ?? STATUS_CONFIG.trial
  const Icon = cfg.icon

  const fontSize = size === 'sm' ? 10.5 : 12
  const iconSize = size === 'sm' ? 10   : 12
  const padding  = size === 'sm' ? '2px 8px' : '4px 12px'

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding, borderRadius: 100,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontSize, fontWeight: 600, color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      <Icon size={iconSize} />
      {cfg.label}
      {showPlan && currentPlan && (
        <span style={{ opacity: 0.7, fontWeight: 400 }}>· {currentPlan.name}</span>
      )}
      {resolvedStatus === 'trial' && daysLeft > 0 && (
        <span style={{ opacity: 0.7, fontWeight: 400 }}>· {daysLeft}j</span>
      )}
    </span>
  )
}
