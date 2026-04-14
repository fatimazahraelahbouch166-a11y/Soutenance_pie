// import { useState } from 'react'
// import { useToast } from '../contexts/ToastContext'
// import { MOCK_CATEGORIES } from '../lib/mockData'
// import Modal from '../components/Modal'
// import ConfirmDialog from '../components/ConfirmDialog'
// import { Plus, Pencil, Trash2 } from 'lucide-react'

// const COLORS = [
//   '#6366f1','#10b981','#f59e0b','#3b82f6',
//   '#ef4444','#8b5cf6','#ec4899','#14b8a6',
//   '#f97316','#64748b',
// ]

// export default function CategoriesPage() {
//   const toast = useToast()
//   const [categories, setCategories] = useState(MOCK_CATEGORIES)
//   const [modalOpen, setModalOpen]   = useState(false)
//   const [deleteId, setDeleteId]     = useState(null)
//   const [editing, setEditing]       = useState(null)
//   const [form, setForm] = useState({ name: '', color: COLORS[0] })

//   const openCreate = () => { setEditing(null); setForm({ name: '', color: COLORS[0] }); setModalOpen(true) }
//   const openEdit   = (cat) => { setEditing(cat); setForm({ name: cat.name, color: cat.color }); setModalOpen(true) }

//   const handleSave = () => {
//     if (!form.name.trim()) return toast.error('Erreur', 'Le nom est requis.')
//     if (editing) {
//       setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c))
//       toast.success('Catégorie modifiée', `"${form.name}" a été mise à jour.`)
//     } else {
//       const newCat = { id: Date.now(), ...form }
//       setCategories(prev => [...prev, newCat])
//       toast.success('Catégorie créée', `"${form.name}" a été ajoutée.`)
//     }
//     setModalOpen(false)
//   }

//   const handleDelete = () => {
//     const cat = categories.find(c => c.id === deleteId)
//     setCategories(prev => prev.filter(c => c.id !== deleteId))
//     setDeleteId(null)
//     toast.success('Supprimée', `"${cat?.name}" a été supprimée.`)
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-500">{categories.length} catégorie{categories.length > 1 ? 's' : ''}</p>
//         <button onClick={openCreate} className="btn-primary">
//           <Plus size={14} /> Nouvelle catégorie
//         </button>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//         {categories.map(cat => (
//           <div key={cat.id}
//             className="card p-4 flex items-center gap-3 group hover:border-gray-200 transition">
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
//               style={{ background: cat.color + '20' }}>
//               <div className="w-4 h-4 rounded-full" style={{ background: cat.color }} />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-gray-800 truncate">{cat.name}</p>
//               <p className="text-xs text-gray-400">{cat.color}</p>
//             </div>
//             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
//               <button onClick={() => openEdit(cat)}
//                 className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600">
//                 <Pencil size={13} />
//               </button>
//               <button onClick={() => setDeleteId(cat.id)}
//                 className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
//                 <Trash2 size={13} />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal créer / modifier */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)}
//         title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'} size="sm">
//         <div className="space-y-4">
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Nom *</label>
//             <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//               className="input" placeholder="Ex : Déplacement" autoFocus />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label className="field-label">Couleur</label>
//             <div className="flex flex-wrap gap-2">
//               {COLORS.map(color => (
//                 <button key={color} type="button"
//                   onClick={() => setForm(f => ({ ...f, color }))}
//                   className={`w-8 h-8 rounded-lg transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
//                   style={{ background: color }}
//                 />
//               ))}
//             </div>
//             <div className="flex items-center gap-2 mt-2">
//               <div className="w-8 h-8 rounded-lg" style={{ background: form.color }} />
//               <span className="text-sm text-gray-500">{form.color}</span>
//             </div>
//           </div>
//           <div className="flex gap-3 pt-2">
//             <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Annuler</button>
//             <button onClick={handleSave} className="btn-primary flex-1">
//               {editing ? 'Modifier' : 'Créer'}
//             </button>
//           </div>
//         </div>
//       </Modal>

//       {/* Confirm delete */}
//       <ConfirmDialog
//         open={!!deleteId}
//         onClose={() => setDeleteId(null)}
//         onConfirm={handleDelete}
//         title="Supprimer la catégorie"
//         message="Cette catégorie sera supprimée. Les dépenses associées resteront mais sans catégorie."
//         confirmLabel="Supprimer"
//         danger
//       />
//     </div>
//   )
// }
import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import { MOCK_CATEGORIES } from '../lib/mockData'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const COLORS = [
  '#6366f1','#10b981','#f59e0b','#3b82f6',
  '#ef4444','#8b5cf6','#ec4899','#14b8a6',
  '#f97316','#64748b',
]

