// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
// import { useAuth } from '../contexts/AuthContext'
// import AuthLayout from '../components/AuthLayout'

// export default function LoginPage() {
//   const { login } = useAuth()
//   const navigate  = useNavigate()
//   const [form, setForm]       = useState({ email: '', password: '' })
//   const [showPwd, setShowPwd] = useState(false)
//   const [error, setError]     = useState('')
//   const [loading, setLoading] = useState(false)

//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   const handleSubmit = async e => {
//     e.preventDefault()
//     setLoading(true); setError('')
//     try {
//       await login(form.email, form.password)
//       navigate('/app/dashboard')
//     } catch (err) {
//       setError(err.response?.data?.message || 'Identifiants incorrects.')
//     } finally { setLoading(false) }
//   }

//   return (
//     <AuthLayout>
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold text-gray-900">Connexion</h2>
//         <p className="text-sm text-gray-400 mt-1">Accédez à votre espace de gestion</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//         <div>
//           <label className="field-label">Adresse email</label>
//           <div className="relative">
//             <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
//               className="input pl-10" placeholder="vous@entreprise.com" autoFocus />
//           </div>
//         </div>

//         <div>
//           <div className="flex items-center justify-between mb-1.5">
//             <label className="field-label mb-0">Mot de passe</label>
//             <button type="button" className="text-xs text-indigo-500 hover:underline">
//               Mot de passe oublié ?
//             </button>
//           </div>
//           <div className="relative">
//             <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input type={showPwd ? 'text' : 'password'} value={form.password}
//               onChange={e => set('password', e.target.value)}
//               className="input pl-10 pr-10" placeholder="••••••••" />
//             <button type="button" onClick={() => setShowPwd(v => !v)}
//               className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//               {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
//             <AlertCircle size={14} className="shrink-0" />{error}
//           </div>
//         )}

//         <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
//           {loading
//             ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Connexion…</>
//             : 'Se connecter'}
//         </button>
//       </form>

//       <div className="flex items-center gap-3 my-5">
//         <span className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400">ou</span>
//         <span className="flex-1 h-px bg-gray-100" />
//       </div>

//       <p className="text-center text-sm text-gray-500">
//         Pas encore de compte ?{' '}
//         <Link to="/register" className="text-indigo-600 font-medium hover:underline">Créer un compte</Link>
//       </p>

//       <div className="mt-5 p-3 bg-indigo-50 rounded-xl border border-indigo-100 space-y-1">
//         <p className="text-xs text-indigo-600 font-medium mb-2">Comptes de démonstration</p>
//         <div className="grid grid-cols-1 gap-1 text-xs text-indigo-500">
//           <div className="flex justify-between"><span className="font-medium text-indigo-700">Company Owner</span><span>owner@techmaroc.ma</span></div>
//           <div className="flex justify-between"><span className="font-medium text-indigo-700">Chef d'équipe</span><span>chef@techmaroc.ma</span></div>
//           <div className="flex justify-between"><span className="font-medium text-indigo-700">Équipe</span><span>equipe@techmaroc.ma</span></div>
//           <p className="text-indigo-400 pt-1">Mot de passe : <span className="font-mono font-medium text-indigo-600">password</span></p>
//         </div>
//       </div>
//     </AuthLayout>
//   )
// }
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'

const DEMO_ACCOUNTS = [
  { role: 'Company Owner', email: 'owner@techmaroc.ma' },
  { role: "Chef d'équipe",  email: 'chef@techmaroc.ma' },
  { role: 'Équipe',         email: 'equipe@techmaroc.ma' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(form.email, form.password)
      navigate('/app/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects.')
    } finally { setLoading(false) }
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Connexion
        </h2>
        <p style={{ fontSize: 13, color: 'var(--silver)' }}>Accédez à votre espace de gestion</p>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '0.02em' }}>Adresse email</label>
          <div style={{ position: 'relative' }}>
            <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
            <input type="email" className="input-premium" placeholder="vous@entreprise.com"
              value={form.email} onChange={e => set('email', e.target.value)}
              style={{ paddingLeft: 36 }} autoFocus />
          </div>
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '0.02em' }}>Mot de passe</label>
            <button type="button" style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Mot de passe oublié ?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
            <input type={showPwd ? 'text' : 'password'} className="input-premium"
              placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 40 }} />
            <button type="button" onClick={() => setShowPwd(v => !v)} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)',
              padding: 2, transition: 'color 0.18s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--charcoal)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
            >
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 'var(--r-md)',
            background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)',
            fontSize: 13, color: 'var(--danger)',
          }}>
            <AlertCircle size={13} style={{ flexShrink: 0 }} />{error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4, height: 42 }}>
          {loading
            ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Connexion…</>
            : 'Se connecter'}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
        <span style={{ flex: 1, height: 1, background: 'var(--pearl)' }} />
        <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>ou</span>
        <span style={{ flex: 1, height: 1, background: 'var(--pearl)' }} />
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--slate)' }}>
        Pas encore de compte ?{' '}
        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Créer un compte</Link>
      </p>

      {/* Demo accounts */}
      <div style={{ marginTop: 20, padding: '16px 18px', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 'var(--r-md)' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          Comptes de démonstration
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DEMO_ACCOUNTS.map(({ role, email }) => (
            <button key={email} type="button" onClick={() => setForm({ email, password: 'password' })}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.6)', border: '1px solid var(--accent-mid)',
                borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent)' }}>{role}</span>
              <span style={{ fontSize: 11.5, color: 'var(--accent-dim)', fontFamily: 'monospace' }}>{email}</span>
            </button>
          ))}
          <p style={{ fontSize: 11.5, color: 'var(--accent-dim)', marginTop: 2 }}>
            Mot de passe : <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)' }}>password</span>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  )
}