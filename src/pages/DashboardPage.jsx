/**
 * DashboardPage.jsx  —  ERP Control Center
 * ─────────────────────────────────────────────────────────────────────────────
 * Aggregates data from ALL modules (expenses, revenues, invoices, budgets,
 * customers, stock, accounting, subscription) via GlobalStore.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle,
  CheckCircle, FileText, Package, Users, Receipt, Wallet,
  ArrowRight, Plus, BookOpen, Scale, Crown, BarChart2,
  ShoppingCart, ChevronRight, AlertCircle, Target,
} from 'lucide-react'
import { useAuth }           from '../contexts/AuthContext'
import { useSubscription }   from '../contexts/SubscriptionContext'
import { useGlobalStore }    from '../store/GlobalStore'
import { buildDashboardStats } from '../services/dashboardService'
import { TrialCountdownCard }  from '../components/subscription/TrialCountdown'
import StatusBadge             from '../components/StatusBadge'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0)
const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—'

const C = {
  accent: '#3D5A80', accentL: '#EBF0F7',
  success: '#3D7A5F', successBg: '#EBF4EF',
  warn: '#8A6A2E', warnBg: '#F5EDD8',
  danger: '#8A3A3A', dangerBg: '#F5EAEA',
  gold: '#B8975A', goldBg: '#F2E8D5',
  ink: '#181715', charcoal: '#2C2A28',
  slate: '#5A5856', silver: '#B5B1A9',
  pearl: '#ECE9E3', ivory: '#F3F0EA', cream: '#F8F6F2',
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, color, bg, trend, link, alert }) {
  const inner = (
    <div style={{
      background: '#fff', border: `1px solid ${alert ? color + '60' : C.pearl}`,
      borderRadius: 14, padding: '16px 18px',
      borderLeft: alert ? `3px solid ${color}` : undefined,
      transition: 'all .2s', cursor: link ? 'pointer' : 'default',
    }}
      onMouseEnter={e => link && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => link && (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: bg || color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 100,
            background: trend >= 0 ? C.successBg : C.dangerBg,
            color: trend >= 0 ? C.success : C.danger,
          }}>{trend >= 0 ? '+' : ''}{trend}%</span>
        )}
        {alert && <AlertCircle size={14} color={color} />}
      </div>
      <p style={{ fontSize: 10.5, color: C.silver, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color: C.ink, letterSpacing: '-.01em' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: C.silver, marginTop: 3 }}>{sub}</p>}
    </div>
  )
  return link ? <Link to={link} style={{ textDecoration: 'none' }}>{inner}</Link> : inner
}

// ─── Chart Tooltip ───────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.pearl}`, borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,.1)' }}>
      <p style={{ fontSize: 11, color: C.silver, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, flexShrink: 0 }} />
          {p.name && <span style={{ fontSize: 11, color: C.slate }}>{p.name}</span>}
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(p.value)} MAD
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Quick Action ────────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, to, color = C.accent }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        padding: '14px 10px', background: '#fff', border: `1px solid ${C.pearl}`,
        borderRadius: 14, cursor: 'pointer', transition: 'all .2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = color + '0a'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.pearl; e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={color} />
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: C.charcoal, textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
      </div>
    </Link>
  )
}

// ─── Budget Bar ──────────────────────────────────────────────────────────────
function BudgetBar({ budget }) {
  const alloc = budget.allocated_amount ?? budget.amount ?? 1
  const spent = budget.spent_amount ?? budget.spent ?? 0
  const pct   = Math.min(Math.round((spent / alloc) * 100), 100)
  const over  = pct >= 100
  const alert = pct >= 80 && !over
  const color = over ? C.danger : alert ? C.warn : C.success

  return (
    <Link to="/app/budgets" style={{ textDecoration: 'none' }}>
      <div style={{ padding: '10px 14px', background: '#fff', border: `1px solid ${C.pearl}`, borderLeft: `3px solid ${color}`, borderRadius: 10, marginBottom: 8, transition: 'background .15s' }}
        onMouseEnter={e => e.currentTarget.style.background = C.cream}
        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.charcoal }}>{budget.name}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color, padding: '1px 7px', background: color + '15', borderRadius: 100 }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: C.ivory, borderRadius: 10, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 10, transition: 'width .8s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10.5, color: C.silver }}>Dépensé : <b style={{ color: C.charcoal }}>{fmt(spent)}</b></span>
          <span style={{ fontSize: 10.5, color: C.silver }}>Alloué : <b style={{ color: C.charcoal }}>{fmt(alloc)}</b></span>
        </div>
      </div>
    </Link>
  )
}

// ─── Activity Row ────────────────────────────────────────────────────────────
const MODULE_COLORS = {
  expense: C.warn, invoice: C.accent, revenue: C.success,
  reimbursement: '#7C3AED', product: '#0891B2',
}
function ActivityRow({ item }) {
  const color = MODULE_COLORS[item.type] ?? C.silver
  return (
    <Link to={item.link} style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 14px', borderRadius: 10, transition: 'background .15s' }}
        onMouseEnter={e => e.currentTarget.style.background = C.cream}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={13} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12.5, fontWeight: 500, color: C.charcoal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</p>
          <p style={{ fontSize: 11, color: C.silver, marginTop: 1 }}>{item.module} · {fmtDate(item.date)}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {item.amount && <p style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{fmt(item.amount)} <span style={{ fontSize: 9.5, fontWeight: 400 }}>MAD</span></p>}
          {item.status && <StatusBadge status={item.status} />}
        </div>
      </div>
    </Link>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ title, link, linkLabel = 'Voir tout', children, style }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.pearl}`, borderRadius: 14, padding: '18px 20px', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.charcoal }}>{title}</p>
        {link && (
          <Link to={link} style={{ fontSize: 11.5, color: C.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
            {linkLabel} <ChevronRight size={12} />
          </Link>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── STATUS BADGE (inline) ───────────────────────────────────────────────────
const ST = {
  paid:     { bg: '#EBF4EF', color: '#3D7A5F', label: 'Payée'   },
  sent:     { bg: '#EBF0F7', color: '#3D5A80', label: 'Envoyée' },
  overdue:  { bg: '#F5EAEA', color: '#8A3A3A', label: 'En retard' },
  pending:  { bg: '#F5EDD8', color: '#8A6A2E', label: 'En attente' },
  approved: { bg: '#EBF4EF', color: '#3D7A5F', label: 'Approuvée' },
  received: { bg: '#EBF4EF', color: '#3D7A5F', label: 'Reçu'   },
  draft:    { bg: '#ECE9E3', color: '#8A8780', label: 'Brouillon' },
  rejected: { bg: '#F5EAEA', color: '#8A3A3A', label: 'Rejetée' },
}
function Badge({ status }) {
  const s = ST[status] ?? { bg: '#ECE9E3', color: '#8A8780', label: status }
  return <span style={{ fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: s.bg, color: s.color }}>{s.label}</span>
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const { isTrialing, daysLeft, currentPlan } = useSubscription()
  const { state, selectors } = useGlobalStore()

  // Pass live-computed budgets and customers so KPIs reflect real-time state
  const d = useMemo(() => buildDashboardStats({
    ...state,
    budgets:   selectors.computedBudgets,
    customers: selectors.computedCustomers,
  }), [state, selectors.computedBudgets, selectors.computedCustomers])

  const isOwner    = user?.role === 'owner'
  const isManager  = ['owner', 'chef_equipe'].includes(user?.role)

  if (state.loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 16 }}>
      <div style={{ width: 22, height: 22, border: `2px solid ${C.accentL}`, borderTopColor: C.accent, borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <p style={{ fontSize: 13, color: C.silver }}>Chargement du tableau de bord…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1300 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 4 }}>
            Bonjour, {user?.first_name} 👋
          </h1>
          <p style={{ fontSize: 13, color: C.slate }}>
            Vue d'ensemble ERP — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isTrialing && (
            <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 10, background: C.goldBg, color: C.gold, border: `1px solid ${C.gold}40` }}>
              <Crown size={12} style={{ marginRight: 5, verticalAlign: 'middle' }} />
              Essai — {daysLeft}j restants
            </span>
          )}
          <span style={{ fontSize: 12, padding: '6px 12px', borderRadius: 10, background: C.accentL, color: C.accent, fontWeight: 500 }}>
            {currentPlan?.name ?? 'Plan actif'}
          </span>
        </div>
      </div>

      {/* ── Subscription trial card ── */}
      <TrialCountdownCard />

      {/* ── KPI Grid — Finance ── */}
      {isOwner && (
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: C.silver, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
            Indicateurs financiers
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <KpiCard label="Revenus totaux"     value={`${fmt(d.totalRevenue)} MAD`}   icon={TrendingUp}   color={C.success} trend={8.4}  link="/app/incomes" />
            <KpiCard label="Charges totales"    value={`${fmt(d.totalExpenses)} MAD`}  icon={TrendingDown} color={C.danger}  trend={-2.1} link="/app/expenses" />
            <KpiCard label="Résultat net"       value={`${fmt(d.netResult)} MAD`}      icon={DollarSign}   color={d.netResult >= 0 ? C.success : C.danger} trend={12.6} />
            <KpiCard label="TVA à décaisser"    value={`${fmt(d.tvaToPay)} MAD`}       icon={Receipt}      color={C.gold}   link="/app/accounting/taxes" />
          </div>
        </div>
      )}

      {/* ── KPI Grid — Operations ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isOwner ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: 14 }}>
        <KpiCard label="Dépenses en attente" value={`${d.pendingExpenses}`}
          sub={`${fmt(d.pendingAmount)} MAD`}
          icon={Clock}       color={C.warn}    link="/app/validation"
          alert={d.pendingExpenses > 3} />
        {isOwner && (
          <KpiCard label="Factures impayées"  value={`${fmt(d.unpaidInvoices)} MAD`}
            sub={d.overdueInvoices > 0 ? `⚠ ${fmt(d.overdueInvoices)} MAD en retard` : 'À jour'}
            icon={FileText}    color={C.accent}  link="/app/accounting/invoices"
            alert={d.overdueInvoices > 0} />
        )}
        <KpiCard label="Remboursements dus"  value={`${fmt(d.pendingReimb)} MAD`}
          sub={`à valider`}
          icon={Wallet}      color={'#7C3AED'} link="/app/reimbursements" />
        <KpiCard label="Budget consommé"     value={`${d.budgetUsagePct}%`}
          sub={`${fmt(d.totalSpent)} / ${fmt(d.totalBudget)} MAD`}
          icon={Target}      color={d.budgetUsagePct >= 80 ? C.danger : C.success}
          link="/app/budgets"
          alert={d.budgetUsagePct >= 80} />
      </div>

      {/* ── Charts row ── */}
      {isOwner && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>

          {/* Revenue vs Expenses Area Chart */}
          <Section title="Revenus vs Charges" link="/app/reports">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={d.monthly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.success} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={C.success} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.danger}  stopOpacity={0.18} />
                    <stop offset="95%" stopColor={C.danger}  stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.pearl} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.silver }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.silver }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="revenue"  name="Revenus" stroke={C.success} strokeWidth={2} fill="url(#gRev)" />
                <Area type="monotone" dataKey="expenses" name="Charges" stroke={C.danger}  strokeWidth={2} fill="url(#gExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </Section>

          {/* Invoice status PieChart */}
          <Section title="Statut facturation">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={d.invoiceStatus} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {d.invoiceStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {d.invoiceStatus.map(s => (
                <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                    <span style={{ width: 9, height: 9, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: C.slate }}>{s.name} ({s.count})</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.charcoal }}>{fmt(s.value)} MAD</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── Alerts band ── */}
      {(d.budgetAlerts.length > 0 || d.lowStockCount > 0 || d.overdueInvoices > 0) && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {d.budgetAlerts.map(b => {
            const pct = Math.round(((b.spent_amount ?? 0) / (b.allocated_amount ?? 1)) * 100)
            return (
              <Link key={b.id} to="/app/budgets" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 14px', borderRadius: 10, background: pct >= 100 ? C.dangerBg : C.warnBg, border: `1px solid ${pct >= 100 ? C.danger : C.warn}40`, cursor: 'pointer' }}>
                  <AlertTriangle size={13} color={pct >= 100 ? C.danger : C.warn} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: pct >= 100 ? C.danger : C.warn }}>
                    Budget "{b.name}" à {pct}%
                  </span>
                </div>
              </Link>
            )
          })}
          {d.lowStockCount > 0 && (
            <Link to="/app/stock" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 14px', borderRadius: 10, background: '#FFF3E0', border: '1px solid #FF980040', cursor: 'pointer' }}>
                <Package size={13} color="#E65100" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#E65100' }}>
                  {d.lowStockCount} produit{d.lowStockCount > 1 ? 's' : ''} en stock critique
                </span>
              </div>
            </Link>
          )}
          {d.overdueInvoices > 0 && (
            <Link to="/app/accounting/invoices" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 14px', borderRadius: 10, background: C.dangerBg, border: `1px solid ${C.danger}40`, cursor: 'pointer' }}>
                <AlertCircle size={13} color={C.danger} />
                <span style={{ fontSize: 12, fontWeight: 600, color: C.danger }}>
                  {fmt(d.overdueInvoices)} MAD de factures en retard
                </span>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* ── Middle columns: activity + budgets ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>

        {/* Recent activity */}
        <Section title="Activité récente" link="/app/expenses" linkLabel="Toutes les dépenses">
          {d.recentExpenses.length === 0 ? (
            <p style={{ fontSize: 13, color: C.silver, textAlign: 'center', padding: 20 }}>Aucune activité</p>
          ) : (
            <div>
              {d.recentExpenses.map(e => (
                <Link key={e.id} to={`/app/expenses/${e.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${C.ivory}`, transition: 'background .15s' }}
                    onMouseEnter={ev => ev.currentTarget.style.background = C.cream}
                    onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: (e.category_color ?? C.accent) + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <DollarSign size={12} color={e.category_color ?? C.accent} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 500, color: C.charcoal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</p>
                      <p style={{ fontSize: 11, color: C.silver }}>{e.employee_name} · {fmtDate(e.date)}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{fmt(e.amount)} MAD</p>
                      <Badge status={e.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Section>

        {/* Budgets */}
        <Section title="Suivi budgets" link="/app/budgets">
          {d.budgets.map(b => <BudgetBar key={b.id} budget={b} />)}
        </Section>
      </div>

      {/* ── Bottom row: invoices + revenues + accounting ── */}
      {isOwner && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

          {/* Recent invoices */}
          <Section title="Factures récentes" link="/app/accounting/invoices">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Référence', 'Client', 'Total', 'Statut'].map(h => (
                    <th key={h} style={{ padding: '6px 8px', fontSize: 10, fontWeight: 600, color: C.silver, textTransform: 'uppercase', letterSpacing: '.07em', textAlign: h === 'Total' ? 'right' : 'left', borderBottom: `1px solid ${C.pearl}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.recentInvoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${C.ivory}` }}>
                    <td style={{ padding: '8px', fontSize: 11.5, fontFamily: 'monospace', color: C.accent, fontWeight: 600 }}>{inv.reference}</td>
                    <td style={{ padding: '8px', fontSize: 12.5 }}>{inv.customer_name}</td>
                    <td style={{ padding: '8px', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{fmt(inv.total)}</td>
                    <td style={{ padding: '8px' }}><Badge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* Recent revenues */}
          <Section title="Revenus récents" link="/app/incomes">
            {d.recentRevenues.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${C.ivory}` }}>
                <div>
                  <p style={{ fontSize: 12.5, fontWeight: 500, color: C.charcoal }}>{r.title}</p>
                  <p style={{ fontSize: 11, color: C.silver }}>{r.category} · {fmtDate(r.date)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.success }}>{fmt(r.amount)} MAD</p>
                  {r.invoice_id && (
                    <Link to="/app/accounting/invoices" style={{ fontSize: 10, color: C.accent, textDecoration: 'none' }}>
                      → FAC-2025-{String(r.invoice_id).padStart(3,'0')}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </Section>
        </div>
      )}

      {/* ── Accounting snapshot ── */}
      {isOwner && (
        <Section title="Dernières écritures comptables" link="/app/accounting/journal">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Date', 'Référence', 'Description', 'Source', 'Montant'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', fontSize: 10, fontWeight: 600, color: C.silver, textTransform: 'uppercase', letterSpacing: '.07em', textAlign: h === 'Montant' ? 'right' : 'left', borderBottom: `1px solid ${C.pearl}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.recentAccounting.map(e => (
                  <tr key={e.id} style={{ borderBottom: `1px solid ${C.ivory}` }}>
                    <td style={{ padding: '8px 10px', fontSize: 12, color: C.silver }}>{fmtDate(e.date)}</td>
                    <td style={{ padding: '8px 10px', fontSize: 11.5, fontFamily: 'monospace', color: C.accent, fontWeight: 600 }}>{e.reference}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12.5, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 100, background: C.accentL, color: C.accent, fontWeight: 600 }}>
                        {e.source_module}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: C.charcoal }}>
                      {fmt(e.amount)} MAD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ── Quick actions ── */}
      <Section title="Actions rapides">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
          <QuickAction icon={Plus}       label="Nouvelle dépense"       to="/app/expenses/new"            color={C.warn} />
          <QuickAction icon={TrendingUp} label="Ajouter un revenu"      to="/app/incomes"                  color={C.success} />
          <QuickAction icon={FileText}   label="Créer facture"          to="/app/accounting/invoices"      color={C.accent} />
          <QuickAction icon={BookOpen}   label="Écriture journal"       to="/app/accounting/journal"       color="#7C3AED" />
          <QuickAction icon={Users}      label="Nouveau client"         to="/app/customers"                color="#0891B2" />
          <QuickAction icon={ShoppingCart}label="Bon de commande"       to="/app/stock"                    color={C.gold} />
          <QuickAction icon={BarChart2}  label="Voir rapports"          to="/app/reports"                  color={C.accent} />
          <QuickAction icon={Scale}      label="Balance comptable"      to="/app/accounting/balance"       color={C.success} />
        </div>
      </Section>

      {/* ── Top customers (owner only) ── */}
      {isOwner && d.topCustomers.length > 0 && (
        <Section title="Top clients" link="/app/customers">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {d.topCustomers.map((c, i) => (
              <Link key={c.id} to="/app/customers" style={{ textDecoration: 'none' }}>
                <div style={{ padding: '12px 14px', background: C.cream, border: `1px solid ${C.pearl}`, borderRadius: 10, transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accentL; e.currentTarget.style.borderColor = C.accent + '40' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.cream; e.currentTarget.style.borderColor = C.pearl }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.accentL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: C.accent, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: C.charcoal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{fmt(c.total_billed)} <span style={{ fontSize: 10 }}>MAD</span></p>
                  <p style={{ fontSize: 11, color: c.balance > 0 ? C.danger : C.success, marginTop: 2 }}>
                    {c.balance > 0 ? `Solde dû : ${fmt(c.balance)} MAD` : 'À jour'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

    </div>
  )
}
