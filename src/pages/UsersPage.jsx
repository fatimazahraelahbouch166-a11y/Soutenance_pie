// import { useState } from 'react'
// import { useToast } from '../contexts/ToastContext'
// import { MOCK_USERS_LIST, MOCK_TEAMS } from '../lib/mockData'
// import Modal from '../components/Modal'
// import ConfirmDialog from '../components/ConfirmDialog'
// import { Plus, Pencil, Trash2, UserCheck, UserX, Mail } from 'lucide-react'
// import { initials } from '../lib/helpers'

// const ROLES = [
//   { value: 'owner',       label: 'Company Owner' },
//   { value: 'chef_equipe', label: "Chef d'équipe" },
//   { value: 'equipe',      label: 'Équipe' },
// ]

// const ROLE_COLORS = {
//   owner:       'bg-indigo-50 text-indigo-700',
//   chef_equipe: 'bg-emerald-50 text-emerald-700',
//   equipe:      'bg-amber-50 text-amber-700',
// }

// export default function UsersPage() {
//   const toast = useToast()
//   const [users, setUsers]     = useState(MOCK_USERS_LIST)
//   const [modalOpen, setModalOpen]   = useState(false)
//   const [inviteOpen, setInviteOpen] = useState(false)
//   const [deleteId, setDeleteId]     = useState(null)
//   const [editing, setEditing]       = useState(null)
//   const [search, setSearch]         = useState('')
//   const [inviteEmail, setInviteEmail] = useState('')
//   const [inviteRole, setInviteRole]   = useState('employee')

//   const [form, setForm] = useState({ first_name: '', last_name: '', email: '', role: 'employee', team_id: '' })
//   const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

//   const openEdit = (u) => {
//     setEditing(u)
//     setForm({ first_name: u.first_name, last_name: u.last_name, email: u.email, role: u.role, team_id: u.team_id || '' })
//     setModalOpen(true)
//   }

//   const handleSave = () => {
//     if (!form.first_name || !form.email) return toast.error('Erreur', 'Prénom et email requis.')
//     setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form } : u))
//     setModalOpen(false)
//     toast.success('Utilisateur modifié', `${form.first_name} ${form.last_name} a été mis à jour.`)
//   }

//   const toggleActive = (id) => {
//     setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u))
//     const u = users.find(x => x.id === id)
//     toast.info(u?.is_active ? 'Compte désactivé' : 'Compte activé', `${u?.first_name} ${u?.last_name}`)
//   }

//   const handleDelete = () => {
//     const u = users.find(x => x.id === deleteId)
//     setUsers(prev => prev.filter(x => x.id !== deleteId))
//     setDeleteId(null)
//     toast.success('Supprimé', `${u?.first_name} ${u?.last_name} a été supprimé.`)
//   }

//   const handleInvite = () => {
//     if (!inviteEmail.includes('@')) return toast.error('Erreur', 'Email invalide.')
//     setInviteOpen(false)
//     setInviteEmail('')
//     toast.success('Invitation envoyée', `Un email a été envoyé à ${inviteEmail}.`)
//   }

//   const filtered = users.filter(u =>
//     `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <div className="space-y-4">
//       {/* Toolbar */}
//       <div className="flex items-center gap-3">
//         <input className="input flex-1" placeholder="Rechercher un utilisateur…"
//           value={search} onChange={e => setSearch(e.target.value)} />
//         <button onClick={() => setInviteOpen(true)} className="btn-primary whitespace-nowrap">
//           <Mail size={14} /> Inviter
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-4 gap-3">
//         {ROLES.map(r => (
//           <div key={r.value} className="card p-3 text-center">
//             <p className="text-lg font-bold text-gray-900">{users.filter(u => u.role === r.value).length}</p>
//             <p className="text-xs text-gray-400 mt-0.5">{r.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="card overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-gray-50">
//               {['Utilisateur','Rôle','Équipe','Statut',''].map(h => (
//                 <th key={h} className="px-5 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-50">
//             {filtered.map(u => (
//               <tr key={u.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-5 py-3">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${u.is_active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'}`}>
//                       {initials(u.first_name, u.last_name)}
//                     </div>
//                     <div>
//                       <p className={`text-sm font-medium ${u.is_active ? 'text-gray-800' : 'text-gray-400'}`}>
//                         {u.first_name} {u.last_name}
//                       </p>
//                       <p className="text-xs text-gray-400">{u.email}</p>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-5 py-3">
//                   <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-500'}`}>
//                     {ROLES.find(r => r.value === u.role)?.label ?? u.role}
//                   </span>
//                 </td>
//                 <td className="px-5 py-3 text-sm text-gray-500">
//                   {u.team?.name ?? '—'}
//                 </td>
//                 <td className="px-5 py-3">
//                   <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
//                     {u.is_active ? 'Actif' : 'Inactif'}
//                   </span>
//                 </td>
//                 <td className="px-5 py-3">
//                   <div className="flex items-center gap-1 justify-end">
//                     <button onClick={() => openEdit(u)}
//                       className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
//                       <Pencil size={13} />
//                     </button>
//                     <button onClick={() => toggleActive(u.id)}
//                       className={`w-7 h-7 flex items-center justify-center rounded-lg ${u.is_active ? 'text-gray-400 hover:bg-amber-50 hover:text-amber-600' : 'text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'}`}>
//                       {u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
//                     </button>
//                     <button onClick={() => setDeleteId(u.id)}
//                       className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
//                       <Trash2 size={13} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {filtered.length === 0 && (
//               <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">Aucun utilisateur trouvé</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal modifier */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modifier l'utilisateur" size="sm">
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-3">
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Prénom *</label>
//               <input type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)} className="input" />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Nom *</label>
//               <input type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)} className="input" />
//             </div>
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Email *</label>
//             <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input" />
//           </div>
//           <div className="grid grid-cols-2 gap-3">
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Rôle</label>
//               <select value={form.role} onChange={e => set('role', e.target.value)} className="input">
//                 {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
//               </select>
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="field-label">Équipe</label>
//               <select value={form.team_id} onChange={e => set('team_id', +e.target.value)} className="input">
//                 <option value="">Aucune</option>
//                 {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//               </select>
//             </div>
//           </div>
//           <div className="flex gap-3 pt-2">
//             <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Annuler</button>
//             <button onClick={handleSave} className="btn-primary flex-1">Enregistrer</button>
//           </div>
//         </div>
//       </Modal>

