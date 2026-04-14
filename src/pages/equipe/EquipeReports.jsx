// EquipeReports.jsx
import { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import Modal from '../../components/Modal'
import { FolderOpen, Plus, CheckCircle2, Clock3, Trash2 } from 'lucide-react'
import { fmt, fmtDate } from '../../lib/helpers'

const STATUS = {
  approved: { label: 'Approuvé', cls: 'bg-emerald-50 text-emerald-700' },
  pending:  { label: 'En attente', cls: 'bg-amber-50 text-amber-700' },
  draft:    { label: 'Brouillon', cls: 'bg-gray-100 text-gray-500' },
  rejected: { label: 'Refusé', cls: 'bg-red-50 text-red-600' },
}

export default function EquipeReports({ data }) {
  const toast = useToast()
  const { reports, expenses, addReport } = data
  const [open, setOpen]   = useState(false)
  const [title, setTitle] = useState('')
  const [selected, setSelected] = useState([])
  const [saving, setSaving] = useState(false)

  const toggleExp = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const handleCreate = async () => {
    if (!title.trim()) return toast.error('Erreur', 'Donnez un titre au rapport.')
    if (selected.length === 0) return toast.error('Erreur', 'Ajoutez au moins une dépense.')
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const total = expenses.filter(e => selected.includes(e.id)).reduce((s, e) => s + e.amount, 0)
    addReport({ title, status: 'pending', total, expense_count: selected.length })
    setOpen(false); setTitle(''); setSelected([])
    setSaving(false)
    toast.success('Rapport créé', `"${title}" soumis pour approbation.`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setOpen(true)} className="btn-primary">
          <Plus size={14} /> Nouveau rapport
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="card p-12 text-center text-gray-400 text-sm">Aucun rapport créé</div>
      ) : (
        <div className="space-y-2">
          {reports.map(r => {
            const s = STATUS[r.status] ?? STATUS.draft
            return (
              <div key={r.id} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                  <FolderOpen size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.expense_count} dépense{r.expense_count > 1 ? 's' : ''} · {fmtDate(r.created_at)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900 tabular-nums">{fmt(r.total)}</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nouveau rapport de dépenses" size="md">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="field-label">Titre du rapport *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="input" placeholder="Ex : Mission Rabat — Mars 2025" autoFocus />
          </div>
          <div>
            <label className="field-label">Sélectionner les dépenses</label>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {expenses.filter(e => e.status !== 'paid').map(e => (
                <label key={e.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  selected.includes(e.id) ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggleExp(e.id)}
                    className="w-4 h-4 accent-indigo-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{e.title}</p>
                    <p className="text-[10px] text-gray-400">{fmtDate(e.expense_date)}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 tabular-nums">{fmt(e.amount)}</span>
                </label>
              ))}
            </div>
          </div>
          {selected.length > 0 && (
            <p className="text-xs text-indigo-600 font-medium">
              {selected.length} dépense{selected.length > 1 ? 's' : ''} sélectionnée{selected.length > 1 ? 's' : ''} · Total : {fmt(expenses.filter(e => selected.includes(e.id)).reduce((s, e) => s + e.amount, 0))}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Annuler</button>
            <button onClick={handleCreate} disabled={saving} className="btn-primary flex-1">
              {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Créer et soumettre'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
