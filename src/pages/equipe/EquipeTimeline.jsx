// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { CheckCircle2, Clock3, XCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react'
// import { fmt, fmtDate } from '../../lib/helpers'

// const STEPS = [
//   { key: 'submitted', label: 'Soumise',              color: 'bg-indigo-500' },
//   { key: 'pending',   label: 'En cours de révision', color: 'bg-amber-400' },
//   { key: 'approved',  label: 'Approuvée',            color: 'bg-emerald-500' },
//   { key: 'processing',label: 'Remboursement lancé',  color: 'bg-blue-500' },
//   { key: 'paid',      label: 'Remboursée',           color: 'bg-purple-500' },
// ]

// function getStep(status) {
//   if (status === 'draft')    return -1
//   if (status === 'pending')  return 1
//   if (status === 'approved') return 2
//   if (status === 'paid')     return 4
//   if (status === 'rejected') return -2
//   return 0
// }

// function getStepDate(expense, stepIdx) {
//   if (stepIdx === 0) return expense.expense_date
//   if (stepIdx <= 1)  return expense.expense_date
//   if (stepIdx === 2) return expense.approved_at ?? null
//   if (stepIdx === 4) return expense.reimbursement?.paid_at ?? null
//   return null
// }

// const STATUS_LABEL = {
//   draft:    { text: 'Brouillon',  bg: 'bg-gray-100',    color: 'text-gray-500' },
//   pending:  { text: 'En attente', bg: 'bg-amber-50',    color: 'text-amber-700' },
//   approved: { text: 'Approuvée',  bg: 'bg-emerald-50',  color: 'text-emerald-700' },
//   rejected: { text: 'Refusée',    bg: 'bg-red-50',      color: 'text-red-600' },
//   paid:     { text: 'Payée',      bg: 'bg-indigo-50',   color: 'text-indigo-700' },
// }
//  function EquipeTimeline({ expense = [] }){
//   const [open, setOpen] = useState(false)
//   const currentStep = getStep(expense.status)
//   const rejected    = expense.status === 'rejected'
//   const s = STATUS_LABEL[expense.status] ?? STATUS_LABEL.draft

//   return (
//     <div className="card overflow-hidden">
//       {/* Header */}
//       <button onClick={() => setOpen(v => !v)}
//         className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left">
//         <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
//           {expense.status === 'paid'     ? <CheckCircle2 size={16} className={s.color} /> :
//            expense.status === 'rejected' ? <XCircle size={16} className={s.color} /> :
//            expense.status === 'approved' ? <CheckCircle2 size={16} className={s.color} /> :
//                                            <Clock3 size={16} className={s.color} />}
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-semibold text-gray-800 truncate">{expense.title}</p>
//           <p className="text-xs text-gray-400">{fmtDate(expense.expense_date)} · {expense.category?.name}</p>
//         </div>
//         <div className="text-right shrink-0 mr-2">
//           <p className="text-sm font-bold text-gray-900 tabular-nums">{fmt(expense.amount)}</p>
//           <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.text}</span>
//         </div>
//         {open ? <ChevronUp size={15} className="text-gray-400 shrink-0" /> : <ChevronDown size={15} className="text-gray-400 shrink-0" />}
//       </button>

//       {/* Timeline steps */}
//       {open && (
//         <div className="px-4 pb-4 pt-1 border-t border-gray-50">
//           {rejected ? (
//             <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 mb-3">
//               <p className="font-medium mb-1">Dépense refusée</p>
//               {expense.rejection_reason && <p className="text-xs opacity-80">{expense.rejection_reason}</p>}
//             </div>
//           ) : (
//             <div className="relative mt-3">
//               {/* Ligne de progression */}
//               <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 z-0" />
//               <div className="absolute top-4 left-4 h-0.5 bg-indigo-400 z-0 transition-all"
//                 style={{ width: `${Math.min(currentStep / (STEPS.length - 1), 1) * 100}%` }} />

