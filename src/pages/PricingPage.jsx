/* ─────────────────────────────────────────────────────────────
   PricingPage.jsx
   Dual-mode: public landing (/pricing) + protected app (/app/pricing)
   Detects which context via `useLocation` and renders accordingly
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Check, X, Zap, ArrowRight, Crown, Shield } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService'

/* ── Design tokens ── */
const C = {
  accent: '#3D5A80', accentLight: '#EBF0F7', accentHover: '#2E4A6E',
  success: '#3D7A5F', successBg: '#EBF4EF',
  gold: '#B8975A', goldBg: '#F2E8D5',
  ink: '#181715', charcoal: '#2C2A28', slate: '#5A5856',
  silver: '#B5B1A9', pearl: '#ECE9E3', ivory: '#F3F0EA', cream: '#F8F6F2',
}

/* ── FAQ items ── */
const FAQ = [
  { q: 'Puis-je annuler à tout moment ?',       a: 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous conservez l\'accès jusqu\'à la fin de la période payée.' },
  { q: 'Y a-t-il une carte bancaire requise pour l\'essai ?', a: 'Non. L\'essai gratuit de 14 jours ne nécessite aucune carte bancaire.' },
  { q: 'Puis-je changer de plan à tout moment ?',  a: 'Oui. Vous pouvez upgrader ou downgrader votre plan à n\'importe quel moment depuis votre espace abonnement.' },
  { q: 'Que se passe-t-il après l\'essai ?',       a: 'Après les 14 jours d\'essai, vous devez souscrire à un plan payant pour continuer. Vos données restent conservées.' },
]

