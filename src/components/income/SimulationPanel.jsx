// src/components/income/SimulationPanel.jsx
// ── Simulateur de revenus — impact dynamique sur objectifs ──

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Plus, Minus, RotateCcw, Zap, TrendingUp, Target, Info } from 'lucide-react'

const D = {
  primary: '#284E7B', secondary: '#659ABD', light: '#ADD4F3', bg: '#EFF3F5',
  green: '#16a34a', greenBg: '#f0fdf4', greenBorder: '#bbf7d0',
  red: '#dc2626', redBg: '#fef2f2', amber: '#d97706', amberBg: '#fffbeb',
  purple: '#7c3aed', purpleBg: '#f5f3ff',
  gray100: '#f3f4f6', gray200: '#e5e7eb', gray300: '#d1d5db',
  gray400: '#9ca3af', gray500: '#6b7280', gray600: '#4b5563',
  gray700: '#374151', gray800: '#1f2937', white: '#ffffff',
}

const SOURCES = [
  { id: 'salary',     label: 'Salaire',       color: D.primary },
  { id: 'freelance',  label: 'Freelance',     color: D.green   },
  { id: 'business',   label: 'Business',      color: D.amber   },
  { id: 'investment', label: 'Investissement',color: D.purple  },
  { id: 'rental',     label: 'Location',      color: '#0891b2' },
]

const inp = {
  padding: '8px 11px', borderRadius: 9, fontSize: 13,
  border: `1.5px solid ${D.gray200}`, background: D.white,
  color: D.gray800, outline: 'none', width: '100%',
  fontFamily: 'Inter, system-ui, sans-serif',
  transition: 'border-color .15s',
}

