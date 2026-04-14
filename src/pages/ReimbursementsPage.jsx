/**
 * ReimbursementsPage.jsx
 * Full Reimbursement Management page — enterprise SaaS level.
 */
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard, Plus, Eye, CheckCircle, XCircle, Pencil, Trash2,
  Download, FileText, LayoutGrid, List, RefreshCw, AlertTriangle,
  ChevronDown, AlertCircle, Clock, TrendingUp,
} from 'lucide-react'

import PageHeader        from '../components/ui/PageHeader'
import StatCard          from '../components/ui/StatCard'
import ActionMenu        from '../components/ui/ActionMenu'
import EmptyState        from '../components/ui/EmptyState'
import SearchInput       from '../components/ui/SearchInput'

import { ReimbursementStatusBadge, ReimbursementPriorityBadge, PaymentMethodBadge, SLABadge }
  from '../components/reimbursements/ReimbursementBadges'
import ReimbursementForm     from '../components/reimbursements/ReimbursementForm'
import RejectModal           from '../components/reimbursements/RejectModal'
import MarkReimbursedModal   from '../components/reimbursements/MarkReimbursedModal'

import { useGlobalStore } from '../store/GlobalStore'
import { STATUS_LABELS, PRIORITY_LABELS, PAYMENT_METHOD_LABELS, TEAMS }
  from '../services/reimbursementService'
import { fmt, fmtDate, initials } from '../lib/helpers'
import { useToast } from '../contexts/ToastContext'

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'all',        label: 'Toutes' },
  { key: 'draft',      label: 'Brouillon' },
  { key: 'pending',    label: 'En attente' },
  { key: 'approved',   label: 'Approuvées' },
  { key: 'rejected',   label: 'Rejetées' },
  { key: 'reimbursed', label: 'Remboursées' },
  { key: 'partial',    label: 'Partielles' },
]

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: 10 }).map((_, j) => (
            <td key={j} style={{ padding: '14px 16px' }}>
              <div style={{
                height: 12, borderRadius: 6,
                width: j === 0 ? 100 : j === 1 ? 80 : j === 9 ? 60 : '70%',
                background: 'var(--pearl)',
                animation: 'shimmer 1.4s ease infinite',
                backgroundSize: '200% 100%',
                backgroundImage: 'linear-gradient(90deg, var(--pearl) 25%, var(--ivory) 50%, var(--pearl) 75%)',
              }} />
            </td>
          ))}
        </tr>
      ))}
      <style>{`@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
    </tbody>
  )
}

// ─── Card view item ───────────────────────────────────────────────────────────

function ReimbursementCard({ item, onView, onApprove, onReject, onMarkPaid, onEdit, onDelete }) {
  const pct = item.approved_amount
    ? Math.round((item.reimbursed_amount / item.approved_amount) * 100)
    : 0

  return (
    <div
      className="card"
      style={{ padding: '18px 20px', cursor: 'pointer', position: 'relative' }}
      onClick={() => onView(item)}
    >
      {/* Priority stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '10px 10px 0 0',
        background: item.priority === 'urgent' ? 'var(--danger)' :
                    item.priority === 'high'   ? 'var(--warn)'   :
                    item.priority === 'medium' ? 'var(--accent)'  : 'var(--pearl)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent)', letterSpacing: '.02em' }}>
            {item.reference}
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
            {item.employee}
          </p>
          <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 1 }}>{item.team}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <ReimbursementStatusBadge status={item.status} />
          <ReimbursementPriorityBadge priority={item.priority} />
        </div>
      </div>

      {/* Amounts */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8, padding: '10px 12px', borderRadius: 10,
        background: 'var(--ivory)', marginBottom: 12,
      }}>
        <div>
          <p style={{ fontSize: 10, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Demandé</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(item.requested_amount)}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 10, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Restant</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: item.remaining_amount > 0 ? 'var(--warn)' : 'var(--success)', fontVariantNumeric: 'tabular-nums' }}>
            {fmt(item.remaining_amount)}
          </p>
        </div>
      </div>

      {/* Progress bar (if approved) */}
      {item.approved_amount && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10.5, color: 'var(--silver)' }}>Remboursé</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--success)' }}>{pct}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 4, background: 'var(--pearl)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${pct}%`,
              background: pct === 100 ? 'var(--success)' : 'var(--accent)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <SLABadge due_date={item.due_date} status={item.status} />
          <PaymentMethodBadge method={item.payment_method} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--silver)' }}>{fmtDate(item.requested_date)}</p>
      </div>
    </div>
  )
}

