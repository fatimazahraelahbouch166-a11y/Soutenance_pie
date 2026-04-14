/**
 * StatCard — KPI / metric display card.
 * Usage:
 *   <StatCard
 *     label="Total Revenus"
 *     value="128,400 MAD"
 *     delta="+12% vs mois dernier"
 *     trend="up"         // 'up' | 'down' | undefined
 *     icon={<TrendingUp size={18} />}
 *     color="success"    // 'success' | 'danger' | 'warn' | 'accent' (default)
 *     loading={false}
 *   />
 */
import { TrendingUp, TrendingDown } from 'lucide-react'

const COLOR_MAP = {
  accent:  { bg: 'var(--accent-light)',  icon: 'var(--accent)',  border: 'var(--accent)' },
  success: { bg: 'var(--success-bg)',    icon: 'var(--success)', border: 'var(--success)' },
  danger:  { bg: 'var(--danger-bg)',     icon: 'var(--danger)',  border: 'var(--danger)' },
  warn:    { bg: 'var(--warn-bg)',       icon: 'var(--warn)',    border: 'var(--warn)' },
  gold:    { bg: 'var(--gold-light)',    icon: 'var(--gold)',    border: 'var(--gold)' },
}

export default function StatCard({ label, value, delta, trend, icon, color = 'accent', loading = false }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.accent

  if (loading) {
    return (
      <div className="card-static" style={{ padding: '18px 20px' }}>
        <div style={{ height: 12, width: '60%', background: 'var(--pearl)', borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 24, width: '40%', background: 'var(--ivory)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 10, width: '50%', background: 'var(--pearl)', borderRadius: 6 }} />
      </div>
    )
  }

  return (
    <div className="card-static" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      {/* Accent left border strip */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: c.border, borderRadius: '4px 0 0 4px',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </p>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: c.bg, color: c.icon,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>

      <p style={{
        fontSize: 22, fontWeight: 700, color: 'var(--ink)',
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
        lineHeight: 1, marginBottom: 8,
      }}>
        {value}
      </p>

      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {trend === 'up' && <TrendingUp size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />}
          {trend === 'down' && <TrendingDown size={12} style={{ color: 'var(--danger)', flexShrink: 0 }} />}
          <span style={{
            fontSize: 11.5,
            color: trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--silver)',
          }}>
            {delta}
          </span>
        </div>
      )}
    </div>
  )
}
