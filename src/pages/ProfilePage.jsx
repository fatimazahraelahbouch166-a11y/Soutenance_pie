// import { useState } from 'react'
// import { useAuth } from '../contexts/AuthContext'
// import { useToast } from '../contexts/ToastContext'
// import { User, Mail, Phone, Lock, Eye, EyeOff, Camera } from 'lucide-react'

// export default function ProfilePage() {
//   const { user } = useAuth()
//   const toast    = useToast()

//   const [form, setForm] = useState({
//     first_name: user?.first_name || '',
//     last_name:  user?.last_name  || '',
//     email:      user?.email      || '',
//     phone:      user?.phone      || '',
//   })

//   const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' })
//   const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false })
//   const [saving, setSaving]   = useState(false)
//   const [savingPwd, setSavingPwd] = useState(false)

//   const set    = (k, v) => setForm(f => ({ ...f, [k]: v }))
//   const setPw  = (k, v) => setPwd(f => ({ ...f, [k]: v }))

//   const handleSaveProfile = async () => {
//     setSaving(true)
//     await new Promise(r => setTimeout(r, 600))
//     setSaving(false)
//     toast.success('Profil mis à jour', 'Vos informations ont été enregistrées.')
//   }

//   const handleChangePwd = async () => {
//     if (!pwd.current) return toast.error('Erreur', 'Mot de passe actuel requis.')
//     if (pwd.new.length < 8) return toast.error('Erreur', '8 caractères minimum.')
//     if (pwd.new !== pwd.confirm) return toast.error('Erreur', 'Les mots de passe ne correspondent pas.')
//     setSavingPwd(true)
//     await new Promise(r => setTimeout(r, 700))
//     setSavingPwd(false)
//     setPwd({ current: '', new: '', confirm: '' })
//     toast.success('Mot de passe modifié', 'Votre mot de passe a été mis à jour.')
//   }

//   const PwdField = ({ label, field }) => (
//     <div className="flex flex-col gap-1">
//       <label className="field-label">{label}</label>
//       <div className="relative">
//         <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input
//           type={showPwd[field] ? 'text' : 'password'}
//           value={pwd[field]}
//           onChange={e => setPw(field, e.target.value)}
//           className="input pl-10 pr-10"
//           placeholder="••••••••"
//         />
//         <button type="button" onClick={() => setShowPwd(s => ({ ...s, [field]: !s[field] }))}
//           className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//           {showPwd[field] ? <EyeOff size={14} /> : <Eye size={14} />}
//         </button>
//       </div>
//     </div>
//   )

//   return (
//     <div className="max-w-2xl mx-auto space-y-5">

//       {/* Avatar + nom */}
//       <div className="card p-6">
//         <div className="flex items-center gap-5 mb-6">
//           <div className="relative">
//             <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center
//                             text-indigo-700 text-xl font-bold">
//               {user?.first_name?.[0]}{user?.last_name?.[0]}
//             </div>
//             <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full
//                                 flex items-center justify-center text-white hover:bg-indigo-700 transition">
//               <Camera size={11} />
//             </button>
//           </div>
//           <div>
//             <p className="text-base font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
//             <p className="text-sm text-gray-400 capitalize">{user?.role} · {user?.company?.name}</p>
//             <p className="text-xs text-gray-400 mt-0.5">{user?.team?.name ?? 'Aucune équipe'}</p>
//           </div>
//         </div>

//         <h3 className="text-sm font-semibold text-gray-700 mb-4">Informations personnelles</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Prénom *</label>
//             <div className="relative">
//               <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)}
//                 className="input pl-10" placeholder="Sara" />
//             </div>
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Nom *</label>
//             <input type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)}
//               className="input" placeholder="Alami" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Email *</label>
//             <div className="relative">
//               <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
//                 className="input pl-10" placeholder="sara@entreprise.ma" />
//             </div>
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Téléphone</label>
//             <div className="relative">
//               <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
//                 className="input pl-10" placeholder="+212 6 00 00 00 00" />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end mt-5 pt-4 border-t border-gray-50">
//           <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
//             {saving
//               ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enregistrement…</>
//               : 'Enregistrer'}
//           </button>
//         </div>
//       </div>

//       {/* Changer mot de passe */}
//       <div className="card p-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-4">Changer le mot de passe</h3>
//         <div className="space-y-4">
//           <PwdField label="Mot de passe actuel" field="current" />
//           <div className="grid grid-cols-2 gap-4">
//             <PwdField label="Nouveau mot de passe" field="new" />
//             <PwdField label="Confirmer" field="confirm" />
//           </div>
//           {pwd.new && pwd.new.length < 8 && (
//             <p className="text-xs text-red-500">8 caractères minimum</p>
//           )}
//           {pwd.new && pwd.confirm && pwd.new !== pwd.confirm && (
//             <p className="text-xs text-red-500">Les mots de passe ne correspondent pas</p>
//           )}
//         </div>
//         <div className="flex justify-end mt-5 pt-4 border-t border-gray-50">
//           <button onClick={handleChangePwd} disabled={savingPwd} className="btn-primary">
//             {savingPwd
//               ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Modification…</>
//               : 'Changer le mot de passe'}
//           </button>
//         </div>
//       </div>

//       {/* Infos compte */}
//       <div className="card p-6">
//         <h3 className="text-sm font-semibold text-gray-700 mb-4">Informations du compte</h3>
//         <div className="space-y-3">
//           {[
//             { label: 'Rôle',      value: user?.role },
//             { label: 'Équipe',    value: user?.team?.name ?? '—' },
//             { label: 'Entreprise', value: user?.company?.name },
//             { label: 'Devise',    value: user?.company?.currency ?? 'MAD' },
//           ].map(({ label, value }) => (
//             <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
//               <span className="text-sm text-gray-500">{label}</span>
//               <span className="text-sm font-medium text-gray-800 capitalize">{value}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   )
// }
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { User, Mail, Phone, Lock, Eye, EyeOff, Camera } from 'lucide-react'

