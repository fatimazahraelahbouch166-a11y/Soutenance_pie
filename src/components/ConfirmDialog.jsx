// import { AlertTriangle } from 'lucide-react'
// import Modal from './Modal'

// export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', danger = false }) {
//   return (
//     <Modal open={open} onClose={onClose} title={title} size="sm">
//       <div className="flex gap-3 mb-5">
//         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
//           <AlertTriangle size={18} className={danger ? 'text-red-500' : 'text-amber-500'} />
//         </div>
//         <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
//       </div>
//       <div className="flex gap-3">
//         <button onClick={onClose} className="btn-secondary flex-1">Annuler</button>
//         <button
//           onClick={() => { onConfirm(); onClose() }}
//           className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-xl transition flex items-center justify-center
//             ${danger ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
//           {confirmLabel}
//         </button>
//       </div>
//     </Modal>
//   )
// }
import { AlertTriangle, Info } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmer', danger = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Message block */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: danger ? 'var(--danger-bg)' : 'var(--warn-bg)',
          }}>
            <AlertTriangle size={16} style={{ color: danger ? 'var(--danger)' : 'var(--warn)' }} />
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--slate)', lineHeight: 1.65, paddingTop: 2 }}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Annuler
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            style={{
              flex: 1, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', borderRadius: 'var(--r-md)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              background: danger ? 'var(--danger)' : 'var(--warn)',
              color: '#fff',
              boxShadow: danger
                ? '0 1px 4px rgba(138,58,58,0.30)'
                : '0 1px 4px rgba(138,106,46,0.30)',
              transition: 'opacity 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}