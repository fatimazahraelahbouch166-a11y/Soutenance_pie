// import { useState, useEffect } from 'react'
// import { useNavigate, Link } from 'react-router-dom'
// import { ArrowLeft, Upload, X, FileText } from 'lucide-react'
// import api from '../lib/api'

// export default function NewExpensePage() {
//   const navigate = useNavigate()
//   const [categories, setCategories] = useState([])
//   const [teams, setTeams]           = useState([])
//   const [errors, setErrors]         = useState({})
//   const [submitting, setSubmitting] = useState(false)
//   const [receipt, setReceipt]       = useState(null)
//   const [form, setForm] = useState({
//     title: '', amount: '', category_id: '', team_id: '',
//     expense_date: new Date().toISOString().slice(0, 10),
//     description: '', project: '',
//   })

//   useEffect(() => {
//     api.get('/categories').then(r => setCategories(r.data.data ?? r.data))
//     api.get('/teams').then(r => setTeams(r.data.data ?? r.data))
//   }, [])

//   const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })) }

//   const handleFile = e => {
//     const file = e.target.files[0]
//     if (file) setReceipt(file)
//   }

//   const handleSubmit = async (asDraft = false) => {
//     setSubmitting(true); setErrors({})
//     try {
//       const fd = new FormData()
//       Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
//       fd.append('submit', asDraft ? '0' : '1')
//       if (receipt) fd.append('receipt', receipt)
//       await api.post('/expenses', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
//       navigate('/app/expenses')
//     } catch (e) {
//       if (e.response?.status === 422) setErrors(e.response.data.errors ?? {})
//     } finally { setSubmitting(false) }
//   }

//   const Field = ({ label, name, type = 'text', placeholder = '', required = false, className = '' }) => (
//     <div className={`flex flex-col gap-1 ${className}`}>
//       <label className="field-label">{label}{required && ' *'}</label>
//       <input type={type} placeholder={placeholder} value={form[name]}
//         onChange={e => set(name, e.target.value)}
//         className={`input ${errors[name] ? 'input-error' : ''}`} />
//       {errors[name] && <p className="text-xs text-red-500">{errors[name][0]}</p>}
//     </div>
//   )

//   return (
//     <div className="max-w-2xl mx-auto space-y-4">
//       <Link to="/expenses" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
//         <ArrowLeft size={14} /> Retour aux dépenses
//       </Link>

//       <div className="card p-6">
//         <h2 className="text-sm font-semibold text-gray-800 mb-5">Informations de la dépense</h2>

//         <div className="grid grid-cols-2 gap-4">
//           <Field label="Titre" name="title" placeholder="Ex : Vol Casablanca–Paris" required />
//           <Field label="Montant (MAD)" name="amount" type="number" placeholder="0.00" required />

//           <div className="flex flex-col gap-1">
//             <label className="field-label">Catégorie *</label>
//             <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
//               className={`input ${errors.category_id ? 'input-error' : ''}`}>
//               <option value="">Choisir…</option>
//               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//             </select>
//             {errors.category_id && <p className="text-xs text-red-500">{errors.category_id[0]}</p>}
//           </div>

//           <Field label="Date" name="expense_date" type="date" required />

//           <div className="flex flex-col gap-1">
//             <label className="field-label">Équipe / Département</label>
//             <select value={form.team_id} onChange={e => set('team_id', e.target.value)} className="input">
//               <option value="">Mon équipe</option>
//               {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//             </select>
//           </div>

//           <Field label="Projet / Centre de coût" name="project" placeholder="Ex : Projet Atlas" />

//           <div className="col-span-2 flex flex-col gap-1">
//             <label className="field-label">Description / Notes</label>
//             <textarea value={form.description} onChange={e => set('description', e.target.value)}
//               rows={3} className="input resize-none" placeholder="Détails supplémentaires…" />
//           </div>

//           {/* Upload */}
//           <div className="col-span-2 flex flex-col gap-1">
//             <label className="field-label">Justificatif (facture, reçu…)</label>
//             {receipt ? (
//               <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
//                 <FileText size={18} className="text-indigo-500 shrink-0" />
//                 <span className="flex-1 text-sm text-indigo-700 truncate">{receipt.name}</span>
//                 <button onClick={() => setReceipt(null)} className="text-indigo-400 hover:text-indigo-600">
//                   <X size={16} />
//                 </button>
//               </div>
//             ) : (
//               <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition group">
//                 <Upload size={22} className="mx-auto text-gray-300 group-hover:text-indigo-400 mb-2 transition" />
//                 <p className="text-sm text-gray-400">Glissez votre fichier ici ou <span className="text-indigo-500">parcourir</span></p>
//                 <p className="text-xs text-gray-300 mt-1">PDF, JPG, PNG — max 10 Mo</p>
//                 <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
//               </label>
//             )}
//           </div>
//         </div>

//         <div className="flex gap-3 mt-6 pt-5 border-t border-gray-50">
//           <button onClick={() => handleSubmit(true)} disabled={submitting} className="btn-secondary">
//             Enregistrer brouillon
//           </button>
//           <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn-primary flex-1">
//             {submitting
//               ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Envoi…</>
//               : 'Soumettre pour validation'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Upload, X, FileText } from 'lucide-react'
import api from '../lib/api'

function FormField({ label, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '0.02em' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11.5, color: 'var(--danger)', marginTop: 2 }}>{error}</p>}
    </div>
  )
}

