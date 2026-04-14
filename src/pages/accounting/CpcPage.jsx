import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, TrendingUp, TrendingDown, Minus, Printer } from 'lucide-react'
import accountingService from '../../services/accountingService'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)

const REVENUE_CODES  = ['7110','7120','7210','7410','7510']
const EXPENSE_CODES  = ['6110','6120','6210','6220','6230','6310','6320','6410','6510','6610']

function CpcLine({ label, value, indent = false, bold = false, separator = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: indent ? '8px 20px 8px 40px' : '8px 20px',
      borderBottom: separator ? '2px solid var(--warm-border)' : '1px solid var(--ivory)',
      background: bold ? 'var(--cream)' : '#fff',
      transition: 'background .15s',
    }}
      onMouseEnter={e => !bold && (e.currentTarget.style.background = 'var(--ivory)')}
      onMouseLeave={e => !bold && (e.currentTarget.style.background = '#fff')}
    >
      <span style={{ fontSize: bold ? 13 : 12.5, fontWeight: bold ? 700 : 400, color: bold ? 'var(--ink)' : 'var(--charcoal)' }}>{label}</span>
      <span style={{ fontSize: bold ? 14 : 13, fontWeight: bold ? 700 : 500, color: bold ? 'var(--ink)' : 'var(--slate)', fontVariantNumeric: 'tabular-nums' }}>
        {fmt(value)} MAD
      </span>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid var(--pearl)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 6 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ fontSize: 12, color: p.color }}>{p.name}: <strong>{fmt(p.value)}</strong></p>)}
    </div>
  )
}