export default function CategoriesPage() {
  const toast = useToast()
  const [categories, setCategories] = useState(MOCK_CATEGORIES)
  const [modalOpen, setModalOpen]   = useState(false)
  const [deleteId, setDeleteId]     = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm] = useState({ name: '', color: COLORS[0] })

  const openCreate = () => { setEditing(null); setForm({ name: '', color: COLORS[0] }); setModalOpen(true) }
  const openEdit   = (cat) => { setEditing(cat); setForm({ name: cat.name, color: cat.color }); setModalOpen(true) }

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Erreur', 'Le nom est requis.')
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c))
      toast.success('Catégorie modifiée', `"${form.name}" a été mise à jour.`)
    } else {
      setCategories(prev => [...prev, { id: Date.now(), ...form }])
      toast.success('Catégorie créée', `"${form.name}" a été ajoutée.`)
    }
    setModalOpen(false)
  }

  const handleDelete = () => {
    const cat = categories.find(c => c.id === deleteId)
    setCategories(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
    toast.success('Supprimée', `"${cat?.name}" a été supprimée.`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>
            {categories.length} catégorie{categories.length > 1 ? 's' : ''}
          </p>
          <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 2 }}>
            Classification des dépenses
          </p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={14} /> Nouvelle catégorie
        </button>
      </div>

      {/* Grid */}
      <div
        className="animate-fade-up stagger-2"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            style={{
              background: '#fff',
              border: '1px solid var(--pearl)',
              borderRadius: 'var(--r-lg)',
              padding: '16px 18px',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 1px 3px rgba(26,25,23,0.04)',
              transition: 'box-shadow 0.25s, transform 0.25s, border-color 0.25s',
              cursor: 'default',
              position: 'relative',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,25,23,0.09)'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.borderColor = 'var(--champagne)'
              e.currentTarget.querySelector('.cat-actions').style.opacity = '1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(26,25,23,0.04)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = 'var(--pearl)'
              e.currentTarget.querySelector('.cat-actions').style.opacity = '0'
            }}
          >
            {/* Color swatch */}
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: cat.color + '18',
              border: `1px solid ${cat.color}28`,
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: cat.color }} />
            </div>

            {/* Label */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cat.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 2, fontFamily: 'monospace' }}>
                {cat.color}
              </p>
            </div>

            {/* Actions */}
            <div
              className="cat-actions"
              style={{ display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.18s' }}
            >
              <button
                onClick={() => openEdit(cat)}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--silver)', transition: 'background 0.18s, color 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--ivory)'; e.currentTarget.style.color = 'var(--charcoal)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--silver)'; }}
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setDeleteId(cat.id)}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--silver)', transition: 'background 0.18s, color 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--silver)'; }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal create / edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '0.02em' }}>
              Nom <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text"
              className="input-premium"
              placeholder="Ex : Déplacement"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
          </div>

          {/* Color picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--slate)', letterSpacing: '0.02em' }}>
              Couleur
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, color }))}
                  style={{
                    width: 32, height: 32, borderRadius: 9, border: 'none',
                    background: color, cursor: 'pointer',
                    outline: form.color === color ? `3px solid ${color}` : '3px solid transparent',
                    outlineOffset: form.color === color ? 2 : 0,
                    transform: form.color === color ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.18s, outline 0.18s, outline-offset 0.18s',
                    boxShadow: `0 2px 6px ${color}40`,
                  }}
                  onMouseEnter={e => { if (form.color !== color) e.currentTarget.style.transform = 'scale(1.08)' }}
                  onMouseLeave={e => { if (form.color !== color) e.currentTarget.style.transform = 'scale(1)' }}
                />
              ))}
            </div>

            {/* Preview */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--r-md)',
              background: 'var(--cream)', border: '1px solid var(--pearl)',
              marginTop: 2,
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: form.color, boxShadow: `0 2px 6px ${form.color}40` }} />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--charcoal)' }}>{form.name || 'Aperçu'}</span>
              <span style={{ fontSize: 11, color: 'var(--silver)', fontFamily: 'monospace', marginLeft: 'auto' }}>{form.color}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button className="btn-secondary" onClick={() => setModalOpen(false)} style={{ flex: 1, justifyContent: 'center' }}>
              Annuler
            </button>
            <button className="btn-primary" onClick={handleSave} style={{ flex: 1, justifyContent: 'center' }}>
              {editing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer la catégorie"
        message="Cette catégorie sera supprimée définitivement. Les dépenses associées resteront mais sans catégorie."
        confirmLabel="Supprimer"
        danger
      />
    </div>
  )
}