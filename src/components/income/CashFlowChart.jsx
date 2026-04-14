// src/components/income/CashFlowChart.jsx
// ── Revenus vs Dépenses — analyse du flux de trésorerie ──

import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const D = {
  primary: '#284E7B', secondary: '#659ABD', light: '#ADD4F3', bg: '#EFF3F5',
  green: '#16a34a', greenBg: '#f0fdf4', greenBorder: '#bbf7d0',
  red: '#dc2626', redBg: '#fef2f2', redBorder: '#fecaca',
  amber: '#d97706', amberBg: '#fffbeb',
  gray100: '#f3f4f6', gray200: '#e5e7eb', gray400: '#9ca3af',
  gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937', white: '#ffffff',
}

// ── Tooltip riche ─────────────────────────────────────────
const RichTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const rev   = payload.find(p => p.dataKey === 'revenus')?.value ?? 0
  const dep   = payload.find(p => p.dataKey === 'depenses')?.value ?? 0
  const net   = rev - dep
  const isPos = net >= 0
  return (
    <div style={{
      background: D.white, border: `1px solid ${D.gray200}`, borderRadius: 14,
      padding: '14px 16px', boxShadow: '0 8px 24px rgba(40,78,123,0.14)', minWidth: 180,
    }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: D.gray400, marginBottom: 10,
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { label: 'Revenus',  value: rev, color: D.green },
          { label: 'Dépenses', value: dep, color: D.red   },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
              <span style={{ fontSize: 12, color: D.gray600 }}>{r.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: D.gray800,
              fontVariantNumeric: 'tabular-nums' }}>
              {r.value.toLocaleString('fr-MA')} MAD
            </span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${D.gray200}`, paddingTop: 8, marginTop: 2,
          display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: D.gray700 }}>Net</span>
          <span style={{ fontSize: 14, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
            color: isPos ? D.green : D.red }}>
            {isPos ? '+' : ''}{net.toLocaleString('fr-MA')} MAD
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Metric pill ────────────────────────────────────────────
const Metric = ({ label, value, delta, positive, icon: Icon }) => (
  <div style={{ flex: 1, padding: '14px 16px', borderRadius: 12,
    background: positive ? D.greenBg : (delta < 0 ? D.redBg : D.bg),
    border: `1px solid ${positive ? D.greenBorder : (delta < 0 ? D.redBorder : D.gray200)}` }}>
    <p style={{ fontSize: 11, fontWeight: 600, color: D.gray400, textTransform: 'uppercase',
      letterSpacing: '0.05em', marginBottom: 6 }}>{label}</p>
    <p style={{ fontSize: 20, fontWeight: 800, color: D.gray800, fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.02em', marginBottom: 4 }}>
      {value.toLocaleString('fr-MA')} MAD
    </p>
    {delta !== undefined && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {delta > 0 ? <ArrowUpRight size={12} style={{ color: D.green }} />
                   : <ArrowDownRight size={12} style={{ color: D.red }} />}
        <span style={{ fontSize: 11, fontWeight: 600,
          color: positive ? (delta > 0 ? D.green : D.red) : (delta < 0 ? D.green : D.red) }}>
          {delta > 0 ? '+' : ''}{delta}% vs mois dernier
        </span>
      </div>
    )}
  </div>
)

// ── Component principal ────────────────────────────────────
export default function CashFlowChart({ data = [] }) {
  const [view, setView] = useState('bar')   // 'bar' | 'line' | 'area'

  if (!data.length) return null

  // Calculs globaux
  const totalRev = data.reduce((s, d) => s + (d.revenus  || 0), 0)
  const totalDep = data.reduce((s, d) => s + (d.depenses || 0), 0)
  const netTotal = totalRev - totalDep
  const lastMonth  = data[data.length - 1]
  const prevMonth  = data[data.length - 2]
  const netDelta   = prevMonth && (prevMonth.revenus - prevMonth.depenses) > 0
    ? Math.round(((lastMonth.revenus - lastMonth.depenses - (prevMonth.revenus - prevMonth.depenses))
        / Math.abs(prevMonth.revenus - prevMonth.depenses)) * 100)
    : 0

  // Message de santé financière
  const health = netTotal > 0
    ? { msg: `Vous avez gagné ${(netTotal).toLocaleString('fr-MA')} MAD de plus que vous n'avez dépensé`,
        color: D.green, bg: D.greenBg, border: D.greenBorder, icon: TrendingUp }
    : netTotal === 0
    ? { msg: 'Revenus et dépenses sont équilibrés ce mois',
        color: D.amber, bg: D.amberBg, border: '#fde68a', icon: Minus }
    : { msg: `Attention — dépenses supérieures aux revenus de ${Math.abs(netTotal).toLocaleString('fr-MA')} MAD`,
        color: D.red, bg: D.redBg, border: D.redBorder, icon: TrendingDown }

  return (
    <div style={{ background: D.white, borderRadius: 16, border: `1px solid ${D.gray200}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '18px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: D.gray800 }}>Flux de trésorerie</p>
          <p style={{ fontSize: 12, color: D.gray400, marginTop: 2 }}>Revenus vs Dépenses — 6 derniers mois</p>
        </div>
        {/* View toggle */}
        <div style={{ display: 'flex', background: D.gray100, borderRadius: 8, padding: 3, gap: 2 }}>
          {[
            { key: 'bar',  label: '▋▋' },
            { key: 'line', label: '∿' },
            { key: 'area', label: '◩' },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              style={{ padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 13,
                cursor: 'pointer', transition: 'all .15s',
                background: view === v.key ? D.white : 'transparent',
                color:      view === v.key ? D.gray800 : D.gray400,
                boxShadow:  view === v.key ? '0 1px 3px rgba(0,0,0,.07)' : 'none',
              }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Health banner */}
      <div style={{ margin: '14px 20px 0', padding: '10px 14px', borderRadius: 10,
        background: health.bg, border: `1px solid ${health.border}`,
        display: 'flex', alignItems: 'center', gap: 8 }}>
        <health.icon size={14} style={{ color: health.color, flexShrink: 0 }} />
        <p style={{ fontSize: 12.5, color: health.color, fontWeight: 500 }}>{health.msg}</p>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: 10, padding: '14px 20px 0' }}>
        <Metric label="Total revenus"  value={totalRev} delta={undefined} positive={true} />
        <Metric label="Total dépenses" value={totalDep} delta={undefined} positive={false} />
        <Metric label="Solde net" value={Math.abs(netTotal)}
          delta={netDelta} positive={netTotal >= 0} />
      </div>

      {/* Chart */}
      <div style={{ padding: '16px 20px 20px' }}>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}
            barGap={4} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="2 8" stroke={D.gray100} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: D.gray400 }}
              axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: D.gray400 }}
              tickFormatter={v => `${(v/1000).toFixed(0)}k`}
              axisLine={false} tickLine={false} />
            <Tooltip content={<RichTooltip />} cursor={{ fill: `${D.primary}06` }} />
            <ReferenceLine y={0} stroke={D.gray200} strokeWidth={1} />

            {view === 'bar' && <>
              <Bar dataKey="revenus"  name="Revenus"  fill={D.green}   radius={[6,6,0,0]} maxBarSize={24} fillOpacity={0.85} />
              <Bar dataKey="depenses" name="Dépenses" fill={D.red}     radius={[6,6,0,0]} maxBarSize={24} fillOpacity={0.75} />
              <Line dataKey="net" name="Net" stroke={D.primary} strokeWidth={2.5} dot={false}
                strokeDasharray="4 2" type="monotone" />
            </>}

            {view === 'line' && <>
              <Line dataKey="revenus"  name="Revenus"  stroke={D.green} strokeWidth={2.5}
                dot={{ r:4, fill:'#fff', stroke:D.green, strokeWidth:2 }} type="monotone" />
              <Line dataKey="depenses" name="Dépenses" stroke={D.red} strokeWidth={2.5}
                dot={{ r:4, fill:'#fff', stroke:D.red, strokeWidth:2 }} type="monotone" />
              <Line dataKey="net" name="Net" stroke={D.primary} strokeWidth={2}
                strokeDasharray="4 2" dot={false} type="monotone" />
            </>}

            {view === 'area' && <>
              <Area dataKey="revenus"  name="Revenus"  stroke={D.green}
                fill={`${D.green}18`} strokeWidth={2} type="monotone" />
              <Area dataKey="depenses" name="Dépenses" stroke={D.red}
                fill={`${D.red}18`} strokeWidth={2} type="monotone" />
            </>}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 8, justifyContent: 'center' }}>
          {[
            { color: D.green, label: 'Revenus'  },
            { color: D.red,   label: 'Dépenses' },
            { color: D.primary, label: 'Net', dashed: true },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {l.dashed
                ? <div style={{ width: 16, height: 0, borderTop: `2px dashed ${l.color}` }} />
                : <span style={{ width: 10, height: 10, borderRadius: 3, background: l.color, display: 'block' }} />}
              <span style={{ fontSize: 11.5, color: D.gray400 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}