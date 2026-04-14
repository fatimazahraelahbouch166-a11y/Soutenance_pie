/* ─────────────────────────────────────────────────────────────
   subscriptionService.js
   Mock subscription service layer — swap for real Stripe/backend later
───────────────────────────────────────────────────────────── */

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

/* ── Plan catalogue ───────────────────────────────────────── */
export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free Trial',
    badge: '7 jours',
    desc: 'Essayez Taadbiir sans engagement',
    price_monthly: 0,
    price_yearly: 0,
    featured: false,
    features: [
      { text: '5 utilisateurs max',          ok: true  },
      { text: 'Gestion des dépenses',         ok: true  },
      { text: 'Workflow de validation',        ok: true  },
      { text: '3 catégories max',             ok: true  },
      { text: 'Tableau de bord basique',       ok: true  },
      { text: 'Export CSV',                    ok: true  },
      { text: 'Budgets avancés',               ok: false },
      { text: 'Export PDF / Excel',            ok: false },
      { text: 'Support prioritaire',           ok: false },
    ],
    limits: { users: 5, expenses: 50, storage_gb: 0.5 },
  },
  {
    id: 'basic',
    name: 'Basic',
    badge: null,
    desc: 'Pour les petites équipes qui démarrent',
    price_monthly: 149,
    price_yearly: 119,
    featured: false,
    features: [
      { text: '5 utilisateurs max',           ok: true  },
      { text: 'Gestion des dépenses',          ok: true  },
      { text: 'Workflow de validation',         ok: true  },
      { text: 'Catégories illimitées',          ok: true  },
      { text: 'Tableau de bord complet',        ok: true  },
      { text: 'Export CSV',                     ok: true  },
      { text: 'Budgets avancés',                ok: true  },
      { text: 'Export PDF / Excel',             ok: false },
      { text: 'Support prioritaire',            ok: false },
    ],
    limits: { users: 5, expenses: 100, storage_gb: 1 },
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: '★ Populaire',
    desc: 'Pour les entreprises en croissance',
    price_monthly: 349,
    price_yearly: 279,
    featured: true,
    features: [
      { text: '25 utilisateurs max',            ok: true  },
      { text: 'Tout Basic inclus',              ok: true  },
      { text: 'Catégories illimitées',           ok: true  },
      { text: 'Budgets avancés',                 ok: true  },
      { text: 'Export PDF & Excel',              ok: true  },
      { text: 'Rapports détaillés',              ok: true  },
      { text: 'Gestion des équipes',             ok: true  },
      { text: 'Notifications email',             ok: true  },
      { text: 'API & intégrations',              ok: false },
    ],
    limits: { users: 25, expenses: null, storage_gb: 10 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: null,
    desc: 'Pour les grandes structures',
    price_monthly: null,
    price_yearly: null,
    featured: false,
    features: [
      { text: 'Utilisateurs illimités',          ok: true  },
      { text: 'Tout Pro inclus',                 ok: true  },
      { text: 'Multi-entreprises',               ok: true  },
      { text: 'API & intégrations ERP',          ok: true  },
      { text: 'SLA garanti 99.9%',               ok: true  },
      { text: 'Support dédié 24/7',              ok: true  },
      { text: 'Formation & onboarding',          ok: true  },
      { text: 'Hébergement dédié',               ok: true  },
      { text: 'Personnalisation UI',             ok: true  },
    ],
    limits: { users: null, expenses: null, storage_gb: null },
  },
]

/* ── Default subscription (trial, 5 days left from today) ── */
function buildDefaultSubscription() {
  const today = new Date()
  const trialEnd = new Date(today)
  trialEnd.setDate(today.getDate() + 5) // 5 days left by default

  return {
    id: 'sub_001',
    status: 'trial',           // trial | active | expired | canceled
    plan: 'free',
    billing_cycle: 'monthly',
    trial_start_date: new Date(today.setDate(today.getDate() - 9))
      .toISOString().split('T')[0],
    trial_end_date: trialEnd.toISOString().split('T')[0],
    subscription_end_date: null,
    payment_method: null,
    invoices: [],
    usage: { users: 4, expenses: 12, storage_gb: 0.3 },
  }
}

