// import { useState } from 'react'
// import { useToast } from '../contexts/ToastContext'
// import { MOCK_QUOTES, MOCK_INVOICES, MOCK_CUSTOMERS, MOCK_PRODUCTS, calcTotals } from '../lib/mockData'
// import Modal from '../components/Modal'
// import { Plus, Eye, FileText, ArrowRight, Trash2, Send, X } from 'lucide-react'
// import { fmt, fmtDate } from '../lib/helpers'

// const QUOTE_STATUS = {
//   draft:    { label: 'Brouillon',  cls: 'bg-gray-100 text-gray-500' },
//   sent:     { label: 'Envoyé',     cls: 'bg-blue-50 text-blue-700' },
//   accepted: { label: 'Accepté',   cls: 'bg-emerald-50 text-emerald-700' },
//   refused:  { label: 'Refusé',    cls: 'bg-red-50 text-red-600' },
//   expired:  { label: 'Expiré',    cls: 'bg-amber-50 text-amber-700' },
// }

// const INV_STATUS = {
//   draft:   { label: 'Brouillon',    cls: 'bg-gray-100 text-gray-500' },
//   sent:    { label: 'Envoyée',      cls: 'bg-blue-50 text-blue-700' },
//   paid:    { label: 'Payée',        cls: 'bg-emerald-50 text-emerald-700' },
//   overdue: { label: 'En retard',    cls: 'bg-red-50 text-red-600' },
//   partial: { label: 'Part. payée', cls: 'bg-amber-50 text-amber-700' },
// }

// function DocumentDetail({ doc, isInvoice }) {
//   if (!doc) return null
//   const customer = MOCK_CUSTOMERS.find(c => c.id === doc.customer_id)
//   const totals   = calcTotals(doc.items)
//   const status   = isInvoice ? INV_STATUS[doc.status] : QUOTE_STATUS[doc.status]

//   return (
//     <div className="space-y-4 text-sm">
//       {/* Header */}
//       <div className="flex items-start justify-between p-4 bg-indigo-50 rounded-xl">
//         <div>
//           <p className="text-xs text-indigo-600 font-medium mb-1">{doc.reference ?? doc.ref}</p>
//           <p className="font-semibold text-gray-900">{customer?.name}</p>
//           <p className="text-xs text-gray-500 mt-0.5">
//             Émis le {fmtDate(doc.date)}
//             {doc.valid_until && ` · Valable jusqu'au ${fmtDate(doc.valid_until)}`}
//             {doc.due_date    && ` · Échéance ${fmtDate(doc.due_date)}`}
//           </p>
//         </div>
//         <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status?.cls}`}>{status?.label}</span>
//       </div>

//       {/* Lignes */}
//       <table className="w-full text-xs">
//         <thead>
//           <tr className="border-b border-gray-100">
//             <th className="text-left py-2 text-gray-400 font-medium">Désignation</th>
//             <th className="text-right py-2 text-gray-400 font-medium">Qté</th>
//             <th className="text-right py-2 text-gray-400 font-medium">PU HT</th>
//             <th className="text-right py-2 text-gray-400 font-medium">Rem.</th>
//             <th className="text-right py-2 text-gray-400 font-medium">Total HT</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-50">
//           {doc.items.map((item, i) => {
//             const lineHT = item.qty * item.unit_price * (1 - (item.discount || 0) / 100)
//             return (
//               <tr key={i}>
//                 <td className="py-2 text-gray-700">{item.name}</td>
//                 <td className="py-2 text-right text-gray-600">{item.qty}</td>
//                 <td className="py-2 text-right text-gray-600">{fmt(item.unit_price)}</td>
//                 <td className="py-2 text-right text-gray-400">{item.discount ? `${item.discount}%` : '—'}</td>
//                 <td className="py-2 text-right font-medium text-gray-800">{fmt(lineHT)}</td>
//               </tr>
//             )
//           })}
//         </tbody>
//       </table>

//       {/* Totaux */}
//       <div className="border-t border-gray-100 pt-3 space-y-1.5">
//         <div className="flex justify-between text-gray-500">
//           <span>Sous-total HT</span><span className="font-medium text-gray-800">{fmt(totals.ht)}</span>
//         </div>
//         <div className="flex justify-between text-gray-500">
//           <span>TVA 20%</span><span>{fmt(totals.tva)}</span>
//         </div>
//         <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
//           <span>Total TTC</span><span>{fmt(totals.ttc)}</span>
//         </div>
//       </div>

