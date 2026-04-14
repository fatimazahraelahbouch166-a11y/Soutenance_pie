// import { useState } from 'react'
// import { useToast } from '../contexts/ToastContext'
// import { MOCK_CUSTOMERS, MOCK_INVOICES, calcTotals } from '../lib/mockData'
// import Modal from '../components/Modal'
// import ConfirmDialog from '../components/ConfirmDialog'
// import { Plus, Pencil, Trash2, Eye, Building2, User, Phone, Mail, MapPin, CreditCard, Search } from 'lucide-react'
// import { fmt } from '../lib/helpers'

// const TYPES = [
//   { value: 'enterprise', label: 'Entreprise' },
//   { value: 'individual', label: 'Particulier' },
//   { value: 'public',     label: 'Administration' },
// ]

// const TERMS = [0, 30, 60, 90]

// const EMPTY = {
//   name: '', type: 'enterprise', ice: '', if_num: '', rc: '', cnss: '',
//   email: '', phone: '', address: '', payment_terms: 30, credit_limit: 50000,
// }

// export default function CustomersPage() {
//   const toast = useToast()
//   const [customers, setCustomers] = useState(MOCK_CUSTOMERS)
//   const [search, setSearch]       = useState('')
//   const [modalOpen, setModalOpen] = useState(false)
//   const [detailId, setDetailId]   = useState(null)
//   const [deleteId, setDeleteId]   = useState(null)
//   const [editing, setEditing]     = useState(null)
//   const [form, setForm] = useState(EMPTY)
//   const [saving, setSaving] = useState(false)
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
//   const openEdit   = (c)  => { setEditing(c); setForm({ ...c }); setModalOpen(true) }

//   const handleSave = async () => {
//     if (!form.name.trim()) return toast.error('Erreur', 'Raison sociale requise.')
//     setSaving(true)
//     await new Promise(r => setTimeout(r, 500))
//     if (editing) {
//       setCustomers(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c))
//       toast.success('Client modifié', `"${form.name}" a été mis à jour.`)
//     } else {
//       setCustomers(prev => [...prev, { id: Date.now(), ...form, balance: 0 }])
//       toast.success('Client créé', `"${form.name}" a été ajouté.`)
//     }
//     setSaving(false); setModalOpen(false)
//   }

//   const handleDelete = () => {
//     const c = customers.find(x => x.id === deleteId)
//     setCustomers(prev => prev.filter(x => x.id !== deleteId))
//     setDeleteId(null)
//     toast.success('Supprimé', `"${c?.name}" a été supprimé.`)
//   }

//   const detail = customers.find(c => c.id === detailId)
//   const detailInvoices = MOCK_INVOICES.filter(i => i.customer_id === detailId)
//   const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

//   const totalCA = MOCK_INVOICES.reduce((s, inv) => {
//     const c = calcTotals(inv.items)
//     return s + c.ttc
//   }, 0)

//   return (
//     <div className="space-y-4">
//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="card p-4">
//           <p className="text-xs text-gray-400 mb-1">Total clients</p>
//           <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
//         </div>
//         <div className="card p-4">
//           <p className="text-xs text-gray-400 mb-1">CA total facturé</p>
//           <p className="text-2xl font-bold text-gray-900">{fmt(totalCA)}</p>
//         </div>
//         <div className="card p-4">
//           <p className="text-xs text-gray-400 mb-1">Encours total</p>
//           <p className="text-2xl font-bold text-gray-900">{fmt(customers.reduce((s, c) => s + c.balance, 0))}</p>
//         </div>
//       </div>

//       {/* Toolbar */}
//       <div className="flex items-center gap-3">
//         <div className="relative flex-1">
//           <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input className="input pl-9" placeholder="Rechercher un client…"
//             value={search} onChange={e => setSearch(e.target.value)} />
//         </div>
//         <button onClick={openCreate} className="btn-primary whitespace-nowrap">
//           <Plus size={14} /> Nouveau client
//         </button>
//       </div>

