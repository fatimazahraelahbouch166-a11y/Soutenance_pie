// import { useEffect, useState } from 'react'
// import { useParams, Link, useNavigate } from 'react-router-dom'
// import { ArrowLeft, Paperclip, CheckCircle, XCircle, Trash2 } from 'lucide-react'
// import api from '../lib/api'
// import StatusBadge from '../components/StatusBadge'
// import Spinner from '../components/Spinner'
// import { fmt, fmtDate, initials } from '../lib/helpers'
// import { useAuth } from '../contexts/AuthContext'

// export default function ExpenseDetailPage() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { user } = useAuth()
//   const [expense, setExpense]   = useState(null)
//   const [loading, setLoading]   = useState(true)
//   const [acting, setActing]     = useState(false)
//   const [rejectReason, setRejectReason] = useState('')
//   const [showReject, setShowReject]     = useState(false)

//   useEffect(() => {
//     api.get(`/expenses/${id}`).then(r => setExpense(r.data)).finally(() => setLoading(false))
//   }, [id])

//   const action = async (type) => {
//     setActing(true)
//     try {
//       const payload = type === 'reject' ? { reason: rejectReason } : {}
//       const res = await api.post(`/expenses/${id}/${type}`, payload)
//       setExpense(res.data)
//       setShowReject(false)
//     } finally { setActing(false) }
//   }

//   const handleDelete = async () => {
//     if (!window.confirm('Supprimer cette dépense ?')) return
//     await api.delete(`/expenses/${id}`)
//     navigate('/app/expenses')
//   }

//   if (loading) return <Spinner />
//   if (!expense) return <p className="text-sm text-gray-400">Dépense introuvable.</p>

//   const canApprove = ['admin','manager'].includes(user?.role) && expense.status === 'pending'
//   const canDelete  = expense.status === 'draft' && expense.user_id === user?.id

//   return (
//     <div className="max-w-2xl mx-auto space-y-4">
//       <Link to="/expenses" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
//         <ArrowLeft size={14} /> Retour
//       </Link>

//       <div className="card p-6">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-6">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">{expense.title}</h2>
//             <p className="text-sm text-gray-400 mt-0.5">#{expense.id} · soumis le {fmtDate(expense.created_at)}</p>
//           </div>
//           <StatusBadge status={expense.status} />
//         </div>

//         {/* Info grid */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           {[
//             { label: 'Montant', value: <span className="text-lg font-bold text-gray-900">{fmt(expense.amount)}</span> },
//             { label: 'Date',    value: fmtDate(expense.expense_date) },
//             { label: 'Catégorie', value: (
//               <span className="flex items-center gap-1.5">
//                 <span className="w-2 h-2 rounded-full" style={{ background: expense.category?.color ?? '#d1d5db' }} />
//                 {expense.category?.name ?? '—'}
//               </span>
//             )},
//             { label: 'Équipe', value: expense.team?.name ?? '—' },
//             { label: 'Projet', value: expense.project || '—' },
//             { label: 'Soumis par', value: (
//               <span className="flex items-center gap-2">
//                 <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
//                   {initials(expense.user?.first_name, expense.user?.last_name)}
//                 </span>
//                 {expense.user?.first_name} {expense.user?.last_name}
//               </span>
//             )},
//           ].map(({ label, value }) => (
//             <div key={label}>
//               <p className="text-xs text-gray-400 mb-0.5">{label}</p>
//               <div className="text-sm text-gray-800">{value}</div>
//             </div>
//           ))}
//         </div>

//         {expense.description && (
//           <div className="mb-6 p-3 bg-gray-50 rounded-xl">
//             <p className="text-xs text-gray-400 mb-1">Description</p>
//             <p className="text-sm text-gray-700">{expense.description}</p>
//           </div>
//         )}

//         {/* Rejection reason */}
//         {expense.status === 'rejected' && expense.rejection_reason && (
//           <div className="mb-6 p-3 bg-red-50 rounded-xl border border-red-100">
//             <p className="text-xs text-red-500 mb-1 font-medium">Motif de refus</p>
//             <p className="text-sm text-red-700">{expense.rejection_reason}</p>
//           </div>
//         )}