//       {/* Mentions légales client */}
//       {customer?.ice && (
//         <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
//           <p className="font-medium text-gray-600">Client : {customer.name}</p>
//           {customer.ice    && <p>ICE : {customer.ice}</p>}
//           {customer.if_num && <p>IF : {customer.if_num}</p>}
//           {customer.rc     && <p>RC : {customer.rc}</p>}
//         </div>
//       )}
//     </div>
//   )
// }

// export default function QuotesPage() {
//   const toast = useToast()
//   const [tab, setTab] = useState('quotes')
//   const [quotes, setQuotes]     = useState(MOCK_QUOTES)
//   const [invoices, setInvoices] = useState(MOCK_INVOICES)
//   const [detailDoc, setDetailDoc] = useState(null)
//   const [detailIsInv, setDetailIsInv] = useState(false)

//   const openDetail = (doc, isInv) => { setDetailDoc(doc); setDetailIsInv(isInv) }

//   const convertToInvoice = (quote) => {
//     const newInv = {
//       id: Date.now(),
//       ref: `FAC-2025-00${invoices.length + 4}`,
//       customer_id: quote.customer_id,
//       quote_id: quote.id,
//       date: new Date().toISOString().slice(0, 10),
//       due_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
//       status: 'draft',
//       notes: `Facture suite devis ${quote.ref}`,
//       items: quote.items,
//     }
//     setInvoices(prev => [newInv, ...prev])
//     setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'accepted' } : q))
//     toast.success('Facture créée', `${newInv.ref} créée depuis ${quote.ref}.`)
//     setTab('invoices')
//   }

//   const markPaid = (inv) => {
//     setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'paid' } : i))
//     if (detailDoc?.id === inv.id) setDetailDoc({ ...inv, status: 'paid' })
//     toast.success('Payée', `${inv.ref} marquée comme payée.`)
//   }

//   const totalCA = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + calcTotals(i.items).ttc, 0)
//   const totalPending = invoices.filter(i => ['sent','draft'].includes(i.status)).reduce((s, i) => s + calcTotals(i.items).ttc, 0)
//   const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + calcTotals(i.items).ttc, 0)

