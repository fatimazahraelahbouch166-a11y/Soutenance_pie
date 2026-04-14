import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { fmt } from '../../lib/helpers'
import { TrendingUp, CheckCircle2, Clock3, XCircle, CreditCard, BarChart3 } from 'lucide-react'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="text-gray-500">{payload[0].name}</p>
      <p className="font-bold text-gray-900">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function EquipeMonthlySummary({ data }) {
  // const { stats, expenses, myBudgets, reimbHistory } = data
//     const {
//   stats = {},
//   expenses = [],
//   myBudgets = [],
//   reimbHistory = []
// } = data || {}
const {
  stats = {},
  expenses = [],
  myBudgets = [],
  reimbHistory = [],
  categories = []
} = data || {}
  const byCategory = categories.map(cat => ({
    name:  cat.name,
    color: cat.color,
    total: expenses.filter(e => e.category_id === cat.id).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0)

  const topCategory = byCategory.sort((a, b) => b.total - a.total)[0]
  const topExpense  = expenses.sort((a, b) => b.amount - a.amount)[0]

  const summaryItems = [
    { label: 'Soumises',    value: expenses.length,             icon: TrendingUp,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Approuvées',  value: expenses.filter(e => ['approved','paid'].includes(e.status)).length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Remboursées', value: expenses.filter(e => e.status === 'paid').length, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'En attente',  value: stats.pending,               icon: Clock3,       color: 'text-amber-600',  bg: 'bg-amber-50' },
    { label: 'Refusées',    value: expenses.filter(e => e.status === 'rejected').length, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-4">
      {/* Résumé chiffré */}
      <div className="grid grid-cols-5 gap-3">
        {summaryItems.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`card p-4 ${s.bg}`}>
              <Icon size={14} className={`${s.color} mb-2`} />
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Répartition par catégorie */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Répartition par catégorie</h3>
          {byCategory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucune donnée</p>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={byCategory} dataKey="total" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                    {byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {byCategory.map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-xs text-gray-600 flex-1 truncate">{c.name}</span>
                    <span className="text-xs font-medium text-gray-800 tabular-nums">{fmt(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Évolution sur 6 mois */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Évolution — 6 derniers mois</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={reimbHistory} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${v/1000}k` : v} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Points clés */}
      <div className="grid grid-cols-2 gap-4">
        {topCategory && (
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">Catégorie principale</p>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: topCategory.color }} />
              <p className="text-sm font-bold text-gray-900">{topCategory.name}</p>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 tabular-nums">{fmt(topCategory.total)}</p>
          </div>
        )}
        {topExpense && (
          <div className="card p-4">
            <p className="text-xs text-gray-400 mb-1">Dépense la plus élevée</p>
            <p className="text-sm font-bold text-gray-900 truncate">{topExpense.title}</p>
            <p className="text-xs text-indigo-600 font-medium tabular-nums">{fmt(topExpense.amount)}</p>
          </div>
        )}
      </div>

      {/* Budgets */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Suivi des budgets</h3>
        <div className="space-y-4">
          {myBudgets.map(b => (
            <div key={b.id}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-600 font-medium">{b.label}</span>
                <span className={`font-semibold tabular-nums ${
                  b.percentage >= 100 ? 'text-red-600' : b.percentage >= 80 ? 'text-amber-600' : 'text-gray-700'
                }`}>
                  {fmt(b.spent)} / {fmt(b.amount)} — {b.percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${
                  b.percentage >= 100 ? 'bg-red-500' : b.percentage >= 80 ? 'bg-amber-400' : 'bg-indigo-500'
                }`} style={{ width: `${Math.min(b.percentage, 100)}%` }} />
              </div>
              {b.percentage >= 80 && b.percentage < 100 && (
                <p className="text-[10px] text-amber-600 mt-0.5">Attention — approche du plafond ({fmt(b.remaining)} restant)</p>
              )}
              {b.percentage >= 100 && (
                <p className="text-[10px] text-red-500 mt-0.5">Budget dépassé de {fmt(b.spent - b.amount)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
