/* ─────────────────────────────────────────────────────────────
   SubscriptionContext.jsx
   Global subscription state — wraps the whole authenticated app
───────────────────────────────────────────────────────────── */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import subscriptionService, { SUBSCRIPTION_PLANS } from '../services/subscriptionService'

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  /* ── Load / refresh ────────────────────────────────────── */
  const refresh = useCallback(async () => {
    try {
      const data = await subscriptionService.getSubscription()
      setSubscription(data)
    } catch (err) {
      console.error('[SubscriptionContext] load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  /* ── Derived values ────────────────────────────────────── */
  const computeDaysLeft = () => {
    if (!subscription?.trial_end_date) return 0
    const end = new Date(subscription.trial_end_date)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  const daysLeft     = computeDaysLeft()
  const status       = subscription?.status ?? 'trial'
  const planId       = subscription?.plan   ?? 'free'
  const isTrialing   = status === 'trial'
  const isActive     = status === 'active'
  const isExpired    = status === 'expired' || (isTrialing && daysLeft === 0)
  const isCanceled   = status === 'canceled'
  const isAlmostExpired = isTrialing && daysLeft > 0 && daysLeft <= 3

  const currentPlan  = SUBSCRIPTION_PLANS.find((p) => p.id === planId) ?? SUBSCRIPTION_PLANS[0]
  const billingCycle = subscription?.billing_cycle ?? 'monthly'

  /* ── Actions ───────────────────────────────────────────── */
  const upgrade = async (planId, cycle, paymentData) => {
    const updated = await subscriptionService.upgradePlan(planId, cycle, paymentData)
    setSubscription(updated)
    return updated
  }

  const cancel = async () => {
    const updated = await subscriptionService.cancelSubscription()
    setSubscription(updated)
    return updated
  }

  const updatePaymentMethod = async (paymentData) => {
    const updated = await subscriptionService.updatePaymentMethod(paymentData)
    setSubscription(updated)
    return updated
  }

  /* ── Context value ─────────────────────────────────────── */
  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        status,
        planId,
        daysLeft,
        billingCycle,
        isTrialing,
        isActive,
        isExpired,
        isCanceled,
        isAlmostExpired,
        currentPlan,
        plans: SUBSCRIPTION_PLANS,
        upgrade,
        cancel,
        updatePaymentMethod,
        refresh,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside <SubscriptionProvider>')
  return ctx
}
