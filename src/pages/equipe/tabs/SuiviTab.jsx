// src/pages/equipe/tabs/SuiviTab.jsx
// Onglet Suivi — Timeline visuelle premium des dépenses

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../lib/api'
import { fmt, fmtDate } from '../../../lib/helpers'
import Spinner from '../../../components/Spinner'
import {
  Clock, CheckCircle2, XCircle, CreditCard, FileText,
  ChevronRight, Filter, AlertCircle, Paperclip,
} from 'lucide-react'

// ── Config des statuts ────────────────────────────────────────
const STATUS_CONFIG = {
  draft: {
    label: 'Brouillon',
    icon: FileText,
    color: 'var(--muted)',
    bg: 'var(--pearl)',
    border: 'var(--champagne)',
    step: 0,
  },
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'var(--warn)',
    bg: 'var(--warn-bg)',
    border: 'var(--warn-mid)',
    step: 1,
  },
  approved: {
    label: 'Approuvée',
    icon: CheckCircle2,
    color: 'var(--success)',
    bg: 'var(--success-bg)',
    border: 'var(--success-mid)',
    step: 2,
  },
  rejected: {
    label: 'Refusée',
    icon: XCircle,
    color: 'var(--danger)',
    bg: 'var(--danger-bg)',
    border: 'var(--danger-mid)',
    step: -1,
  },
  paid: {
    label: 'Remboursée',
    icon: CreditCard,
    color: 'var(--accent)',
    bg: 'var(--accent-light)',
    border: 'var(--accent-mid)',
    step: 3,
  },
}

// ── Étapes de la timeline ─────────────────────────────────────
const STEPS = [
  { key: 'draft',    label: 'Soumise',    icon: FileText },
  { key: 'pending',  label: 'En attente', icon: Clock },
  { key: 'approved', label: 'Approuvée',  icon: CheckCircle2 },
  { key: 'paid',     label: 'Remboursée', icon: CreditCard },
]

