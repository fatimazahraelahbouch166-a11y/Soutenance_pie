// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { User, Mail, Lock, Eye, EyeOff, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
// import { useAuth } from '../contexts/AuthContext'
// import AuthLayout from '../components/AuthLayout'

// const ROLES = [
//   { value: 'owner',       label: 'Company Owner',  desc: 'Gérant — accès complet' },
//   { value: 'chef_equipe', label: "Chef d'équipe",  desc: 'Valide les dépenses' },
//   { value: 'equipe',      label: 'Équipe',         desc: 'Crée ses dépenses' },
// ]

// function PwdStrength({ password }) {
//   const checks = [
//     { label: '8 caractères minimum', ok: password.length >= 8 },
//     { label: 'Une majuscule',         ok: /[A-Z]/.test(password) },
//     { label: 'Un chiffre',            ok: /[0-9]/.test(password) },
//   ]
//   const score = checks.filter(c => c.ok).length
//   if (!password) return null
//   return (
//     <div className="mt-2 space-y-1.5">
//       <div className="flex gap-1">
//         {[0,1,2].map(i => (
//           <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
//             i < score ? ['bg-red-400','bg-amber-400','bg-emerald-400'][score-1] : 'bg-gray-100'
//           }`} />
//         ))}
//       </div>
//       <div className="space-y-0.5">
//         {checks.map(c => (
//           <div key={c.label} className="flex items-center gap-1.5">
//             <CheckCircle2 size={11} className={c.ok ? 'text-emerald-500' : 'text-gray-300'} />
//             <span className={`text-[11px] ${c.ok ? 'text-gray-600' : 'text-gray-400'}`}>{c.label}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default function RegisterPage() {
//   const { register } = useAuth()
//   const navigate = useNavigate()
//   const [step, setStep]   = useState(1)
//   const [showPwd, setShowPwd]         = useState(false)
//   const [showConfirm, setShowConfirm] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors]   = useState({})
//   const [apiError, setApiError] = useState('')
//   const [form, setForm] = useState({
//     first_name: '', last_name: '', email: '',
//     password: '', password_confirmation: '', role: 'equipe',
//     company_name: '', company_email: '', currency: 'MAD', timezone: 'Africa/Casablanca',
//   })

//   const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })) }

//   const validateStep1 = () => {
//     const e = {}
//     if (!form.first_name.trim()) e.first_name = 'Prénom requis'
//     if (!form.last_name.trim())  e.last_name  = 'Nom requis'
//     if (!form.email.trim())      e.email = 'Email requis'
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
//     if (!form.password)          e.password = 'Requis'
//     else if (form.password.length < 8) e.password = '8 caractères minimum'
//     if (form.password !== form.password_confirmation) e.password_confirmation = 'Les mots de passe ne correspondent pas'
//     setErrors(e); return Object.keys(e).length === 0
//   }

//   const validateStep2 = () => {
//     const e = {}
//     if (!form.company_name.trim()) e.company_name = "Nom de l'entreprise requis"
//     setErrors(e); return Object.keys(e).length === 0
//   }

//   const handleSubmit = async e => {
//     e.preventDefault()
//     if (!validateStep2()) return
//     setLoading(true); setApiError('')
//     try {
//       await register(form)
//       navigate('/app/dashboard')
//     } catch (err) {
//       if (err.response?.status === 422) {
//         const errs = err.response.data.errors ?? {}
//         setErrors(errs)
//         if (['first_name','last_name','email','password'].some(f => errs[f])) setStep(1)
//       } else {
//         setApiError(err.response?.data?.message || 'Une erreur est survenue.')
//       }
//     } finally { setLoading(false) }
//   }

//   return (
//     <AuthLayout>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-900">Créer un compte</h2>
//         <p className="text-sm text-gray-400 mt-1">Inscription en 2 étapes</p>
//       </div>

//       {/* Steps */}
//       <div className="flex items-center gap-2 mb-6">
//         {[1,2].map(s => (
//           <div key={s} className="flex items-center gap-2 flex-1">
//             <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
//               step === s ? 'bg-indigo-600 text-white' : step > s ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
//             }`}>
//               {step > s ? <CheckCircle2 size={14} /> : s}
//             </div>
//             <span className={`text-xs ${step === s ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
//               {s === 1 ? 'Votre compte' : 'Votre entreprise'}
//             </span>
//             {s < 2 && <div className="flex-1 h-px bg-gray-100 ml-1" />}
//           </div>
//         ))}
//       </div>