export default function CpcPage() {
  const [accounts, setAccounts] = useState([])
  const [monthly, setMonthly]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [period, setPeriod]     = useState('2024')

  useEffect(() => {
    Promise.all([
      accountingService.getAccounts(),
      accountingService.getMonthlyStats(),
    ]).then(([accs, mon]) => { setAccounts(accs); setMonthly(mon); setLoading(false) })
  }, [])

  const revenues  = accounts.filter(a => a.type === 'revenue')
  const expenses  = accounts.filter(a => a.type === 'expense')

  const totalRevenue = revenues.reduce((s, a) => s + a.balance, 0)
  const totalExpense = expenses.reduce((s, a) => s + a.balance, 0)
  const result       = totalRevenue - totalExpense

  // Split expenses into operational and financial
  const opExpenses  = expenses.filter(a => !['6510','6610'].includes(a.code))
  const finExpenses = expenses.filter(a => ['6510'].includes(a.code))
  const taxExpenses = expenses.filter(a => ['6610'].includes(a.code))

  const ebeRevenues  = revenues.filter(a => ['7110','7120','7210'].includes(a.code))
  const ebeExpenses  = expenses.filter(a => ['6110','6120','6210','6220','6230','6310','6320'].includes(a.code))
  const ebe = ebeRevenues.reduce((s, a) => s + a.balance, 0) - ebeExpenses.reduce((s, a) => s + a.balance, 0)
  const rbe = ebe - (expenses.find(a => a.code === '6410')?.balance ?? 0)
  const rBrut = rbe - finExpenses.reduce((s, a) => s + a.balance, 0)
  const rNet  = rBrut - taxExpenses.reduce((s, a) => s + a.balance, 0)

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
            CPC — Compte de Produits et Charges
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>État des résultats — Exercice {period}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="input-premium" style={{ width: 120 }} value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <button className="btn-secondary"><Printer size={14} />Imprimer</button>
          <button className="btn-secondary"><Download size={14} />Export PDF</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--pearl)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Chargement…
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'flex-start' }}>

          {/* CPC Document */}
          <div>
            {/* Result indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20,
              padding: '14px 20px', borderRadius: 12,
              background: result >= 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${result >= 0 ? 'var(--success-mid)' : 'var(--danger-mid)'}`,
            }}>
              {result >= 0 ? <TrendingUp size={20} color="var(--success)" /> : <TrendingDown size={20} color="var(--danger)" />}
              <div>
                <p style={{ fontSize: 11, color: result >= 0 ? 'var(--success)' : 'var(--danger)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>
                  {result >= 0 ? 'Résultat bénéficiaire' : 'Résultat déficitaire'}
                </p>
                <p style={{ fontSize: 20, fontWeight: 700, color: result >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {fmt(Math.abs(result))} MAD
                </p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Marge nette</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: result >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {totalRevenue > 0 ? ((result / totalRevenue) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>

            {/* CPC Table */}
            <div className="card-static" style={{ overflow: 'hidden' }}>
              {/* Section header */}
              <div style={{ background: 'var(--success)', padding: '10px 20px' }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.08em' }}>I — PRODUITS D'EXPLOITATION</p>
              </div>
              {revenues.map(a => <CpcLine key={a.id} label={`${a.code} — ${a.name}`} value={a.balance} indent />)}
              <CpcLine label="Total Produits" value={totalRevenue} bold separator />

              <div style={{ background: 'var(--danger)', padding: '10px 20px' }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.08em' }}>II — CHARGES D'EXPLOITATION</p>
              </div>
              {opExpenses.map(a => <CpcLine key={a.id} label={`${a.code} — ${a.name}`} value={a.balance} indent />)}
              <CpcLine label="Total Charges d'exploitation" value={opExpenses.reduce((s, a) => s + a.balance, 0)} bold />

              <div style={{ background: 'var(--accent)', padding: '10px 20px' }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.08em' }}>III — RÉSULTATS INTERMÉDIAIRES</p>
              </div>
              <CpcLine label="EBE (Excédent Brut d'Exploitation)" value={ebe} bold />
              <CpcLine label="Résultat brut d'exploitation (après amort.)" value={rbe} indent />

              {finExpenses.length > 0 && <>
                <div style={{ background: 'var(--warn)', padding: '10px 20px' }}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.08em' }}>IV — CHARGES FINANCIÈRES</p>
                </div>
                {finExpenses.map(a => <CpcLine key={a.id} label={`${a.code} — ${a.name}`} value={a.balance} indent />)}
                <CpcLine label="Résultat avant impôt" value={rBrut} bold />
              </>}

              {taxExpenses.length > 0 && <>
                <div style={{ background: 'var(--muted)', padding: '10px 20px' }}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.08em' }}>V — IMPÔTS ET TAXES</p>
                </div>
                {taxExpenses.map(a => <CpcLine key={a.id} label={`${a.code} — ${a.name}`} value={a.balance} indent />)}
              </>}

              {/* Final Result */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px',
                background: result >= 0 ? 'var(--success)' : 'var(--danger)',
              }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  RÉSULTAT NET DE L'EXERCICE
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                  {result >= 0 ? '+' : '-'} {fmt(Math.abs(rNet))} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Right column: Chart + KPIs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* KPI cards */}
            {[
              { label: 'Chiffre d\'affaires', value: fmt(totalRevenue), color: 'var(--success)', icon: TrendingUp },
              { label: 'Total charges',       value: fmt(totalExpense), color: 'var(--danger)',  icon: TrendingDown },
              { label: 'EBE',                 value: fmt(ebe),          color: 'var(--accent)',  icon: Minus },
              { label: 'Résultat net',        value: fmt(result),       color: result >= 0 ? 'var(--success)' : 'var(--danger)', icon: result >= 0 ? TrendingUp : TrendingDown },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="card-static" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color }}>{value} <span style={{ fontSize: 10 }}>MAD</span></p>
                </div>
              </div>
            ))}

            {/* Quarterly bar chart */}
            <div className="card-static" style={{ padding: '16px 14px' }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 14 }}>Évolution mensuelle</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthly.slice(-6)} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--pearl)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--silver)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--silver)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue"  name="Revenus"  fill="var(--success)" radius={[3,3,0,0]} />
                  <Bar dataKey="expenses" name="Charges"  fill="var(--danger)"  radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
