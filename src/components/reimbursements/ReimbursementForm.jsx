/**
 * ReimbursementForm.jsx
 * Create / Edit reimbursement modal.
 */
import { useState, useEffect } from 'react'
import { Upload, X, FileText, AlertCircle } from 'lucide-react'
import FormModal from '../ui/FormModal'
import { MOCK_EXPENSES, PRIORITY_LABELS, PAYMENT_METHOD_LABELS } from '../../services/reimbursementService'

const EMPTY_FORM = {
  expense_id:       '',
  employee:         '',
  team:             '',
  requested_amount: '',
  priority:         'medium',
  description:      '',
  due_date:         '',
}

const TEAMS = ['Direction', 'Technique', 'Commercial', 'RH', 'Finance', 'Marketing']

export default function ReimbursementForm({ open, onClose, onSubmit, initialData = null, loading = false }) {
  const isEdit = !!initialData
  const [form, setForm]     = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [warn, setWarn]     = useState(null)

  // Populate form on edit
  useEffect(() => {
    if (open) {
      setForm(initialData
        ? {
            expense_id:       initialData.expense_id ?? '',
            employee:         initialData.employee ?? '',
            team:             initialData.team ?? '',
            requested_amount: initialData.requested_amount ?? '',
            priority:         initialData.priority ?? 'medium',
            description:      initialData.description ?? '',
            due_date:         initialData.due_date ?? '',
          }
        : EMPTY_FORM
      )
      setErrors({})
      setWarn(null)
    }
  }, [open, initialData])

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))

    // High amount warning
    if (field === 'requested_amount' && Number(value) > 5000) {
      setWarn('Montant élevé (> 5 000 MAD) — une validation supplémentaire peut être requise.')
    } else if (field === 'requested_amount') {
      setWarn(null)
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.expense_id)       errs.expense_id       = 'Veuillez sélectionner une dépense liée.'
    if (!form.employee.trim())  errs.employee         = 'Nom de l\'employé requis.'
    if (!form.team)             errs.team             = 'Équipe requise.'
    if (!form.requested_amount || Number(form.requested_amount) <= 0)
                                errs.requested_amount = 'Montant invalide.'
    if (!form.description.trim()) errs.description    = 'Description requise.'
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({
      ...form,
      requested_amount: Number(form.requested_amount),
    })
  }

  // Auto-fill employee when expense is selected
  const handleExpenseChange = (expId) => {
    set('expense_id', expId)
    const exp = MOCK_EXPENSES.find(e => e.id === expId)
    if (exp && !form.requested_amount) {
      set('requested_amount', exp.amount)
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    boxSizing: 'border-box',
    borderColor: errors[field] ? 'var(--danger)' : undefined,
  })

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier la demande' : 'Nouvelle demande de remboursement'}
      subtitle={isEdit ? `Réf. ${initialData?.reference}` : 'Remplissez les informations ci-dessous'}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel={isEdit ? 'Enregistrer' : 'Créer la demande'}
      width={560}
    >
      {/* High amount warning */}
      {warn && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '10px 14px', borderRadius: 10,
          background: 'var(--warn-bg)', border: '1px solid var(--warn-mid)',
        }}>
          <AlertCircle size={14} style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: 'var(--warn)', lineHeight: 1.5 }}>{warn}</p>
        </div>
      )}

      {/* Expense selector */}
      <FormModal.Field label="Dépense liée" required error={errors.expense_id}>
        <select
          className="input-premium"
          style={inputStyle('expense_id')}
          value={form.expense_id}
          onChange={e => handleExpenseChange(e.target.value)}
        >
          <option value="">— Sélectionnez une dépense —</option>
          {MOCK_EXPENSES.map(exp => (
            <option key={exp.id} value={exp.id}>
              {exp.id} · {exp.title} ({exp.amount.toLocaleString('fr-MA')} MAD)
            </option>
          ))}
        </select>
      </FormModal.Field>

      {/* Employee + Team */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormModal.Field label="Employé" required error={errors.employee}>
          <input
            className="input-premium"
            style={inputStyle('employee')}
            placeholder="Nom complet"
            value={form.employee}
            onChange={e => set('employee', e.target.value)}
          />
        </FormModal.Field>
        <FormModal.Field label="Équipe" required error={errors.team}>
          <select
            className="input-premium"
            style={inputStyle('team')}
            value={form.team}
            onChange={e => set('team', e.target.value)}
          >
            <option value="">— Équipe —</option>
            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormModal.Field>
      </div>

      {/* Amount + Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <FormModal.Field label="Montant demandé (MAD)" required error={errors.requested_amount}>
          <input
            className="input-premium"
            style={inputStyle('requested_amount')}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.requested_amount}
            onChange={e => set('requested_amount', e.target.value)}
          />
        </FormModal.Field>
        <FormModal.Field label="Priorité">
          <select
            className="input-premium"
            value={form.priority}
            onChange={e => set('priority', e.target.value)}
          >
            {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </FormModal.Field>
      </div>

      {/* Due date */}
      <FormModal.Field label="Date d'échéance" hint="Optionnel — délai attendu de remboursement">
        <input
          className="input-premium"
          type="date"
          value={form.due_date}
          onChange={e => set('due_date', e.target.value)}
        />
      </FormModal.Field>

      {/* Description */}
      <FormModal.Field label="Description / Justification" required error={errors.description}>
        <textarea
          className="input-premium"
          style={{ minHeight: 80, resize: 'vertical', inputStyle: inputStyle('description') }}
          placeholder="Décrivez la raison de ce remboursement…"
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </FormModal.Field>

      {/* Attachments hint */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 10,
        background: 'var(--ivory)', border: '1px dashed var(--pearl)',
        cursor: 'default',
      }}>
        <Upload size={14} style={{ color: 'var(--silver)', flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)' }}>Pièces jointes</p>
          <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 1 }}>
            L'ajout de fichiers est disponible depuis la page de détail après création.
          </p>
        </div>
      </div>
    </FormModal>
  )
}