/* ── Storage helpers ─────────────────────────────────────── */
const STORAGE_KEY = 'mock_subscription'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/* ── Service API ─────────────────────────────────────────── */
const subscriptionService = {

  /** Fetch current subscription (or create default) */
  getSubscription: async () => {
    await delay(350)
    const saved = readStorage()
    if (saved) {
      // If status is 'canceled' but user never paid (no subscription_end_date),
      // treat as a fresh trial so the app doesn't get stuck in a dead-end state.
      if (saved.status === 'canceled' && !saved.subscription_end_date) {
        const defaults = buildDefaultSubscription()
        writeStorage(defaults)
        return defaults
      }
      return saved
    }
    const defaults = buildDefaultSubscription()
    writeStorage(defaults)
    return defaults
  },

  /** Upgrade / activate a paid plan after payment */
  upgradePlan: async (planId, billingCycle, paymentData) => {
    await delay(1400) // simulate payment processing
    const sub = readStorage() || buildDefaultSubscription()
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)
    if (!plan) throw new Error('Plan introuvable')

    const today = new Date()
    const endDate = new Date(today)
    if (billingCycle === 'yearly') {
      endDate.setFullYear(today.getFullYear() + 1)
    } else {
      endDate.setMonth(today.getMonth() + 1)
    }

    const amount =
      billingCycle === 'yearly'
        ? (plan.price_yearly ?? 0) * 12
        : plan.price_monthly ?? 0

    const invoice = {
      id: `INV-${today.getFullYear()}-${String(sub.invoices.length + 1).padStart(3, '0')}`,
      date: today.toLocaleDateString('fr-FR'),
      amount,
      plan: planId,
      billing_cycle: billingCycle,
      status: 'paid',
    }

    const updated = {
      ...sub,
      status: 'active',
      plan: planId,
      billing_cycle: billingCycle,
      subscription_end_date: endDate.toISOString().split('T')[0],
      payment_method: {
        type: 'card',
        brand: detectCardBrand(paymentData.cardNumber),
        last4: (paymentData.cardNumber ?? '').replace(/\s/g, '').slice(-4) || '4242',
        expiry: paymentData.expiry || '12/26',
        holder: paymentData.cardName || '',
      },
      invoices: [...sub.invoices, invoice],
    }

    writeStorage(updated)
    return updated
  },

  /** Cancel active subscription */
  cancelSubscription: async () => {
    await delay(800)
    const sub = readStorage() || buildDefaultSubscription()
    const updated = { ...sub, status: 'canceled' }
    writeStorage(updated)
    return updated
  },

  /** Update saved payment method */
  updatePaymentMethod: async (paymentData) => {
    await delay(900)
    const sub = readStorage() || buildDefaultSubscription()
    const updated = {
      ...sub,
      payment_method: {
        type: 'card',
        brand: detectCardBrand(paymentData.cardNumber),
        last4: (paymentData.cardNumber ?? '').replace(/\s/g, '').slice(-4) || '0000',
        expiry: paymentData.expiry || '12/26',
        holder: paymentData.cardName || '',
      },
    }
    writeStorage(updated)
    return updated
  },

  /** Reactivate after cancellation / expiration */
  reactivate: async (planId, billingCycle, paymentData) => {
    return subscriptionService.upgradePlan(planId, billingCycle, paymentData)
  },

  /** Dev helper: set trial to expire in N days */
  devSetTrialDays: (days) => {
    const sub = readStorage() || buildDefaultSubscription()
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + days)
    writeStorage({
      ...sub,
      status: days <= 0 ? 'expired' : 'trial',
      trial_end_date: trialEnd.toISOString().split('T')[0],
    })
    window.location.reload()
  },

  /** Dev helper: reset to fresh trial */
  devReset: () => {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  },
}

/* ── Card brand detector ─────────────────────────────────── */
function detectCardBrand(number = '') {
  const n = number.replace(/\s/g, '')
  if (/^4/.test(n)) return 'Visa'
  if (/^5[1-5]/.test(n)) return 'Mastercard'
  if (/^3[47]/.test(n)) return 'Amex'
  return 'Card'
}

export default subscriptionService