//   return (
//     <div className="space-y-4">
//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="card p-4"><p className="text-xs text-gray-400 mb-1">CA encaissé</p><p className="text-2xl font-bold text-emerald-600">{fmt(totalCA)}</p></div>
//         <div className="card p-4"><p className="text-xs text-gray-400 mb-1">En attente paiement</p><p className="text-2xl font-bold text-amber-600">{fmt(totalPending)}</p></div>
//         <div className="card p-4"><p className="text-xs text-gray-400 mb-1">En retard</p><p className="text-2xl font-bold text-red-500">{fmt(totalOverdue)}</p></div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b border-gray-100">
//         {[{ key: 'quotes', label: `Devis (${quotes.length})` }, { key: 'invoices', label: `Factures (${invoices.length})` }].map(t => (
//           <button key={t.key} onClick={() => setTab(t.key)}
//             className={`px-5 py-2.5 text-sm border-b-2 transition-colors ${
//               tab === t.key ? 'border-indigo-600 text-indigo-700 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'
//             }`}>
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* Devis */}
//       {tab === 'quotes' && (
//         <div className="card overflow-hidden">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-50">
//                 {['Référence','Client','Date','Validité','Montant TTC','Statut',''].map(h => (
//                   <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {quotes.map(q => {
//                 const c = customers.find(x => x.id === q.customer_id)
//                 const t = calcTotals(q.items)
//                 const s = QUOTE_STATUS[q.status]
//                 return (
//                   <tr key={q.id} className="hover:bg-gray-50">
//                     <td className="px-5 py-3 text-sm font-medium text-indigo-600">{q.ref}</td>
//                     <td className="px-5 py-3 text-sm text-gray-700">{c?.name}</td>
//                     <td className="px-5 py-3 text-sm text-gray-400">{fmtDate(q.date)}</td>
//                     <td className="px-5 py-3 text-sm text-gray-400">{fmtDate(q.valid_until)}</td>
//                     <td className="px-5 py-3 text-sm font-semibold text-gray-800">{fmt(t.ttc)}</td>
//                     <td className="px-5 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span></td>
//                     <td className="px-5 py-3">
//                       <div className="flex gap-1 justify-end">
//                         <button onClick={() => openDetail(q, false)}
//                           className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
//                           <Eye size={13} />
//                         </button>
//                         {q.status !== 'accepted' && (
//                           <button onClick={() => convertToInvoice(q)} title="Convertir en facture"
//                             className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-600">
//                             <ArrowRight size={13} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Factures */}
//       {tab === 'invoices' && (
//         <div className="card overflow-hidden">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-50">
//                 {['Référence','Client','Date','Échéance','Montant TTC','Statut',''].map(h => (
//                   <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {invoices.map(inv => {
//                 const c = customers.find(x => x.id === inv.customer_id) ?? { name: inv.customer_name }
//                 const t = calcTotals(inv.items)
//                 const s = INV_STATUS[inv.status]
//                 return (
//                   <tr key={inv.id} className="hover:bg-gray-50">
//                     <td className="px-5 py-3 text-sm font-medium text-indigo-600">{inv.ref}</td>
//                     <td className="px-5 py-3 text-sm text-gray-700">{c?.name}</td>
//                     <td className="px-5 py-3 text-sm text-gray-400">{fmtDate(inv.date)}</td>
//                     <td className="px-5 py-3 text-sm text-gray-400">{fmtDate(inv.due_date)}</td>
//                     <td className="px-5 py-3 text-sm font-semibold text-gray-800">{fmt(t.ttc)}</td>
//                     <td className="px-5 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span></td>
//                     <td className="px-5 py-3">
//                       <div className="flex gap-1 justify-end">
//                         <button onClick={() => openDetail(inv, true)}
//                           className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
//                           <Eye size={13} />
//                         </button>
//                         {inv.status !== 'paid' && (
//                           <button onClick={() => markPaid(inv)} title="Marquer payée"
//                             className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-600">
//                             <FileText size={13} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Détail modal */}
//       <Modal open={!!detailDoc} onClose={() => setDetailDoc(null)}
//         title={detailDoc?.reference ?? detailDoc?.ref ?? ''} size="md">
//         <DocumentDetail doc={detailDoc} isInvoice={detailIsInv} customers={customers} />
//         {detailDoc && !detailIsInv && detailDoc.status !== 'accepted' && (
//           <div className="mt-4 pt-4 border-t border-gray-50">
//             <button onClick={() => { convertToInvoice(detailDoc); setDetailDoc(null) }}
//               className="btn-primary w-full">
//               <ArrowRight size={14} /> Convertir en facture
//             </button>
//           </div>
//         )}
//         {detailDoc && detailIsInv && detailDoc.status !== 'paid' && (
//           <div className="mt-4 pt-4 border-t border-gray-50">
//             <button onClick={() => markPaid(detailDoc)}
//               className="btn-primary w-full">
//               Marquer comme payée
//             </button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }
import { useState, useMemo } from 'react'
import { useToast } from '../contexts/ToastContext'
import { useGlobalStore } from '../store/GlobalStore'
import { calcTotals } from '../lib/mockData'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/ui/PageHeader'
import StatCard   from '../components/ui/StatCard'
import { Eye, FileText, ArrowRight, Receipt, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import { fmt, fmtDate } from '../lib/helpers'

function ActionBtn({ onClick, icon: Icon, title, success }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', transition: 'background .18s, color .18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = success ? 'var(--success-bg)' : 'var(--accent-light)'; e.currentTarget.style.color = success ? 'var(--success)' : 'var(--accent)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--silver)'; }}
    ><Icon size={13} /></button>
  )
}

