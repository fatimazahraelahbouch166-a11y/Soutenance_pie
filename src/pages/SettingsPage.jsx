// import { useState } from 'react'
// import { useToast } from '../contexts/ToastContext'
// import { Building2, Mail, Phone, MapPin, Globe, DollarSign, Save } from 'lucide-react'

// const CURRENCIES = ['MAD', 'EUR', 'USD', 'GBP']
// const TIMEZONES  = [
//   'Africa/Casablanca',
//   'Europe/Paris',
//   'Europe/London',
//   'America/New_York',
// ]

// export default function SettingsPage() {
//   const toast = useToast()
//   const [saving, setSaving] = useState(false)
//   const [form, setForm] = useState({
//     name:      'TechMaroc SARL',
//     email:     'contact@techmaroc.ma',
//     phone:     '+212 5 22 00 00 00',
//     address:   'Casablanca, Maroc',
//     currency:  'MAD',
//     timezone:  'Africa/Casablanca',
//     ice:       '002345678000056',
//     if_num:    '12345678',
//     rc:        '123456 Casablanca',
//     cnss:      '1234567',
//   })

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   const handleSave = async () => {
//     setSaving(true)
//     await new Promise(r => setTimeout(r, 700))
//     setSaving(false)
//     toast.success('Paramètres enregistrés', 'Les informations de votre entreprise ont été mises à jour.')
//   }

//   const Field = ({ label, name, type = 'text', placeholder = '', icon: Icon }) => (
//     <div className="flex flex-col gap-1">
//       <label className="field-label">{label}</label>
//       <div className={Icon ? 'relative' : ''}>
//         {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
//         <input
//           type={type}
//           value={form[name]}
//           onChange={e => set(name, e.target.value)}
//           className={`input ${Icon ? 'pl-10' : ''}`}
//           placeholder={placeholder}
//         />
//       </div>
//     </div>
//   )

//   return (
//     <div className="max-w-2xl mx-auto space-y-5">

//       {/* Informations générales */}
//       <div className="card p-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-5 flex items-center gap-2">
//           <Building2 size={15} className="text-indigo-500" />
//           Informations de l'entreprise
//         </h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="col-span-2">
//             <Field label="Raison sociale *" name="name" placeholder="TechMaroc SARL" icon={Building2} />
//           </div>
//           <Field label="Email" name="email" type="email" placeholder="contact@entreprise.ma" icon={Mail} />
//           <Field label="Téléphone" name="phone" placeholder="+212 5 22 00 00 00" icon={Phone} />
//           <div className="col-span-2">
//             <Field label="Adresse" name="address" placeholder="Casablanca, Maroc" icon={MapPin} />
//           </div>
//         </div>
//       </div>

//       {/* Informations légales marocaines */}
//       <div className="card p-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
//           <Globe size={15} className="text-indigo-500" />
//           Informations légales (Maroc)
//         </h3>
//         <p className="text-xs text-gray-400 mb-5">Ces informations apparaîtront sur vos factures et devis.</p>
//         <div className="grid grid-cols-2 gap-4">
//           <Field label="ICE (Identifiant Commun de l'Entreprise)" name="ice" placeholder="002345678000056" />
//           <Field label="IF (Identifiant Fiscal)" name="if_num" placeholder="12345678" />
//           <Field label="RC (Registre de Commerce)" name="rc" placeholder="123456 Casablanca" />
//           <Field label="CNSS" name="cnss" placeholder="1234567" />
//         </div>
//       </div>

//       {/* Devise et fuseau horaire */}
//       <div className="card p-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-5 flex items-center gap-2">
//           <DollarSign size={15} className="text-indigo-500" />
//           Préférences régionales
//         </h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Devise</label>
//             <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input">
//               {CURRENCIES.map(c => <option key={c}>{c}</option>)}
//             </select>
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Fuseau horaire</label>
//             <select value={form.timezone} onChange={e => set('timezone', e.target.value)} className="input">
//               {TIMEZONES.map(t => <option key={t}>{t}</option>)}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Limites de dépenses */}
//       <div className="card p-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-1">Limites de dépenses</h3>
//         <p className="text-xs text-gray-400 mb-5">Définissez des plafonds au-delà desquels une approbation supplémentaire est requise.</p>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Validation Manager (MAD)</label>
//             <input type="number" defaultValue={5000} className="input" />
//             <p className="text-xs text-gray-400">Au-delà → Admin requis</p>
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Validation Admin (MAD)</label>
//             <input type="number" defaultValue={20000} className="input" />
//             <p className="text-xs text-gray-400">Au-delà → Directeur requis</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
//           {saving
//             ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enregistrement…</>
//             : <><Save size={14} />Enregistrer les paramètres</>}
//         </button>
//       </div>

//     </div>
//   )
// }
import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import { Building2, Mail, Phone, MapPin, Globe, DollarSign, Save } from 'lucide-react'

const CURRENCIES = ['MAD', 'EUR', 'USD', 'GBP']
const TIMEZONES  = ['Africa/Casablanca', 'Europe/Paris', 'Europe/London', 'America/New_York']

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="card-static animate-fade-up" style={{ padding: '24px 28px' }}>
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--ivory)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={13} style={{ color: 'var(--accent)' }} />
          </div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)' }}>{title}</p>
        </div>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--silver)', marginTop: 6, marginLeft: 36 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, name, type = 'text', placeholder = '', icon: Icon, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />}
        <input type={type} value={value} onChange={e => onChange(name, e.target.value)}
          className="input-premium" placeholder={placeholder}
          style={Icon ? { paddingLeft: 32 } : {}} />
      </div>
    </div>
  )
}