//               <div className="relative flex justify-between">
//                 {STEPS.map((step, i) => {
//                   const done    = i <= currentStep
//                   const current = i === currentStep
//                   return (
//                     <div key={step.key} className="flex flex-col items-center gap-1.5" style={{ flex: 1 }}>
//                       <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
//                         done
//                           ? `${step.color} border-transparent`
//                           : 'bg-white border-gray-200'
//                       } ${current ? 'ring-4 ring-indigo-100' : ''}`}>
//                         {done
//                           ? <CheckCircle2 size={14} className="text-white" />
//                           : <Circle size={10} className="text-gray-300" />}
//                       </div>
//                       <div className="text-center">
//                         <p className={`text-[10px] font-medium leading-tight ${done ? 'text-gray-700' : 'text-gray-300'}`}>
//                           {step.label}
//                         </p>
//                         {getStepDate(expense, i) && done && (
//                           <p className="text-[9px] text-gray-400 mt-0.5">{fmtDate(getStepDate(expense, i))}</p>
//                         )}
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Approver */}
//           {expense.approver && (
//             <p className="text-xs text-gray-400 mt-3">
//               {expense.status === 'approved' ? 'Approuvé' : 'Traité'} par <span className="font-medium text-gray-600">{expense.approver.first_name} {expense.approver.last_name}</span>
//             </p>
//           )}

//           <Link to={`/app/expenses/${expense.id}`}
//             className="mt-3 flex items-center gap-1 text-xs text-indigo-500 hover:underline">
//             Voir le détail →
//           </Link>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function EquipeTimeline({ expenses }) {
//   const [filter, setFilter] = useState('all')

//   const filtered = filter === 'all' ? expenses : expenses.filter(e => e.status === filter)

//   return (
//     <div className="space-y-4">
//       {/* Filtres */}
//       <div className="flex gap-2 flex-wrap">
//         {[
//           { key: 'all',      label: 'Toutes' },
//           { key: 'pending',  label: 'En attente' },
//           { key: 'approved', label: 'Approuvées' },
//           { key: 'rejected', label: 'Refusées' },
//           { key: 'paid',     label: 'Remboursées' },
//         ].map(f => (
//           <button key={f.key} onClick={() => setFilter(f.key)}
//             className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
//               filter === f.key
//                 ? 'bg-indigo-600 text-white'
//                 : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
//             }`}>
//             {f.label}
//             <span className="ml-1.5 opacity-70">
//               {f.key === 'all' ? expenses.length : expenses.filter(e => e.status === f.key).length}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Liste */}
//       {filtered.length === 0 ? (
//         <div className="card p-10 text-center text-gray-400 text-sm">Aucune dépense dans cette catégorie</div>
//       ) : (
//         <div className="space-y-2">
//           {filtered.map(e => <ExpenseTimeline key={e.id} expense={e} />)}
//         </div>
//       )}
//     </div>
//   )
// }
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock3,
  XCircle,
  Circle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

import { fmt, fmtDate } from '../../lib/helpers'

/* =======================
   CONFIG
======================= */

const STEPS = [
  { key: 'submitted', label: 'Soumise',              color: 'bg-indigo-500' },
  { key: 'pending',   label: 'En cours de révision', color: 'bg-amber-400' },
  { key: 'approved',  label: 'Approuvée',            color: 'bg-emerald-500' },
  { key: 'processing',label: 'Remboursement lancé',  color: 'bg-blue-500' },
  { key: 'paid',      label: 'Remboursée',           color: 'bg-purple-500' },
]

const STATUS_LABEL = {
  draft:    { text: 'Brouillon',  bg: 'bg-gray-100',   color: 'text-gray-500' },
  pending:  { text: 'En attente', bg: 'bg-amber-50',   color: 'text-amber-700' },
  approved: { text: 'Approuvée',  bg: 'bg-emerald-50', color: 'text-emerald-700' },
  rejected: { text: 'Refusée',    bg: 'bg-red-50',     color: 'text-red-600' },
  paid:     { text: 'Payée',      bg: 'bg-indigo-50',  color: 'text-indigo-700' },
}

/* =======================
   HELPERS
======================= */

function getStep(status) {
  if (status === 'draft') return -1
  if (status === 'pending') return 1
  if (status === 'approved') return 2
  if (status === 'paid') return 4
  if (status === 'rejected') return -2
  return 0
}

