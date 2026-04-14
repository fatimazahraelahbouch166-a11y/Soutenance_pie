// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
// import api from '../lib/api'
// import { useToast } from '../contexts/ToastContext'
// import Spinner from '../components/Spinner'
// import { fmt, fmtDate, initials } from '../lib/helpers'

// export default function ValidationPage() {
//   const [items, setItems]     = useState([])
//   const [loading, setLoading] = useState(true)
//   const [acting, setActing]   = useState(null)
//   const [rejectId, setRejectId]     = useState(null)
//   const [rejectReason, setRejectReason] = useState('')

//   useEffect(() => {
//     api.get('/expenses', { params: { status: 'pending' } })
//       .then(r => setItems(r.data.data ?? r.data))
//       .finally(() => setLoading(false))
//   }, [])

//   const approve = async id => {
//     setActing(id)
//     try {
//       await api.post(`/expenses/${id}/approve`)
//       setItems(prev => prev.filter(e => e.id !== id))
//     } finally { setActing(null) }
//   }

//   const reject = async id => {
//     setActing(id)
//     try {
//       await api.post(`/expenses/${id}/reject`, { reason: rejectReason })
//       setItems(prev => prev.filter(e => e.id !== id))
//       setRejectId(null); setRejectReason('')
//     } finally { setActing(null) }
//   }

//   if (loading) return <Spinner />

//   return (
//     <div className="space-y-4">
//       <p className="text-sm text-gray-500">
//         {items.length === 0
//           ? 'Aucune dépense en attente de validation.'
//           : `${items.length} dépense${items.length > 1 ? 's' : ''} en attente`}
//       </p>

//       {items.length === 0 && (
//         <div className="card flex flex-col items-center py-16 gap-3">
//           <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
//             <CheckCircle size={24} className="text-emerald-500" />
//           </div>
//           <p className="text-sm font-medium text-gray-700">Tout est à jour !</p>
//           <p className="text-xs text-gray-400">Aucune dépense en attente de validation.</p>
//         </div>
//       )}

//       <div className="space-y-3">
//         {items.map(exp => (
//           <div key={exp.id} className="card p-4">
//             <div className="flex items-start gap-4">
//               <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
//                 {initials(exp.user?.first_name, exp.user?.last_name)}
//               </div>

//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start justify-between gap-2">
//                   <div>
//                     <p className="text-sm font-semibold text-gray-800">{exp.title}</p>
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       {exp.user?.first_name} {exp.user?.last_name}
//                       {exp.category && <> · <span style={{ color: exp.category.color }}>{exp.category.name}</span></>}
//                       {' · '}{fmtDate(exp.expense_date)}
//                     </p>
//                   </div>
//                   <p className="text-base font-bold text-gray-900 shrink-0">{fmt(exp.amount)}</p>
//                 </div>

//                 {exp.description && (
//                   <p className="text-xs text-gray-500 mt-2 italic">"{exp.description}"</p>
//                 )}

//                 {exp.receipts?.length > 0 && (
//                   <p className="text-xs text-gray-400 mt-1">{exp.receipts.length} justificatif(s) joint(s)</p>
//                 )}