const Spinner = () => (
  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
)

export default function SettingsPage() {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: 'TechMaroc SARL', email: 'contact@techmaroc.ma',
    phone: '+212 5 22 00 00 00', address: 'Casablanca, Maroc',
    currency: 'MAD', timezone: 'Africa/Casablanca',
    ice: '002345678000056', if_num: '12345678',
    rc: '123456 Casablanca', cnss: '1234567',
    limit_manager: 5000, limit_admin: 20000,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    toast.success('Paramètres enregistrés', 'Les informations de votre entreprise ont été mises à jour.')
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Company info */}
      <SectionCard icon={Building2} title="Informations de l'entreprise">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <Field label="Raison sociale *" name="name" placeholder="TechMaroc SARL" icon={Building2} value={form.name} onChange={set} />
          </div>
          <Field label="Email" name="email" type="email" placeholder="contact@entreprise.ma" icon={Mail} value={form.email} onChange={set} />
          <Field label="Téléphone" name="phone" placeholder="+212 5 22 00 00 00" icon={Phone} value={form.phone} onChange={set} />
          <div style={{ gridColumn: '1/-1' }}>
            <Field label="Adresse" name="address" placeholder="Casablanca, Maroc" icon={MapPin} value={form.address} onChange={set} />
          </div>
        </div>
      </SectionCard>

      {/* Legal info */}
      <SectionCard icon={Globe} title="Informations légales (Maroc)" subtitle="Ces informations apparaîtront sur vos factures et devis.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'ICE', name: 'ice', ph: '002345678000056' },
            { label: 'IF (Identifiant Fiscal)', name: 'if_num', ph: '12345678' },
            { label: 'RC (Registre de Commerce)', name: 'rc', ph: '123456 Casablanca' },
            { label: 'CNSS', name: 'cnss', ph: '1234567' },
          ].map(f => (
            <Field key={f.name} label={f.label} name={f.name} placeholder={f.ph} value={form[f.name]} onChange={set} />
          ))}
        </div>
      </SectionCard>

      {/* Regional */}
      <SectionCard icon={DollarSign} title="Préférences régionales">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>Devise</label>
            <select className="input-premium" value={form.currency} onChange={e => set('currency', e.target.value)}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>Fuseau horaire</label>
            <select className="input-premium" value={form.timezone} onChange={e => set('timezone', e.target.value)}>
              {TIMEZONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Limits */}
      <SectionCard icon={DollarSign} title="Limites de dépenses" subtitle="Plafonds au-delà desquels une approbation supplémentaire est requise.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Seuil validation Manager (MAD)', name: 'limit_manager', hint: 'Au-delà → Admin requis' },
            { label: 'Seuil validation Admin (MAD)', name: 'limit_admin', hint: 'Au-delà → Directeur requis' },
          ].map(f => (
            <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>{f.label}</label>
              <input type="number" className="input-premium" value={form[f.name]} onChange={e => set(f.name, +e.target.value)} />
              <p style={{ fontSize: 11, color: 'var(--silver)' }}>{f.hint}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? <><Spinner /> Enregistrement…</> : <><Save size={14} /> Enregistrer les paramètres</>}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}