//       {/* Table */}
//       <div className="card overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-gray-50">
//               {['Client','Type','Contact','Conditions','Encours',''].map(h => (
//                 <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {filtered.map(c => (
//               <tr key={c.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-5 py-3">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
//                       {c.type === 'individual'
//                         ? <User size={14} className="text-indigo-600" />
//                         : <Building2 size={14} className="text-indigo-600" />}
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-800">{c.name}</p>
//                       {c.ice && <p className="text-xs text-gray-400">ICE: {c.ice}</p>}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-5 py-3">
//                   <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
//                     {TYPES.find(t => t.value === c.type)?.label}
//                   </span>
//                 </td>
//                 <td className="px-5 py-3">
//                   <p className="text-xs text-gray-600">{c.email}</p>
//                   <p className="text-xs text-gray-400">{c.phone}</p>
//                 </td>
//                 <td className="px-5 py-3 text-sm text-gray-600">
//                   {c.payment_terms === 0 ? 'Comptant' : `${c.payment_terms} jours`}
//                 </td>
//                 <td className="px-5 py-3">
//                   <span className={`text-sm font-semibold ${c.balance > 0 ? 'text-amber-600' : 'text-gray-800'}`}>
//                     {fmt(c.balance)}
//                   </span>
//                 </td>
//                 <td className="px-5 py-3">
//                   <div className="flex items-center gap-1 justify-end">
//                     <button onClick={() => setDetailId(c.id)}
//                       className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-indigo-50 hover:text-indigo-600">
//                       <Eye size={13} />
//                     </button>
//                     <button onClick={() => openEdit(c)}
//                       className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
//                       <Pencil size={13} />
//                     </button>
//                     <button onClick={() => setDeleteId(c.id)}
//                       className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
//                       <Trash2 size={13} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal créer / modifier */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}
//         title={editing ? 'Modifier le client' : 'Nouveau client'} size="lg">
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-2 flex flex-col gap-1">
//               <label className="field-label">Raison sociale / Nom *</label>
//               <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
//                 className="input" placeholder="Groupe Saham" autoFocus />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Type</label>
//               <select value={form.type} onChange={e => set('type', e.target.value)} className="input">
//                 {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
//               </select>
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Conditions paiement</label>
//               <select value={form.payment_terms} onChange={e => set('payment_terms', +e.target.value)} className="input">
//                 {TERMS.map(t => <option key={t} value={t}>{t === 0 ? 'Comptant' : `${t} jours`}</option>)}
//               </select>
//             </div>
//           </div>

//           {form.type !== 'individual' && (
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-1">
//                 <label className="field-label">ICE</label>
//                 <input type="text" value={form.ice} onChange={e => set('ice', e.target.value)}
//                   className="input" placeholder="002345678000056" />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label className="field-label">IF</label>
//                 <input type="text" value={form.if_num} onChange={e => set('if_num', e.target.value)}
//                   className="input" placeholder="12345678" />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label className="field-label">RC</label>
//                 <input type="text" value={form.rc} onChange={e => set('rc', e.target.value)}
//                   className="input" placeholder="123456 Casablanca" />
//               </div>
//               <div className="flex flex-col gap-1">
//                 <label className="field-label">CNSS</label>
//                 <input type="text" value={form.cnss} onChange={e => set('cnss', e.target.value)}
//                   className="input" placeholder="1234567" />
//               </div>
//             </div>
//           )}

//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Email</label>
//               <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
//                 className="input" placeholder="contact@entreprise.ma" />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Téléphone</label>
//               <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
//                 className="input" placeholder="+212 5 22 00 00 00" />
//             </div>
//             <div className="col-span-2 flex flex-col gap-1">
//               <label className="field-label">Adresse</label>
//               <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
//                 className="input" placeholder="Casablanca, Maroc" />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Plafond crédit (MAD)</label>
//               <input type="number" value={form.credit_limit} onChange={e => set('credit_limit', +e.target.value)}
//                 className="input" />
//             </div>
//           </div>

