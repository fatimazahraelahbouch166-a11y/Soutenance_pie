import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { fmt, fmtDate } from '../../lib/helpers'
import { CreditCard, TrendingUp, CheckCircle2, Clock3 } from 'lucide-react'

const METHOD_ICON = {
  'Virement bancaire': '🏦',
  'Espèces':           '💵',
  'Chèque':            '📄',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-indigo-600">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function EquipeReimbHistory({ data }) {
  const { reimbursements, reimbHistory, stats } = data

  const totalPaid    = reimbursements.filter(r => r.status === 'paid').reduce((s, r) => s + r.amount, 0)
  const totalPending = reimbursements.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0)
  const yearTotal    = reimbHistory.reduce((s, m) => s + m.amount, 0)

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-500" /> Remboursé total</p>
          <p className="text-xl font-bold text-emerald-600 tabular-nums">{fmt(totalPaid)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock3 size={11} className="text-amber-500" /> En attente</p>
          <p className="text-xl font-bold text-amber-600 tabular-nums">{fmt(totalPending)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><TrendingUp size={11} className="text-indigo-500" /> Total annuel</p>
          <p className="text-xl font-bold text-indigo-600 tabular-nums">{fmt(yearTotal)}</p>
        </div>
      </div>

      {/* Graphique */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Évolution mensuelle des remboursements</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={reimbHistory} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historique détaillé */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">Historique des remboursements</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {reimbursements.map(r => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                r.status === 'paid' ? 'bg-emerald-50' : 'bg-amber-50'
              }`}>
                <CreditCard size={15} className={r.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{r.expense}</p>
                <p className="text-xs text-gray-400">{r.method} · {r.status === 'paid' ? fmtDate(r.date) : 'En attente'}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900 tabular-nums">{fmt(r.amount)}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  r.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {r.status === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
