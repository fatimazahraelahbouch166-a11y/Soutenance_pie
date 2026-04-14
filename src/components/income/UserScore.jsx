// src/components/income/UserScore.jsx
// ── Score utilisateur — gamification financière ──

import { useState, useEffect } from 'react'
import { Award, Star, TrendingUp, CheckCircle, Target, Zap, ChevronRight } from 'lucide-react'

const D = {
  primary: '#284E7B', secondary: '#659ABD', bg: '#EFF3F5',
  green: '#16a34a', greenBg: '#f0fdf4', greenBorder: '#bbf7d0',
  amber: '#d97706', amberBg: '#fffbeb', amberBorder: '#fde68a',
  red: '#dc2626', redBg: '#fef2f2', redBorder: '#fecaca',
  purple: '#7c3aed', purpleBg: '#f5f3ff',
  gray100: '#f3f4f6', gray200: '#e5e7eb', gray400: '#9ca3af',
  gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
  gray800: '#1f2937', white: '#ffffff',
}

// ── Niveaux et badges ──────────────────────────────────────
const LEVELS = [
  { min: 0,   max: 39,  label: 'Débutant',     emoji: '🌱', color: D.gray500, bg: D.gray100,   border: D.gray200 },
  { min: 40,  max: 59,  label: 'En progrès',   emoji: '📈', color: D.amber,  bg: D.amberBg,   border: D.amberBorder },
  { min: 60,  max: 79,  label: 'Bon élève',    emoji: '⭐', color: D.secondary, bg: D.bg,      border: '#ADD4F380' },
  { min: 80,  max: 94,  label: 'Excellent',    emoji: '🏆', color: D.green,  bg: D.greenBg,   border: D.greenBorder },
  { min: 95,  max: 100, label: 'Expert',       emoji: '💎', color: D.purple, bg: D.purpleBg,  border: '#7c3aed30' },
]

const getLevel = (score) => LEVELS.find(l => score >= l.min && score <= l.max) || LEVELS[0]

// ── Calcul du score ────────────────────────────────────────
const computeScore = (stats) => {
  if (!stats) return { total: 0, details: [] }
  const details = []
  let total = 0

  // 1. Ponctualité (30 pts max)
  const allIncomes  = (stats.all?.length || 0)
  const overdueCount = (stats.alerts?.length || 0)
  const punctuality = allIncomes > 0
    ? Math.round(((allIncomes - overdueCount) / allIncomes) * 30)
    : 0
  details.push({ label: 'Ponctualité', pts: punctuality, max: 30,
    desc: `${allIncomes - overdueCount}/${allIncomes} revenus reçus à temps`,
    icon: CheckCircle, color: punctuality >= 25 ? D.green : punctuality >= 15 ? D.amber : D.red })
  total += punctuality

  // 2. Objectif mensuel (25 pts max)
  const goalPts = Math.min(Math.round((stats.goalProgress || 0) / 4), 25)
  details.push({ label: 'Objectif mensuel', pts: goalPts, max: 25,
    desc: `${stats.goalProgress || 0}% de l'objectif atteint`,
    icon: Target, color: goalPts >= 20 ? D.green : goalPts >= 12 ? D.amber : D.red })
  total += goalPts

  // 3. Régularité (20 pts max)
  const recurringCount = (stats.all || []).filter(i => i.is_recurring).length
  const regularityPts  = Math.min(recurringCount * 5, 20)
  details.push({ label: 'Régularité', pts: regularityPts, max: 20,
    desc: `${recurringCount} revenu${recurringCount > 1 ? 's' : ''} récurrent${recurringCount > 1 ? 's' : ''} actif${recurringCount > 1 ? 's' : ''}`,
    icon: Zap, color: regularityPts >= 15 ? D.green : regularityPts >= 8 ? D.amber : D.red })
  total += regularityPts

  // 4. Croissance (15 pts max)
  const delta = stats.deltaMonth || 0
  const growthPts = delta > 20 ? 15 : delta > 10 ? 12 : delta > 0 ? 8 : delta > -10 ? 4 : 0
  details.push({ label: 'Croissance', pts: growthPts, max: 15,
    desc: delta >= 0 ? `+${delta}% vs mois dernier` : `${delta}% vs mois dernier`,
    icon: TrendingUp, color: growthPts >= 12 ? D.green : growthPts >= 6 ? D.amber : D.red })
  total += growthPts

  // 5. Organisation (10 pts max)
  const taggedCount = (stats.all || []).filter(i => i.tags?.length > 0).length
  const orgPts = Math.min(taggedCount * 2, 10)
  details.push({ label: 'Organisation', pts: orgPts, max: 10,
    desc: `${taggedCount} revenu${taggedCount > 1 ? 's' : ''} organisé${taggedCount > 1 ? 's' : ''} avec tags`,
    icon: Star, color: orgPts >= 8 ? D.green : orgPts >= 4 ? D.amber : D.red })
  total += orgPts

  return { total: Math.min(total, 100), details }
}