//           <div className="flex gap-3 pt-2">
//             <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Annuler</button>
//             <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
//               {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : editing ? 'Modifier' : 'Créer'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Detail modal */}
//       <Modal open={!!detailId} onClose={() => setDetailId(null)} title={detail?.name ?? ''} size="md">
//         {detail && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 { icon: Building2, label: 'Type',        value: TYPES.find(t => t.value === detail.type)?.label },
//                 { icon: CreditCard, label: 'Conditions', value: detail.payment_terms === 0 ? 'Comptant' : `${detail.payment_terms} jours` },
//                 { icon: Mail,  label: 'Email',    value: detail.email },
//                 { icon: Phone, label: 'Tél',      value: detail.phone },
//                 { icon: MapPin, label: 'Adresse', value: detail.address },
//                 { icon: CreditCard, label: 'Encours', value: fmt(detail.balance) },
//               ].map(({ icon: Icon, label, value }) => (
//                 <div key={label} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
//                   <Icon size={14} className="text-indigo-500 shrink-0 mt-0.5" />
//                   <div>
//                     <p className="text-xs text-gray-400">{label}</p>
//                     <p className="text-sm text-gray-800">{value || '—'}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {detail.type !== 'individual' && (detail.ice || detail.if_num) && (
//               <div className="p-3 bg-indigo-50 rounded-xl">
//                 <p className="text-xs font-medium text-indigo-700 mb-2">Informations légales</p>
//                 <div className="grid grid-cols-2 gap-2 text-xs">
//                   {detail.ice    && <div><span className="text-gray-400">ICE : </span>{detail.ice}</div>}
//                   {detail.if_num && <div><span className="text-gray-400">IF : </span>{detail.if_num}</div>}
//                   {detail.rc     && <div><span className="text-gray-400">RC : </span>{detail.rc}</div>}
//                   {detail.cnss   && <div><span className="text-gray-400">CNSS : </span>{detail.cnss}</div>}
//                 </div>
//               </div>
//             )}
//             {detailInvoices.length > 0 && (
//               <div>
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Dernières factures</p>
//                 <div className="space-y-2">
//                   {detailInvoices.map(inv => {
//                     const t = calcTotals(inv.items)
//                     return (
//                       <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
//                         <span className="font-medium text-gray-700">{inv.ref}</span>
//                         <span className="text-gray-400">{inv.date}</span>
//                         <span className="font-semibold text-gray-800">{fmt(t.ttc)}</span>
//                         <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
//                           inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
//                           inv.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
//                         }`}>{inv.status === 'paid' ? 'Payée' : inv.status === 'overdue' ? 'En retard' : 'Envoyée'}</span>
//                       </div>
//                     )
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>

//       <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
//         title="Supprimer le client" message="Ce client sera supprimé. Ses factures resteront dans le système."
//         confirmLabel="Supprimer" danger />
//     </div>
//   )
// }
import { useState, useMemo } from 'react'
import { useToast } from '../contexts/ToastContext'
import { useGlobalStore } from '../store/GlobalStore'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import PageHeader   from '../components/ui/PageHeader'
import StatCard     from '../components/ui/StatCard'
import SearchInput  from '../components/ui/SearchInput'
import { Plus, Pencil, Trash2, Eye, Building2, User, Phone, Mail, MapPin, CreditCard, Search, Users, TrendingUp, Wallet } from 'lucide-react'
import { fmt } from '../lib/helpers'

const TYPES  = [{ value: 'enterprise', label: 'Entreprise' }, { value: 'individual', label: 'Particulier' }, { value: 'public', label: 'Administration' }]
const TERMS  = [0, 30, 60, 90]
const EMPTY  = { name: '', type: 'enterprise', ice: '', if_num: '', rc: '', cnss: '', email: '', phone: '', address: '', payment_terms: 30, credit_limit: 50000 }

function ActionBtn({ onClick, icon: Icon, danger }) {
  return (
    <button onClick={onClick} style={{
      width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', transition: 'background 0.18s, color 0.18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = danger ? 'var(--danger-bg)' : 'var(--ivory)'; e.currentTarget.style.color = danger ? 'var(--danger)' : 'var(--charcoal)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--silver)'; }}
    ><Icon size={13} /></button>
  )
}

