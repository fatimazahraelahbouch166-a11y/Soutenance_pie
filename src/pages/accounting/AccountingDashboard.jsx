import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, Receipt, AlertCircle,
  FileText, BookOpen, Scale, BarChart2, ArrowRight,
} from 'lucide-react'
import accountingService from '../../services/accountingService'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

function KpiCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="card-static" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 100,
            background: trend >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
            color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
          }}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-.01em' }}>{value}</p>
        {sub && <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 3 }}>{sub}</p>}
      </div>
    </div>
  )
}

function QuickLink({ to, icon: Icon, label, description, color }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className="card" style={{
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={17} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)' }}>{label}</p>
          <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{description}</p>
        </div>
        <ArrowRight size={14} color="var(--silver)" />
      </div>
    </Link>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--pearl)', borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,.08)',
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{fmt(p.value)} MAD</strong>
        </p>
      ))}
    </div>
  )
}

export default function AccountingDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    accountingService.getDashboardStats().then(s => { setStats(s); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--muted)' }}>
      <div style={{ width: 18, height: 18, border: '2px solid var(--accent-mid)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      Chargement du tableau de bord…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const kpis = [
    { label: 'Revenus totaux',     value: `${fmt(stats.revenue)} MAD`,    sub: 'Exercice courant', icon: TrendingUp,   color: 'var(--success)', trend: 8.4 },
    { label: 'Charges totales',    value: `${fmt(stats.expenses)} MAD`,   sub: 'Exercice courant', icon: TrendingDown, color: 'var(--danger)',  trend: -2.1 },
    { label: 'Résultat net',       value: `${fmt(stats.result)} MAD`,     sub: 'Bénéfice',         icon: DollarSign,   color: 'var(--accent)',  trend: 12.6 },
    { label: 'TVA à décaisser',    value: `${fmt(stats.tva_to_pay)} MAD`, sub: 'Solde TVA net',    icon: Receipt,      color: 'var(--gold)',    trend: undefined },
    { label: 'Factures en attente',value: `${fmt(stats.invoices_pending)} MAD`, sub: 'Envoyées non payées', icon: FileText, color: '#7C3AED', trend: undefined },
    { label: 'Factures en retard', value: `${fmt(stats.invoices_overdue)} MAD`, sub: 'Dépassées',    icon: AlertCircle,  color: 'var(--danger)',  trend: undefined },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
          Tableau de Bord Comptable
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          Vue d'ensemble des finances — Exercice 2024
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Revenue vs Expenses Area Chart */}
        <div className="card-static" style={{ padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 16 }}>
            Revenus vs Charges — 2024
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.monthly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--danger)" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--pearl)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--silver)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--silver)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue"  name="Revenus"  stroke="var(--accent)" strokeWidth={2} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="expenses" name="Charges"  stroke="var(--danger)" strokeWidth={2} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Result Bar Chart */}
        <div className="card-static" style={{ padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 16 }}>
            Résultat mensuel — 2024
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.monthly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--pearl)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--silver)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--silver)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="result" name="Résultat" radius={[4,4,0,0]} fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--silver)', marginBottom: 14 }}>
          Accès rapide
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <QuickLink to="/app/accounting/journal" icon={BookOpen}  label="Journal"       description="Saisie d'écritures"     color="var(--accent)" />
          <QuickLink to="/app/accounting/ledger"  icon={BookOpen}  label="Grand Livre"   description="Comptes détaillés"      color="#7C3AED" />
          <QuickLink to="/app/accounting/balance" icon={Scale}     label="Balance"       description="Équilibre débit/crédit" color="var(--gold)" />
          <QuickLink to="/app/accounting/invoices"icon={FileText}  label="Factures"      description="Facturation clients"    color="var(--success)" />
          <QuickLink to="/app/accounting/bilan"   icon={BarChart2} label="Bilan"         description="Actif / Passif"         color="var(--danger)" />
          <QuickLink to="/app/accounting/cpc"     icon={TrendingUp}label="CPC"           description="Produits & Charges"     color="#0891B2" />
          <QuickLink to="/app/accounting/taxes"   icon={Receipt}   label="TVA"           description="Gestion des taxes"      color="var(--warn)" />
          <QuickLink to="/app/accounting/payments"icon={DollarSign}label="Paiements"     description="Suivi règlements"       color="var(--success)" />
        </div>
      </div>
    </div>
  )
}