// ── Ligne de revenu simulé ─────────────────────────────────
function SimRow({ item, onUpdate, onRemove }) {
  const src = SOURCES.find(s => s.id === item.source) || SOURCES[0]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
      borderBottom: `1px solid ${D.gray100}` }}>
      <div style={{ width: 8, height: 8, borderRadius: 2, background: src.color, flexShrink: 0 }} />
      <select value={item.source}
        onChange={e => onUpdate({ ...item, source: e.target.value })}
        style={{ ...inp, width: 130, flex: 'none' }}>
        {SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <input type="number" value={item.amount}
        onChange={e => onUpdate({ ...item, amount: +e.target.value || 0 })}
        placeholder="Montant" style={{ ...inp, flex: 1 }} />
      <span style={{ fontSize: 11.5, color: D.gray400, whiteSpace: 'nowrap' }}>MAD/mois</span>
      <button onClick={onRemove}
        style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${D.gray200}`,
          background: D.white, color: D.gray400, display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          transition: 'all .15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = D.redBg; e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = D.red }}
        onMouseLeave={e => { e.currentTarget.style.background = D.white; e.currentTarget.style.borderColor = D.gray200; e.currentTarget.style.color = D.gray400 }}>
        <Minus size={12} />
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function SimulationPanel({ currentTotal = 0, goal = 30000, monthlyData = [] }) {
  const [simItems, setSimItems]   = useState([
    { id: 1, source: 'freelance', amount: 5000 },
  ])
  const [multiplier, setMultiplier] = useState(100) // % d'ajustement global

  const addItem = () => setSimItems(prev => [
    ...prev, { id: Date.now(), source: 'freelance', amount: 0 }
  ])

const updateItem = (id, data) =>
  setSimItems(prev =>
    prev.map(it => it.id === id ? { ...it, ...data } : it)
  )
    const removeItem = id =>
    setSimItems(prev => prev.filter(it => it.id !== id))

  const reset = () => {
    setSimItems([{ id: 1, source: 'freelance', amount: 5000 }])
    setMultiplier(100)
  }

  // Calculs simulation
  const simTotal    = simItems.reduce((s, i) => s + (i.amount || 0), 0)
  const adjustedBase = Math.round(currentTotal * (multiplier / 100))
  const totalSim    = adjustedBase + simTotal
  const goalProgress = goal > 0 ? Math.round((totalSim / goal) * 100) : 0
  const delta        = totalSim - currentTotal
  const deltaSign    = delta >= 0 ? '+' : ''

  // Données graphique simulation
  const chartData = useMemo(() => {
    if (!monthlyData.length) return []
    return monthlyData.map((m, i) => ({
      ...m,
      simulated: i === monthlyData.length - 1
        ? totalSim
        : Math.round(m.received * (multiplier / 100)),
    }))
  }, [monthlyData, multiplier, totalSim])

  // Impact sur objectif
  const impactMsg = goalProgress >= 100
    ? { text: 'Objectif atteint avec cette simulation', color: D.green, bg: D.greenBg }
    : goalProgress >= 80
    ? { text: `À ${goalProgress}% de l'objectif`, color: D.amber, bg: D.amberBg }
    : { text: `Toujours en dessous de l'objectif (${goalProgress}%)`, color: D.red, bg: D.redBg }

  return (
    <div style={{ background: D.white, borderRadius: 16, border: `1px solid ${D.gray200}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${D.gray100}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8,
            background: `linear-gradient(135deg, ${D.purple}25, ${D.primary}15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} style={{ color: D.purple }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: D.gray800 }}>Simulateur de revenus</p>
            <p style={{ fontSize: 11.5, color: D.gray400 }}>Testez des scénarios sans impacter vos données</p>
          </div>
        </div>
        <button onClick={reset}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
            borderRadius: 8, border: `1px solid ${D.gray200}`, background: D.white,
            color: D.gray500, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = D.primary}
          onMouseLeave={e => e.currentTarget.style.borderColor = D.gray200}>
          <RotateCcw size={12} /> Réinitialiser
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>

        {/* LEFT — Formulaire simulation */}
        <div style={{ padding: '18px 20px', borderRight: `1px solid ${D.gray100}` }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: D.gray500, textTransform: 'uppercase',
            letterSpacing: '0.05em', marginBottom: 14 }}>Paramètres</p>

          {/* Multiplicateur global */}
          <div style={{ marginBottom: 18, padding: '14px', background: D.bg,
            borderRadius: 12, border: `1px solid ${D.gray200}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: D.gray700 }}>
                Ajustement des revenus actuels
              </label>
              <span style={{ fontSize: 13, fontWeight: 800, color: D.primary,
                fontVariantNumeric: 'tabular-nums' }}>{multiplier}%</span>
            </div>
            <input type="range" min={0} max={200} step={5} value={multiplier}
              onChange={e => setMultiplier(+e.target.value)}
              style={{ width: '100%', accentColor: D.primary }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: D.gray400 }}>0%</span>
              <span style={{ fontSize: 10, color: D.gray400 }}>Actuel (100%)</span>
              <span style={{ fontSize: 10, color: D.gray400 }}>200%</span>
            </div>
          </div>

          {/* Revenus additionnels */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: D.gray700, marginBottom: 10 }}>
              Ajouter des revenus hypothétiques
            </p>
            {simItems.map(item => (
              <SimRow key={item.id} item={item}
                onUpdate={data => updateItem(item.id, data)}
                onRemove={() => removeItem(item.id)} />
            ))}
            <button onClick={addItem}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
                marginTop: 8, borderRadius: 9, border: `1.5px dashed ${D.gray300}`,
                background: 'transparent', color: D.gray400, fontSize: 12.5,
                cursor: 'pointer', width: '100%', transition: 'all .15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = D.primary; e.currentTarget.style.color = D.primary }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = D.gray300; e.currentTarget.style.color = D.gray400 }}>
              <Plus size={13} /> Ajouter un revenu simulé
            </button>
          </div>
        </div>

        {/* RIGHT — Résultats */}
        <div style={{ padding: '18px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: D.gray500, textTransform: 'uppercase',
            letterSpacing: '0.05em', marginBottom: 14 }}>Impact simulé</p>

          {/* KPIs simulation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Revenus actuels',   value: currentTotal, color: D.gray600 },
              { label: 'Ajustement base',   value: adjustedBase - currentTotal, signed: true, color: multiplier >= 100 ? D.green : D.red },
              { label: '+ Revenus simulés', value: simTotal,     signed: true,  color: D.purple },
            ].map(k => (
              <div key={k.label} style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '8px 12px', borderRadius: 9, background: D.gray100 }}>
                <span style={{ fontSize: 12.5, color: D.gray600 }}>{k.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: k.color,
                  fontVariantNumeric: 'tabular-nums' }}>
                  {k.signed && k.value >= 0 ? '+' : ''}{k.value.toLocaleString('fr-MA')} MAD
                </span>
              </div>
            ))}
            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 14px', borderRadius: 10, background: D.primary }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ADD4F3' }}>Total simulé</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff',
                fontVariantNumeric: 'tabular-nums' }}>
                {totalSim.toLocaleString('fr-MA')} MAD
              </span>
            </div>
          </div>

          {/* Progress vers objectif */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: D.gray500, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Target size={12} /> Objectif mensuel
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: goalProgress >= 100 ? D.green : D.primary }}>
                {goalProgress}%
              </span>
            </div>
            <div style={{ height: 8, background: D.gray100, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 10,
                width: `${Math.min(goalProgress, 100)}%`,
                background: goalProgress >= 100
                  ? `linear-gradient(90deg, ${D.green}, #22c55e)`
                  : goalProgress >= 80
                  ? `linear-gradient(90deg, ${D.amber}, #f59e0b)`
                  : `linear-gradient(90deg, ${D.primary}, ${D.secondary})`,
                transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
              }} />
            </div>
          </div>

          {/* Impact message */}
          <div style={{ padding: '10px 12px', borderRadius: 10,
            background: impactMsg.bg, border: `1px solid ${impactMsg.color}25`,
            display: 'flex', alignItems: 'center', gap: 7 }}>
            <TrendingUp size={13} style={{ color: impactMsg.color, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: impactMsg.color, fontWeight: 500 }}>{impactMsg.text}</p>
          </div>

          {/* Delta badge */}
          <div style={{ marginTop: 10, textAlign: 'center', padding: '8px',
            background: delta >= 0 ? D.greenBg : D.redBg, borderRadius: 10,
            border: `1px solid ${delta >= 0 ? D.greenBorder : '#fecaca'}` }}>
            <p style={{ fontSize: 12, color: delta >= 0 ? D.green : D.red, fontWeight: 600 }}>
              {deltaSign}{delta.toLocaleString('fr-MA')} MAD par rapport à aujourd'hui
            </p>
          </div>
        </div>
      </div>

      {/* Chart simulé */}
      {chartData.length > 0 && (
        <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${D.gray100}` }}>
          <p style={{ fontSize: 12, color: D.gray400, margin: '14px 0 10px',
            display: 'flex', alignItems: 'center', gap: 5 }}>
            <Info size={11} />
            Le dernier mois affiche le résultat simulé
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -16 }} barGap={3}>
              <CartesianGrid strokeDasharray="2 6" stroke={D.gray100} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: D.gray400 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: D.gray400 }}
                tickFormatter={v => `${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v, name) => [`${v.toLocaleString('fr-MA')} MAD`, name]} />
              <ReferenceLine y={goal} stroke={D.amber} strokeDasharray="4 3" strokeWidth={1.5} />
              <Bar dataKey="received"  name="Réel"     fill={D.secondary} radius={[4,4,0,0]} maxBarSize={20} />
              <Bar dataKey="simulated" name="Simulé"   fill={D.purple}   radius={[4,4,0,0]} maxBarSize={20} fillOpacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}