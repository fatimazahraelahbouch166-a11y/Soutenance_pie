// src/components/income/InsightsCard.jsx
// ── Génère des insights intelligents basés sur les stats ──

import { TrendingUp, TrendingDown, Target, AlertTriangle, Star, Zap, ChevronRight } from 'lucide-react'

const D = {
  primary: '#284E7B', green: '#16a34a', greenBg: '#f0fdf4',
  amber: '#d97706', amberBg: '#fffbeb',
  red: '#dc2626', redBg: '#fef2f2',
  purple: '#7c3aed', purpleBg: '#f5f3ff',
  gray100: '#f3f4f6', gray400: '#9ca3af', gray600: '#4b5563', gray800: '#1f2937',
  white: '#ffffff',
}

// ── Moteur d'insights ────────────────────────────────────
function generateInsights(stats) {
  if (!stats) return []
  const insights = []
  const { deltaMonth, totalThisMonth, totalLastMonth, goalProgress, bySource, alerts } = stats

  // 1. Évolution mensuelle
  if (Math.abs(deltaMonth) >= 5) {
    insights.push({
      id: 'monthly_delta',
      type: deltaMonth > 0 ? 'positive' : 'warning',
      icon: deltaMonth > 0 ? TrendingUp : TrendingDown,
      color: deltaMonth > 0 ? D.green : D.amber,
      bg:    deltaMonth > 0 ? D.greenBg : D.amberBg,
      title: deltaMonth > 0
        ? `Revenus en hausse de ${deltaMonth}%`
        : `Revenus en baisse de ${Math.abs(deltaMonth)}%`,
      detail: `${deltaMonth > 0 ? '+' : ''}${deltaMonth}% comparé au mois précédent`,
      action: deltaMonth < 0 ? 'Voir les détails →' : null,
    })
  }

  // 2. Source dominante
  if (bySource?.length > 0) {
    const top   = bySource[0]
    const total = bySource.reduce((s, x) => s + x.total, 0)
    const pct   = total > 0 ? Math.round((top.total / total) * 100) : 0
    insights.push({
      id: 'top_source',
      type: 'info',
      icon: Star,
      color: D.primary,
      bg:    '#EFF3F5',
      title: `${top.label} — source principale`,
      detail: `${pct}% des revenus ce mois (${top.total.toLocaleString('fr-MA')} MAD)`,
    })
  }

  // 3. Objectif
  if (goalProgress >= 100) {
    insights.push({
      id: 'goal_reached',
      type: 'success',
      icon: Target,
      color: D.green,
      bg:    D.greenBg,
      title: 'Objectif mensuel atteint ! 🎉',
      detail: `Vous avez dépassé votre cible de ${goalProgress - 100}%`,
    })
  } else if (goalProgress >= 75) {
    insights.push({
      id: 'goal_close',
      type: 'positive',
      icon: Target,
      color: D.primary,
      bg:    '#EFF3F5',
      title: `Objectif à ${goalProgress}% — Presque là !`,
      detail: `Il vous manque ${(stats.goal?.monthly_target - totalThisMonth || 0).toLocaleString('fr-MA')} MAD`,
    })
  }

  // 4. Revenus en retard
  if (alerts?.length > 0) {
    const lateTotal = alerts.reduce((s, a) => s + a.amount, 0)
    insights.push({
      id: 'overdue',
      type: 'danger',
      icon: AlertTriangle,
      color: D.red,
      bg:    D.redBg,
      title: `${alerts.length} revenu${alerts.length > 1 ? 's' : ''} en retard`,
      detail: `${lateTotal.toLocaleString('fr-MA')} MAD non confirmés — Action requise`,
      urgent: true,
    })
  }

  // 5. Freelance check (si source freelance baisse)
  const freelance = bySource?.find(s => s.source === 'freelance')
  if (freelance && freelance.total === 0) {
    insights.push({
      id: 'freelance_low',
      type: 'warning',
      icon: Zap,
      color: D.purple,
      bg:    D.purpleBg,
      title: 'Aucun revenu freelance ce mois',
      detail: 'Pensez à relancer vos clients ou prospecter',
    })
  }

  return insights
}

// ── Composant principal ────────────────────────────────
export default function InsightsCard({ stats, onAction }) {
  const insights = generateInsights(stats)
  if (!insights.length) return null

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg, #7c3aed20, #284E7B20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Zap size={14} style={{ color: D.purple }} />
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: D.gray800 }}>
          Insights intelligents
        </p>
        <span style={{
          marginLeft: 'auto', fontSize: 10.5, fontWeight: 600, color: D.purple,
          background: D.purpleBg, padding: '2px 8px', borderRadius: 20,
          border: '1px solid #7c3aed30',
        }}>
          IA · {insights.length} insight{insights.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Insights list */}
      <div style={{ padding: '8px 0' }}>
        {insights.map((ins, i) => {
          const Icon = ins.icon
          return (
            <div key={ins.id}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 20px',
                borderBottom: i < insights.length - 1 ? '1px solid #f9fafb' : 'none',
                borderLeft: ins.urgent ? `3px solid ${ins.color}` : '3px solid transparent',
                transition: 'background 0.15s', cursor: ins.action ? 'pointer' : 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.background = ins.bg + '60'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => ins.action && onAction?.(ins)}
            >
              {/* Icon */}
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: ins.bg, border: `1px solid ${ins.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 1,
              }}>
                <Icon size={14} style={{ color: ins.color }} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: D.gray800,
                  marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {ins.title}
                  {ins.urgent && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: D.red,
                      background: D.redBg, padding: '1px 6px', borderRadius: 10,
                    }}>URGENT</span>
                  )}
                </p>
                <p style={{ fontSize: 12, color: D.gray400, lineHeight: 1.4 }}>{ins.detail}</p>
              </div>

              {/* Action arrow */}
              {ins.action && (
                <div style={{ display: 'flex', alignItems: 'center', color: ins.color, fontSize: 11, fontWeight: 600, gap: 2 }}>
                  {ins.action} <ChevronRight size={12} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}