export default function NewExpensePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [teams, setTeams]           = useState([])
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [receipt, setReceipt]       = useState(null)
  const [dragOver, setDragOver]     = useState(false)
  const [form, setForm] = useState({
    title: '', amount: '', category_id: '', team_id: '',
    expense_date: new Date().toISOString().slice(0, 10),
    description: '', project: '',
  })

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data ?? r.data))
    api.get('/teams').then(r => setTeams(r.data.data ?? r.data))
  }, [])

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }))
  }

  const handleFile = (file) => { if (file) setReceipt(file) }

  const handleSubmit = async (asDraft = false) => {
    setSubmitting(true); setErrors({})
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      fd.append('submit', asDraft ? '0' : '1')
      if (receipt) fd.append('receipt', receipt)
      await api.post('/expenses', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/app/expenses')
    } catch (e) {
      if (e.response?.status === 422) setErrors(e.response.data.errors ?? {})
    } finally { setSubmitting(false) }
  }

  const inputStyle = (hasError) => ({
    ...(hasError ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 3px rgba(138,58,58,0.10)' } : {}),
  })

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Back */}
      <Link to="/app/expenses" className="animate-fade-in" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12.5, color: 'var(--silver)', textDecoration: 'none', transition: 'color 0.18s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--charcoal)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
      >
        <ArrowLeft size={13} /> Retour aux dépenses
      </Link>

      {/* Form card */}
      <div className="card-static animate-fade-up" style={{ padding: '28px 30px' }}>

        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 24 }}>
          Informations de la dépense
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Title */}
          <FormField label="Titre" required error={errors.title?.[0]}>
            <input className="input-premium" placeholder="Ex : Vol Casablanca–Paris"
              value={form.title} onChange={e => set('title', e.target.value)}
              style={inputStyle(errors.title)} autoFocus />
          </FormField>

          {/* Amount */}
          <FormField label="Montant (MAD)" required error={errors.amount?.[0]}>
            <input className="input-premium" type="number" placeholder="0.00"
              value={form.amount} onChange={e => set('amount', e.target.value)}
              style={inputStyle(errors.amount)} />
          </FormField>

          {/* Category */}
          <FormField label="Catégorie" required error={errors.category_id?.[0]}>
            <select className="input-premium" value={form.category_id}
              onChange={e => set('category_id', e.target.value)}
              style={inputStyle(errors.category_id)}>
              <option value="">Choisir une catégorie…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>

          {/* Date */}
          <FormField label="Date" required error={errors.expense_date?.[0]}>
            <input className="input-premium" type="date"
              value={form.expense_date} onChange={e => set('expense_date', e.target.value)} />
          </FormField>

          {/* Team */}
          <FormField label="Équipe / Département">
            <select className="input-premium" value={form.team_id} onChange={e => set('team_id', e.target.value)}>
              <option value="">Mon équipe par défaut</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>

          {/* Project */}
          <FormField label="Projet / Centre de coût">
            <input className="input-premium" placeholder="Ex : Projet Atlas"
              value={form.project} onChange={e => set('project', e.target.value)} />
          </FormField>

          {/* Description */}
          <div style={{ gridColumn: '1/-1' }}>
            <FormField label="Description / Notes">
              <textarea
                value={form.description} onChange={e => set('description', e.target.value)}
                rows={3} placeholder="Détails supplémentaires…"
                className="input-premium"
                style={{ resize: 'none', height: 'auto', padding: '10px 12px', lineHeight: 1.65 }}
              />
            </FormField>
          </div>

          {/* Receipt upload */}
          <div style={{ gridColumn: '1/-1' }}>
            <FormField label="Justificatif (facture, reçu…)">
              {receipt ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 'var(--r-md)',
                  background: 'var(--accent-light)', border: '1px solid var(--accent-mid)',
                }}>
                  <FileText size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {receipt.name}
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--accent-dim)' }}>
                    {(receipt.size / 1024).toFixed(0)} Ko
                  </span>
                  <button onClick={() => setReceipt(null)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--accent-dim)', transition: 'color 0.18s', padding: 2,
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--accent-dim)'}
                  ><X size={15} /></button>
                </div>
              ) : (
                <label
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 8, padding: '32px 24px',
                    border: `2px dashed ${dragOver ? 'var(--accent-mid)' : 'var(--champagne)'}`,
                    borderRadius: 'var(--r-md)', cursor: 'pointer',
                    background: dragOver ? 'var(--accent-light)' : 'transparent',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-mid)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
                  onMouseLeave={e => { if (!dragOver) { e.currentTarget.style.borderColor = 'var(--champagne)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={16} style={{ color: 'var(--silver)' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--slate)' }}>
                      Glissez votre fichier ici ou{' '}
                      <span style={{ color: 'var(--accent)', fontWeight: 500 }}>parcourir</span>
                    </p>
                    <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 3 }}>PDF, JPG, PNG — max 10 Mo</p>
                  </div>
                  <input type="file" style={{ display: 'none' }} accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => handleFile(e.target.files[0])} />
                </label>
              )}
            </FormField>
          </div>
        </div>

        {/* Submit row */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, paddingTop: 22, borderTop: '1px solid var(--ivory)' }}>
          <button onClick={() => handleSubmit(true)} disabled={submitting} className="btn-secondary">
            Brouillon
          </button>
          <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            {submitting
              ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Envoi…</>
              : 'Soumettre pour validation'}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}