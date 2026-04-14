/* ─────────────────────────────────────────────────────────────
   PaymentPage.jsx
   Full payment UI — mock only, ready for Stripe integration
   Route: /app/payment?plan=pro&billing=monthly
───────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  CreditCard, Lock, Check, ArrowLeft, ChevronRight,
  Zap, Shield, RefreshCw, AlertCircle,
} from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useToast } from '../contexts/ToastContext'
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService'

/* ── Design tokens ── */
const C = {
  accent: '#3D5A80', accentLight: '#EBF0F7', accentHover: '#2E4A6E',
  success: '#3D7A5F', successBg: '#EBF4EF',
  ink: '#181715', charcoal: '#2C2A28', slate: '#5A5856',
  silver: '#B5B1A9', pearl: '#ECE9E3', ivory: '#F3F0EA', cream: '#F8F6F2',
  warn: '#8A6A2E', warnBg: '#F5EDD8',
  danger: '#8A3A3A', dangerBg: '#F5EAEA',
}

/* ── Card number formatter ── */
function formatCard(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

/* ── Expiry formatter ── */
function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

/* ── Small trust badge ── */
function TrustBadge({ icon: Icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Icon size={12} style={{ color: C.silver }} />
      <span style={{ fontSize: 11.5, color: C.silver }}>{text}</span>
    </div>
  )
}

/* ── Plan summary sidebar ── */
function PlanSummary({ plan, billingCycle, annual }) {
  if (!plan) return null
  const price = annual ? plan.price_yearly : plan.price_monthly
  const total = annual ? (plan.price_yearly ?? 0) * 12 : price

  return (
    <div style={{
      background: '#fff', border: `1px solid ${C.pearl}`, borderRadius: 'var(--r-xl)',
      padding: '28px 26px', position: 'sticky', top: 24,
    }}>
      {/* Plan header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22,
        paddingBottom: 18, borderBottom: `1px solid ${C.ivory}`,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: plan.featured ? C.accent : C.accentLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={18} style={{ color: plan.featured ? '#fff' : C.accent }} />
        </div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{plan.name}</p>
          <p style={{ fontSize: 12, color: C.silver, marginTop: 2 }}>{plan.desc}</p>
        </div>
      </div>

      {/* Price breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: C.slate }}>{plan.name} × 1</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.charcoal }}>
            {price} MAD/mois
          </span>
        </div>
        {annual && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: C.slate }}>Facturation annuelle</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.success }}>
              −{Math.round(((plan.price_monthly - plan.price_yearly) / plan.price_monthly) * 100)}%
            </span>
          </div>
        )}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          paddingTop: 10, borderTop: `1px solid ${C.ivory}`,
        }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: C.charcoal }}>Total</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>
            {annual ? `${total} MAD/an` : `${price} MAD/mois`}
          </span>
        </div>
      </div>

      {/* Included features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: C.silver, marginBottom: 4 }}>
          Inclus dans ce plan
        </p>
        {plan.features.filter(f => f.ok).slice(0, 5).map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Check size={12} style={{ color: C.success, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: C.slate }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Trust */}
      <div style={{
        marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.ivory}`,
        display: 'flex', flexDirection: 'column', gap: 7,
      }}>
        <TrustBadge icon={Lock}      text="Paiement 100% sécurisé" />
        <TrustBadge icon={Shield}    text="Données chiffrées SSL" />
        <TrustBadge icon={RefreshCw} text="Annulation facile à tout moment" />
      </div>
    </div>
  )
}

/* ── Input field ── */
function Field({ label, hint, error, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 12.5, fontWeight: 500, color: C.slate }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: C.silver }}>{hint}</span>}
      </div>
      {children}
      {error && (
        <p style={{ fontSize: 11.5, color: C.danger, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function PaymentPage() {
  const [searchParams] = useSearchParams()
  const navigate       = useNavigate()
  const toast          = useToast()
  const { upgrade }    = useSubscription()

  const planId       = searchParams.get('plan') || 'pro'
  const billingParam = searchParams.get('billing') || 'monthly'

  const [annual, setAnnual]   = useState(billingParam === 'yearly')
  const [method, setMethod]   = useState('card') // card | paypal
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors]   = useState({})

  const [form, setForm] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  })

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)

  useEffect(() => {
    setAnnual(billingParam === 'yearly')
  }, [billingParam])

  /* ── Form helpers ── */
  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e })
  }

  const validate = () => {
    const e = {}
    if (method === 'card') {
      if (!form.cardName.trim())                               e.cardName   = 'Nom requis'
      if (form.cardNumber.replace(/\s/g, '').length < 16)     e.cardNumber = 'Numéro invalide (16 chiffres)'
      if (!/^\d{2}\/\d{2}$/.test(form.expiry))                e.expiry     = 'Format MM/AA requis'
      if (form.cvv.length < 3)                                 e.cvv        = 'CVV invalide'
    }
    return e
  }

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await upgrade(planId, annual ? 'yearly' : 'monthly', {
        cardNumber: form.cardNumber,
        expiry: form.expiry,
        cardName: form.cardName,
        method,
      })
      setSuccess(true)
      toast.success('Paiement confirmé !', `Plan ${plan?.name} activé avec succès.`)
      setTimeout(() => navigate('/app/dashboard'), 2200)
    } catch (err) {
      toast.error('Erreur de paiement', 'Veuillez vérifier vos informations.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success screen ── */
  if (success) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
        textAlign: 'center', padding: 32,
      }}>
        <div className="animate-fade-up" style={{
          width: 72, height: 72, borderRadius: '50%',
          background: C.successBg, border: `2px solid ${C.success}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={32} style={{ color: C.success }} />
        </div>
        <div className="animate-fade-up stagger-1">
          <h2 style={{ fontSize: 24, fontWeight: 600, color: C.ink, fontFamily: 'var(--font-serif)', marginBottom: 8 }}>
            Paiement confirmé !
          </h2>
          <p style={{ fontSize: 14, color: C.muted }}>
            Votre plan <strong>{plan?.name}</strong> est maintenant actif. Redirection…
          </p>
        </div>
        <div style={{ width: 200, height: 3, borderRadius: 4, background: C.pearl, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: C.success, borderRadius: 4,
            animation: 'progress-fill 2.2s linear forwards',
          }} />
        </div>
        <style>{`@keyframes progress-fill { from { width:0% } to { width:100% } }`}</style>
      </div>
    )
  }

  if (!plan) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: C.danger }}>Plan introuvable.</p>
        <Link to="/app/subscription" style={{ color: C.accent }}>Retour</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>

      {/* Back */}
      <Link
        to="/app/subscription"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 22,
          fontSize: 13, color: C.slate, textDecoration: 'none', fontWeight: 500,
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.accent}
        onMouseLeave={e => e.currentTarget.style.color = C.slate}
      >
        <ArrowLeft size={14} /> Retour à l'abonnement
      </Link>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: 12, color: C.silver }}>
        <span>Abonnement</span>
        <ChevronRight size={12} />
        <span>Choisir un plan</span>
        <ChevronRight size={12} />
        <span style={{ color: C.charcoal, fontWeight: 500 }}>Paiement</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

        {/* ── Left: Payment form ── */}
        <div>
          <div className="card-static animate-fade-up" style={{ padding: '32px 36px' }}>

            {/* Title */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: C.ink, fontFamily: 'var(--font-serif)', marginBottom: 6 }}>
                Finaliser l'abonnement
              </h1>
              <p style={{ fontSize: 13, color: C.silver }}>Vos informations sont protégées par un chiffrement SSL 256-bit.</p>
            </div>

            {/* Billing toggle */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 28,
              padding: '10px 16px', background: C.cream, border: `1px solid ${C.pearl}`,
              borderRadius: 'var(--r-md)',
            }}>
              <span style={{ fontSize: 12.5, fontWeight: !annual ? 600 : 400, color: !annual ? C.charcoal : C.silver }}>Mensuel</span>
              <button
                type="button"
                onClick={() => setAnnual(v => !v)}
                style={{
                  position: 'relative', width: 38, height: 20, borderRadius: 10,
                  background: annual ? C.accent : C.pearl, border: 'none', cursor: 'pointer',
                  transition: 'background .22s',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3, left: annual ? 19 : 3,
                  width: 14, height: 14, borderRadius: '50%', background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,.18)', transition: 'left .22s',
                }} />
              </button>
              <span style={{ fontSize: 12.5, fontWeight: annual ? 600 : 400, color: annual ? C.charcoal : C.silver }}>Annuel</span>
              {annual && (
                <span style={{
                  fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                  background: C.successBg, color: C.success,
                }}>−20%</span>
              )}
            </div>

            {/* Payment method tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              {[
                { id: 'card',   label: 'Carte bancaire', icon: CreditCard },
                { id: 'paypal', label: 'PayPal',         icon: () => (
                  <span style={{ fontSize: 13, fontWeight: 700, color: method === 'paypal' ? '#003087' : C.silver }}>P</span>
                )},
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  style={{
                    flex: 1, height: 46, borderRadius: 'var(--r-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    border: `1.5px solid ${method === id ? C.accent : C.pearl}`,
                    background: method === id ? C.accentLight : '#fff',
                    cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    color: method === id ? C.accent : C.slate,
                    transition: 'all .2s',
                  }}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            {/* Card form */}
            {method === 'card' && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                <Field label="Nom sur la carte" error={errors.cardName}>
                  <input
                    className="input-premium"
                    placeholder="Sara Alami"
                    value={form.cardName}
                    onChange={e => set('cardName', e.target.value)}
                    style={{ borderColor: errors.cardName ? C.danger : undefined }}
                  />
                </Field>

                <Field label="Numéro de carte" hint="Visa, Mastercard, Amex" error={errors.cardNumber}>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input-premium"
                      placeholder="1234 5678 9012 3456"
                      value={form.cardNumber}
                      onChange={e => set('cardNumber', formatCard(e.target.value))}
                      style={{ paddingRight: 50, borderColor: errors.cardNumber ? C.danger : undefined }}
                    />
                    <CreditCard size={15} style={{
                      position: 'absolute', right: 14, top: '50%',
                      transform: 'translateY(-50%)', color: C.silver, pointerEvents: 'none',
                    }} />
                  </div>
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Date d'expiration" error={errors.expiry}>
                    <input
                      className="input-premium"
                      placeholder="MM/AA"
                      value={form.expiry}
                      onChange={e => set('expiry', formatExpiry(e.target.value))}
                      style={{ borderColor: errors.expiry ? C.danger : undefined }}
                    />
                  </Field>

                  <Field label="CVV" hint="3–4 chiffres" error={errors.cvv}>
                    <input
                      className="input-premium"
                      placeholder="···"
                      type="password"
                      maxLength={4}
                      value={form.cvv}
                      onChange={e => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      style={{ letterSpacing: '0.2em', borderColor: errors.cvv ? C.danger : undefined }}
                    />
                  </Field>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    height: 50, borderRadius: 'var(--r-md)', border: 'none',
                    background: loading ? C.accentLight : C.accent,
                    color: loading ? C.accent : '#fff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: 14.5, fontWeight: 600, letterSpacing: '.03em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: loading ? 'none' : '0 2px 12px rgba(61,90,128,.28)',
                    transition: 'all .2s',
                    marginTop: 6,
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: '2px solid var(--accent-mid)', borderTopColor: C.accent,
                        animation: 'spin .7s linear infinite', display: 'inline-block',
                      }} />
                      Traitement en cours…
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      Confirmer le paiement ·{' '}
                      {annual
                        ? `${(plan.price_yearly ?? 0) * 12} MAD/an`
                        : `${plan.price_monthly ?? 0} MAD/mois`}
                    </>
                  )}
                </button>

                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </form>
            )}

            {/* PayPal */}
            {method === 'paypal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
                <p style={{ fontSize: 13, color: C.slate, textAlign: 'center', lineHeight: 1.6 }}>
                  Vous serez redirigé vers PayPal pour finaliser votre paiement de façon sécurisée.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: '100%', height: 50, borderRadius: 'var(--r-md)', border: 'none',
                    background: loading ? '#f0f0f0' : '#0070ba',
                    color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: 14.5, fontWeight: 700, letterSpacing: '.02em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxShadow: '0 2px 12px rgba(0,112,186,.3)',
                  }}
                >
                  {loading ? 'Redirection…' : 'Payer avec PayPal'}
                </button>
                <p style={{ fontSize: 11.5, color: C.silver }}>
                  Vous serez redirigé vers paypal.com pour compléter votre achat.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ── Right: Plan summary ── */}
        <div className="animate-fade-up stagger-1">
          <PlanSummary plan={plan} billingCycle={annual ? 'yearly' : 'monthly'} annual={annual} />
        </div>
      </div>
    </div>
  )
}
