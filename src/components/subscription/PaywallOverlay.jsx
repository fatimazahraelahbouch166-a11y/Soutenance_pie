/* ─────────────────────────────────────────────────────────────
   PaywallOverlay.jsx
   Full-screen blocking overlay shown when trial/subscription expired
───────────────────────────────────────────────────────────── */
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, ArrowRight, Crown, Zap } from 'lucide-react'
import { useSubscription } from '../../contexts/SubscriptionContext'

/* Routes where the paywall must NEVER block (so user can always upgrade) */
const EXEMPT_PATHS = ['/app/subscription', '/app/pricing', '/app/payment']

export default function PaywallOverlay() {
  const { isExpired, loading } = useSubscription()
  const navigate  = useNavigate()
  const location  = useLocation()

  // Never block if still loading
  if (loading) return null
  // Never block if not expired
  if (!isExpired) return null
  // Never block on subscription / pricing / payment pages
  if (EXEMPT_PATHS.some(p => location.pathname.startsWith(p))) return null

  const title    = 'Votre période d\'essai a expiré'
  const subtitle = 'Vous avez profité de 14 jours d\'essai gratuit. Passez à un plan payant pour continuer.'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(24, 23, 21, 0.72)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
    }}>
      <div
        className="animate-fade-up"
        style={{
          background: '#fff',
          borderRadius: 'var(--r-xl)',
          padding: '44px 48px',
          maxWidth: 480,
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 32px 80px rgba(24,23,21,0.22)',
          border: '1px solid var(--pearl)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Lock size={26} style={{ color: 'var(--danger)' }} />
        </div>

        {/* Heading */}
        <h2 style={{
          fontSize: 22, fontWeight: 600, color: 'var(--ink)',
          fontFamily: 'var(--font-serif)', marginBottom: 10,
        }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          {subtitle}
        </p>

        {/* Feature highlights */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 28,
          padding: '16px 20px', borderRadius: 'var(--r-lg)',
          background: 'var(--cream)', border: '1px solid var(--pearl)',
          textAlign: 'left',
        }}>
          {[
            { icon: Crown, text: 'Plans à partir de 149 MAD/mois' },
            { icon: Zap,   text: 'Accès immédiat après paiement'  },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                background: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={12} style={{ color: 'var(--accent)' }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/app/subscription')}
          style={{
            width: '100%', height: 46, borderRadius: 'var(--r-md)',
            background: 'var(--accent)', color: '#fff',
            border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 500, letterSpacing: '.02em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 2px 12px rgba(61,90,128,.3)',
            transition: 'opacity .2s, transform .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Choisir un plan <ArrowRight size={15} />
        </button>

        <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 14 }}>
          Vos données sont conservées — aucune perte d'information.
        </p>
      </div>
    </div>
  )
}