//       {apiError && (
//         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-4">
//           <AlertCircle size={14} className="shrink-0" />{apiError}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} noValidate>
//         {step === 1 && (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="field-label">Prénom *</label>
//                 <div className="relative">
//                   <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)}
//                     className={`input pl-9 ${errors.first_name ? 'input-error' : ''}`} placeholder="Sara" autoFocus />
//                 </div>
//                 {errors.first_name && <p className="error-msg"><AlertCircle size={11}/>{errors.first_name}</p>}
//               </div>
//               <div>
//                 <label className="field-label">Nom *</label>
//                 <input type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)}
//                   className={`input ${errors.last_name ? 'input-error' : ''}`} placeholder="Alami" />
//                 {errors.last_name && <p className="error-msg"><AlertCircle size={11}/>{errors.last_name}</p>}
//               </div>
//             </div>

//             <div>
//               <label className="field-label">Email *</label>
//               <div className="relative">
//                 <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
//                   className={`input pl-10 ${errors.email ? 'input-error' : ''}`} placeholder="sara@entreprise.com" />
//               </div>
//               {errors.email && <p className="error-msg"><AlertCircle size={11}/>{errors.email}</p>}
//             </div>

//             <div>
//               <label className="field-label">Rôle *</label>
//               <div className="grid grid-cols-2 gap-2">
//                 {ROLES.map(r => (
//                   <button key={r.value} type="button" onClick={() => set('role', r.value)}
//                     className={`text-left p-3 rounded-xl border transition-all ${
//                       form.role === r.value
//                         ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-400'
//                         : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//                     }`}>
//                     <p className={`text-xs font-semibold ${form.role === r.value ? 'text-indigo-700' : 'text-gray-700'}`}>{r.label}</p>
//                     <p className="text-[11px] text-gray-400 mt-0.5">{r.desc}</p>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="field-label">Mot de passe *</label>
//               <div className="relative">
//                 <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input type={showPwd ? 'text' : 'password'} value={form.password}
//                   onChange={e => set('password', e.target.value)}
//                   className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`} placeholder="••••••••" />
//                 <button type="button" onClick={() => setShowPwd(v => !v)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                   {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
//                 </button>
//               </div>
//               {errors.password && <p className="error-msg"><AlertCircle size={11}/>{errors.password}</p>}
//               <PwdStrength password={form.password} />
//             </div>

//             <div>
//               <label className="field-label">Confirmer le mot de passe *</label>
//               <div className="relative">
//                 <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input type={showConfirm ? 'text' : 'password'} value={form.password_confirmation}
//                   onChange={e => set('password_confirmation', e.target.value)}
//                   className={`input pl-10 pr-10 ${errors.password_confirmation ? 'input-error' : ''}`} placeholder="••••••••" />
//                 <button type="button" onClick={() => setShowConfirm(v => !v)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                   {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
//                 </button>
//               </div>
//               {errors.password_confirmation && <p className="error-msg"><AlertCircle size={11}/>{errors.password_confirmation}</p>}
//               {form.password && form.password === form.password_confirmation && (
//                 <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
//                   <CheckCircle2 size={11} /> Mots de passe identiques
//                 </p>
//               )}
//             </div>

//             <button type="button" onClick={() => validateStep1() && setStep(2)} className="btn-primary w-full mt-2">
//               Continuer →
//             </button>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-4">
//             <div>
//               <label className="field-label">Nom de l'entreprise *</label>
//               <div className="relative">
//                 <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input type="text" value={form.company_name} onChange={e => set('company_name', e.target.value)}
//                   className={`input pl-10 ${errors.company_name ? 'input-error' : ''}`}
//                   placeholder="TechMaroc SARL" autoFocus />
//               </div>
//               {errors.company_name && <p className="error-msg"><AlertCircle size={11}/>{errors.company_name}</p>}
//             </div>

//             <div>
//               <label className="field-label">Email de l'entreprise</label>
//               <div className="relative">
//                 <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//                 <input type="email" value={form.company_email} onChange={e => set('company_email', e.target.value)}
//                   className="input pl-10" placeholder="contact@entreprise.ma" />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <label className="field-label">Devise</label>
//                 <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input">
//                   <option value="MAD">MAD — Dirham</option>
//                   <option value="EUR">EUR — Euro</option>
//                   <option value="USD">USD — Dollar</option>
//                   <option value="GBP">GBP — Livre</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="field-label">Fuseau horaire</label>
//                 <select value={form.timezone} onChange={e => set('timezone', e.target.value)} className="input">
//                   <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
//                   <option value="Europe/Paris">Paris (GMT+2)</option>
//                   <option value="Europe/London">Londres</option>
//                   <option value="America/New_York">New York</option>
//                 </select>
//               </div>
//             </div>

