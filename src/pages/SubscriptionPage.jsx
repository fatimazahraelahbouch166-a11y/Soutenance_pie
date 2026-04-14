/* ─────────────────────────────────────────────────────────────
   SubscriptionPage.jsx  — complete subscription management UI
───────────────────────────────────────────────────────────── */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Crown, CreditCard, Calendar, AlertTriangle, CheckCircle,
  Clock, XCircle, ArrowRight, ArrowUpRight, Download,
  Users, FileText, HardDrive, RefreshCw, Zap,
} from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useToast } from '../contexts/ToastContext'
import SubscriptionBadge from '../components/subscription/SubscriptionBadge'
import { TrialCountdownCard } from '../components/subscription/TrialCountdown'
import { SUBSCRIPTION_PLANS } from '../services/subscriptionService'

/* ── Design tokens ── */
const C = {
  accent: '#3D5A80', accentLight: '#EBF0F7', accentMid: '#C2D3E8', accentHover: '#2E4A6E',
  success: '#3D7A5F', successBg: '#EBF4EF', successMid: '#9FCFB8',
  warn: '#8A6A2E', warnBg: '#F5EDD8', warnMid: '#D4BC88',
  danger: '#8A3A3A', dangerBg: '#F5EAEA', dangerMid: '#D4A0A0',
  gold: '#B8975A', goldBg: '#F2E8D5',
  ink: '#181715', charcoal: '#2C2A28', slate: '#5A5856',
  silver: '#B5B1A9', pearl: '#ECE9E3', ivory: '#F3F0EA', cream: '#F8F6F2',
}

/* ── Section card wrapper ── */
function SectionCard({ icon: Icon, title, action, children, style }) {
  return (
    <div className="card-static animate-fade-up" style={{ padding: '24px 28px', ...style }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.ivory}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={13} style={{ color: C.accent }} />
          </div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: C.charcoal }}>{title}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

/* ── Row item for details ── */
function DetailRow({ label, value, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 0', borderBottom: last ? 'none' : `1px solid ${C.ivory}`,
    }}>
      <span style={{ fontSize: 13, color: C.muted ?? C.silver }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: C.charcoal }}>{value}</span>
    </div>
  )
}

/* ── Usage bar ── */
function UsageBar({ label, used, max, unit = '' }) {
  const pct       = max ? Math.min(Math.round((used / max) * 100), 100) : 0
  const color     = pct >= 90 ? C.danger : pct >= 70 ? C.warn : C.accent
  const unlimited = max === null || max === undefined

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
        <span style={{ fontSize: 12.5, color: C.charcoal }}>{label}</span>
        <span style={{ fontSize: 12, color: C.silver }}>
          {used}{unit} {unlimited ? '(illimité)' : `/ ${max}${unit}`}
        </span>
      </div>
      {!unlimited && (
        <>
          <div style={{
            height: 6, background: C.ivory, borderRadius: 10,
            overflow: 'hidden', marginBottom: 4,
          }}>
            <div style={{
              height: '100%', width: `${pct}%`, borderRadius: 10,
              background: color, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
            }} />
          </div>
          {pct >= 80 && (
            <p style={{ fontSize: 11, color }}>
              {pct >= 90 ? '⚠ Limite presque atteinte' : 'Attention : utilisation élevée'}
            </p>
          )}
        </>
      )}
    </div>
  )
}

/* ── Mini plan card (for upgrade panel) ── */
function MiniPlanCard({ plan, currentPlanId, annual, onSelect }) {
  const isCurrentPlan = plan.id === currentPlanId
  const price = annual ? plan.price_yearly : plan.price_monthly

  return (
    <div
      onClick={() => !isCurrentPlan && onSelect(plan.id)}
      style={{
        padding: '16px 18px', borderRadius: 'var(--r-lg)',
        border: `1.5px solid ${isCurrentPlan ? C.accent : C.pearl}`,
        background: isCurrentPlan ? C.accentLight : '#fff',
        cursor: isCurrentPlan ? 'default' : 'pointer',
        transition: 'all .2s',
      }}
      onMouseEnter={e => { if (!isCurrentPlan) e.currentTarget.style.borderColor = C.accent }}
      onMouseLeave={e => { if (!isCurrentPlan) e.currentTarget.style.borderColor = C.pearl  }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: isCurrentPlan ? C.accent : C.charcoal }}>{plan.name}</p>
        {isCurrentPlan && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '1px 8px', borderRadius: 100,
            background: C.accent, color: '#fff',
          }}>Actuel</span>
        )}
      </div>
      {price !== null ? (
        <p style={{ fontSize: 18, fontWeight: 700, color: isCurrentPlan ? C.accent : C.ink, fontFamily: 'var(--font-serif)' }}>
          {price} <span style={{ fontSize: 11, fontWeight: 400, color: C.silver }}>MAD/mois</span>
        </p>
      ) : (
        <p style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Sur devis</p>
      )}
    </div>
  )
}

