// import { TrendingUp, TrendingDown } from 'lucide-react'

// export default function KpiCard({ label, value, delta, trend }) {
//   return (
//     <div className="card p-4">
//       <p className="text-xs text-gray-400 mb-2">{label}</p>
//       <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
//       {delta && (
//         <p className={`flex items-center gap-1 text-xs mt-2 ${
//           trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400'
//         }`}>
//           {trend === 'up'   && <TrendingUp size={11} />}
//           {trend === 'down' && <TrendingDown size={11} />}
//           {delta}
//         </p>
//       )}
//     </div>
//   )
// }
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function KpiCard({ label, value, delta, trend, icon: Icon, accent, index = 0 }) {
  const trendColor = trend === 'up' ? 'var(--success)' : trend === 'down' ? 'var(--danger)' : 'var(--silver)'
  const TrendIcon  = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div
      className={`kpi-card animate-fade-up stagger-${index + 1}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: accent ?? 'linear-gradient(90deg, var(--accent-mid), transparent)',
        borderRadius: 'var(--r-lg) var(--r-lg) 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 11.5, color: 'var(--silver)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          {label}
        </p>
        {Icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)',
          }}>
            <Icon size={14} />
          </div>
        )}
      </div>

      <p style={{
        fontSize: 26, fontWeight: 600, color: 'var(--ink)',
        letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 10,
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</p>

      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TrendIcon size={12} style={{ color: trendColor, flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: trendColor, fontWeight: 500 }}>{delta}</span>
        </div>
      )}
    </div>
  )
}