function getStepDate(expense, stepIdx) {
  if (stepIdx === 0) return expense.expense_date
  if (stepIdx <= 1) return expense.expense_date
  if (stepIdx === 2) return expense.approved_at ?? null
  if (stepIdx === 4) return expense.reimbursement?.paid_at ?? null
  return null
}

/* =======================
   COMPONENT 1
   (UNE DÉPENSE)
======================= */

function ExpenseTimeline({ expense }) {
  const [open, setOpen] = useState(false)

  const currentStep = getStep(expense.status)
  const rejected = expense.status === 'rejected'
  const status = STATUS_LABEL[expense.status] ?? STATUS_LABEL.draft

  return (
    <div className="card overflow-hidden">

      {/* HEADER */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${status.bg}`}>
          {expense.status === 'paid' ? (
            <CheckCircle2 size={16} className={status.color} />
          ) : expense.status === 'rejected' ? (
            <XCircle size={16} className={status.color} />
          ) : (
            <Clock3 size={16} className={status.color} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{expense.title}</p>
          <p className="text-xs text-gray-400">
            {fmtDate(expense.expense_date)} · {expense.category?.name}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold">{fmt(expense.amount)}</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
            {status.text}
          </span>
        </div>

        {open ? (
          <ChevronUp size={15} className="text-gray-400" />
        ) : (
          <ChevronDown size={15} className="text-gray-400" />
        )}
      </button>

      {/* CONTENT */}
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-50">

          {/* REJECTED */}
          {rejected ? (
            <div className="p-3 bg-red-50 rounded-xl text-sm text-red-700">
              <p className="font-medium mb-1">Dépense refusée</p>
              {expense.rejection_reason && (
                <p className="text-xs opacity-80">{expense.rejection_reason}</p>
              )}
            </div>
          ) : (
            /* TIMELINE */
            <div className="relative mt-4">

              <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-indigo-400 transition-all"
                style={{
                  width: `${Math.min(currentStep / (STEPS.length - 1), 1) * 100}%`
                }}
              />

              <div className="relative flex justify-between">
                {STEPS.map((step, i) => {
                  const done = i <= currentStep
                  const current = i === currentStep

                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1 gap-1.5">

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          done ? `${step.color} border-transparent` : 'bg-white border-gray-200'
                        } ${current ? 'ring-4 ring-indigo-100' : ''}`}
                      >
                        {done ? (
                          <CheckCircle2 size={14} className="text-white" />
                        ) : (
                          <Circle size={10} className="text-gray-300" />
                        )}
                      </div>

                      <p className={`text-[10px] text-center ${done ? 'text-gray-700' : 'text-gray-300'}`}>
                        {step.label}
                      </p>

                      {getStepDate(expense, i) && done && (
                        <p className="text-[9px] text-gray-400">
                          {fmtDate(getStepDate(expense, i))}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* APPROVER */}
          {expense.approver && (
            <p className="text-xs text-gray-400 mt-3">
              {expense.status === 'approved' ? 'Approuvé' : 'Traité'} par{' '}
              <span className="font-medium text-gray-600">
                {expense.approver.first_name} {expense.approver.last_name}
              </span>
            </p>
          )}

          <Link
            to={`/app/expenses/${expense.id}`}
            className="mt-3 inline-block text-xs text-indigo-500 hover:underline"
          >
            Voir le détail →
          </Link>
        </div>
      )}
    </div>
  )
}

/* =======================
   COMPONENT 2
   (LISTE + FILTRES)
======================= */

export default function EquipeTimeline({ expenses = [] }) {
  const [filter, setFilter] = useState('all')

  const filtered =
    filter === 'all'
      ? expenses
      : expenses.filter(e => e.status === filter)

  return (
    <div className="space-y-4">

      {/* FILTRES */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Toutes' },
          { key: 'pending', label: 'En attente' },
          { key: 'approved', label: 'Approuvées' },
          { key: 'rejected', label: 'Refusées' },
          { key: 'paid', label: 'Remboursées' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-xs border ${
              filter === f.key
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* LISTE */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-10 text-center text-gray-400 text-sm">
            Aucune dépense dans cette catégorie
          </div>
        ) : (
          filtered.map(e => (
            <ExpenseTimeline key={e.id} expense={e} />
          ))
        )}
      </div>
    </div>
  )
}