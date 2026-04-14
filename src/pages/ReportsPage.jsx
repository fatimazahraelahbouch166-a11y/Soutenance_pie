import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import api from '../lib/api'
import PageHeader  from '../components/ui/PageHeader'
import StatCard    from '../components/ui/StatCard'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { fmt } from '../lib/helpers'
import {
  BarChart2, TrendingUp, TrendingDown, FileText,
  FileSpreadsheet, Calendar, DollarSign,
} from 'lucide-react'

const C = {
  accent:  '#3D5A80', accentLight: '#EBF0F7',
  success: '#3D7A5F', successBg: '#EBF4EF',
  warn:    '#8A6A2E', warnBg: '#F5EDD8',
  danger:  '#8A3A3A', dangerBg: '#F5EAEA',
  gold:    '#B8975A',
  ink: '#181715', charcoal: '#2C2A28', slate: '#5A5856',
  silver: '#B5B1A9', pearl: '#ECE9E3', ivory: '#F3F0EA',
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.pearl}`, borderRadius: 12, padding: '10px 14px', boxShadow: '0 4px 20px rgba(26,25,23,0.12)', minWidth: 140 }}>
      <p style={{ fontSize: 11, color: C.silver, marginBottom: 6, fontWeight: 500 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill || p.stroke, flexShrink: 0 }} />
          {p.name && <span style={{ fontSize: 11, color: C.slate }}>{p.name}</span>}
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <div className="card-static" style={{ padding: '20px 22px' }}>
      <SectionHeader title={title} subtitle={subtitle} />
      {children}
    </div>
  )
}

const MONTHLY_TREND = [
  { month: 'Oct', revenus: 42000, depenses: 32000, profit: 10000 },
  { month: 'Nov', revenus: 38500, depenses: 28500, profit: 10000 },
  { month: 'Déc', revenus: 51000, depenses: 41000, profit: 10000 },
  { month: 'Jan', revenus: 47000, depenses: 38000, profit:  9000 },
  { month: 'Fév', revenus: 55000, depenses: 43000, profit: 12000 },
  { month: 'Mar', revenus: 62000, depenses: 48200, profit: 13800 },
]

const TOP_CATEGORIES = [
  { name: 'Déplacement',  total: 12800, pct: 27, color: '#6366f1' },
  { name: 'Formation',    total:  9400, pct: 20, color: '#ef4444' },
  { name: 'Hébergement',  total:  8200, pct: 17, color: '#10b981' },
  { name: 'Informatique', total:  7600, pct: 16, color: '#3b82f6' },
  { name: 'Restauration', total:  6100, pct: 13, color: '#f59e0b' },
  { name: 'Fournitures',  total:  3100, pct:  7, color: '#8b5cf6' },
]

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod]   = useState('month')
  const [from, setFrom]       = useState('2025-01-01')
  const [to, setTo]           = useState('2025-03-31')
  const [hoverCat, setHoverCat] = useState(null)

  useEffect(() => {
    setTimeout(() => setLoading(false), 600)
  }, [])

  const totalRevenue  = MONTHLY_TREND.reduce((s, m) => s + m.revenus,  0)
  const totalExpenses = MONTHLY_TREND.reduce((s, m) => s + m.depenses, 0)
  const totalProfit   = totalRevenue - totalExpenses
  const avgProfit     = Math.round(totalProfit / MONTHLY_TREND.length)
  const catTotal      = TOP_CATEGORIES.reduce((s, c) => s + c.total, 0)

  const handleExportCSV = () => {
    const rows = [['Mois', 'Revenus', 'Dépenses', 'Profit'], ...MONTHLY_TREND.map(m => [m.month, m.revenus, m.depenses, m.profit])]
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'rapport_expenseiq.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <PageHeader
        title="Rapports & Analytiques"
        subtitle="Analysez vos revenus, dépenses et tendances financières"
        icon={<BarChart2 size={18} />}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={handleExportCSV} style={{ height: 34, fontSize: 12, padding: '0 14px' }}>
              <FileSpreadsheet size={13} /> Exporter CSV
            </button>
            <button className="btn-secondary" onClick={() => window.print()} style={{ height: 34, fontSize: 12, padding: '0 14px' }}>
              <FileText size={13} /> Exporter PDF
            </button>
          </div>
        }
      />

      {/* Period selector */}
      <div className="card-static" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Calendar size={14} style={{ color: C.accent, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: C.charcoal }}>Période :</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ key:'week', label:'Semaine' }, { key:'month', label:'Mois' }, { key:'year', label:'Année' }, { key:'custom', label:'Personnalisé' }].map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)} style={{
              padding: '5px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12.5, fontWeight: period === p.key ? 600 : 400,
              background: period === p.key ? C.accent : 'transparent',
              color: period === p.key ? '#fff' : C.silver, transition: 'all 0.15s',
            }}>
              {p.label}
            </button>
          ))}
        </div>
        {period === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="date" className="input-premium" value={from} onChange={e => setFrom(e.target.value)} style={{ width: 150 }} />
            <span style={{ color: C.silver, fontSize: 12 }}>→</span>
            <input type="date" className="input-premium" value={to}   onChange={e => setTo(e.target.value)}   style={{ width: 150 }} />
          </div>
        )}
      </div>

      {/* KPIs */}
      {loading ? <LoadingSkeleton type="stat" count={4} /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatCard label="Total Revenus"     value={fmt(totalRevenue)}  delta="+8% vs période précédente" trend="up"   icon={<TrendingUp size={15} />}  color="success" />
          <StatCard label="Total Dépenses"    value={fmt(totalExpenses)} delta="+5% vs période précédente" trend="down" icon={<TrendingDown size={15} />} color="danger"  />
          <StatCard label="Profit net"        value={fmt(totalProfit)}   delta="Marge: 22%"                trend="up"   icon={<DollarSign size={15} />}  color="accent"  />
          <StatCard label="Profit moyen/mois" value={fmt(avgProfit)}     delta="Sur 6 mois"                             icon={<BarChart2 size={15} />}   color="gold"    />
        </div>
      )}

      {/* Area chart — Revenue vs Expenses */}
      <Section title="Revenus vs Dépenses" subtitle="Évolution sur la période sélectionnée">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHLY_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.success} stopOpacity={0.18} />
                <stop offset="95%" stopColor={C.success} stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.danger} stopOpacity={0.15} />
                <stop offset="95%" stopColor={C.danger} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 6" stroke={C.ivory} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.silver }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: C.silver }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Area type="monotone" dataKey="revenus"  name="Revenus"  stroke={C.success} strokeWidth={2.5} fill="url(#gRev)"
              dot={{ r: 3, fill: '#fff', stroke: C.success, strokeWidth: 2 }} />
            <Area type="monotone" dataKey="depenses" name="Dépenses" stroke={C.danger}  strokeWidth={2.5} fill="url(#gExp)"
              dot={{ r: 3, fill: '#fff', stroke: C.danger,  strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Section>

      {/* Profit bar + Categories pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Section title="Profit mensuel" subtitle="Revenus – Dépenses par mois">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -14 }}>
              <CartesianGrid strokeDasharray="2 6" stroke={C.ivory} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.silver }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.silver }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="profit" name="Profit" radius={[6,6,0,0]} maxBarSize={36}>
                {MONTHLY_TREND.map((m, i) => <Cell key={i} fill={m.profit >= 0 ? C.success : C.danger} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Répartition par catégorie" subtitle="Dépenses par poste budgétaire">
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ResponsiveContainer width={140} height={140} style={{ flexShrink: 0 }}>
              <PieChart>
                <Pie data={TOP_CATEGORIES} dataKey="total" nameKey="name"
                  innerRadius={38} outerRadius={58} paddingAngle={3} strokeWidth={0}
                  onMouseEnter={(_, i) => setHoverCat(i)} onMouseLeave={() => setHoverCat(null)}
                >
                  {TOP_CATEGORIES.map((c, i) => (
                    <Cell key={i} fill={c.color}
                      opacity={hoverCat === null || hoverCat === i ? 1 : 0.3}
                      style={{ cursor: 'pointer', transition: 'opacity .18s' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TOP_CATEGORIES.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'default',
                  opacity: hoverCat === null || hoverCat === i ? 1 : 0.35, transition: 'opacity .18s' }}
                  onMouseEnter={() => setHoverCat(i)} onMouseLeave={() => setHoverCat(null)}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 11.5, color: C.slate, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                  <span style={{ fontSize: 10.5, color: C.silver, minWidth: 24 }}>{c.pct}%</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.charcoal, fontVariantNumeric: 'tabular-nums', minWidth: 70, textAlign: 'right' }}>{fmt(c.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* Detailed tables */}
      <Section title="Détail par catégorie" subtitle="Montants dépensés par poste budgétaire">
        <table className="premium-table">
          <thead>
            <tr><th>Catégorie</th><th>Montant dépensé</th><th>% du total</th><th>Progression</th></tr>
          </thead>
          <tbody>
            {TOP_CATEGORIES.map((c, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 500, color: C.charcoal }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 600, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{fmt(c.total)}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: 20, background: C.accentLight, color: C.accent, fontSize: 11.5, fontWeight: 600 }}>{c.pct}%</span>
                </td>
                <td style={{ minWidth: 160 }}>
                  <div style={{ height: 6, background: C.ivory, borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 10 }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Tendance mensuelle" subtitle="Vue tabulaire mois par mois">
        <table className="premium-table">
          <thead>
            <tr><th>Mois</th><th>Revenus</th><th>Dépenses</th><th>Profit</th><th>Marge</th></tr>
          </thead>
          <tbody>
            {MONTHLY_TREND.map((m, i) => {
              const marge = m.revenus > 0 ? Math.round((m.profit / m.revenus) * 100) : 0
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: C.charcoal }}>{m.month}</td>
                  <td style={{ color: C.success, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(m.revenus)}</td>
                  <td style={{ color: C.danger,  fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(m.depenses)}</td>
                  <td style={{ fontWeight: 700, color: m.profit >= 0 ? C.success : C.danger, fontVariantNumeric: 'tabular-nums' }}>
                    {m.profit >= 0 ? '+' : ''}{fmt(m.profit)}
                  </td>
                  <td>
                    <span style={{
                      padding: '2px 8px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
                      background: marge >= 20 ? C.successBg : marge >= 10 ? C.warnBg : C.dangerBg,
                      color:      marge >= 20 ? C.success   : marge >= 10 ? C.warn   : C.danger,
                    }}>{marge}%</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Section>

    </div>
  )
}