function TimelineBar({ status }) {
  const cfg   = STATUS_CONFIG[status]
  const step  = cfg?.step ?? 0
  const isRej = status === 'rejected'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '14px 0 10px' }}>
      {STEPS.map((s, i) => {
       const done = !isRej && (step >= (s.step ?? i))
        const current = !isRej && status === s.key
        const sCfg    = STATUS_CONFIG[s.key]

        const stepDone = i === 0
          ? step >= 0
          : i === 1
          ? step >= 1
          : i === 2
          ? step >= 2
          : step >= 3

        const active = stepDone && !isRej

        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
            {/* Circle */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isRej && i > 0 ? 'var(--pearl)' : active ? sCfg.bg : 'var(--pearl)',
              border: `2px solid ${isRej && i > 0 ? 'var(--champagne)' : active ? sCfg.border : 'var(--champagne)'}`,
              transition: 'all 0.3s ease',
              position: 'relative',
            }}>
              {isRej && i > 0
                ? <s.icon size={13} style={{ color: 'var(--champagne)' }} />
                : active
                ? <s.icon size={13} style={{ color: sCfg.color }} />
                : <s.icon size={13} style={{ color: 'var(--champagne)' }} />
              }
              {/* Pulse sur l'étape courante */}
              {status === s.key && !isRej && (
                <span style={{
                  position: 'absolute', inset: -4,
                  borderRadius: '50%',
                  border: `2px solid ${sCfg.color}`,
                  opacity: 0.4,
                  animation: 'pulse-ring 1.8s ease-out infinite',
                }} />
              )}
            </div>

            {/* Label */}
            <div style={{
              position: 'absolute',
              marginTop: 52,
              fontSize: 10,
              fontWeight: status === s.key ? 600 : 400,
              color: isRej && i > 0 ? 'var(--champagne)' : active ? sCfg.color : 'var(--silver)',
              whiteSpace: 'nowrap',
              transform: 'translateX(-50%)',
              marginLeft: 15,
            }}>{s.label}</div>

            {/* Connector line */}
            {i < 3 && (
              <div style={{
                flex: 1, height: 2, margin: '0 4px',
                background: isRej ? 'var(--pearl)' : stepDone && step > i ? sCfg.color : 'var(--pearl)',
                transition: 'background 0.4s ease',
                borderRadius: 2,
              }} />
            )}
          </div>
        )
      })}

      {/* Rejected override */}
      {isRej && (
        <div style={{
          marginLeft: 12, display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 100,
          background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)',
          flexShrink: 0,
        }}>
          <XCircle size={12} style={{ color: 'var(--danger)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--danger)' }}>Refusée</span>
        </div>
      )}

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function ExpenseCard({ expense, index }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[expense.status] ?? STATUS_CONFIG.draft
  const Icon = cfg.icon

  return (
    <div
      className={`animate-fade-up`}
      style={{
        animationDelay: `${index * 0.06}s`,
        background: '#fff',
        border: `1px solid var(--pearl)`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        marginBottom: 12,
        boxShadow: '0 1px 3px rgba(26,25,23,.04)',
        transition: 'box-shadow .25s, transform .25s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,25,23,.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(26,25,23,.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Header */}
      <div
        style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 14 }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Status icon */}
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} style={{ color: cfg.color }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
              {expense.title}
            </p>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
              {fmt(expense.amount)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Catégorie */}
            {expense.category && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--muted)' }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: expense.category.color }} />
                {expense.category.name}
              </span>
            )}
            {/* Date */}
            <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>
              {fmtDate(expense.expense_date)}
            </span>
            {/* Justificatifs */}
            {expense.receipts?.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11.5, color: 'var(--silver)' }}>
                <Paperclip size={11} /> {expense.receipts.length}
              </span>
            )}
            {/* Badge statut */}
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 100,
              background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            }}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <ChevronRight size={15} style={{ color: 'var(--silver)', flexShrink: 0, marginTop: 2, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
      </div>

      {/* Timeline + détails (expanded) */}
      {expanded && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--ivory)', paddingTop: 16, animation: 'fadeIn .2s ease' }}>

          {/* Timeline bar */}
          <div style={{ position: 'relative', marginBottom: 40 }}>
            <TimelineBar status={expense.status} />
          </div>

          {/* Motif de refus */}
          {expense.status === 'rejected' && expense.rejection_reason && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px', borderRadius: 10,
              background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)',
              marginBottom: 14,
            }}>
              <AlertCircle size={14} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--danger)', marginBottom: 2 }}>Motif de refus</p>
                <p style={{ fontSize: 13, color: 'var(--danger)', opacity: 0.85 }}>{expense.rejection_reason}</p>
              </div>
            </div>
          )}

          {/* Approbation */}
          {expense.approver && expense.status !== 'rejected' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10,
              background: 'var(--success-bg)', border: '1px solid var(--success-mid)',
              marginBottom: 14,
            }}>
              <CheckCircle2 size={13} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <p style={{ fontSize: 12.5, color: 'var(--success)' }}>
                Approuvée par <strong>{expense.approver.first_name} {expense.approver.last_name}</strong> · {fmtDate(expense.approved_at)}
              </p>
            </div>
          )}

          {/* Description */}
          {expense.description && (
            <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.65, marginBottom: 14, padding: '10px 14px', background: 'var(--cream)', borderRadius: 8 }}>
              {expense.description}
            </p>
          )}

          {/* Pièces jointes */}
          {expense.receipts?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              {expense.receipts.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--cream)', borderRadius: 8, border: '1px solid var(--pearl)' }}>
                  <Paperclip size={12} style={{ color: 'var(--silver)' }} />
                  <span style={{ fontSize: 12.5, color: 'var(--slate)', flex: 1 }}>{r.original_name}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>{(r.file_size / 1024).toFixed(0)} Ko</span>
                </div>
              ))}
            </div>
          )}

          {/* Voir détail */}
          <Link to={`/app/expenses/${expense.id}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12.5, color: 'var(--accent)', fontWeight: 500, textDecoration: 'none',
          }}>
            Voir le détail complet <ChevronRight size={13} />
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Composant principal ───────────────────────────────────────
export default function SuiviTab() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    api.get('/expenses')
      .then(r => setExpenses(r.data.data ?? r.data))
      .finally(() => setLoading(false))
  }, [])

  const FILTERS = [
    { key: 'all',      label: 'Toutes' },
    { key: 'pending',  label: 'En attente' },
    { key: 'approved', label: 'Approuvées' },
    { key: 'paid',     label: 'Remboursées' },
    { key: 'rejected', label: 'Refusées' },
    { key: 'draft',    label: 'Brouillons' },
  ]

  const filtered = expenses.filter(e => {
    const matchFilter = filter === 'all' || e.status === filter
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // Grouper par mois
  const grouped = filtered.reduce((acc, exp) => {
    const date  = new Date(exp.expense_date)
    const key   = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    if (!acc[key]) acc[key] = { label, items: [] }
    acc[key].items.push(exp)
    return acc
  }, {})

  const months = Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a))

  if (loading) return <Spinner fullPage={false} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Filtres + Recherche */}
      <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Barre de recherche */}
        <input
          className="input-premium"
          placeholder="Rechercher une dépense…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />

        {/* Filtres pill */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const cfg = STATUS_CONFIG[f.key]
            const active = filter === f.key
            return (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '5px 14px', borderRadius: 100,
                fontSize: 12, fontWeight: active ? 600 : 400,
                border: `1px solid ${active ? (cfg?.border ?? 'var(--accent-mid)') : 'var(--warm-border)'}`,
                background: active ? (cfg?.bg ?? 'var(--accent-light)') : '#fff',
                color: active ? (cfg?.color ?? 'var(--accent)') : 'var(--muted)',
                cursor: 'pointer', transition: 'all .18s',
                fontFamily: 'var(--font-sans)',
              }}>
                {f.label}
                {f.key !== 'all' && (
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>
                    ({expenses.filter(e => e.status === f.key).length})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Résumé rapide */}
      <div className="animate-fade-up stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {[
          { label: 'Total soumis', value: expenses.length, color: 'var(--accent)' },
          { label: 'En attente',   value: expenses.filter(e => e.status === 'pending').length, color: 'var(--warn)' },
          { label: 'Approuvées',   value: expenses.filter(e => ['approved','paid'].includes(e.status)).length, color: 'var(--success)' },
          { label: 'Remboursées',  value: expenses.filter(e => e.status === 'paid').length, color: 'var(--accent)' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid var(--pearl)',
            borderRadius: 'var(--r-md)', padding: '12px 16px',
            boxShadow: '0 1px 3px rgba(26,25,23,.04)',
          }}>
            <p style={{ fontSize: 10.5, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline par mois */}
      {filtered.length === 0 ? (
        <div className="card-static" style={{ padding: '56px 0', textAlign: 'center' }}>
          <FileText size={28} style={{ color: 'var(--champagne)', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 13, color: 'var(--silver)' }}>
            {search || filter !== 'all' ? 'Aucune dépense trouvée' : 'Aucune dépense pour le moment'}
          </p>
        </div>
      ) : (
        months.map(([key, { label, items }]) => (
          <div key={key} className="animate-fade-up stagger-3">
            {/* Mois header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ height: 1, background: 'var(--pearl)', flex: 'none', width: 16 }} />
              <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--silver)', letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {label}
              </p>
              <div style={{ height: 1, background: 'var(--pearl)', flex: 1 }} />
              <span style={{ fontSize: 11.5, color: 'var(--silver)', whiteSpace: 'nowrap' }}>
                {fmt(items.reduce((s, e) => s + Number(e.amount), 0))}
              </span>
            </div>

            {/* Cards */}
            {items.map((exp, i) => (
              <ExpenseCard key={exp.id} expense={exp} index={i} />
            ))}
          </div>
        ))
      )}
    </div>
  )
}