function DocumentDetail({ doc, isInvoice, customers }) {
  if (!doc) return null
  const customer = customers?.find(c => c.id === doc.customer_id) ?? { name: doc.customer_name, ice: doc.customer_ice, if_num: doc.customer_if_num, rc: doc.customer_rc }
  const totals   = calcTotals(doc.items)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Header block */}
      <div style={{ padding: '16px 18px', background: 'var(--accent-light)', borderRadius: 12, border: '1px solid var(--accent-mid)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>{doc.reference ?? doc.ref}</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{customer?.name}</p>
          <p style={{ fontSize: 11.5, color: 'var(--accent-dim)' }}>
            Émis le {fmtDate(doc.date)}
            {doc.valid_until && ` · Valable jusqu'au ${fmtDate(doc.valid_until)}`}
            {doc.due_date    && ` · Échéance ${fmtDate(doc.due_date)}`}
          </p>
        </div>
        <StatusBadge status={doc.status} />
      </div>

      {/* Lines table */}
      <table className="premium-table" style={{ fontSize: 12.5 }}>
        <thead>
          <tr>
            <th>Désignation</th>
            <th style={{ textAlign: 'right' }}>Qté</th>
            <th style={{ textAlign: 'right' }}>PU HT</th>
            <th style={{ textAlign: 'right' }}>Rem.</th>
            <th style={{ textAlign: 'right' }}>Total HT</th>
          </tr>
        </thead>
        <tbody>
          {doc.items.map((item, i) => {
            const lineHT = item.qty * item.unit_price * (1 - (item.discount || 0) / 100)
            return (
              <tr key={i}>
                <td>{item.name}</td>
                <td style={{ textAlign: 'right' }}>{item.qty}</td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(item.unit_price)}</td>
                <td style={{ textAlign: 'right', color: 'var(--silver)' }}>{item.discount ? `${item.discount}%` : '—'}</td>
                <td style={{ textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(lineHT)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ borderTop: '1px solid var(--pearl)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Sous-total HT', value: fmt(totals.ht), bold: false },
          { label: 'TVA 20%',       value: fmt(totals.tva), bold: false },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}>
            <span>{r.label}</span><span style={{ color: 'var(--charcoal)' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600, color: 'var(--ink)', paddingTop: 10, borderTop: '1px solid var(--pearl)' }}>
          <span>Total TTC</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(totals.ttc)}</span>
        </div>
      </div>

      {/* Legal info */}
      {customer?.ice && (
        <div style={{ padding: '12px 14px', background: 'var(--cream)', borderRadius: 10, fontSize: 12 }}>
          <p style={{ fontWeight: 500, color: 'var(--charcoal)', marginBottom: 6 }}>Client : {customer.name}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', color: 'var(--muted)' }}>
            {customer.ice    && <span>ICE : <b style={{ color: 'var(--slate)' }}>{customer.ice}</b></span>}
            {customer.if_num && <span>IF : <b style={{ color: 'var(--slate)' }}>{customer.if_num}</b></span>}
            {customer.rc     && <span>RC : <b style={{ color: 'var(--slate)' }}>{customer.rc}</b></span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuotesPage() {
  const toast = useToast()
  const { state, selectors, actions } = useGlobalStore()
  const quotes   = state.quotes
  const invoices = state.invoices
  const customers = state.customers
  const [tab, setTab]           = useState('quotes')
  const [detailDoc, setDetailDoc] = useState(null)
  const [detailIsInv, setDetailIsInv] = useState(false)

  const openDetail = (doc, isInv) => { setDetailDoc(doc); setDetailIsInv(isInv) }

  const convertToInvoice = (quote) => {
    actions.convertQuote(quote)
    const ref = quote.reference ?? quote.ref
    toast.success('Facture créée', `Facture créée depuis ${ref}.`)
    setDetailDoc(null)
    setTab('invoices')
  }

  const markPaid = (inv) => {
    actions.payInvoice(inv, 'bank_transfer')
    if (detailDoc?.id === inv.id) setDetailDoc({ ...inv, status: 'paid' })
    const ref = inv.reference ?? inv.ref
    toast.success('Payée', `${ref} marquée comme payée.`)
  }

  const getDocTotal = (doc) => doc.total ?? (doc.items ? calcTotals(doc.items).ttc : 0)

  const totalCA      = useMemo(() => invoices.filter(i => i.status === 'paid').reduce((s, i) => s + getDocTotal(i), 0), [invoices])
  const totalPending = useMemo(() => invoices.filter(i => ['sent','draft'].includes(i.status)).reduce((s, i) => s + getDocTotal(i), 0), [invoices])
  const totalOverdue = useMemo(() => invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + getDocTotal(i), 0), [invoices])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <PageHeader
        title="Devis & Factures"
        subtitle="Gérez vos devis, convertissez-les en factures et suivez les paiements"
        icon={<Receipt size={18} />}
        badge={`${quotes.length} devis · ${invoices.length} factures`}
      />

      {/* KPI strip */}
      <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="CA encaissé"           value={fmt(totalCA)}      icon={<TrendingUp size={15} />}  color="success" delta="Factures payées" />
        <StatCard label="En attente paiement"   value={fmt(totalPending)} icon={<Clock size={15} />}       color="warn"    delta={`${invoices.filter(i => ['sent','draft'].includes(i.status)).length} facture(s)`} />
        <StatCard label="En retard"             value={fmt(totalOverdue)} icon={<AlertCircle size={15} />} color={totalOverdue > 0 ? 'danger' : 'accent'}
          delta={totalOverdue > 0 ? 'Action requise' : 'Aucun retard ✓'}
          trend={totalOverdue > 0 ? 'down' : undefined}
        />
        <StatCard label="Devis en cours"        value={quotes.filter(q => q.status === 'sent').length} icon={<FileText size={15} />} color="accent" delta="Envoyés, en attente réponse" />
      </div>

      {/* Tabs */}
      <div className="animate-fade-up stagger-2" style={{ display: 'flex', borderBottom: '1px solid var(--pearl)' }}>
        {[
          { key: 'quotes',   label: `Devis (${quotes.length})` },
          { key: 'invoices', label: `Factures (${invoices.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 20px', fontSize: 13, background: 'none', border: 'none',
            borderBottom: `2px solid ${tab === t.key ? 'var(--accent)' : 'transparent'}`,
            color: tab === t.key ? 'var(--accent)' : 'var(--muted)',
            fontWeight: tab === t.key ? 500 : 400,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
            transition: 'color .18s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Quotes table */}
      {tab === 'quotes' && (
        <div className="card-static animate-fade-up stagger-3">
          <table className="premium-table">
            <thead><tr>
              {['Référence','Client','Date','Validité','Montant TTC','Statut',''].map(h => <th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {quotes.map(q => {
                const c = customers.find(x => x.id === q.customer_id)
                const t = calcTotals(q.items)
                return (
                  <tr key={q.id}>
                    <td><span style={{ fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{q.reference ?? q.ref}</span></td>
                    <td style={{ fontWeight: 500 }}>{c?.name}</td>
                    <td style={{ color: 'var(--silver)' }}>{fmtDate(q.date)}</td>
                    <td style={{ color: 'var(--silver)' }}>{fmtDate(q.valid_until)}</td>
                    <td><span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(t.ttc)}</span></td>
                    <td><StatusBadge status={q.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <ActionBtn onClick={() => openDetail(q, false)} icon={Eye} title="Voir" />
                        {q.status !== 'accepted' && (
                          <ActionBtn onClick={() => convertToInvoice(q)} icon={ArrowRight} title="Convertir en facture" success />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoices table */}
      {tab === 'invoices' && (
        <div className="card-static animate-fade-up stagger-3">
          <table className="premium-table">
            <thead><tr>
              {['Référence','Client','Date','Échéance','Montant TTC','Statut',''].map(h => <th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {invoices.map(inv => {
                const c = customers.find(x => x.id === inv.customer_id) ?? { name: inv.customer_name }
                const t = calcTotals(inv.items)
                return (
                  <tr key={inv.id}>
                    <td><span style={{ fontWeight: 600, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>{inv.reference ?? inv.ref}</span></td>
                    <td style={{ fontWeight: 500 }}>{c?.name}</td>
                    <td style={{ color: 'var(--silver)' }}>{fmtDate(inv.date)}</td>
                    <td style={{ color: 'var(--silver)' }}>{fmtDate(inv.due_date)}</td>
                    <td><span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(t.ttc)}</span></td>
                    <td><StatusBadge status={inv.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <ActionBtn onClick={() => openDetail(inv, true)} icon={Eye} title="Voir" />
                        {inv.status !== 'paid' && (
                          <ActionBtn onClick={() => markPaid(inv)} icon={FileText} title="Marquer payée" success />
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!detailDoc} onClose={() => setDetailDoc(null)} title={detailDoc?.reference ?? detailDoc?.ref ?? ''} size="md">
        <DocumentDetail doc={detailDoc} isInvoice={detailIsInv} customers={customers} />
        {detailDoc && !detailIsInv && detailDoc.status !== 'accepted' && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ivory)' }}>
            <button className="btn-primary" onClick={() => { convertToInvoice(detailDoc); setDetailDoc(null) }} style={{ width: '100%', justifyContent: 'center' }}>
              <ArrowRight size={14} /> Convertir en facture
            </button>
          </div>
        )}
        {detailDoc && detailIsInv && detailDoc.status !== 'paid' && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ivory)' }}>
            <button className="btn-primary" onClick={() => markPaid(detailDoc)} style={{ width: '100%', justifyContent: 'center', background: 'var(--success)', boxShadow: '0 1px 4px rgba(61,122,95,.28)' }}>
              Marquer comme payée
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}