//             {/* Recap */}
//             <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
//               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Récapitulatif</p>
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
//                   {form.first_name?.[0]}{form.last_name?.[0]}
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">{form.first_name} {form.last_name}</p>
//                   <p className="text-xs text-gray-400">{form.email} · {ROLES.find(r => r.value === form.role)?.label}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Retour</button>
//               <button type="submit" disabled={loading} className="btn-primary flex-1">
//                 {loading
//                   ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Création…</>
//                   : 'Créer mon compte'}
//               </button>
//             </div>
//           </div>
//         )}
//       </form>

//       <p className="text-center text-sm text-gray-500 mt-5">
//         Déjà un compte ?{' '}
//         <Link to="/login" className="text-indigo-600 font-medium hover:underline">Se connecter</Link>
//       </p>
//     </AuthLayout>
//   )
// }
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'

const ROLES = [
  { value: 'owner',       label: 'Company Owner',  desc: 'Gérant — accès complet' },
  { value: 'chef_equipe', label: "Chef d'équipe",  desc: 'Valide les dépenses' },
  { value: 'equipe',      label: 'Équipe',         desc: 'Crée ses dépenses' },
]

function PwdStrength({ password }) {
  const checks = [
    { label: '8 caractères minimum', ok: password.length >= 8 },
    { label: 'Une majuscule',         ok: /[A-Z]/.test(password) },
    { label: 'Un chiffre',            ok: /[0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  if (!password) return null
  const barColors = ['var(--danger)', 'var(--warn)', 'var(--success)']
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 100, background: i < score ? barColors[score - 1] : 'var(--pearl)', transition: 'background .3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle2 size={10} style={{ color: c.ok ? 'var(--success)' : 'var(--champagne)', flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: c.ok ? 'var(--success)' : 'var(--silver)' }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FieldWrap({ label, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--danger)' }}>
          <AlertCircle size={11} />{error}
        </div>
      )}
    </div>
  )
}

