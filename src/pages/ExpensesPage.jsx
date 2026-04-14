import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalStore } from '../store/GlobalStore'
import StatusBadge from '../components/StatusBadge'
import PageHeader   from '../components/ui/PageHeader'
import StatCard     from '../components/ui/StatCard'
import EmptyState   from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import Pagination   from '../components/ui/Pagination'
import ActionMenu   from '../components/ui/ActionMenu'
import FilterBar    from '../components/ui/FilterBar'
import SearchInput  from '../components/ui/SearchInput'
import FormModal    from '../components/ui/FormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { fmt, fmtDate } from '../lib/helpers'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { MOCK_CATEGORIES, MOCK_TEAMS } from '../lib/mockData'
import {
  Plus, Filter, FileText, LayoutGrid, List,
  TrendingDown, Clock, CheckCircle, XCircle,
  Pencil, Trash2, Eye, ExternalLink, Upload,
  DollarSign, ChevronRight, Check,
} from 'lucide-react'

/* ── Tabs ─────────────────────────────────────────────────── */
const TABS = [
  { key: '',         label: 'Toutes'    },
  { key: 'draft',    label: 'Brouillon' },
  { key: 'pending',  label: 'En attente'},
  { key: 'approved', label: 'Approuvées'},
  { key: 'rejected', label: 'Rejetées'  },
  { key: 'paid',     label: 'Payées'    },
]

const EMPTY_FORM = {
  title: '', description: '', amount: '',
  category_id: '', team_id: '', expense_date: new Date().toISOString().slice(0, 10),
  project: '', status: 'draft',
}

/* ── Expense Card (grid view) ─────────────────────────────── */
function ExpenseCard({ exp, onEdit, onDelete, canApprove }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="card"
      style={{ padding: 18, cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: exp.category?.color ? `${exp.category.color}18` : 'var(--ivory)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: exp.category?.color ?? 'var(--silver)' }} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.3 }}>
              {exp.category?.name ?? 'Sans catégorie'}
            </p>
            <p style={{ fontSize: 10.5, color: 'var(--silver)', marginTop: 1 }}>{fmtDate(exp.expense_date)}</p>
          </div>
        </div>
        <StatusBadge status={exp.status} />
      </div>

      <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.3 }}>
        {exp.title}
      </p>
      {exp.description && (
        <p style={{ fontSize: 12, color: 'var(--silver)', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {exp.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--ivory)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--accent-light)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8.5, fontWeight: 700, flexShrink: 0,
          }}>
            {exp.user?.first_name?.[0]}{exp.user?.last_name?.[0]}
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--slate)' }}>
            {exp.user?.first_name} {exp.user?.last_name}
          </span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
          {fmt(exp.amount)}
        </span>
      </div>

      {hovered && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <button
            className="btn-ghost"
            onClick={e => { e.stopPropagation(); onEdit(exp) }}
            style={{ flex: 1, height: 30, fontSize: 11.5, justifyContent: 'center' }}
          >
            <Pencil size={11} /> Modifier
          </button>
          <Link
            to={`/app/expenses/${exp.id}`}
            className="btn-ghost"
            style={{ flex: 1, height: 30, fontSize: 11.5, justifyContent: 'center', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <Eye size={11} /> Détail
          </Link>
        </div>
      )}
    </div>
  )
}

/* ── Normalize a flat centralData expense → UI-compatible shape ── */
function normalizeExpense(e) {
  return {
    ...e,
    expense_date: e.expense_date ?? e.date,
    category: e.category && typeof e.category === 'object'
      ? e.category
      : { id: e.category_id ?? e.category, name: e.category ?? 'Sans catégorie', color: e.category_color ?? 'var(--silver)' },
    user: e.user ?? {
      first_name: (e.employee_name ?? '').split(' ')[0] ?? '',
      last_name:  (e.employee_name ?? '').split(' ').slice(1).join(' ') ?? '',
      team: { name: e.team ?? '' },
    },
  }
}