// ── Barre de score ─────────────────────────────────────────
function ScoreBar({ pts, max, color }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { setTimeout(() => setWidth((pts / max) * 100), 150) }, [pts, max])
  return (
    <div style={{ height: 5, background: D.gray100, borderRadius: 10, overflow: 'hidden', flex: 1 }}>
      <div style={{
        height: '100%', width: `${width}%`, borderRadius: 10, background: color,
        transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  )
}

// ── Animated score circle ──────────────────────────────────
function ScoreCircle({ score, level }) {
  const [animScore, setAnimScore] = useState(0)
  useEffect(() => {
    let current = 0
    const step  = score / 40
    const timer = setInterval(() => {
      current = Math.min(current + step, score)
      setAnimScore(Math.round(current))
      if (current >= score) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [score])

  const circumference = 2 * Math.PI * 40
  const dash = (animScore / 100) * circumference

  return (
    <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
      <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={50} cy={50} r={40} fill="none" stroke={D.gray100} strokeWidth={8} />
        <circle cx={50} cy={50} r={40} fill="none"
          stroke={level.color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.05s linear' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: D.gray800,
          lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{animScore}</span>
        <span style={{ fontSize: 10, color: D.gray400, fontWeight: 600 }}>/100</span>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────
export default function UserScore({ stats }) {
  const { total, details } = computeScore(stats)
  const level = getLevel(total)
  const nextLevel = LEVELS.find(l => l.min > total)

  return (
    <div style={{ background: D.white, borderRadius: 16, border: `1px solid ${D.gray200}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${D.gray100}`,
        display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8,
          background: `linear-gradient(135deg, ${level.color}25, ${level.color}10)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Award size={15} style={{ color: level.color }} />
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: D.gray800 }}>Score financier</p>
        <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: level.color,
          background: level.bg, padding: '3px 10px', borderRadius: 20,
          border: `1px solid ${level.border}` }}>
          {level.emoji} {level.label}
        </span>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Score + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20,
          padding: '16px', borderRadius: 12, background: level.bg,
          border: `1px solid ${level.border}` }}>
          <ScoreCircle score={total} level={level} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: D.gray800,
              marginBottom: 4, letterSpacing: '-0.02em' }}>
              {level.emoji} {level.label}
            </p>
            <p style={{ fontSize: 13, color: D.gray500, marginBottom: 10 }}>
              Score global sur 100 points
            </p>
            {nextLevel && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: D.gray400 }}>
                    Prochain niveau : {nextLevel.emoji} {nextLevel.label}
                  </span>
                  <span style={{ fontSize: 11, color: D.gray500, fontWeight: 600 }}>
                    {nextLevel.min - total} pts restants
                  </span>
                </div>
                <div style={{ height: 5, background: D.gray200, borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 10,
                    width: `${((total - level.min) / (nextLevel.min - level.min)) * 100}%`,
                    background: level.color,
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            )}
            {!nextLevel && (
              <p style={{ fontSize: 12, fontWeight: 600, color: level.color }}>
                🎉 Niveau maximum atteint !
              </p>
            )}
          </div>
        </div>

        {/* Détail des critères */}
        <p style={{ fontSize: 11, fontWeight: 700, color: D.gray400, textTransform: 'uppercase',
          letterSpacing: '0.06em', marginBottom: 12 }}>Détail des critères</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {details.map((d) => {
            const Icon = d.icon
            return (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  background: `${d.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={12} style={{ color: d.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, color: D.gray700, fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: d.color,
                      fontVariantNumeric: 'tabular-nums' }}>{d.pts}/{d.max}</span>
                  </div>
                  <ScoreBar pts={d.pts} max={d.max} color={d.color} />
                  <p style={{ fontSize: 10.5, color: D.gray400, marginTop: 3 }}>{d.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tips */}
        {total < 80 && (
          <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10,
            background: D.bg, border: `1px solid ${D.gray200}` }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: D.primary, marginBottom: 6 }}>
              💡 Comment améliorer votre score
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {details.filter(d => d.pts < d.max * 0.7).slice(0, 3).map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ChevronRight size={11} style={{ color: D.secondary, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: D.gray600 }}>
                    Améliorez votre <b>{d.label.toLowerCase()}</b> (+{d.max - d.pts} pts possibles)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}