//         {/* Receipts */}
//         {expense.receipts?.length > 0 && (
//           <div className="mb-6">
//             <p className="text-xs text-gray-400 mb-2">Justificatifs ({expense.receipts.length})</p>
//             <div className="space-y-2">
//               {expense.receipts.map(r => (
//                 <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//                   <Paperclip size={14} className="text-gray-400 shrink-0" />
//                   <span className="text-sm text-gray-700 flex-1 truncate">{r.original_name}</span>
//                   <span className="text-xs text-gray-400">{(r.file_size / 1024).toFixed(0)} Ko</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Approver info */}
//         {expense.approver && (
//           <div className="mb-6 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
//             <p className="text-xs text-emerald-600 font-medium mb-0.5">
//               {expense.status === 'approved' ? 'Approuvée' : 'Traitée'} par {expense.approver.first_name} {expense.approver.last_name}
//             </p>
//             <p className="text-xs text-emerald-500">{fmtDate(expense.approved_at)}</p>
//           </div>
//         )}

//         {/* Actions */}
//         <div className="flex gap-3 pt-4 border-t border-gray-50">
//           {canApprove && !showReject && (
//             <>
//               <button onClick={() => action('approve')} disabled={acting}
//                 className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-xl hover:bg-emerald-100 transition">
//                 <CheckCircle size={14} /> Approuver
//               </button>
//               <button onClick={() => setShowReject(true)}
//                 className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition">
//                 <XCircle size={14} /> Refuser
//               </button>
//             </>
//           )}
//           {showReject && (
//             <div className="flex-1 space-y-2">
//               <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
//                 className="input resize-none" rows={2} placeholder="Motif de refus (optionnel)…" />
//               <div className="flex gap-2">
//                 <button onClick={() => action('reject')} disabled={acting}
//                   className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition">
//                   Confirmer le refus
//                 </button>
//                 <button onClick={() => setShowReject(false)} className="btn-secondary px-4 py-2 text-sm">Annuler</button>
//               </div>
//             </div>
//           )}
//           {canDelete && (
//             <button onClick={handleDelete}
//               className="ml-auto flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition">
//               <Trash2 size={14} /> Supprimer
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Paperclip, CheckCircle, XCircle, Trash2, CreditCard, BookOpen } from 'lucide-react'
import api from '../lib/api'
import StatusBadge from '../components/StatusBadge'
import Spinner from '../components/Spinner'
import { fmt, fmtDate, initials } from '../lib/helpers'
import { useAuth } from '../contexts/AuthContext'
import { useGlobalStore } from '../store/GlobalStore'
import WorkflowActions, { BudgetLink } from '../components/WorkflowActions'