function FormField({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '0.02em' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export default function CustomersPage() {
  const toast = useToast()
  const { state, selectors, actions } = useGlobalStore()
  const customers = selectors.computedCustomers   // live-derived: balance, total_billed, etc.
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailId, setDetailId]   = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit   = (c) => { setEditing(c);  setForm({ name: c.name, type: c.type ?? 'enterprise', ice: c.ice ?? '', if_num: c.if_num ?? '', rc: c.rc ?? '', cnss: c.cnss ?? '', email: c.email ?? '', phone: c.phone ?? '', address: c.address ?? '', payment_terms: c.payment_terms ?? 30, credit_limit: c.credit_limit ?? 50000 }); setModalOpen(true) }

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Erreur', 'Raison sociale requise.')
    setSaving(true)
    if (editing) {
      actions.updateCustomer({ ...editing, ...form })
      toast.success('Client modifié', `"${form.name}" mis à jour.`)
    } else {
      actions.addCustomer({ ...form, balance: 0 })
      toast.success('Client créé', `"${form.name}" ajouté.`)
    }
    setSaving(false); setModalOpen(false)
  }

  const handleDelete = () => {
    const c = customers.find(x => x.id === deleteId)
    actions.deleteCustomer(deleteId)
    setDeleteId(null)
    toast.success('Supprimé', `"${c?.name}" supprimé.`)
  }

  const detail         = customers.find(c => c.id === detailId)
  const detailInvoices = state.invoices.filter(i => i.customer_id === detailId)
  const filtered       = useMemo(() =>
    customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [customers, search]
  )
  const totalCA      = customers.reduce((s, c) => s + (c.total_billed ?? 0), 0)
  const totalBalance = customers.reduce((s, c) => s + (c.balance ?? 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Page Header */}
      <PageHeader
        title="Clients"
        subtitle="Gérez votre portefeuille clients et le suivi facturation"
        icon={<Users size={18} />}
        badge={customers.length}
        actions={
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={14} /> Nouveau client
          </button>
        }
      />

      {/* KPI strip */}
      <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        <StatCard label="Total clients"    value={customers.length}     icon={<Users size={15} />}      color="accent" />
        <StatCard label="CA total facturé" value={fmt(totalCA)}         icon={<TrendingUp size={15} />} color="success" />
        <StatCard label="Encours total"    value={fmt(totalBalance)}    icon={<Wallet size={15} />}     color={totalBalance > 0 ? 'warn' : 'accent'}
          delta={totalBalance > 0 ? 'À encaisser' : 'Tout à jour ✓'} />
      </div>

      {/* Toolbar */}
      <div className="animate-fade-up stagger-2" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un client…" width={300} />
        <span style={{ fontSize: 12.5, color: 'var(--silver)', marginLeft: 4 }}>
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="card-static animate-fade-up stagger-3">
        <table className="premium-table">
          <thead>
            <tr>
              {['Client', 'Type', 'Contact', 'Conditions', 'Encours', ''].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {c.type === 'individual'
                        ? <User size={14} style={{ color: 'var(--accent)' }} />
                        : <Building2 size={14} style={{ color: 'var(--accent)' }} />}
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{c.name}</p>
                      {c.ice && <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 1 }}>ICE : {c.ice}</p>}
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: 11.5, padding: '3px 10px', borderRadius: 100, background: 'var(--pearl)', color: 'var(--slate)', fontWeight: 500 }}>
                    {TYPES.find(t => t.value === c.type)?.label}
                  </span>
                </td>
                <td>
                  <p style={{ fontSize: 12.5, color: 'var(--charcoal)' }}>{c.email || '—'}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 1 }}>{c.phone}</p>
                </td>
                <td style={{ color: 'var(--slate)' }}>
                  {c.payment_terms === 0 ? 'Comptant' : `${c.payment_terms} jours`}
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: c.balance > 0 ? 'var(--warn)' : 'var(--charcoal)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(c.balance)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                    <ActionBtn onClick={() => setDetailId(c.id)} icon={Eye} />
                    <ActionBtn onClick={() => openEdit(c)} icon={Pencil} />
                    <ActionBtn onClick={() => setDeleteId(c.id)} icon={Trash2} danger />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--silver)' }}>Aucun client trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le client' : 'Nouveau client'} size="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <FormField label="Raison sociale / Nom" required>
                <input className="input-premium" placeholder="Groupe Saham" value={form.name}
                  onChange={e => set('name', e.target.value)} autoFocus />
              </FormField>
            </div>
            <FormField label="Type">
              <select className="input-premium" value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </FormField>
            <FormField label="Conditions de paiement">
              <select className="input-premium" value={form.payment_terms} onChange={e => set('payment_terms', +e.target.value)}>
                {TERMS.map(t => <option key={t} value={t}>{t === 0 ? 'Comptant' : `${t} jours`}</option>)}
              </select>
            </FormField>
          </div>

          {form.type !== 'individual' && (
            <>
              <div style={{ height: 1, background: 'var(--ivory)' }} />
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--silver)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Informations légales</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[['ICE', 'ice', '002345678000056'], ['IF', 'if_num', '12345678'], ['RC', 'rc', '123456 Casablanca'], ['CNSS', 'cnss', '1234567']].map(([l, k, ph]) => (
                  <FormField key={k} label={l}><input className="input-premium" placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} /></FormField>
                ))}
              </div>
            </>
          )}

          <div style={{ height: 1, background: 'var(--ivory)' }} />
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--silver)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Contact</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Email"><input className="input-premium" type="email" placeholder="contact@entreprise.ma" value={form.email} onChange={e => set('email', e.target.value)} /></FormField>
            <FormField label="Téléphone"><input className="input-premium" type="tel" placeholder="+212 5 22 00 00 00" value={form.phone} onChange={e => set('phone', e.target.value)} /></FormField>
            <div style={{ gridColumn: '1/-1' }}>
              <FormField label="Adresse"><input className="input-premium" placeholder="Casablanca, Maroc" value={form.address} onChange={e => set('address', e.target.value)} /></FormField>
            </div>
            <FormField label="Plafond crédit (MAD)"><input className="input-premium" type="number" value={form.credit_limit} onChange={e => set('credit_limit', +e.target.value)} /></FormField>
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
              {saving ? <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> : editing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal open={!!detailId} onClose={() => setDetailId(null)} title={detail?.name ?? ''} size="md">
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: Building2, label: 'Type',       value: TYPES.find(t => t.value === detail.type)?.label },
                { icon: CreditCard, label: 'Conditions', value: detail.payment_terms === 0 ? 'Comptant' : `${detail.payment_terms} jours` },
                { icon: Mail,  label: 'Email',   value: detail.email },
                { icon: Phone, label: 'Tél',     value: detail.phone },
                { icon: MapPin, label: 'Adresse', value: detail.address },
                { icon: CreditCard, label: 'Encours', value: fmt(detail.balance) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'var(--cream)', borderRadius: 10 }}>
                  <Icon size={13} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 10.5, color: 'var(--silver)', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 13, color: 'var(--charcoal)' }}>{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>

            {detail.type !== 'individual' && (detail.ice || detail.if_num) && (
              <div style={{ padding: '14px 16px', background: 'var(--accent-light)', borderRadius: 10, border: '1px solid var(--accent-mid)' }}>
                <p style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--accent)', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Informations légales</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[['ICE', detail.ice], ['IF', detail.if_num], ['RC', detail.rc], ['CNSS', detail.cnss]].filter(([, v]) => v).map(([l, v]) => (
                    <div key={l} style={{ fontSize: 12 }}>
                      <span style={{ color: 'var(--accent-dim)' }}>{l} : </span>
                      <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailInvoices.length > 0 && (
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--silver)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Dernières factures</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {detailInvoices.map(inv => {
                    const t = calcTotals(inv.items)
                    return (
                      <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--cream)', borderRadius: 10 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--charcoal)' }}>{inv.ref}</span>
                        <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>{inv.date}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--charcoal)', fontVariantNumeric: 'tabular-nums' }}>{fmt(t.ttc)}</span>
                        <StatusBadge status={inv.status} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Supprimer le client" message="Ce client sera supprimé définitivement. Ses factures resteront dans le système."
        confirmLabel="Supprimer" danger />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}