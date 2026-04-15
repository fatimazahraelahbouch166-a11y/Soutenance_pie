import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import Modal from '../../components/Modal'
import { Zap, Plus, Trash2, ArrowRight } from 'lucide-react'
import { fmt } from '../../lib/helpers'
import { MOCK_CATEGORIES } from '../../hooks/useEquipeData'
export default function EquipeTemplates({ 
  templates = [], 
  categories = [], 
  addTemplate, 
  removeTemplate 
}) {
  const toast    = useToast()
  const navigate = useNavigate()
  // const { templates, categories, addTemplate, removeTemplate } = data
//   const { 
//   templates = [], 
//   categories = [], 
//   addTemplate, 
//   removeTemplate 
// } = data || {}
// const data = {
//   templates,
//   categories,
//   addTemplate,
//   removeTemplate
// }
// const templates = data?.templates || []
// const categories = data?.categories || []
// const addTemplate = data?.addTemplate
// const removeTemplate = data?.removeTemplate
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category_id: '', amount: '', description: '' })
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // const handleCreate = () => {
  //   if (!form.name.trim()) return toast.error('Erreur', 'Nom du modèle requis.')
  //   addTemplate({ ...form, amount: +form.amount, category_id: +form.category_id })
  //   setOpen(false)
  //   setForm({ name: '', category_id: '', amount: '', description: '' })
  //   toast.success('Modèle créé', `"${form.name}" ajouté à vos modèles.`)
  // }
const handleCreate = () => {
  if (!form.name.trim()) {
    return toast.error('Erreur', 'Nom du modèle requis.')
  }

  // 🔥 حماية مهمة
  if (typeof addTemplate !== 'function') {
    console.error('addTemplate is not a function', addTemplate)
    toast.error('Erreur', 'Problème technique, réessayez.')
    return
  }

  addTemplate({
    ...form,
    amount: +form.amount,
    category_id: +form.category_id
  })

  setOpen(false)
  setForm({ name: '', category_id: '', amount: '', description: '' })

  toast.success('Modèle créé', `"${form.name}" ajouté à vos modèles.`)
}
  const handleUse = (tpl) => {
    navigate('/app/expenses/new', {
      state: {
        prefill: {
          category_id:  tpl.category_id,
          title:        tpl.name,
          amount:       tpl.amount,
          description:  tpl.description,
        }
      }
    })
    toast.info('Modèle appliqué', 'Formulaire pré-rempli avec le modèle.')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setOpen(true)} className="btn-primary">
          <Plus size={14} /> Nouveau modèle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map(tpl => {
          const cat = categories.find(c => c.id === tpl.category_id)
          return (
            <div key={tpl.id} className="card p-4 flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: (cat?.color ?? '#6366f1') + '20' }}>
                <Zap size={16} style={{ color: cat?.color ?? '#6366f1' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{tpl.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat?.name ?? '—'}</p>
                {tpl.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.description}</p>
                )}
                {tpl.amount > 0 && (
                  <p className="text-xs font-medium text-indigo-600 mt-1">{fmt(tpl.amount)} hab.</p>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => handleUse(tpl)}
                  className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition"
                  title="Utiliser ce modèle">
                  <ArrowRight size={13} />
                </button>
                <button onClick={() => { removeTemplate(tpl.id); toast.success('Supprimé', `"${tpl.name}" supprimé.`) }}
                  className="w-8 h-8 text-gray-300 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          )
        })}
        {templates.length === 0 && (
          <div className="col-span-2 card p-10 text-center text-gray-400 text-sm">
            Aucun modèle — créez votre premier modèle pour gagner du temps.
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau modèle de dépense" size="sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="field-label">Nom du modèle *</label>
            <input type="text" value={form.name} onChange={e => setF('name', e.target.value)}
              className="input" placeholder="Ex : Repas client" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="field-label">Catégorie</label>
              <select value={form.category_id} onChange={e => setF('category_id', e.target.value)} className="input">
                <option value="">Aucune</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="field-label">Montant habituel</label>
              <input type="number" value={form.amount} onChange={e => setF('amount', e.target.value)}
                className="input" placeholder="0" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="field-label">Description</label>
            <textarea value={form.description} onChange={e => setF('description', e.target.value)}
              className="input resize-none" rows={2} placeholder="Description par défaut…" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Annuler</button>
            <button onClick={handleCreate} className="btn-primary flex-1">Créer le modèle</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