/* ── Cancel confirmation modal ── */
function CancelModal({ onConfirm, onClose, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(24,23,21,.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="animate-fade-up" style={{
        background: '#fff', borderRadius: 'var(--r-xl)', padding: '36px 40px',
        maxWidth: 420, width: '90%', textAlign: 'center',
        boxShadow: '0 24px 60px rgba(24,23,21,.18)', border: `1px solid ${C.pearl}`,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
          background: C.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <XCircle size={24} style={{ color: C.danger }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Annuler l'abonnement ?</h3>
        <p style={{ fontSize: 13, color: C.silver, lineHeight: 1.65, marginBottom: 24 }}>
          Votre abonnement sera annulé à la fin de la période en cours.
          Vous conservez l'accès jusqu'à cette date.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 42, borderRadius: 'var(--r-md)', border: `1px solid ${C.pearl}`,
              background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: C.slate,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, height: 42, borderRadius: 'var(--r-md)', border: 'none',
              background: loading ? C.dangerBg : C.danger,
              color: loading ? C.danger : '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {loading ? <RefreshCw size={13} style={{ animation: 'spin .7s linear infinite' }} /> : null}
            {loading ? 'Annulation…' : 'Confirmer l\'annulation'}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════ */
export default function SubscriptionPage() {
  const navigate  = useNavigate()
  const toast     = useToast()
  const {
    subscription, status, planId, billingCycle,
    isTrialing, isActive, isExpired, isCanceled, daysLeft,
    currentPlan, cancel,
  } = useSubscription()

  const [annual, setAnnual]         = useState(billingCycle === 'yearly')
  const [showCancel, setShowCancel] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  /* ── Cancel handler ── */
  const handleCancel = async () => {
    setCancelLoading(true)
    try {
      await cancel()
      toast.warning('Abonnement annulé', 'Votre abonnement prendra fin à la date prévue.')
    } catch {
      toast.error('Erreur', 'Impossible d\'annuler l\'abonnement pour l\'instant.')
    } finally {
      setCancelLoading(false)
      setShowCancel(false)
    }
  }

  /* ── Derived display values ── */
  const usage = subscription?.usage ?? { users: 4, expenses: 12, storage_gb: 0.3 }
  const limits = currentPlan?.limits ?? { users: 5, expenses: 50, storage_gb: 0.5 }

  const renewalDate = subscription?.subscription_end_date
    ? new Date(subscription.subscription_end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const billingLabel = billingCycle === 'yearly' ? 'Annuelle' : 'Mensuelle'
  const planPrice    = billingCycle === 'yearly'
    ? `${(currentPlan?.price_yearly ?? 0) * 12} MAD/an`
    : `${currentPlan?.price_monthly ?? 0} MAD/mois`

  /* ── Status config ── */
  const statusConfig = {
    trial:    { bg: C.warnBg,    border: C.warnMid,    text: C.warn,    icon: Clock },
    active:   { bg: C.successBg, border: C.successMid, text: C.success, icon: CheckCircle },
    expired:  { bg: C.dangerBg,  border: C.dangerMid,  text: C.danger,  icon: AlertTriangle },
    canceled: { bg: C.ivory,     border: C.pearl,      text: C.silver,  icon: XCircle },
  }
  const cfg = statusConfig[status] ?? statusConfig.trial
  const StatusIcon = cfg.icon

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Status banner ── */}
      <div className="animate-fade-up" style={{
        padding: '18px 22px', borderRadius: 'var(--r-lg)',
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.text}`,
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <StatusIcon size={18} style={{ color: cfg.text, flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: cfg.text }}>
              Plan actuel : {currentPlan?.name}
            </p>
            <SubscriptionBadge />
          </div>

          {isTrialing && daysLeft > 0 && (
            <p style={{ fontSize: 13, color: cfg.text, opacity: 0.8, lineHeight: 1.6 }}>
              Il vous reste <strong>{daysLeft} jour{daysLeft > 1 ? 's' : ''}</strong> d'essai gratuit.
              Choisissez un plan pour continuer sans interruption.
            </p>
          )}
          {(isExpired || (isTrialing && daysLeft === 0)) && (
            <p style={{ fontSize: 13, color: cfg.text, opacity: 0.8 }}>
              Votre essai a expiré. Souscrivez à un plan pour retrouver l'accès complet.
            </p>
          )}
          {isActive && (
            <p style={{ fontSize: 13, color: cfg.text, opacity: 0.8 }}>
              Prochain renouvellement le <strong>{renewalDate}</strong>.
            </p>
          )}
          {isCanceled && (
            <p style={{ fontSize: 13, color: cfg.text, opacity: 0.8 }}>
              Votre abonnement est annulé. Réabonnez-vous pour retrouver l'accès.
            </p>
          )}
        </div>
      </div>

      {/* ── Trial countdown (visible only when trialing) ── */}
      {isTrialing && <TrialCountdownCard />}

      {/* ── Upgrade CTAs when trial/expired/canceled ── */}
      {(isTrialing || isExpired || isCanceled) && (
        <div className="animate-fade-up" style={{
          padding: '22px 26px', borderRadius: 'var(--r-lg)',
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
              Prêt à passer à la vitesse supérieure ?
            </p>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.65)' }}>
              Plans à partir de 149 MAD/mois · Accès immédiat · Annulation facile
            </p>
          </div>
          <button
            onClick={() => navigate('/app/pricing')}
            style={{
              flexShrink: 0, height: 40, padding: '0 20px', borderRadius: 'var(--r-md)',
              background: '#fff', color: C.accent, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7,
              boxShadow: '0 2px 10px rgba(0,0,0,.15)', transition: 'opacity .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Voir les plans <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ── Subscription details ── */}
      <SectionCard
        icon={Crown}
        title="Détails de l'abonnement"
        action={
          <Link
            to="/app/pricing"
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.accent, textDecoration: 'none', fontWeight: 500 }}
          >
            Changer de plan <ArrowUpRight size={12} />
          </Link>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DetailRow label="Plan"                value={currentPlan?.name ?? '—'} />
          <DetailRow label="Statut"              value={<SubscriptionBadge size="sm" />} />
          <DetailRow label="Facturation"         value={isActive ? billingLabel : '—'} />
          <DetailRow
            label="Prochain renouvellement"
            value={isActive ? renewalDate : isTrialing ? `Dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}` : '—'}
          />
          <DetailRow
            label="Montant"
            value={isActive ? planPrice : '—'}
            last
          />
        </div>

        {/* Action buttons */}
        {isActive && (
          <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.ivory}` }}>
            <button
              onClick={() => navigate('/app/pricing')}
              style={{
                flex: 1, height: 40, borderRadius: 'var(--r-md)', border: 'none',
                background: C.accent, color: '#fff', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              <Crown size={13} /> Changer de plan
            </button>
            <button
              onClick={() => setShowCancel(true)}
              style={{
                flex: 1, height: 40, borderRadius: 'var(--r-md)',
                border: `1px solid ${C.pearl}`, background: '#fff',
                color: C.danger, cursor: 'pointer', fontSize: 13, fontWeight: 500,
              }}
            >
              Annuler l'abonnement
            </button>
          </div>
        )}
      </SectionCard>

      {/* ── Upgrade panel (show mini plan cards) ── */}
      {(isTrialing || isCanceled) && (
        <SectionCard icon={Zap} title="Choisir un plan">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 12.5, color: !annual ? C.charcoal : C.silver, fontWeight: !annual ? 600 : 400 }}>Mensuel</span>
            <button
              type="button"
              onClick={() => setAnnual(v => !v)}
              style={{
                position: 'relative', width: 38, height: 20, borderRadius: 10,
                background: annual ? C.accent : C.pearl, border: 'none', cursor: 'pointer',
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: annual ? 19 : 3,
                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,.15)', transition: 'left .22s',
              }} />
            </button>
            <span style={{ fontSize: 12.5, color: annual ? C.charcoal : C.silver, fontWeight: annual ? 600 : 400 }}>Annuel</span>
            {annual && <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: C.successBg, color: C.success }}>−20%</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            {SUBSCRIPTION_PLANS.filter(p => p.id !== 'free' && p.id !== 'enterprise').map(p => (
              <MiniPlanCard
                key={p.id} plan={p} currentPlanId={planId} annual={annual}
                onSelect={id => navigate(`/app/payment?plan=${id}&billing=${annual ? 'yearly' : 'monthly'}`)}
              />
            ))}
          </div>
          <button
            onClick={() => navigate('/app/pricing')}
            style={{
              width: '100%', height: 40, borderRadius: 'var(--r-md)',
              border: `1px solid ${C.pearl}`, background: '#fff',
              color: C.slate, cursor: 'pointer', fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            Voir la comparaison complète des plans <ArrowRight size={13} />
          </button>
        </SectionCard>
      )}

      {/* ── Payment method ── */}
      <SectionCard icon={CreditCard} title="Méthode de paiement">
        {!isActive ? (
          <p style={{ fontSize: 13, color: C.silver }}>
            {isTrialing
              ? 'Aucune carte enregistrée — vous êtes en période d\'essai.'
              : 'Aucune méthode de paiement enregistrée.'}
          </p>
        ) : !subscription?.payment_method ? (
          <p style={{ fontSize: 13, color: C.silver }}>Aucune carte enregistrée.</p>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 16px', background: C.cream, border: `1px solid ${C.pearl}`, borderRadius: 'var(--r-md)',
          }}>
            <div style={{
              width: 44, height: 28, background: C.accent, borderRadius: 5, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.06em' }}>
                {subscription.payment_method.brand?.toUpperCase() ?? 'CARD'}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: C.charcoal }}>
                •••• •••• •••• {subscription.payment_method.last4}
              </p>
              <p style={{ fontSize: 11.5, color: C.silver, marginTop: 1 }}>
                {subscription.payment_method.holder && `${subscription.payment_method.holder} · `}
                Expire {subscription.payment_method.expiry}
              </p>
            </div>
            <button
              onClick={() => navigate('/app/payment?plan=' + planId + '&billing=' + billingCycle)}
              style={{ fontSize: 12, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              Modifier
            </button>
          </div>
        )}
      </SectionCard>

      {/* ── Invoice history (only when active) ── */}
      {isActive && subscription?.invoices?.length > 0 && (
        <SectionCard icon={Calendar} title="Historique des factures">
          <table className="premium-table">
            <thead>
              <tr>
                {['Numéro', 'Date', 'Plan', 'Montant', 'Statut', ''].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...subscription.invoices].reverse().map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{inv.id}</td>
                  <td style={{ color: C.silver }}>{inv.date}</td>
                  <td style={{ color: C.slate, textTransform: 'capitalize' }}>{inv.plan}</td>
                  <td style={{ fontWeight: 600 }}>{inv.amount} MAD</td>
                  <td>
                    <span className="badge badge-paid">
                      <span className="badge-dot" />
                      {inv.status === 'paid' ? 'Payée' : inv.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={{
                      fontSize: 12, color: C.accent, background: 'none', border: 'none',
                      cursor: 'pointer', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <Download size={11} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {/* ── Usage metrics ── */}
      <SectionCard icon={Users} title="Utilisation du plan">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <UsageBar label="Utilisateurs"              used={usage.users}       max={limits.users}       />
          <UsageBar label="Dépenses ce mois"          used={usage.expenses}    max={limits.expenses}    />
          <UsageBar label="Stockage justificatifs"    used={usage.storage_gb}  max={limits.storage_gb}  unit=" Go" />
        </div>
      </SectionCard>

      {/* Cancel modal */}
      {showCancel && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setShowCancel(false)}
          loading={cancelLoading}
        />
      )}
    </div>
  )
}