const LoadSpinner = () => (
  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
)

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]     = useState(1)
  const [showPwd, setShowPwd]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', password_confirmation: '', role: 'equipe',
    company_name: '', company_email: '', currency: 'MAD', timezone: 'Africa/Casablanca',
  })
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: null })) }

  const validateStep1 = () => {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'Prénom requis'
    if (!form.last_name.trim())  e.last_name  = 'Nom requis'
    if (!form.email.trim())      e.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
    if (!form.password)          e.password = 'Requis'
    else if (form.password.length < 8) e.password = '8 caractères minimum'
    if (form.password !== form.password_confirmation) e.password_confirmation = 'Ne correspondent pas'
    setErrors(e); return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.company_name.trim()) e.company_name = "Nom de l'entreprise requis"
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true); setApiError('')
    try {
      await register(form)
      navigate('/app/dashboard')
    } catch (err) {
      if (err.response?.status === 422) {
        const errs = err.response.data.errors ?? {}
        setErrors(errs)
        if (['first_name','last_name','email','password'].some(f => errs[f])) setStep(1)
      } else {
        setApiError(err.response?.data?.message || 'Une erreur est survenue.')
      }
    } finally { setLoading(false) }
  }

  const inputStyle = (hasErr) => hasErr ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 3px rgba(138,58,58,.10)' } : {}
  const iconStyle  = { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }

  return (
    <AuthLayout>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-.02em', marginBottom: 6 }}>Créer un compte</h2>
        <p style={{ fontSize: 13, color: 'var(--silver)' }}>Inscription en 2 étapes</p>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
        {[1, 2].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 600, flexShrink: 0,
                background: step > s ? 'var(--success-bg)' : step === s ? 'var(--accent)' : 'var(--pearl)',
                color: step > s ? 'var(--success)' : step === s ? '#fff' : 'var(--silver)',
                transition: 'all .25s',
              }}>
                {step > s ? <CheckCircle2 size={13} /> : s}
              </div>
              <span style={{ fontSize: 12, fontWeight: step === s ? 500 : 400, color: step === s ? 'var(--charcoal)' : 'var(--silver)' }}>
                {s === 1 ? 'Votre compte' : 'Votre entreprise'}
              </span>
            </div>
            {i < 1 && <div style={{ flex: 1, height: 1, background: step > 1 ? 'var(--success-mid)' : 'var(--pearl)', margin: '0 10px', transition: 'background .3s' }} />}
          </div>
        ))}
      </div>

      {apiError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)', fontSize: 13, color: 'var(--danger)', marginBottom: 16 }}>
          <AlertCircle size={13} style={{ flexShrink: 0 }} />{apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldWrap label="Prénom" required error={errors.first_name}>
                <div style={{ position: 'relative' }}>
                  <User size={13} style={iconStyle} />
                  <input type="text" className="input-premium" style={{ paddingLeft: 32, ...inputStyle(errors.first_name) }}
                    placeholder="Sara" value={form.first_name} onChange={e => set('first_name', e.target.value)} autoFocus />
                </div>
              </FieldWrap>
              <FieldWrap label="Nom" required error={errors.last_name}>
                <input type="text" className="input-premium" style={inputStyle(errors.last_name)}
                  placeholder="Alami" value={form.last_name} onChange={e => set('last_name', e.target.value)} />
              </FieldWrap>
            </div>

            <FieldWrap label="Email" required error={errors.email}>
              <div style={{ position: 'relative' }}>
                <Mail size={13} style={iconStyle} />
                <input type="email" className="input-premium" style={{ paddingLeft: 32, ...inputStyle(errors.email) }}
                  placeholder="sara@entreprise.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
            </FieldWrap>

            {/* Role picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>Rôle *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => set('role', r.value)} style={{
                    textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--r-md)',
                    border: `1px solid ${form.role === r.value ? 'var(--accent-mid)' : 'var(--warm-border)'}`,
                    background: form.role === r.value ? 'var(--accent-light)' : '#fff',
                    cursor: 'pointer', outline: form.role === r.value ? '2px solid var(--accent-mid)' : 'none', outlineOffset: 1,
                    transition: 'all .18s',
                  }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: form.role === r.value ? 'var(--accent)' : 'var(--charcoal)', marginBottom: 2 }}>{r.label}</p>
                    <p style={{ fontSize: 10.5, color: 'var(--silver)', lineHeight: 1.4 }}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <FieldWrap label="Mot de passe" required error={errors.password}>
              <div style={{ position: 'relative' }}>
                <Lock size={13} style={iconStyle} />
                <input type={showPwd ? 'text' : 'password'} className="input-premium" style={{ paddingLeft: 32, paddingRight: 40, ...inputStyle(errors.password) }}
                  placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)' }}>
                  {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              <PwdStrength password={form.password} />
            </FieldWrap>

            <FieldWrap label="Confirmer le mot de passe" required error={errors.password_confirmation}>
              <div style={{ position: 'relative' }}>
                <Lock size={13} style={iconStyle} />
                <input type={showConfirm ? 'text' : 'password'} className="input-premium" style={{ paddingLeft: 32, paddingRight: 40, ...inputStyle(errors.password_confirmation) }}
                  placeholder="••••••••" value={form.password_confirmation} onChange={e => set('password_confirmation', e.target.value)} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)' }}>
                  {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              {form.password && form.password === form.password_confirmation && form.password.length >= 8 && (
                <p style={{ fontSize: 11.5, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={11} /> Mots de passe identiques
                </p>
              )}
            </FieldWrap>

            <button type="button" onClick={() => validateStep1() && setStep(2)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
              Continuer →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FieldWrap label="Nom de l'entreprise" required error={errors.company_name}>
              <div style={{ position: 'relative' }}>
                <Building2 size={13} style={iconStyle} />
                <input type="text" className="input-premium" style={{ paddingLeft: 32, ...inputStyle(errors.company_name) }}
                  placeholder="TechMaroc SARL" value={form.company_name} onChange={e => set('company_name', e.target.value)} autoFocus />
              </div>
            </FieldWrap>

            <FieldWrap label="Email de l'entreprise">
              <div style={{ position: 'relative' }}>
                <Mail size={13} style={iconStyle} />
                <input type="email" className="input-premium" style={{ paddingLeft: 32 }}
                  placeholder="contact@entreprise.ma" value={form.company_email} onChange={e => set('company_email', e.target.value)} />
              </div>
            </FieldWrap>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldWrap label="Devise">
                <select className="input-premium" value={form.currency} onChange={e => set('currency', e.target.value)}>
                  <option value="MAD">MAD — Dirham</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="USD">USD — Dollar</option>
                  <option value="GBP">GBP — Livre</option>
                </select>
              </FieldWrap>
              <FieldWrap label="Fuseau horaire">
                <select className="input-premium" value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                  <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
                  <option value="Europe/Paris">Paris (GMT+2)</option>
                  <option value="Europe/London">Londres</option>
                  <option value="America/New_York">New York</option>
                </select>
              </FieldWrap>
            </div>

            {/* Recap */}
            <div style={{ padding: '14px 16px', background: 'var(--cream)', border: '1px solid var(--pearl)', borderRadius: 'var(--r-md)' }}>
              <p style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--silver)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 }}>Récapitulatif</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                  {form.first_name?.[0]}{form.last_name?.[0]}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)' }}>{form.first_name} {form.last_name}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--silver)' }}>{form.email} · {ROLES.find(r => r.value === form.role)?.label}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>← Retour</button>
              <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {loading ? <><LoadSpinner /> Création…</> : 'Créer mon compte'}
              </button>
            </div>
          </div>
        )}
      </form>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--slate)', marginTop: 20 }}>
        Déjà un compte ?{' '}
        <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Se connecter</Link>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  )
}