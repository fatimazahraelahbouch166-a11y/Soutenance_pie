import { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { Map, Calendar, CheckCircle2, Clock3, MapPin } from 'lucide-react'
import { fmt, fmtDate } from '../../lib/helpers'

const STATUS = {
  completed: { label: 'Terminée', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  upcoming:  { label: 'À venir',  cls: 'bg-blue-50 text-blue-700',      icon: Clock3 },
  ongoing:   { label: 'En cours', cls: 'bg-amber-50 text-amber-700',    icon: Clock3 },
}

export default function EquipeMissions({ data }) {
  const toast = useToast()
  // const { missions, expenses } = data
  const missions = data?.missions ?? []
  const expenses = data?.expenses ?? []
  const [selected, setSelected] = useState(null)

  const mission = missions.find(m => m.id === selected)
  const missionExpenses = mission
    ? expenses.filter(e => mission.expense_ids.includes(e.id))
    : []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {missions.map(m => {
          const s = STATUS[m.status] ?? STATUS.upcoming
          const Icon = s.icon
          const isSelected = selected === m.id
          return (
            <button key={m.id} onClick={() => setSelected(isSelected ? null : m.id)}
              className={`card p-4 text-left transition hover:shadow-sm ${isSelected ? 'ring-2 ring-indigo-400' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                    <Map size={14} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{m.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={9} />{m.city}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <Calendar size={11} />
                {fmtDate(m.start)} → {fmtDate(m.end)}
              </div>
              <p className="text-xs text-gray-400 mt-1">{m.expense_ids.length} dépense{m.expense_ids.length !== 1 ? 's' : ''} liée{m.expense_ids.length !== 1 ? 's' : ''}</p>
            </button>
          )
        })}
      </div>

      {/* Détail mission sélectionnée */}
      {mission && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">{mission.title}</h3>
            <button
              onClick={() => toast.info('Export', 'Export PDF disponible avec le backend Laravel.')}
              className="btn-secondary text-xs px-3 py-1.5">
              Exporter PDF
            </button>
          </div>

          {missionExpenses.length > 0 ? (
            <div className="space-y-2">
              {missionExpenses.map(e => (
                <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{e.title}</p>
                    <p className="text-xs text-gray-400">{fmtDate(e.expense_date)}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 tabular-nums">{fmt(e.amount)}</p>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-gray-100 text-sm font-bold text-gray-900">
                <span>Total mission</span>
                <span className="tabular-nums">{fmt(missionExpenses.reduce((s, e) => s + e.amount, 0))}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">Aucune dépense liée à cette mission.</p>
          )}
        </div>
      )}
    </div>
  )
}