//       {/* Modal invitation */}
//       <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Inviter un utilisateur" size="sm">
//         <div className="space-y-4">
//           <p className="text-sm text-gray-500">Un email d'invitation sera envoyé avec un lien d'accès sécurisé.</p>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Adresse email *</label>
//             <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
//               className="input" placeholder="collègue@entreprise.ma" autoFocus />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Rôle attribué</label>
//             <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="input">
//               {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
//             </select>
//           </div>
//           <div className="flex gap-3 pt-2">
//             <button onClick={() => setInviteOpen(false)} className="btn-secondary flex-1">Annuler</button>
//             <button onClick={handleInvite} className="btn-primary flex-1">
//               <Mail size={13} /> Envoyer l'invitation
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Confirm delete */}
//       <ConfirmDialog
//         open={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         title="Supprimer l'utilisateur"
//         message="Cet utilisateur sera supprimé définitivement. Ses dépenses resteront dans le système."
//         confirmLabel="Supprimer"
//         danger
//       />
//     </div>
//   )
// }
import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import { MOCK_USERS_LIST, MOCK_TEAMS } from '../lib/mockData'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, Pencil, Trash2, UserCheck, UserX, Mail, Search } from 'lucide-react'
import { initials } from '../lib/helpers'

const ROLES = [
  { value: 'owner',       label: 'Company Owner' },
  { value: 'chef_equipe', label: "Chef d'équipe" },
  { value: 'equipe',      label: 'Équipe' },
]

const ROLE_STYLE = {
  owner:       { bg: 'var(--accent-light)',  text: 'var(--accent)',  dot: 'var(--accent)' },
  chef_equipe: { bg: 'var(--success-bg)',    text: 'var(--success)', dot: 'var(--success)' },
  equipe:      { bg: 'var(--warn-bg)',       text: 'var(--warn)',    dot: 'var(--warn)' },
}

function ActionBtn({ onClick, icon: Icon, warn, danger }) {
  const hoverBg    = danger ? 'var(--danger-bg)'  : warn ? 'var(--warn-bg)'  : 'var(--ivory)'
  const hoverColor = danger ? 'var(--danger)'     : warn ? 'var(--warn)'     : 'var(--charcoal)'
  return (
    <button onClick={onClick} style={{
      width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'none', color: 'var(--silver)', transition: 'background .18s, color .18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--silver)'; }}
    ><Icon size={13} /></button>
  )
}

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