//                 {/* Reject form */}
//                 {rejectId === exp.id && (
//                   <div className="mt-3 space-y-2">
//                     <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
//                       className="input resize-none text-xs" rows={2}
//                       placeholder="Motif de refus (optionnel)…" />
//                     <div className="flex gap-2">
//                       <button onClick={() => reject(exp.id)} disabled={acting === exp.id}
//                         className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition">
//                         Confirmer le refus
//                       </button>
//                       <button onClick={() => { setRejectId(null); setRejectReason('') }}
//                         className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition">
//                         Annuler
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {rejectId !== exp.id && (
//                   <div className="flex items-center gap-2 mt-3">
//                     <button onClick={() => approve(exp.id)} disabled={!!acting}
//                       className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition disabled:opacity-50">
//                       <CheckCircle size={13} />
//                       {acting === exp.id ? 'En cours…' : 'Approuver'}
//                     </button>
//                     <button onClick={() => setRejectId(exp.id)} disabled={!!acting}
//                       className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition disabled:opacity-50">
//                       <XCircle size={13} /> Refuser
//                     </button>
//                     <Link to={`/expenses/${exp.id}`}
//                       className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
//                       Détail <ChevronRight size={12} />
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, ChevronRight, Paperclip } from 'lucide-react'
import { useGlobalStore } from '../store/GlobalStore'
import Spinner from '../components/Spinner'
import { fmt, fmtDate, initials } from '../lib/helpers'

export default function ValidationPage() {
  const { state, actions } = useGlobalStore()
  const [acting, setActing]             = useState(null)
  const [rejectId, setRejectId]         = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  // Pending expenses — normalised to UI shape
  const items = useMemo(() =>
    state.expenses
      .filter(e => e.status === 'pending')
      .map(e => ({
        ...e,
        expense_date: e.expense_date ?? e.date,
        category: e.category && typeof e.category === 'object'
          ? e.category
          : e.category ? { name: e.category, color: e.category_color ?? 'var(--silver)' } : null,
        user: e.user ?? {
          first_name: (e.employee_name ?? '').split(' ')[0],
          last_name:  (e.employee_name ?? '').split(' ').slice(1).join(' '),
        },
      })),
    [state.expenses]
  )

  const approve = (id) => {
    const exp = items.find(e => e.id === id)
    if (!exp) return
    setActing(id)
    actions.approveExpense(exp, 'Manager')
    setActing(null)
  }

  const reject = (id) => {
    const exp = items.find(e => e.id === id)
    if (!exp) return
    setActing(id)
    actions.rejectExpense(exp, rejectReason || 'Refusé')
    setRejectId(null)
    setRejectReason('')
    setActing(null)
  }

  if (state.loading) return <Spinner />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Count header */}
      <div className="animate-fade-up">
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>
          {items.length === 0
            ? 'Aucune dépense en attente'
            : `${items.length} dépense${items.length > 1 ? 's' : ''} en attente de validation`}
        </p>
        {items.length > 0 && (
          <p style={{ fontSize: 12, color: 'var(--silver)', marginTop: 2 }}>
            Total : <strong style={{ color: 'var(--charcoal)' }}>{fmt(items.reduce((s, e) => s + e.amount, 0))}</strong>
          </p>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="card-static animate-fade-up stagger-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={22} style={{ color: 'var(--success)' }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--charcoal)' }}>Tout est à jour !</p>
          <p style={{ fontSize: 13, color: 'var(--silver)' }}>Aucune dépense en attente de validation.</p>
        </div>
      )}

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((exp, i) => (
          <div
            key={exp.id}
            className={`card-static animate-fade-up stagger-${Math.min(i + 2, 7)}`}
            style={{ padding: '20px 22px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                {initials(exp.user?.first_name, exp.user?.last_name)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{exp.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {exp.user?.first_name} {exp.user?.last_name}
                      </span>
                      {exp.category && (
                        <>
                          <span style={{ color: 'var(--champagne)' }}>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                            <span style={{ width: 6, height: 6, borderRadius: 2, background: exp.category.color }} />
                            <span style={{ color: 'var(--slate)' }}>{exp.category.name}</span>
                          </span>
                        </>
                      )}
                      <span style={{ color: 'var(--champagne)' }}>·</span>
                      <span style={{ fontSize: 12, color: 'var(--silver)' }}>{fmtDate(exp.expense_date)}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', flexShrink: 0, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(exp.amount)}
                  </span>
                </div>

                {/* Description */}
                {exp.description && (
                  <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--cream)', borderRadius: 8, borderLeft: '2px solid var(--champagne)' }}>
                    <p style={{ fontSize: 12.5, color: 'var(--slate)', lineHeight: 1.5, fontStyle: 'italic' }}>
                      "{exp.description}"
                    </p>
                  </div>
                )}

                {/* Receipts */}
                {exp.receipts?.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12, fontSize: 11.5, color: 'var(--silver)' }}>
                    <Paperclip size={11} />
                    {exp.receipts.length} justificatif{exp.receipts.length > 1 ? 's' : ''} joint{exp.receipts.length > 1 ? 's' : ''}
                  </div>
                )}

                {/* Reject textarea */}
                {rejectId === exp.id && (
                  <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea
                      value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      rows={2} placeholder="Motif de refus (optionnel)…"
                      className="input-premium"
                      style={{ resize: 'none', height: 'auto', padding: '8px 12px', lineHeight: 1.55, fontSize: 13 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => reject(exp.id)} disabled={acting === exp.id} style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 34,
                        borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer',
                        background: 'var(--danger)', color: '#fff',
                        fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-sans)',
                        opacity: acting === exp.id ? .6 : 1,
                      }}>
                        Confirmer le refus
                      </button>
                      <button onClick={() => { setRejectId(null); setRejectReason('') }} className="btn-secondary" style={{ height: 34, fontSize: 12.5 }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {rejectId !== exp.id && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => approve(exp.id)} disabled={!!acting} style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 32,
                      borderRadius: 'var(--r-md)', border: '1px solid var(--success-mid)', cursor: 'pointer',
                      background: 'var(--success-bg)', color: 'var(--success)',
                      fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-sans)',
                      opacity: acting ? .5 : 1, transition: 'background .18s',
                    }}
                      onMouseEnter={e => { if (!acting) e.currentTarget.style.background = '#D6EEE6'; }}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--success-bg)'}
                    >
                      <CheckCircle size={13} />
                      {acting === exp.id ? 'En cours…' : 'Approuver'}
                    </button>

                    <button onClick={() => setRejectId(exp.id)} disabled={!!acting} style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 32,
                      borderRadius: 'var(--r-md)', border: '1px solid var(--danger-mid)', cursor: 'pointer',
                      background: 'var(--danger-bg)', color: 'var(--danger)',
                      fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-sans)',
                      opacity: acting ? .5 : 1, transition: 'background .18s',
                    }}
                      onMouseEnter={e => { if (!acting) e.currentTarget.style.background = '#EDD8D8'; }}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                    >
                      <XCircle size={13} /> Refuser
                    </button>

                    <Link to={`/app/expenses/${exp.id}`} style={{
                      marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 12, color: 'var(--silver)', textDecoration: 'none', transition: 'color .18s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
                    >
                      Voir le détail <ChevronRight size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}