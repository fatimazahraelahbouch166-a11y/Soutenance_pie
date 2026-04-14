import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Clock, Calculator, Camera,
  CreditCard, FolderOpen, BookOpen, Map, MessageSquare,
  BarChart3, TrendingUp, AlertCircle, CheckCircle2, Clock3,
  XCircle, ChevronRight, Plus, ArrowRight, Bell, Zap,
} from 'lucide-react'
import { useEquipeData } from '../hooks/useEquipeData'
import { fmt, fmtDate } from '../lib/helpers'
import EquipeTimeline        from './equipe/EquipeTimeline'
import EquipeMileage         from './equipe/EquipeMileage'
import EquipeOCR             from './equipe/EquipeOCR'
import EquipeReimbHistory    from './equipe/EquipeReimbHistory'
import EquipeReports         from './equipe/EquipeReports'
import EquipeTemplates       from './equipe/EquipeTemplates'
import EquipeMissions        from './equipe/EquipeMissions'
import EquipeChat            from './equipe/EquipeChat'
import EquipeMonthlySummary  from './equipe/EquipeMonthlySummary'
import SuiviTab from './equipe/tabs/SuiviTab'
const STATUS_CONFIG = {
  draft:    { label: 'Brouillon',  icon: Clock3,        color: 'text-gray-500',   bg: 'bg-gray-100' },
  pending:  { label: 'En attente', icon: Clock3,         color: 'text-amber-600',  bg: 'bg-amber-50' },
  approved: { label: 'Approuvée',  icon: CheckCircle2,   color: 'text-emerald-600', bg: 'bg-emerald-50' },
  rejected: { label: 'Refusée',    icon: XCircle,        color: 'text-red-500',    bg: 'bg-red-50' },
  paid:     { label: 'Remboursée', icon: CheckCircle2,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
}

const NAV_TABS = [
  { id: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'timeline',   label: 'Suivi',           icon: Clock },
  { id: 'mileage',    label: 'Kilométrique',    icon: Calculator },
  { id: 'ocr',        label: 'Scanner',         icon: Camera },
  { id: 'reimb',      label: 'Remboursements',  icon: CreditCard },
  { id: 'reports',    label: 'Rapports',        icon: FolderOpen },
  { id: 'templates',  label: 'Modèles',         icon: BookOpen },
  { id: 'missions',   label: 'Missions',        icon: Map },
  { id: 'chat',       label: 'Messages',        icon: MessageSquare },
  { id: 'summary',    label: 'Bilan',           icon: BarChart3 },
]

export default function EquipeDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
const data = useEquipeData()

if (!data) {
  return <div className="p-4 text-gray-500">Chargement...</div>
}

const { stats, expenses, myBudgets } = data

  // Alertes budgets
  const budgetAlerts = myBudgets.filter(b => b.percentage >= 80)

  const renderContent = () => {
    switch (activeTab) {
    //   case 'timeline':  return <EquipeTimeline expenses={expenses} />
    case 'timeline': return <SuiviTab />
      case 'mileage':   return <EquipeMileage />
      case 'ocr':       return <EquipeOCR />
      case 'reimb':     return <EquipeReimbHistory data={data} />
      case 'reports':   return <EquipeReports data={data} />
      case 'templates': return <EquipeTemplates data={data} />
      case 'missions':  return <EquipeMissions data={data} />
      case 'chat':      return <EquipeChat expenses={expenses} />
      case 'summary':   return <EquipeMonthlySummary data={data} />
      default:          return <DashboardHome data={data} budgetAlerts={budgetAlerts} setTab={setActiveTab} />
    }
  }

  return (
    <div className="space-y-0">
      {/* Bannière rôle */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
            {data.user?.first_name?.[0]}{data.user?.last_name?.[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{data.user?.first_name} {data.user?.last_name}</p>
            <p className="text-xs text-gray-400">Espace Équipe · {data.user?.team?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {budgetAlerts.length > 0 && (
            <button onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 font-medium">
              <AlertCircle size={12} />
              {budgetAlerts.length} alerte{budgetAlerts.length > 1 ? 's' : ''} budget
            </button>
          )}
          <Link to="/app/expenses/new" className="btn-primary text-xs px-3 py-2">
            <Plus size={13} /> Nouvelle dépense
          </Link>
        </div>
      </div>

      {/* Navigation horizontale */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          {NAV_TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                  active
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}>
                <Icon size={14} />
                {tab.label}
                {tab.id === 'chat' && (
                  <span className="w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenu */}
      {renderContent()}
    </div>
  )
}

/* ─── Dashboard Home ──────────────────────────────────────────── */
function DashboardHome({ data, budgetAlerts, setTab }) {
  const { stats, expenses, myBudgets, reimbursements } = data

  const kpis = [
    { label: 'Dépenses ce mois',   value: fmt(stats.totalMonth),    sub: `${stats.countMonth} soumissions`,  color: 'bg-indigo-50', icon: TrendingUp, iconColor: 'text-indigo-600' },
    { label: 'En attente',          value: stats.pending,            sub: fmt(stats.pendingAmount),           color: 'bg-amber-50',  icon: Clock3,     iconColor: 'text-amber-600' },
    { label: 'À rembourser',        value: fmt(stats.approved),      sub: 'Approuvé, en cours',               color: 'bg-emerald-50', icon: CheckCircle2, iconColor: 'text-emerald-600' },
    { label: 'Remboursé total',     value: fmt(stats.paid),          sub: 'Encaissé',                         color: 'bg-purple-50', icon: CreditCard, iconColor: 'text-purple-600' },
  ]

  const recent = expenses.slice(0, 5)

  return (
    <div className="space-y-4">

      {/* Alertes budgets */}
      {budgetAlerts.length > 0 && (
        <div className="space-y-2">
          {budgetAlerts.map(b => (
            <div key={b.id} className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${
              b.percentage >= 100 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <AlertCircle size={15} className="shrink-0" />
              <span className="flex-1">
                <strong>{b.label}</strong> — {b.percentage}% utilisé
                {b.percentage >= 100 ? ' · Budget dépassé !' : ' · Approche du plafond'}
              </span>
              <span className="text-xs font-medium">{fmt(b.remaining)} restant</span>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className={`card p-4 ${k.color}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-500 leading-tight">{k.label}</p>
                <Icon size={15} className={k.iconColor} />
              </div>
              <p className="text-xl font-bold text-gray-900 tabular-nums">{k.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Dépenses récentes */}
        <div className="card p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Dépenses récentes</h3>
            <Link to="/app/expenses" className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
              Tout voir <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recent.map(e => {
              const s = STATUS_CONFIG[e.status] ?? STATUS_CONFIG.draft
              const Icon = s.icon
              return (
                <Link key={e.id} to={`/app/expenses/${e.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.bg}`}>
                    <Icon size={14} className={s.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{e.title}</p>
                    <p className="text-xs text-gray-400">{fmtDate(e.expense_date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900 tabular-nums">{fmt(e.amount)}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${s.bg} ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
          <button onClick={() => setTab('timeline')}
            className="mt-3 w-full py-2 text-xs text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition flex items-center justify-center gap-1">
            Voir le suivi détaillé <ArrowRight size={12} />
          </button>
        </div>

        {/* Panneau droit */}
        <div className="space-y-3">
          {/* Budgets */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Mes budgets</h3>
              <button onClick={() => setTab('summary')} className="text-xs text-indigo-500 hover:underline">Bilan</button>
            </div>
            <div className="space-y-3">
              {myBudgets.slice(0, 3).map(b => (
                <div key={b.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 truncate max-w-[120px]">{b.label}</span>
                    <span className={`font-semibold tabular-nums ${b.percentage >= 100 ? 'text-red-600' : b.percentage >= 80 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {b.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      b.percentage >= 100 ? 'bg-red-500' : b.percentage >= 80 ? 'bg-amber-400' : 'bg-indigo-500'
                    }`} style={{ width: `${Math.min(b.percentage, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{fmt(b.spent)} / {fmt(b.amount)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Actions rapides</h3>
            <div className="space-y-1.5">
              {[
                { label: 'Scanner un reçu',     tab: 'ocr',       icon: Camera,      color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Calcul kilométrique',  tab: 'mileage',   icon: Calculator,  color: 'text-blue-600 bg-blue-50' },
                { label: 'Utiliser un modèle',   tab: 'templates', icon: Zap,         color: 'text-purple-600 bg-purple-50' },
                { label: 'Créer un rapport',     tab: 'reports',   icon: FolderOpen,  color: 'text-amber-600 bg-amber-50' },
              ].map(a => {
                const Icon = a.icon
                return (
                  <button key={a.label} onClick={() => setTab(a.tab)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition text-left">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                      <Icon size={13} />
                    </div>
                    <span className="text-xs text-gray-700">{a.label}</span>
                    <ChevronRight size={12} className="text-gray-300 ml-auto" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Dernier remboursement */}
          {reimbursements[0] && (
            <div className="card p-4 bg-indigo-50 border-indigo-100">
              <p className="text-xs text-indigo-600 font-medium mb-1">Dernier remboursement</p>
              <p className="text-lg font-bold text-indigo-900 tabular-nums">{fmt(reimbursements[0].amount)}</p>
              <p className="text-xs text-indigo-600 mt-0.5">{reimbursements[0].method} · {fmtDate(reimbursements[0].date)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}