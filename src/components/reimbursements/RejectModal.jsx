/**
 * RejectModal.jsx
 * Modal to reject a reimbursement with a mandatory reason.
 */
import { useState, useEffect } from 'react'
import { XCircle } from 'lucide-react'
import FormModal from '../ui/FormModal'

export default function RejectModal({ open, onClose, onConfirm, reference, loading = false }) {
  const [reason, setReason] = useState('')
  const [error, setError]   = useState('')

  useEffect(() => {
    if (open) { setReason(''); setError('') }
  }, [open])

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('La raison du rejet est obligatoire.')
      return
    }
    onConfirm(reason.trim())
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Rejeter la demande"
      subtitle={reference ? `Réf. ${reference}` : undefined}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Confirmer le rejet"
      cancelLabel="Annuler"
      danger
      width={480}
    >
      {/* Warning banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 16px', borderRadius: 10,
        background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)',
      }}>
        <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--danger)' }}>
            Action irréversible
          </p>
          <p style={{ fontSize: 12, color: 'var(--danger)', opacity: 0.85, marginTop: 2, lineHeight: 1.5 }}>
            Le rejet de cette demande notifiera l'employé et clôturera le dossier.
          </p>
        </div>
      </div>

      {/* Reason textarea */}
      <FormModal.Field
        label="Raison du rejet"
        required
        error={error}
        hint="Cette raison sera communiquée à l'employé et conservée dans l'historique."
      >
        <textarea
          className="input-premium"
          style={{ minHeight: 100, resize: 'vertical' }}
          placeholder="Ex : Justificatifs incomplets, montant non conforme à la politique interne…"
          value={reason}
          onChange={e => { setReason(e.target.value); setError('') }}
          autoFocus
        />
      </FormModal.Field>
    </FormModal>
  )
}