/* ── Plan card ── */
function PlanCard({ plan, annual, onChoose, isInApp }) {
  const price = annual ? plan.price_yearly : plan.price_monthly
  const featured = plan.featured

  return (
    <div
      style={{
        background: featured ? C.accent : '#fff',
        border: `1.5px solid ${featured ? C.accent : C.pearl}`,
        borderRadius: 'var(--r-xl)', padding: '30px 26px',
        display: 'flex', flexDirection: 'column',
        position: 'relative',
        boxShadow: featured ? '0 10px 40px rgba(61,90,128,.28)' : '0 1px 4px rgba(26,25,23,.05)',
        transition: 'transform .25s, box-shadow .25s',
      }}
      onMouseEnter={e => { if (!featured) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(26,25,23,.11)'; } }}
      onMouseLeave={e => { if (!featured) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(26,25,23,.05)'; } }}
    >
      {/* Popular badge */}
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          background: C.gold, color: '#fff', fontSize: 10.5, fontWeight: 600,
          padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap', letterSpacing: '.04em',
        }}>
          {plan.badge}
        </div>
      )}

      {/* Name & desc */}
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 11, letterSpacing: '.10em', textTransform: 'uppercase', color: featured ? 'rgba(255,255,255,.5)' : C.silver, marginBottom: 5 }}>
          {plan.name}
        </p>
        <p style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,.6)' : C.slate, fontWeight: 300, lineHeight: 1.55 }}>
          {plan.desc}
        </p>
      </div>

      {/* Price */}
      {price !== null ? (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: 44, fontWeight: 600, color: featured ? '#fff' : C.ink, letterSpacing: '-.03em', lineHeight: 1, fontFamily: 'var(--font-serif)' }}>
              {price}
            </span>
            <span style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,.45)' : C.silver }}>MAD/mois</span>
          </div>
          {annual && (
            <p style={{ fontSize: 11.5, color: featured ? 'rgba(255,255,255,.35)' : C.silver, marginTop: 3 }}>
              Facturé {(plan.price_yearly * 12).toLocaleString()} MAD/an
            </p>
          )}
        </div>
      ) : (
        <p style={{ fontSize: 32, fontWeight: 600, color: featured ? '#fff' : C.ink, marginBottom: 18, fontFamily: 'var(--font-serif)' }}>Sur devis</p>
      )}

      {/* Trial note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: featured ? 'rgba(255,255,255,.55)' : C.success, marginBottom: 20 }}>
        <Zap size={12} /> 14 jours d'essai gratuit
      </div>

      {/* CTA */}
      {plan.id === 'enterprise' ? (
        <a
          href="mailto:contact@expenseiq.ma"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            height: 42, borderRadius: 'var(--r-md)', marginBottom: 22,
            fontSize: 13, fontWeight: 500, textDecoration: 'none',
            background: featured ? '#fff' : C.accentLight,
            color: featured ? C.accent : C.accent,
            transition: 'opacity .2s, transform .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Nous contacter <ArrowRight size={13} />
        </a>
      ) : (
        <button
          onClick={() => onChoose(plan.id, annual ? 'yearly' : 'monthly')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            height: 42, width: '100%', borderRadius: 'var(--r-md)', marginBottom: 22,
            fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
            background: featured ? '#fff' : C.accent,
            color: featured ? C.accent : '#fff',
            boxShadow: featured ? 'none' : '0 2px 8px rgba(61,90,128,.3)',
            transition: 'opacity .2s, transform .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {isInApp ? 'Choisir ce plan' : "Commencer l'essai"} <ArrowRight size={13} />
        </button>
      )}

      {/* Features */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {plan.features.map((f, j) => (
          <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13 }}>
            {f.ok
              ? <Check size={13} style={{ color: featured ? 'rgba(255,255,255,.65)' : C.success, flexShrink: 0 }} />
              : <X    size={13} style={{ color: featured ? 'rgba(255,255,255,.2)'  : C.pearl,   flexShrink: 0 }} />}
            <span style={{
              color: f.ok
                ? (featured ? 'rgba(255,255,255,.78)' : C.charcoal)
                : (featured ? 'rgba(255,255,255,.25)' : C.silver),
              textDecoration: f.ok ? 'none' : 'line-through',
            }}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── FAQ item ── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${C.pearl}` }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: C.charcoal }}>{q}</span>
        <span style={{ fontSize: 18, color: C.silver, flexShrink: 0, transition: 'transform .2s', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.7, paddingBottom: 16 }}>{a}</p>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════ */
export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const isInApp   = location.pathname.startsWith('/app')

  const handleChoose = (planId, billing) => {
    if (isInApp) {
      navigate(`/app/payment?plan=${planId}&billing=${billing}`)
    } else {
      navigate(`/register?plan=${planId}&billing=${billing}`)
    }
  }

  /* ── Shared content ── */
  const content = (
    <>
      {/* Hero */}
      <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 52 }}>
        <h1 style={{
          fontSize: 38, fontWeight: 600, color: C.ink,
          letterSpacing: '-0.025em', marginBottom: 12,
          fontFamily: 'var(--font-serif)',
        }}>
          Tarifs simples et transparents
        </h1>
        <p style={{ fontSize: 15, color: C.silver, fontWeight: 300, marginBottom: 30 }}>
          14 jours d'essai gratuit — aucune carte bancaire requise
        </p>

        {/* Toggle */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          padding: '10px 20px', background: '#fff', border: `1px solid ${C.pearl}`, borderRadius: 12,
          boxShadow: '0 1px 4px rgba(26,25,23,.06)',
        }}>
          <span style={{ fontSize: 13, fontWeight: !annual ? 600 : 400, color: !annual ? C.charcoal : C.silver }}>Mensuel</span>
          <button
            onClick={() => setAnnual(v => !v)}
            style={{
              position: 'relative', width: 42, height: 22, borderRadius: 11,
              background: annual ? C.accent : '#d4d0c8', border: 'none', cursor: 'pointer',
              transition: 'background .22s', flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute', top: 3, left: annual ? 21 : 3,
              width: 16, height: 16, borderRadius: '50%', background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,.2)', transition: 'left .22s',
            }} />
          </button>
          <span style={{ fontSize: 13, fontWeight: annual ? 600 : 400, color: annual ? C.charcoal : C.silver }}>Annuel</span>
          {annual && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 100, background: C.successBg, color: C.success }}>−20%</span>
          )}
        </div>
      </div>

      {/* Plans grid */}
      <div className="animate-fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 60 }}>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            annual={annual}
            onChoose={handleChoose}
            isInApp={isInApp}
          />
        ))}
      </div>

      {/* Trust badges */}
      <div className="animate-fade-up stagger-2" style={{
        display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 60, flexWrap: 'wrap',
      }}>
        {[
          { icon: Shield, text: 'Paiement sécurisé SSL' },
          { icon: Crown,  text: 'Annulation à tout moment' },
          { icon: Zap,    text: 'Accès immédiat après paiement' },
        ].map(({ icon: Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon size={14} style={{ color: C.silver }} />
            <span style={{ fontSize: 12.5, color: C.silver }}>{text}</span>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="animate-fade-up stagger-3" style={{ maxWidth: 640, margin: '0 auto 48px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: C.ink, fontFamily: 'var(--font-serif)', textAlign: 'center', marginBottom: 28 }}>
          Questions fréquentes
        </h2>
        {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
      </div>

      {/* Contact */}
      <div className="animate-fade-up stagger-4" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: C.silver }}>
          Des questions ?{' '}
          <a href="mailto:contact@expenseiq.ma" style={{ color: C.accent, fontWeight: 500 }}>Contactez-nous</a>
        </p>
      </div>
    </>
  )

  /* ── App mode: render without public shell ── */
  if (isInApp) {
    return (
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {content}
      </div>
    )
  }

  /* ── Public mode: render with public topbar ── */
  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: 'var(--font-sans)' }}>
      {/* Topbar */}
      <div style={{
        background: '#fff', borderBottom: `1px solid ${C.pearl}`,
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--accent), #1E3A5C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(61,90,128,.28)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6.5" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.95"/>
              <rect x="10.75" y="9" width="2.5" height="9" rx="1.25" fill="white" fillOpacity="0.95"/>
              <path d="M8 18h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45"/>
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: '-.02em' }}>Taadbiir</span>
        </Link>
        <Link to="/login" style={{ fontSize: 13, color: C.accent, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
          Se connecter <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px' }}>
        {content}
      </div>
    </div>
  )
}
