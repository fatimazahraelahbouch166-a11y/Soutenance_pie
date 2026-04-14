/**
 * MarkReimbursedModal.jsx
 * Modal to record a (full or partial) reimbursement payment.
 */
import { useState, useEffect } from 'react'
import { CreditCard, AlertCircle } from 'lucide-react'
import FormModal from '../ui/FormModal'
import { PAYMENT_METHOD_LABELS } from '../../services/reimbursementService'

const EMPTY = {
  amount:           '',
  payment_method:   'bank_transfer',
  payment_reference:'',
  date:             new Date().toISOString().split('T')[0],
}

export default function MarkReimbursedModal({ open, onClose, onConfirm, reimbursement, loading = false }) {
  const [form, setForm]     = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [isPartial, setIsPartial] = useState(false)

  const maxAmount = reimbursement
    ? (reimbursement.approved_amount ?? reimbursement.requested_amount) - (reimbursement.reimbursed_amount ?? 0)
    : 0

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, amount: String(maxAmount), date: new Date().toISOString().split('T')[0] })
      setErrors({})
      setIsPartial(false)
    }
  }, [open, reimbursement])

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
    if (field === 'amount') {
      setIsPartial(Number(value) < maxAmount && Number(value) > 0)
    }
  }

  const validate = () => {
    const errs = {}
    const amt = Number(form.amount)
    if (!form.amount || amt <= 0)   errs.amount = 'Montant invalide.'
    if (amt > maxAmount)            errs.amount = `Montant supérieur au solde dû (${maxAmount.toLocaleString('fr-MA')} MAD).`
    if (!form.payment_method)       errs.payment_method = 'Mode de paiement requis.'
    if (!form.date)                 errs.date = 'Date requise.'
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onConfirm({ ...form, amount: Number(form.amount) })
  }

  if (!reimbursement) return null

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Enregistrer un paiement"
      subtitle={`Réf. ${reimbursement.reference} — ${reimbursement.employee}`}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Confirmer le paiement"
      width={500}
    >
      {/* Summary strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 10, padding: '12px 16px', borderRadius: 10,
        background: 'var(--ivory)', border: '1px solid var(--pearl)',
      }}>
        <div>
          <p style={{ fontSize: 10.5, color: 'var(--silver)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Montant approuvé
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
            {(reimbursement.approved_amount ?? reimbursement.requested_amount).toLocaleString('fr-MA')} MAD
          </p>
        </div>
        <div>
          <p style={{ fontSize: 10.5, color: 'var(--silver)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Solde restant
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--warn)', marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
            {maxAmount.toLocaleString('fr-MA')} MAD
          </p>
        </div>
      </div>

      {/* Partial warning */}
      {isPartial && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '10px 14px', borderRadius: 10,
          background: 'var(--warn-bg)', border: '1px solid var(--warn-mid)',
        }}>
          <AlertCircle size={14} style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--warn)', lineHeight: 1.5 }}>
            Remboursement partiel — le statut passera à <strong>Partielle</strong>. Un second paiement sera nécessaire.
          </p>
        </div>
      )}

      {/* Amount to pay */}
      <FormModal.Field
        label="Montant à verser (MAD)"
        required
        error={errors.amount}
        hint={`Maximum : ${maxAmount.toLocaleString('fr-MA')} MAD`}
      >
        <input
          className="input-premium"
          type="number"
          min="0"
          max={maxAmount}
          step="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={e => set('amount', e.target.value)}
          autoFocus
          style={{ borderColor: errors.amount ? 'var(--danger)' : undefined }}
        />
      </FormModal.Field>

      {/* Payment method + reference */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormModal.Field label="Mode de paiement" required error={errors.payment_method}>
          <select
            className="input-premium"
            value={form.payment_method}
            onChange={e => set('payment_method', e.target.value)}
          >
            {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </FormModal.Field>
        <FormModal.Field label="Référence de paiement" hint="N° virement, chèque, reçu…">
          <input
            className="input-premium"
            placeholder="Ex : VIR-2026-0188"
            value={form.payment_reference}
            onChange={e => set('payment_reference', e.target.value)}
          />
        </FormModal.Field>
      </div>

      {/* Date */}
      <FormModal.Field label="Date de paiement" required error={errors.date}>
        <input
          className="input-premium"
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
        />
      </FormModal.Field>
    </FormModal>
  )
}