export default function UsersPage() {
  const toast = useToast()
  const [users, setUsers]           = useState(MOCK_USERS_LIST)
  const [modalOpen, setModalOpen]   = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [deleteId, setDeleteId]     = useState(null)
  const [editing, setEditing]       = useState(null)
  const [search, setSearch]         = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole]   = useState('equipe')
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', role: 'equipe', team_id: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openEdit = (u) => {
    setEditing(u)
    setForm({ first_name: u.first_name, last_name: u.last_name, email: u.email, role: u.role, team_id: u.team_id || '' })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.first_name || !form.email) return toast.error('Erreur', 'Prénom et email requis.')
    setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...form } : u))
    setModalOpen(false)
    toast.success('Utilisateur modifié', `${form.first_name} ${form.last_name} mis à jour.`)
  }

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u))
    const u = users.find(x => x.id === id)
    toast.info(u?.is_active ? 'Compte désactivé' : 'Compte activé', `${u?.first_name} ${u?.last_name}`)
  }

  const handleDelete = () => {
    const u = users.find(x => x.id === deleteId)
    setUsers(prev => prev.filter(x => x.id !== deleteId))
    setDeleteId(null)
    toast.success('Supprimé', `${u?.first_name} ${u?.last_name} supprimé.`)
  }

  const handleInvite = () => {
    if (!inviteEmail.includes('@')) return toast.error('Erreur', 'Email invalide.')
    setInviteOpen(false); setInviteEmail('')
    toast.success('Invitation envoyée', `Email envoyé à ${inviteEmail}.`)
  }

  const filtered = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Toolbar + stats */}
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
          <input className="input-premium" placeholder="Rechercher un utilisateur…"
            value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32 }} />
        </div>
        <button className="btn-primary" onClick={() => setInviteOpen(true)}>
          <Mail size={14} /> Inviter
        </button>
      </div>

      {/* Role stats */}
      <div className="animate-fade-up stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {ROLES.map((r, i) => {
          const rs = ROLE_STYLE[r.value]
          const count = users.filter(u => u.role === r.value).length
          return (
            <div key={r.value} className="kpi-card" style={{ padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${rs.dot}50, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, color: 'var(--silver)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase' }}>{r.label}</p>
                <span style={{ fontSize: 20, fontWeight: 600, color: rs.text }}>{count}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <div className="card-static animate-fade-up stagger-3">
        <table className="premium-table">
          <thead><tr>
            {['Utilisateur', 'Rôle', 'Équipe', 'Statut', ''].map(h => <th key={h}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(u => {
              const rs = ROLE_STYLE[u.role] ?? { bg: 'var(--pearl)', text: 'var(--muted)', dot: 'var(--silver)' }
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.is_active !== false ? rs.bg : 'var(--pearl)', color: u.is_active !== false ? rs.text : 'var(--silver)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 600, flexShrink: 0 }}>
                        {initials(u.first_name, u.last_name)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, color: u.is_active !== false ? 'var(--charcoal)' : 'var(--silver)' }}>
                          {u.first_name} {u.last_name}
                        </p>
                        <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 1 }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 100, background: rs.bg, fontSize: 11.5, fontWeight: 500, color: rs.text }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: rs.dot }} />
                      {ROLES.find(r => r.value === u.role)?.label ?? u.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--slate)' }}>{u.team?.name ?? '—'}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 500, background: u.is_active !== false ? 'var(--success-bg)' : 'var(--pearl)', color: u.is_active !== false ? 'var(--success)' : 'var(--muted)' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                      {u.is_active !== false ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                      <ActionBtn onClick={() => openEdit(u)} icon={Pencil} />
                      <ActionBtn onClick={() => toggleActive(u.id)} icon={u.is_active !== false ? UserX : UserCheck} warn={u.is_active !== false} />
                      <ActionBtn onClick={() => setDeleteId(u.id)} icon={Trash2} danger />
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--silver)', fontSize: 13 }}>Aucun utilisateur trouvé</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modifier l'utilisateur" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Prénom" required>
              <input type="text" className="input-premium" value={form.first_name} onChange={e => set('first_name', e.target.value)} />
            </FormField>
            <FormField label="Nom" required>
              <input type="text" className="input-premium" value={form.last_name} onChange={e => set('last_name', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Email" required>
            <input type="email" className="input-premium" value={form.email} onChange={e => set('email', e.target.value)} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Rôle">
              <select className="input-premium" value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </FormField>
            <FormField label="Équipe">
              <select className="input-premium" value={form.team_id} onChange={e => set('team_id', +e.target.value)}>
                <option value="">Aucune</option>
                {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: 'center' }}>Enregistrer</button>
          </div>
        </div>
      </Modal>

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Inviter un utilisateur" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Un email d'invitation sera envoyé avec un lien d'accès sécurisé.
          </p>
          <FormField label="Adresse email" required>
            <input type="email" className="input-premium" value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)} placeholder="collègue@entreprise.ma" autoFocus />
          </FormField>
          <FormField label="Rôle attribué">
            <select className="input-premium" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button className="btn-secondary" onClick={() => setInviteOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
            <button className="btn-primary" onClick={handleInvite} style={{ flex: 1, justifyContent: 'center' }}>
              <Mail size={13} /> Envoyer l'invitation
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Supprimer l'utilisateur"
        message="Cet utilisateur sera supprimé définitivement. Ses dépenses resteront dans le système."
        confirmLabel="Supprimer" danger />
    </div>
  )
}