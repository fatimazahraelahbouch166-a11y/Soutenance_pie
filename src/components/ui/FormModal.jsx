/**
 * FormModal — generic form dialog wrapper.
 * Usage:
 *   <FormModal
 *     open={isOpen}
 *     onClose={() => setOpen(false)}
 *     title="Nouvelle dépense"
 *     onSubmit={handleSubmit}
 *     loading={submitting}
 *     submitLabel="Enregistrer"
 *   >
 *     <FormModal.Field label="Titre" required>
 *       <input className="input-premium" ... />
 *     </FormModal.Field>
 *   </FormModal>
 */
import { useEffect } from 'react'
import { X } from 'lucide-react'
import Spinner from '../Spinner'

function Field({ label, required, error, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>
          {label}
          {required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {hint && <p style={{ fontSize: 11, color: 'var(--silver)' }}>{hint}</p>}
      {error && <p style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 500 }}>{error}</p>}
    </div>
  )
}

export default function FormModal({
  open, onClose, title, subtitle,
  onSubmit, loading = false,
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  children,
  width = 520,
  danger = false,
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(24,23,21,0.44)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, backdropFilter: 'blur(2px)',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 18,
        width: '100%', maxWidth: width,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(24,23,21,0.22)',
        animation: 'modalFade 0.18s ease',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '20px 24px 16px', borderBottom: '1px solid var(--ivory)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              {title}
            </h2>
            {subtitle && <p style={{ fontSize: 12, color: 'var(--silver)', marginTop: 3 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid var(--pearl)',
              background: '#fff', cursor: 'pointer', color: 'var(--silver)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s', flexShrink: 0, marginLeft: 12,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--ivory)'
              e.currentTarget.style.color = 'var(--charcoal)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = 'var(--silver)'
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto', flex: 1,
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
          padding: '14px 24px', borderTop: '1px solid var(--ivory)', flexShrink: 0,
        }}>
          <button className="btn-secondary" onClick={onClose} disabled={loading} style={{ height: 36 }}>
            {cancelLabel}
          </button>
          <button
            className="btn-primary"
            onClick={onSubmit}
            disabled={loading}
            style={{
              height: 36,
              background: danger ? 'var(--danger)' : undefined,
            }}
          >
            {loading ? <Spinner size={14} /> : null}
            {submitLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalFade {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

FormModal.Field = Field