function FormField({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function SectionCard({ title, children, action }) {
  return (
    <div className="card-static animate-fade-up" style={{ padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--ivory)' }}>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)' }}>{title}</p>
        {action}
      </div>
      {children}
    </div>
  )
}

function PwdField({ label, field, value, onChange, show, onToggle }) {
  return (
    <FormField label={label}>
      <div style={{ position: 'relative' }}>
        <Lock size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(field, e.target.value)}
          className="input-premium" placeholder="••••••••" style={{ paddingLeft: 34, paddingRight: 40 }} />
        <button type="button" onClick={onToggle} style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)',
          padding: 2, transition: 'color .18s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--charcoal)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
    </FormField>
  )
}

const Spinner = () => (
  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
)

export default function ProfilePage() {
  const { user } = useAuth()
  const toast    = useToast()

  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    email:      user?.email      || '',
    phone:      user?.phone      || '',
  })
  const [pwd, setPwd]         = useState({ current: '', new: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false })
  const [saving, setSaving]   = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setPw = (k, v) => setPwd(f => ({ ...f, [k]: v }))
  const toggleShow = (k) => setShowPwd(s => ({ ...s, [k]: !s[k] }))

  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    toast.success('Profil mis à jour', 'Vos informations ont été enregistrées.')
  }

  const handleChangePwd = async () => {
    if (!pwd.current) return toast.error('Erreur', 'Mot de passe actuel requis.')
    if (pwd.new.length < 8) return toast.error('Erreur', '8 caractères minimum.')
    if (pwd.new !== pwd.confirm) return toast.error('Erreur', 'Les mots de passe ne correspondent pas.')
    setSavingPwd(true)
    await new Promise(r => setTimeout(r, 700))
    setSavingPwd(false)
    setPwd({ current: '', new: '', confirm: '' })
    toast.success('Mot de passe modifié', 'Votre mot de passe a été mis à jour.')
  }

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Identity card */}
      <SectionCard title="Informations personnelles">
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: 18, fontWeight: 600, border: '2px solid var(--accent-mid)' }}>
              {initials}
            </div>
            <button style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--accent)', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background .18s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
            >
              <Camera size={10} style={{ color: '#fff' }} />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{user?.first_name} {user?.last_name}</p>
            <p style={{ fontSize: 12, color: 'var(--silver)', marginTop: 2 }}>{user?.role} · {user?.company?.name}</p>
            <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 1 }}>{user?.team?.name ?? 'Aucune équipe'}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Prénom" required>
            <div style={{ position: 'relative' }}>
              <User size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
              <input type="text" className="input-premium" style={{ paddingLeft: 32 }} placeholder="Sara"
                value={form.first_name} onChange={e => set('first_name', e.target.value)} />
            </div>
          </FormField>
          <FormField label="Nom" required>
            <input type="text" className="input-premium" placeholder="Alami" value={form.last_name} onChange={e => set('last_name', e.target.value)} />
          </FormField>
          <FormField label="Email" required>
            <div style={{ position: 'relative' }}>
              <Mail size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
              <input type="email" className="input-premium" style={{ paddingLeft: 32 }} placeholder="sara@entreprise.ma"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </FormField>
          <FormField label="Téléphone">
            <div style={{ position: 'relative' }}>
              <Phone size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
              <input type="tel" className="input-premium" style={{ paddingLeft: 32 }} placeholder="+212 6 00 00 00 00"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </FormField>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--ivory)' }}>
          <button className="btn-primary" onClick={handleSaveProfile} disabled={saving}>
            {saving ? <><Spinner /> Enregistrement…</> : 'Enregistrer'}
          </button>
        </div>
      </SectionCard>

      {/* Password */}
      <SectionCard title="Changer le mot de passe">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PwdField label="Mot de passe actuel" field="current" value={pwd.current} onChange={setPw} show={showPwd.current} onToggle={() => toggleShow('current')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <PwdField label="Nouveau mot de passe" field="new" value={pwd.new} onChange={setPw} show={showPwd.new} onToggle={() => toggleShow('new')} />
            <PwdField label="Confirmer" field="confirm" value={pwd.confirm} onChange={setPw} show={showPwd.confirm} onToggle={() => toggleShow('confirm')} />
          </div>
          {pwd.new && pwd.new.length < 8 && (
            <p style={{ fontSize: 11.5, color: 'var(--danger)' }}>8 caractères minimum</p>
          )}
          {pwd.new && pwd.confirm && pwd.new !== pwd.confirm && (
            <p style={{ fontSize: 11.5, color: 'var(--danger)' }}>Les mots de passe ne correspondent pas</p>
          )}
          {pwd.new && pwd.new === pwd.confirm && pwd.new.length >= 8 && (
            <p style={{ fontSize: 11.5, color: 'var(--success)' }}>✓ Mots de passe identiques</p>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--ivory)' }}>
          <button className="btn-primary" onClick={handleChangePwd} disabled={savingPwd}>
            {savingPwd ? <><Spinner /> Modification…</> : 'Changer le mot de passe'}
          </button>
        </div>
      </SectionCard>

      {/* Account info */}
      <SectionCard title="Informations du compte">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { label: 'Rôle', value: user?.role },
            { label: 'Équipe', value: user?.team?.name ?? '—' },
            { label: 'Entreprise', value: user?.company?.name },
            { label: 'Devise', value: user?.company?.currency ?? 'MAD' },
          ].map(({ label, value }, i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--ivory)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)', textTransform: 'capitalize' }}>{value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}