export default function ExpenseDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const { state }  = useGlobalStore()

  const [expense, setExpense]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [acting, setActing]           = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject]   = useState(false)

  useEffect(() => {
    api.get(`/expenses/${id}`).then(r => setExpense(r.data)).finally(() => setLoading(false))
  }, [id])

  // ── Cross-module lookups from GlobalStore ──
  const numId        = parseInt(id, 10)
  const expenseState = state.expenses.find(e => e.id === numId)
  const reimbursement = expenseState?.reimbursement_id != null
    ? state.reimbursements.find(r => r.id === expenseState.reimbursement_id)
    : state.reimbursements.find(r => r.expense_id === numId)
  const budget        = expenseState?.budget_id != null
    ? state.budgets.find(b => b.id === expenseState.budget_id)
    : null
  const accEntries    = state.accountingEntries.filter(
    e => e.source_module === 'expense' && e.source_id === numId
  )

  const action = async (type) => {
    setActing(true)
    try {
      const payload = type === 'reject' ? { reason: rejectReason } : {}
      const res = await api.post(`/expenses/${id}/${type}`, payload)
      setExpense(res.data)
      setShowReject(false)
    } finally { setActing(false) }
  }

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cette dépense ?')) return
    await api.delete(`/expenses/${id}`)
    navigate('/app/expenses')
  }

  if (loading) return <Spinner />
  if (!expense) return (
    <p style={{ fontSize: 13, color: 'var(--silver)', padding: '48px 0', textAlign: 'center' }}>Dépense introuvable.</p>
  )

  const canApprove = ['admin','manager','chef_equipe','owner'].includes(user?.role) && expense.status === 'pending'
  const canDelete  = expense.status === 'draft' && expense.user_id === user?.id

  const InfoCell = ({ label, children }) => (
    <div>
      <p style={{ fontSize: 10.5, color: 'var(--silver)', marginBottom: 4 }}>{label}</p>
      <div style={{ fontSize: 13, color: 'var(--charcoal)' }}>{children}</div>
    </div>
  )

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Back link */}
      <Link to="/app/expenses" className="animate-fade-in" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12.5, color: 'var(--silver)', textDecoration: 'none',
        transition: 'color 0.18s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--charcoal)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
      >
        <ArrowLeft size={13} /> Retour aux dépenses
      </Link>

      {/* Main card */}
      <div className="card-static animate-fade-up" style={{ padding: '28px 30px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 26 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 4 }}>
              {expense.title}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--silver)' }}>
              #{expense.id} · soumis le {fmtDate(expense.created_at)}
            </p>
          </div>
          <StatusBadge status={expense.status} />
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24, padding: '20px 22px', background: 'var(--cream)', borderRadius: 12 }}>
          <InfoCell label="Montant">
            <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(expense.amount)}
            </span>
          </InfoCell>
          <InfoCell label="Date">{fmtDate(expense.expense_date)}</InfoCell>
          <InfoCell label="Catégorie">
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: expense.category?.color ?? 'var(--pearl)', flexShrink: 0 }} />
              {expense.category?.name ?? '—'}
            </span>
          </InfoCell>
          <InfoCell label="Équipe">{expense.team?.name ?? '—'}</InfoCell>
          <InfoCell label="Projet">{expense.project || '—'}</InfoCell>
          <InfoCell label="Soumis par">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {initials(expense.user?.first_name, expense.user?.last_name)}
              </span>
              {expense.user?.first_name} {expense.user?.last_name}
            </span>
          </InfoCell>
        </div>

        {/* Description */}
        {expense.description && (
          <div style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--cream)', borderRadius: 10, borderLeft: '2.5px solid var(--champagne)' }}>
            <p style={{ fontSize: 10.5, color: 'var(--silver)', marginBottom: 5 }}>Description</p>
            <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.65 }}>{expense.description}</p>
          </div>
        )}

        {/* Rejection reason */}
        {expense.status === 'rejected' && expense.rejection_reason && (
          <div style={{ marginBottom: 20, padding: '14px 16px', background: 'var(--danger-bg)', borderRadius: 10, borderLeft: '2.5px solid var(--danger)' }}>
            <p style={{ fontSize: 10.5, color: 'var(--danger)', marginBottom: 5, fontWeight: 600 }}>Motif de refus</p>
            <p style={{ fontSize: 13, color: 'var(--danger)', lineHeight: 1.65, opacity: 0.85 }}>{expense.rejection_reason}</p>
          </div>
        )}

        {/* Receipts */}
        {expense.receipts?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10.5, color: 'var(--silver)', marginBottom: 8, fontWeight: 500 }}>
              Justificatifs ({expense.receipts.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {expense.receipts.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--cream)', borderRadius: 10, border: '1px solid var(--pearl)' }}>
                  <Paperclip size={13} style={{ color: 'var(--silver)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.original_name}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>{(r.file_size / 1024).toFixed(0)} Ko</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approver */}
        {expense.approver && (
          <div style={{ marginBottom: 20, padding: '12px 16px', background: 'var(--success-bg)', borderRadius: 10, borderLeft: '2.5px solid var(--success)' }}>
            <p style={{ fontSize: 12.5, color: 'var(--success)', fontWeight: 500 }}>
              {expense.status === 'approved' ? 'Approuvée' : 'Traitée'} par {expense.approver.first_name} {expense.approver.last_name}
            </p>
            <p style={{ fontSize: 11.5, color: 'var(--success-mid)', marginTop: 2 }}>{fmtDate(expense.approved_at)}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 20, borderTop: '1px solid var(--ivory)', flexWrap: 'wrap' }}>
          {canApprove && !showReject && (
            <>
              <button onClick={() => action('approve')} disabled={acting} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0 16px', height: 36, borderRadius: 'var(--r-md)',
                background: 'var(--success-bg)', color: 'var(--success)',
                border: '1px solid var(--success-mid)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'background 0.18s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#D6EEE6'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--success-bg)'}
              >
                <CheckCircle size={14} /> Approuver
              </button>
              <button onClick={() => setShowReject(true)} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0 16px', height: 36, borderRadius: 'var(--r-md)',
                background: 'var(--danger-bg)', color: 'var(--danger)',
                border: '1px solid var(--danger-mid)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', transition: 'background 0.18s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#EDD8D8'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-bg)'}
              >
                <XCircle size={14} /> Refuser
              </button>
            </>
          )}

          {showReject && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <textarea
                value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                rows={2} placeholder="Motif de refus (optionnel)…"
                className="input-premium"
                style={{ resize: 'none', height: 'auto', padding: '10px 12px', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => action('reject')} disabled={acting} className="btn-primary"
                  style={{ background: 'var(--danger)', boxShadow: '0 1px 4px rgba(138,58,58,0.3)' }}>
                  Confirmer le refus
                </button>
                <button onClick={() => setShowReject(false)} className="btn-secondary">Annuler</button>
              </div>
            </div>
          )}

          {canDelete && (
            <button onClick={handleDelete} style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12.5, color: 'var(--silver)', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'color 0.18s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
            >
              <Trash2 size={13} /> Supprimer
            </button>
          )}
        </div>
      </div>

      {/* ── Cross-module related records ── */}
      {(reimbursement || budget || accEntries.length > 0) && (
        <WorkflowActions
          title="Éléments liés"
          items={[
            reimbursement && {
              type:   'reimbursement',
              ref:    reimbursement.reference,
              label:  reimbursement.expense_title ?? `Remboursement #${reimbursement.id}`,
              sub:    reimbursement.status === 'paid'
                        ? `Remboursé le ${fmtDate(reimbursement.reimbursement_date)}`
                        : reimbursement.status === 'approved'
                          ? 'Approuvé — en attente de paiement'
                          : reimbursement.status,
              to:     `/app/reimbursements/${reimbursement.id}`,
              amount: reimbursement.remaining_amount > 0
                        ? reimbursement.remaining_amount
                        : reimbursement.reimbursed_amount,
              badge:  reimbursement.status === 'paid' ? 'Remboursé' : reimbursement.status === 'approved' ? 'Approuvé' : undefined,
            },
            ...accEntries.map(entry => ({
              type:  'accounting',
              ref:   entry.reference,
              label: entry.description,
              sub:   `Débit ${entry.debit_account} / Crédit ${entry.credit_account}`,
              to:    '/app/accounting/journal',
              amount: entry.amount,
            })),
          ].filter(Boolean)}
          actions={[
            !reimbursement && expense?.status === 'approved' && {
              icon:    CreditCard,
              label:   'Demander un remboursement',
              color:   '#3D5A80',
              bg:      '#EBF0F7',
              onClick: () => navigate('/app/reimbursements'),
            },
            accEntries.length === 0 && expense?.status === 'approved' && {
              icon:    BookOpen,
              label:   'Voir le journal',
              color:   '#7C3AED',
              bg:      '#F3F0FF',
              onClick: () => navigate('/app/accounting/journal'),
            },
          ].filter(Boolean)}
        >
          {budget && <BudgetLink budget={budget} to="/app/budgets" />}
        </WorkflowActions>
      )}
    </div>
  )
}