// ─── Alert banners ────────────────────────────────────────────────────────────

function AlertBanners({ items }) {
  const overdue = items.filter(r => {
    if (!r.due_date || ['reimbursed','rejected'].includes(r.status)) return false
    return new Date(r.due_date) < new Date()
  })
  const noAttachments = items.filter(r =>
    r.status === 'pending' && (r.attachments?.length ?? 0) === 0
  )
  const highAmount = items.filter(r =>
    r.status === 'pending' && r.requested_amount > 5000
  )

  if (!overdue.length && !noAttachments.length && !highAmount.length) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {overdue.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderRadius: 10,
          background: 'var(--danger-bg)', border: '1px solid var(--danger-mid)',
        }}>
          <AlertTriangle size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <p style={{ fontSize: 12.5, color: 'var(--danger)', fontWeight: 500 }}>
            <strong>{overdue.length} demande{overdue.length > 1 ? 's' : ''}</strong> en retard de paiement — action requise.
          </p>
        </div>
      )}
      {noAttachments.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderRadius: 10,
          background: 'var(--warn-bg)', border: '1px solid var(--warn-mid)',
        }}>
          <AlertCircle size={14} style={{ color: 'var(--warn)', flexShrink: 0 }} />
          <p style={{ fontSize: 12.5, color: 'var(--warn)', fontWeight: 500 }}>
            <strong>{noAttachments.length} demande{noAttachments.length > 1 ? 's' : ''}</strong> en attente sans justificatifs.
          </p>
        </div>
      )}
      {highAmount.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderRadius: 10,
          background: 'var(--accent-light)', border: '1px solid var(--accent-mid)',
        }}>
          <TrendingUp size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <p style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 500 }}>
            <strong>{highAmount.length} demande{highAmount.length > 1 ? 's' : ''}</strong> avec montant supérieur à 5 000 MAD — validation renforcée recommandée.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReimbursementsPage() {
  const navigate = useNavigate()
  const toast    = useToast()
  const { state, actions } = useGlobalStore()

  // ── UI state ──
  const [activeTab,  setActiveTab]  = useState('all')
  const [viewMode,   setViewMode]   = useState('table')    // 'table' | 'card'
  const [search,     setSearch]     = useState('')
  const [filters,    setFilters]    = useState({})
  const [showFilter, setShowFilter] = useState(false)
  const [selected,   setSelected]   = useState([])

  // ── Modal state ──
  const [createOpen,     setCreateOpen]     = useState(false)
  const [editTarget,     setEditTarget]     = useState(null)
  const [rejectTarget,   setRejectTarget]   = useState(null)
  const [paidTarget,     setPaidTarget]     = useState(null)
  const [deleteTarget,   setDeleteTarget]   = useState(null)
  const [submitting,     setSubmitting]     = useState(false)

  const loading = state.loading

  // Stub — data is now reactive, no manual reload needed
  const load = () => {}

  // ── Normalize reimbursement: fill fields the UI expects ──
  const normalizeReimb = (r) => ({
    ...r,
    employee:       r.employee ?? r.employee_name ?? '',
    team:           r.team ?? '',
    priority:       r.priority ?? 'medium',
    requested_date: r.requested_date ?? r.created_at ?? '',
    due_date:       r.due_date ?? null,
    reimbursed_amount: r.reimbursed_amount ?? 0,
    approved_amount:   r.approved_amount ?? null,
    remaining_amount:  r.remaining_amount ?? r.requested_amount ?? 0,
    attachments:    r.attachments ?? [],
  })

  // ── Client-side filtering (all filter fields) ──
  const items = useMemo(() => {
    let list = state.reimbursements.map(normalizeReimb)
    if (activeTab && activeTab !== 'all') list = list.filter(r => r.status === activeTab)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        (r.reference ?? '').toLowerCase().includes(q) ||
        (r.employee ?? '').toLowerCase().includes(q)
      )
    }
    if (filters.team)           list = list.filter(r => r.team === filters.team)
    if (filters.priority)       list = list.filter(r => r.priority === filters.priority)
    if (filters.payment_method) list = list.filter(r => r.payment_method === filters.payment_method)
    if (filters.employee)       list = list.filter(r => (r.employee ?? '').toLowerCase().includes(filters.employee.toLowerCase()))
    if (filters.amount_min)     list = list.filter(r => r.requested_amount >= parseFloat(filters.amount_min))
    if (filters.amount_max)     list = list.filter(r => r.requested_amount <= parseFloat(filters.amount_max))
    if (filters.date_from)      list = list.filter(r => (r.requested_date ?? '') >= filters.date_from)
    if (filters.date_to)        list = list.filter(r => (r.requested_date ?? '') <= filters.date_to)
    return list
  }, [state.reimbursements, activeTab, search, filters])

  // ── Derived stats (all fields the StatCards expect) ──
  const stats = useMemo(() => {
    const all = state.reimbursements.map(normalizeReimb)
    const approved   = all.filter(r => r.status === 'approved')
    const partial    = all.filter(r => r.status === 'partial')
    const reimbursed = all.filter(r => ['paid','reimbursed'].includes(r.status))
    return {
      pending_count:    all.filter(r => r.status === 'pending').length,
      pending_amount:   all.filter(r => r.status === 'pending').reduce((s, r) => s + r.requested_amount, 0),
      to_pay_count:     approved.length,
      to_pay:           approved.reduce((s, r) => s + (r.remaining_amount ?? 0), 0),
      partial_count:    partial.length,
      partial_remaining:partial.reduce((s, r) => s + (r.remaining_amount ?? 0), 0),
      rejected_count:   all.filter(r => r.status === 'rejected').length,
      total_reimbursed: reimbursed.reduce((s, r) => s + (r.reimbursed_amount ?? r.requested_amount), 0),
    }
  }, [state.reimbursements])

  // ── Helpers ──
  const tabCount = (key) => {
    const map = {
      pending:  stats.pending_count,
      approved: stats.to_pay_count,
      partial:  stats.partial_count,
      rejected: stats.rejected_count,
    }
    return map[key] != null ? map[key] : ''
  }

  const allSelected  = items.length > 0 && selected.length === items.length
  const someSelected = selected.length > 0

  const toggleSelect = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const toggleAll = () =>
    setSelected(allSelected ? [] : items.map(i => i.id))

  // ── Actions ──
  const handleCreate = (payload) => {
    setSubmitting(true)
    actions.addReimbursement(payload)
    toast.success('Demande créée', 'La demande de remboursement a été créée.')
    setCreateOpen(false)
    setSubmitting(false)
  }

  const handleEdit = (payload) => {
    setSubmitting(true)
    actions.updateReimbursement({ ...editTarget, ...payload })
    toast.success('Modifiée', 'La demande a été mise à jour.')
    setEditTarget(null)
    setSubmitting(false)
  }

  const handleApprove = (item) => {
    actions.approveReimb(item, 'Manager')
    toast.success('Approuvée', `${item.reference} a été approuvée.`)
  }

  const handleReject = (reason) => {
    setSubmitting(true)
    actions.rejectReimb(rejectTarget, reason)
    toast.warning('Rejetée', `${rejectTarget.reference} a été rejetée.`)
    setRejectTarget(null)
    setSubmitting(false)
  }

  const handleMarkPaid = (payload) => {
    setSubmitting(true)
    actions.markReimbPaid(paidTarget, payload.payment_method, payload.payment_reference)
    toast.success('Paiement enregistré', `${paidTarget.reference} mise à jour.`)
    setPaidTarget(null)
    setSubmitting(false)
  }

  const handleDelete = (item) => {
    if (!window.confirm(`Supprimer ${item.reference} ? Cette action est irréversible.`)) return
    actions.deleteReimbursement(item.id)
    toast.info('Supprimée', `${item.reference} a été supprimée.`)
    setSelected(s => s.filter(id => id !== item.id))
  }

  const handleBulkApprove = () => {
    selected.forEach(id => {
      const item = state.reimbursements.find(i => i.id === id)
      if (item && ['pending','draft'].includes(item.status)) {
        actions.approveReimb(item, 'Manager')
      }
    })
    toast.success('Approuvées', `${selected.length} demandes approuvées.`)
    setSelected([])
  }

  const handleExportCSV = () => {
    const rows = [
      ['Référence','Employé','Équipe','Montant demandé','Montant approuvé','Remboursé','Restant','Statut','Priorité','Méthode','Date demande'],
      ...items.map(r => [
        r.reference, r.employee, r.team,
        r.requested_amount, r.approved_amount ?? '', r.reimbursed_amount, r.remaining_amount,
        STATUS_LABELS[r.status], PRIORITY_LABELS[r.priority],
        r.payment_method ? PAYMENT_METHOD_LABELS[r.payment_method] : '',
        r.requested_date,
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'remboursements.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Exporté', 'Fichier CSV téléchargé.')
  }

  const setFilter = (key, value) =>
    setFilters(f => value ? { ...f, [key]: value } : Object.fromEntries(Object.entries(f).filter(([k]) => k !== key)))

  const clearFilters = () => { setFilters({}); setSearch('') }

  const activeFilterCount = Object.keys(filters).filter(k => filters[k]).length + (search ? 1 : 0)

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header ── */}
      <PageHeader
        title="Remboursements"
        subtitle="Gérez et suivez toutes les demandes de remboursement"
        icon={<CreditCard size={18} />}
        actions={
          <>
            <button className="btn-secondary" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} /> Exporter CSV
            </button>
            <button className="btn-primary" onClick={() => setCreateOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={15} /> Nouvelle demande
            </button>
          </>
        }
      />

      {/* ── Alert banners ── */}
      <AlertBanners items={items} />

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        <StatCard
          label="Total remboursé"
          value={stats ? fmt(stats.total_reimbursed) : '…'}
          icon={<CheckCircle size={16} />}
          color="success"
          delta={stats ? `${items.filter(r => r.status === 'reimbursed').length} dossiers` : ''}
        />
        <StatCard
          label="En attente"
          value={stats ? String(stats.pending_count) : '…'}
          icon={<Clock size={16} />}
          color="warn"
          delta={stats ? fmt(stats.pending_amount) : ''}
          trend="down"
        />
        <StatCard
          label="Rejetées"
          value={stats ? String(stats.rejected_count) : '…'}
          icon={<XCircle size={16} />}
          color="danger"
          delta="ce mois"
        />
        <StatCard
          label="À payer"
          value={stats ? fmt(stats.to_pay) : '…'}
          icon={<CreditCard size={16} />}
          color="accent"
          delta={stats ? `${stats.to_pay_count} approuvée${stats.to_pay_count !== 1 ? 's' : ''}` : ''}
          trend="up"
        />
        <StatCard
          label="Partielles"
          value={stats ? String(stats.partial_count) : '…'}
          icon={<RefreshCw size={16} />}
          color="gold"
          delta={stats ? fmt(stats.partial_remaining) + ' restant' : ''}
        />
      </div>

      {/* ── Controls bar ── */}
      <div className="card-static" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Top row: search + view toggle + filter btn */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Rechercher par référence, employé, montant…"
            />
          </div>

          {/* Filter toggle */}
          <button
            className={showFilter ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setShowFilter(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}
          >
            Filtres
            {activeFilterCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                width: 16, height: 16, borderRadius: '50%',
                background: 'var(--danger)', color: '#fff',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={13} style={{ transform: showFilter ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
          </button>

          {/* View mode toggle */}
          <div style={{
            display: 'flex', borderRadius: 8,
            border: '1px solid var(--pearl)', overflow: 'hidden',
          }}>
            {[
              { mode: 'table', icon: <List size={14} /> },
              { mode: 'card',  icon: <LayoutGrid size={14} /> },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 34, height: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer',
                  background: viewMode === mode ? 'var(--accent)' : 'transparent',
                  color: viewMode === mode ? '#fff' : 'var(--silver)',
                  transition: 'all .15s',
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          <button className="btn-ghost" onClick={load} title="Rafraîchir">
            <RefreshCw size={14} style={{ color: 'var(--silver)' }} />
          </button>
        </div>

        {/* Expandable filter panel */}
        {showFilter && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
            padding: '14px', borderRadius: 10,
            background: 'var(--ivory)', border: '1px solid var(--pearl)',
            animation: 'fadeIn .15s ease',
          }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Équipe
              </label>
              <select className="input-premium" value={filters.team ?? ''} onChange={e => setFilter('team', e.target.value)}>
                <option value="">Toutes les équipes</option>
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Priorité
              </label>
              <select className="input-premium" value={filters.priority ?? ''} onChange={e => setFilter('priority', e.target.value)}>
                <option value="">Toutes</option>
                {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Mode de paiement
              </label>
              <select className="input-premium" value={filters.payment_method ?? ''} onChange={e => setFilter('payment_method', e.target.value)}>
                <option value="">Tous</option>
                {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Employé
              </label>
              <input className="input-premium" placeholder="Nom…" value={filters.employee ?? ''} onChange={e => setFilter('employee', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Montant min (MAD)
              </label>
              <input className="input-premium" type="number" placeholder="0" value={filters.amount_min ?? ''} onChange={e => setFilter('amount_min', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Montant max (MAD)
              </label>
              <input className="input-premium" type="number" placeholder="∞" value={filters.amount_max ?? ''} onChange={e => setFilter('amount_max', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Date de
              </label>
              <input className="input-premium" type="date" value={filters.date_from ?? ''} onChange={e => setFilter('date_from', e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--charcoal)', display: 'block', marginBottom: 5 }}>
                Date à
              </label>
              <input className="input-premium" type="date" value={filters.date_to ?? ''} onChange={e => setFilter('date_to', e.target.value)} />
            </div>

            {activeFilterCount > 0 && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-ghost" onClick={clearFilters} style={{ fontSize: 12, color: 'var(--danger)' }}>
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--pearl)', marginBottom: -14 }}>
          {TABS.map(tab => {
            const cnt = tabCount(tab.key)
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '8px 14px',
                  fontSize: 12.5, fontWeight: 500,
                  border: 'none', background: 'transparent',
                  cursor: 'pointer',
                  color: activeTab === tab.key ? 'var(--accent)' : 'var(--silver)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'all .15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {tab.label}
                {cnt !== '' && cnt > 0 && (
                  <span style={{
                    padding: '0px 6px', borderRadius: 10, fontSize: 10.5, fontWeight: 700,
                    background: activeTab === tab.key ? 'var(--accent-light)' : 'var(--pearl)',
                    color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)',
                  }}>
                    {cnt}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      {someSelected && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderRadius: 10,
          background: 'var(--accent-light)', border: '1px solid var(--accent-mid)',
          animation: 'fadeIn .15s ease',
        }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', flex: 1 }}>
            {selected.length} sélectionnée{selected.length > 1 ? 's' : ''}
          </span>
          <button className="btn-secondary" style={{ fontSize: 12 }} onClick={handleBulkApprove}>
            <CheckCircle size={13} /> Approuver tout
          </button>
          <button
            className="btn-secondary"
            style={{ fontSize: 12 }}
            onClick={() => {
              const data = items.filter(i => selected.includes(i.id))
              const rows = [
                ['Référence','Employé','Montant','Statut'],
                ...data.map(r => [r.reference, r.employee, r.requested_amount, STATUS_LABELS[r.status]])
              ]
              const csv = rows.map(r => r.join(',')).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url  = URL.createObjectURL(blob)
              const a    = document.createElement('a')
              a.href = url; a.download = 'selection.csv'; a.click()
            }}
          >
            <Download size={13} /> Exporter
          </button>
          <button className="btn-ghost" onClick={() => setSelected([])} style={{ fontSize: 12 }}>
            Annuler
          </button>
        </div>
      )}

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="card-static" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="premium-table" style={{ minWidth: 1100 }}>
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
                    />
                  </th>
                  <th>Référence</th>
                  <th>Employé</th>
                  <th style={{ textAlign: 'right' }}>Demandé</th>
                  <th style={{ textAlign: 'right' }}>Approuvé</th>
                  <th style={{ textAlign: 'right' }}>Remboursé</th>
                  <th style={{ textAlign: 'right' }}>Restant</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                  <th>Méthode</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>

              {loading ? <TableSkeleton /> : (
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={12} style={{ padding: 0, border: 'none' }}>
                        <EmptyState
                          icon={<CreditCard size={28} />}
                          title="Aucune demande trouvée"
                          description="Modifiez vos filtres ou créez une nouvelle demande de remboursement."
                          action={
                            <button className="btn-primary" onClick={() => setCreateOpen(true)}>
                              <Plus size={13} /> Nouvelle demande
                            </button>
                          }
                        />
                      </td>
                    </tr>
                  ) : items.map(item => (
                    <tr
                      key={item.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/app/reimbursements/${item.id}`)}
                    >
                      {/* Checkbox */}
                      <td onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          style={{ cursor: 'pointer', accentColor: 'var(--accent)' }}
                        />
                      </td>

                      {/* Reference */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)' }}>
                            {item.reference}
                          </span>
                          <SLABadge due_date={item.due_date} status={item.status} />
                        </div>
                      </td>

                      {/* Employee */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            background: 'var(--accent-light)', color: 'var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700,
                          }}>
                            {initials(...item.employee.split(' '))}
                          </div>
                          <div>
                            <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{item.employee}</p>
                            <p style={{ fontSize: 11, color: 'var(--silver)' }}>{item.team}</p>
                          </div>
                        </div>
                      </td>

                      {/* Amounts */}
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(item.requested_amount)}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--slate)', fontVariantNumeric: 'tabular-nums' }}>
                          {item.approved_amount != null ? fmt(item.approved_amount) : '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                          {fmt(item.reimbursed_amount)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{
                          fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                          color: item.remaining_amount > 0 ? 'var(--warn)' : 'var(--success)',
                        }}>
                          {fmt(item.remaining_amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td><ReimbursementStatusBadge status={item.status} /></td>

                      {/* Priority */}
                      <td><ReimbursementPriorityBadge priority={item.priority} /></td>

                      {/* Payment method */}
                      <td><PaymentMethodBadge method={item.payment_method} /></td>

                      {/* Date */}
                      <td style={{ color: 'var(--silver)', fontSize: 12 }}>{fmtDate(item.requested_date)}</td>

                      {/* Actions */}
                      <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <ActionMenu items={[
                          {
                            label: 'Voir détail',
                            icon: <Eye size={13} />,
                            onClick: () => navigate(`/app/reimbursements/${item.id}`),
                          },
                          'divider',
                          {
                            label: 'Approuver',
                            icon: <CheckCircle size={13} />,
                            onClick: () => handleApprove(item),
                            disabled: !['draft','pending'].includes(item.status),
                          },
                          {
                            label: 'Rejeter',
                            icon: <XCircle size={13} />,
                            onClick: () => setRejectTarget(item),
                            disabled: item.status === 'rejected',
                            danger: true,
                          },
                          {
                            label: 'Marquer remboursée',
                            icon: <CreditCard size={13} />,
                            onClick: () => setPaidTarget(item),
                            disabled: !['approved','partial'].includes(item.status),
                          },
                          'divider',
                          {
                            label: 'Modifier',
                            icon: <Pencil size={13} />,
                            onClick: () => setEditTarget(item),
                            disabled: item.status === 'reimbursed',
                          },
                          {
                            label: 'Supprimer',
                            icon: <Trash2 size={13} />,
                            onClick: () => handleDelete(item),
                            danger: true,
                          },
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Footer count */}
          {!loading && items.length > 0 && (
            <div style={{
              padding: '10px 18px', borderTop: '1px solid var(--ivory)',
              fontSize: 11.5, color: 'var(--silver)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{items.length} résultat{items.length > 1 ? 's' : ''}</span>
              {someSelected && <span>{selected.length} sélectionné{selected.length > 1 ? 's' : ''}</span>}
            </div>
          )}
        </div>
      )}

      {/* ── CARD VIEW ── */}
      {viewMode === 'card' && (
        loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-static" style={{ padding: 20, height: 200 }}>
                {[80, 50, 40, 60].map((w, j) => (
                  <div key={j} style={{
                    height: 12, width: `${w}%`, borderRadius: 6, marginBottom: 12,
                    background: 'var(--pearl)', animation: 'shimmer 1.4s ease infinite',
                    backgroundSize: '200% 100%',
                    backgroundImage: 'linear-gradient(90deg, var(--pearl) 25%, var(--ivory) 50%, var(--pearl) 75%)',
                  }} />
                ))}
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="card-static">
            <EmptyState
              icon={<CreditCard size={28} />}
              title="Aucune demande trouvée"
              description="Créez votre première demande de remboursement."
              action={<button className="btn-primary" onClick={() => setCreateOpen(true)}>+ Nouvelle demande</button>}
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {items.map(item => (
              <ReimbursementCard
                key={item.id}
                item={item}
                onView={i => navigate(`/app/reimbursements/${i.id}`)}
                onApprove={handleApprove}
                onReject={i => setRejectTarget(i)}
                onMarkPaid={i => setPaidTarget(i)}
                onEdit={i => setEditTarget(i)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      )}

      {/* ── MODALS ── */}

      <ReimbursementForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        loading={submitting}
      />

      <ReimbursementForm
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        initialData={editTarget}
        loading={submitting}
      />

      <RejectModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
        reference={rejectTarget?.reference}
        loading={submitting}
      />

      <MarkReimbursedModal
        open={!!paidTarget}
        onClose={() => setPaidTarget(null)}
        onConfirm={handleMarkPaid}
        reimbursement={paidTarget}
        loading={submitting}
      />

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