/* ── Main Page ────────────────────────────────────────────── */
export default function ExpensesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { state, selectors, actions } = useGlobalStore()

  const [tab, setTab]             = useState('')
  const [search, setSearch]       = useState('')
  const [page, setPage]           = useState(1)
  const [view, setView]           = useState('table')  // 'table' | 'grid'
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters]     = useState({ category_id: '', team_id: '', from: '', to: '', amount_min: '', amount_max: '' })
  const [selected, setSelected]   = useState(new Set())

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false)
  const [editingExp, setEditingExp]     = useState(null)
  const [form, setForm]                 = useState(EMPTY_FORM)
  const [submitting, setSubmitting]     = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const PER_PAGE = 10
  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v }))
  const loading = state.loading

  /* ── Normalize + filter entirely client-side ── */
  const allExpenses = useMemo(() =>
    state.expenses.map(normalizeExpense),
    [state.expenses]
  )

  const filtered = useMemo(() => {
    let list = allExpenses
    if (tab)                list = list.filter(e => e.status === tab)
    if (filters.category_id) list = list.filter(e => String(e.category?.id ?? e.category_id) === String(filters.category_id))
    if (filters.team_id)     list = list.filter(e => String(e.team_id ?? e.user?.team?.id) === String(filters.team_id))
    if (filters.from)        list = list.filter(e => (e.expense_date ?? '') >= filters.from)
    if (filters.to)          list = list.filter(e => (e.expense_date ?? '') <= filters.to)
    if (filters.amount_min)  list = list.filter(e => e.amount >= parseFloat(filters.amount_min))
    if (filters.amount_max)  list = list.filter(e => e.amount <= parseFloat(filters.amount_max))
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.user?.first_name?.toLowerCase().includes(q) ||
        e.user?.last_name?.toLowerCase().includes(q) ||
        e.category?.name?.toLowerCase().includes(q)
      )
    }
    return list
  }, [allExpenses, tab, filters, search])

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, page])

  /* ── Statistics (computed from full set, not filtered view) ── */
  const stats = useMemo(() => {
    const total    = allExpenses.reduce((s, e) => s + e.amount, 0)
    const pending  = allExpenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0)
    const approved = allExpenses.filter(e => ['approved', 'paid'].includes(e.status)).reduce((s, e) => s + e.amount, 0)
    return { total, pending, approved, count: allExpenses.length }
  }, [allExpenses])

  /* ── Selection helpers ── */
  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set())
    else setSelected(new Set(paginated.map(e => e.id)))
  }
  const toggleOne = (id) => {
    setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  /* ── Bulk action ── */
  const handleBulk = (action) => {
    if (!selected.size) return
    const ids = [...selected]
    ids.forEach(id => {
      const exp = allExpenses.find(e => e.id === id)
      if (!exp) return
      if (action === 'approve') actions.approveExpense(exp, user?.name ?? 'Manager')
      else actions.rejectExpense(exp, 'Rejeté en masse')
    })
    toast.success('Action effectuée', `${ids.length} dépense(s) ${action === 'approve' ? 'approuvée(s)' : 'rejetée(s)'}`)
    setSelected(new Set())
  }

  /* ── Create / Edit ── */
  const openCreate = () => { setEditingExp(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit   = (exp) => {
    setEditingExp(exp)
    setForm({
      title:        exp.title        ?? '',
      description:  exp.description  ?? '',
      amount:       exp.amount       ?? '',
      category_id:  exp.category?.id ?? '',
      team_id:      exp.team_id      ?? '',
      expense_date: exp.expense_date ?? new Date().toISOString().slice(0, 10),
      project:      exp.project      ?? '',
      status:       exp.status       ?? 'draft',
    })
    setModalOpen(true)
  }

  const handleSubmit = () => {
    if (!form.title || !form.amount) {
      toast.error('Champs requis', 'Veuillez remplir le titre et le montant')
      return
    }
    setSubmitting(true)
    const cat = MOCK_CATEGORIES.find(c => String(c.id) === String(form.category_id))
    const payload = {
      ...form,
      amount:       parseFloat(form.amount),
      category:     cat ? { id: cat.id, name: cat.name, color: cat.color } : form.category,
      category_id:  form.category_id,
      employee_name: user?.name ?? user?.first_name ?? 'Utilisateur',
      user:         { first_name: user?.first_name ?? user?.name ?? '', last_name: user?.last_name ?? '', team: { name: '' } },
    }
    if (editingExp) {
      actions.updateExpense({ ...editingExp, ...payload })
      toast.success('Succès', 'Dépense modifiée')
    } else {
      actions.addExpense(payload)
      toast.success('Succès', 'Dépense créée')
    }
    setModalOpen(false)
    setSubmitting(false)
  }

  /* ── Delete ── */
  const handleDelete = () => {
    if (!deleteTarget) return
    actions.deleteExpense(deleteTarget.id)
    toast.success('Supprimée', `"${deleteTarget.title}" a été supprimée`)
    setDeleteTarget(null)
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Page Header ── */}
      <PageHeader
        className="animate-fade-up"
        title="Dépenses"
        subtitle="Gérez et suivez toutes les notes de frais"
        icon={<TrendingDown size={18} />}
        badge={filtered.length}
        actions={
          <>
            <button className="btn-secondary" onClick={() => setShowFilters(v => !v)} style={{ position: 'relative' }}>
              <Filter size={13} />
              Filtres
              {activeFiltersCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 17, height: 17, borderRadius: '50%',
                  background: 'var(--accent)', color: '#fff',
                  fontSize: 9.5, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button className="btn-primary" onClick={openCreate}>
              <Plus size={14} /> Nouvelle dépense
            </button>
          </>
        }
      />

      {/* ── Stats row ── */}
      <div className="animate-fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Total dépenses"  value={fmt(stats.total)}   icon={<DollarSign size={15} />} color="accent" />
        <StatCard label="En attente"      value={fmt(stats.pending)} icon={<Clock size={15} />}      color="warn" />
        <StatCard label="Approuvées"      value={fmt(stats.approved)}icon={<CheckCircle size={15} />} color="success" />
        <StatCard label="Nombre d'entrées" value={stats.count}       icon={<FileText size={15} />}   color="accent" />
      </div>

      {/* ── Filter bar ── */}
      <FilterBar
        open={showFilters}
        count={activeFiltersCount}
        onApply={() => { setPage(1); setShowFilters(false) }}
        onReset={() => { setFilters({ category_id: '', team_id: '', from: '', to: '', amount_min: '', amount_max: '' }); setPage(1) }}
      >
        <FilterBar.Field label="Catégorie">
          <select className="input-premium" value={filters.category_id} onChange={e => setF('category_id', e.target.value)}>
            <option value="">Toutes</option>
            {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterBar.Field>
        <FilterBar.Field label="Équipe">
          <select className="input-premium" value={filters.team_id} onChange={e => setF('team_id', e.target.value)}>
            <option value="">Toutes</option>
            {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </FilterBar.Field>
        <FilterBar.Field label="Du">
          <input type="date" className="input-premium" value={filters.from} onChange={e => setF('from', e.target.value)} />
        </FilterBar.Field>
        <FilterBar.Field label="Au">
          <input type="date" className="input-premium" value={filters.to} onChange={e => setF('to', e.target.value)} />
        </FilterBar.Field>
        <FilterBar.Field label="Montant min">
          <input type="number" className="input-premium" placeholder="0" value={filters.amount_min} onChange={e => setF('amount_min', e.target.value)} />
        </FilterBar.Field>
        <FilterBar.Field label="Montant max">
          <input type="number" className="input-premium" placeholder="∞" value={filters.amount_max} onChange={e => setF('amount_max', e.target.value)} />
        </FilterBar.Field>
      </FilterBar>

      {/* ── Toolbar: tabs + search + view toggle ── */}
      <div className="animate-fade-up stagger-2 card-static" style={{ padding: '0 4px', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ivory)', padding: '0 16px' }}>
          <div style={{ display: 'flex' }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setPage(1); setSearch('') }}
                style={{
                  padding: '12px 16px', fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                  color: tab === t.key ? 'var(--accent)' : 'var(--silver)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: `2px solid ${tab === t.key ? 'var(--accent)' : 'transparent'}`,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                  marginBottom: -1,
                }}
              >
                {t.label}
                {t.key === 'pending' && allExpenses.filter(e => e.status === 'pending').length > 0 && (
                  <span style={{
                    marginLeft: 6, padding: '1px 6px', borderRadius: 20,
                    background: 'var(--warn-bg)', color: 'var(--warn)',
                    fontSize: 10.5, fontWeight: 600,
                  }}>
                    {allExpenses.filter(e => e.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <SearchInput value={search} onChange={setSearch} placeholder="Rechercher…" width={220} />
            {/* View toggle */}
            <div style={{ display: 'flex', background: 'var(--ivory)', borderRadius: 8, padding: 3 }}>
              {[['table', <List size={13} />], ['grid', <LayoutGrid size={13} />]].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)} style={{
                  width: 28, height: 28, borderRadius: 6, border: 'none',
                  background: view === v ? '#fff' : 'transparent',
                  color: view === v ? 'var(--charcoal)' : 'var(--silver)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk actions bar */}
        {selected.size > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', background: 'var(--accent-light)',
            borderBottom: '1px solid var(--accent-mid)',
          }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>
              {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
            </span>
            <button className="btn-secondary" onClick={() => handleBulk('approve')} style={{ height: 30, fontSize: 12, padding: '0 12px' }}>
              <Check size={12} /> Approuver
            </button>
            <button className="btn-secondary" onClick={() => handleBulk('reject')} style={{ height: 30, fontSize: 12, padding: '0 12px' }}>
              <XCircle size={12} /> Rejeter
            </button>
            <button className="btn-ghost" onClick={() => setSelected(new Set())} style={{ height: 30, marginLeft: 'auto', fontSize: 12 }}>
              Désélectionner
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ padding: 16 }}>
            {view === 'grid'
              ? <LoadingSkeleton type="cards" count={6} />
              : <LoadingSkeleton type="table" rows={6} />
            }
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title="Aucune dépense trouvée"
            description={search ? `Aucun résultat pour "${search}"` : "Commencez par créer votre première dépense."}
            action={<button className="btn-primary" onClick={openCreate}><Plus size={13} /> Créer une dépense</button>}
          />
        ) : view === 'grid' ? (
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {paginated.map(exp => (
              <ExpenseCard key={exp.id} exp={exp}
                onEdit={openEdit}
                onDelete={e => setDeleteTarget(e)}
                canApprove={user?.role !== 'equipe'}
              />
            ))}
          </div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    style={{ cursor: 'pointer', width: 14, height: 14, accentColor: 'var(--accent)' }}
                  />
                </th>
                {['Employé', 'Description', 'Catégorie', 'Projet', 'Date', 'Montant', 'Statut', ''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((exp, i) => (
                <tr key={exp.id} style={{ animationDelay: `${i * 0.03}s` }}
                  onClick={() => toggleOne(exp.id)}
                >
                  <td onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(exp.id)}
                      onChange={() => toggleOne(exp.id)}
                      style={{ cursor: 'pointer', width: 14, height: 14, accentColor: 'var(--accent)' }}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--accent-light)', color: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9.5, fontWeight: 600, flexShrink: 0,
                      }}>
                        {exp.user?.first_name?.[0]}{exp.user?.last_name?.[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--charcoal)', lineHeight: 1.2 }}>
                          {exp.user?.first_name} {exp.user?.last_name}
                        </p>
                        <p style={{ fontSize: 10.5, color: 'var(--silver)', lineHeight: 1 }}>
                          {exp.user?.team?.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--slate)', fontSize: 12.5 }}>
                    {exp.title}
                  </td>
                  <td>
                    {exp.category ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 2, background: exp.category.color, flexShrink: 0 }} />
                        <span style={{ color: 'var(--slate)', fontSize: 12.5 }}>{exp.category.name}</span>
                      </div>
                    ) : '—'}
                  </td>
                  <td style={{ color: 'var(--silver)', fontSize: 12 }}>{exp.project || '—'}</td>
                  <td style={{ color: 'var(--silver)', fontSize: 12.5, whiteSpace: 'nowrap' }}>{fmtDate(exp.expense_date)}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>
                      {fmt(exp.amount)}
                    </span>
                  </td>
                  <td><StatusBadge status={exp.status} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <ActionMenu items={[
                      { label: 'Voir détail', icon: <Eye size={12} />, onClick: () => window.location.href = `/app/expenses/${exp.id}` },
                      { label: 'Modifier', icon: <Pencil size={12} />, onClick: () => openEdit(exp) },
                      { label: 'Télécharger reçu', icon: <Upload size={12} />, onClick: () => toast.info('Bientôt', 'Upload disponible dans la vue détail') },
                      'divider',
                      { label: 'Supprimer', icon: <Trash2 size={12} />, onClick: () => setDeleteTarget(exp), danger: true },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && filtered.length > PER_PAGE && (
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExp ? 'Modifier la dépense' : 'Nouvelle dépense'}
        subtitle={editingExp ? `Modification de "${editingExp.title}"` : 'Renseignez les informations de la dépense'}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel={editingExp ? 'Enregistrer les modifications' : 'Créer la dépense'}
      >
        <FormModal.Field label="Titre" required>
          <input className="input-premium" placeholder="Ex: Vol Casablanca-Paris"
            value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </FormModal.Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormModal.Field label="Montant (MAD)" required>
            <input className="input-premium" type="number" placeholder="0.00"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </FormModal.Field>
          <FormModal.Field label="Date">
            <input className="input-premium" type="date"
              value={form.expense_date} onChange={e => setForm(f => ({ ...f, expense_date: e.target.value }))} />
          </FormModal.Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormModal.Field label="Catégorie">
            <select className="input-premium" value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">Sélectionner…</option>
              {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormModal.Field>
          <FormModal.Field label="Équipe">
            <select className="input-premium" value={form.team_id} onChange={e => setForm(f => ({ ...f, team_id: e.target.value }))}>
              <option value="">Sélectionner…</option>
              {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormModal.Field>
        </div>

        <FormModal.Field label="Projet (optionnel)">
          <input className="input-premium" placeholder="Nom du projet"
            value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} />
        </FormModal.Field>

        <FormModal.Field label="Description (optionnel)">
          <textarea
            className="input-premium"
            placeholder="Détails supplémentaires…"
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ resize: 'vertical', lineHeight: 1.6 }}
          />
        </FormModal.Field>

        <FormModal.Field label="Statut initial">
          <select className="input-premium" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="draft">Brouillon</option>
            <option value="pending">Soumettre pour approbation</option>
          </select>
        </FormModal.Field>

        {/* Receipt upload UI (visual only) */}
        <div style={{
          border: '2px dashed var(--pearl)', borderRadius: 12,
          padding: '18px 16px', textAlign: 'center', cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-dim)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--pearl)'}
        >
          <Upload size={18} style={{ color: 'var(--silver)', margin: '0 auto 6px' }} />
          <p style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--charcoal)' }}>
            Glissez un reçu ici
          </p>
          <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 3 }}>
            PDF, JPG, PNG — max 10 Mo
          </p>
          <button className="btn-secondary" style={{ marginTop: 10, height: 30, fontSize: 12 }}
            onClick={e => e.preventDefault()}>
            <Upload size={11} /> Choisir un fichier
          </button>
        </div>
      </FormModal>

      {/* ── Delete Confirm ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer la dépense ?"
        message={`"${deleteTarget?.title}" sera définitivement supprimée. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        danger
      />
    </div>
  )
}
