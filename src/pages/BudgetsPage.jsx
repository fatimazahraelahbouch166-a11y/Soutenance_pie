import { useState, useMemo } from 'react'
import { useGlobalStore } from '../store/GlobalStore'
import PageHeader   from '../components/ui/PageHeader'
import StatCard     from '../components/ui/StatCard'
import EmptyState   from '../components/ui/EmptyState'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import FormModal    from '../components/ui/FormModal'
import SearchInput  from '../components/ui/SearchInput'
import ActionMenu   from '../components/ui/ActionMenu'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../contexts/ToastContext'
import { fmt } from '../lib/helpers'
import { useAuth } from '../contexts/AuthContext'
import { MOCK_CATEGORIES,MOCK_TEAMS } from '../lib/mockData'
import {
  Plus, BookOpen, AlertTriangle, CheckCircle,
  Pencil, Trash2, TrendingUp, Users, Tag,
} from 'lucide-react'

const EMPTY_FORM = {
  label: '', amount: '', period: 'yearly',
  category_id: '', team_id: '',
  start_date: '2025-01-01', end_date: '2025-12-31',
}

/* ── Budget Progress Bar ─────────────────────────────────── */
function BudgetCard({ budget, onEdit, onDelete }) {
  const pct   = Math.min(budget.percentage ?? 0, 100)
  const over  = (budget.percentage ?? 0) > 100
  const alert = (budget.percentage ?? 0) >= 80 && !over

  const color  = over ? 'var(--danger)' : alert ? 'var(--warn)' : 'var(--success)'
  const bg     = over ? 'var(--danger-bg)' : alert ? 'var(--warn-bg)' : 'var(--success-bg)'
  const border = over ? 'var(--danger)' : alert ? 'var(--warn)' : 'var(--success)'

  return (
    <div className="card-static" style={{
      padding: '18px 20px',
      borderLeft: `4px solid ${border}`,
      transition: 'box-shadow 0.2s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {budget.label}
            </p>
            {over && (
              <span style={{ padding: '2px 7px', borderRadius: 20, background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: 10.5, fontWeight: 600, flexShrink: 0 }}>
                ⚠ Dépassé
              </span>
            )}
            {alert && !over && (
              <span style={{ padding: '2px 7px', borderRadius: 20, background: 'var(--warn-bg)', color: 'var(--warn)', fontSize: 10.5, fontWeight: 600, flexShrink: 0 }}>
                Attention
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {budget.category && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: budget.category.color }} />
                <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>{budget.category.name}</span>
              </div>
            )}
            {budget.team && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={10} style={{ color: 'var(--silver)' }} />
                <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>{budget.team.name}</span>
              </div>
            )}
            {!budget.category && !budget.team && (
              <span style={{ fontSize: 11.5, color: 'var(--silver)' }}>Global</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            padding: '4px 10px', borderRadius: 20,
            background: bg, color, fontSize: 13, fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {budget.percentage ?? 0}%
          </span>
          <ActionMenu items={[
            { label: 'Modifier', icon: <Pencil size={12} />, onClick: () => onEdit(budget) },
            'divider',
            { label: 'Supprimer', icon: <Trash2 size={12} />, onClick: () => onDelete(budget), danger: true },
          ]} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, background: 'var(--ivory)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: 10,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative',
        }}>
          {pct > 10 && (
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: pct > 30 ? 3 : 0,
              background: 'rgba(255,255,255,0.4)', borderRadius: '0 10px 10px 0',
            }} />
          )}
        </div>
      </div>

      {/* Amount details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Budget',    value: fmt(budget.amount),    color: 'var(--charcoal)' },
          { label: 'Dépensé',   value: fmt(budget.spent ?? 0), color },
          { label: 'Restant',   value: fmt(budget.remaining ?? budget.amount - (budget.spent ?? 0)), color: budget.remaining < 0 ? 'var(--danger)' : 'var(--success)' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 10.5, color: 'var(--silver)', marginBottom: 3 }}>{item.label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: item.color, fontVariantNumeric: 'tabular-nums' }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Normalize a flat centralData budget → UI-compatible shape ── */
function normalizeBudget(b) {
  const cat = b.category
  return {
    ...b,
    label: b.label ?? b.name,
    category: cat && typeof cat === 'object'
      ? cat
      : cat ? { id: b.category_id ?? cat, name: cat, color: 'var(--accent)' } : null,
    team: b.team ?? (b.team_id ? { id: b.team_id, name: `Équipe ${b.team_id}` } : null),
  }
}

/* ── Main Page ───────────────────────────────────────────── */
export default function BudgetsPage() {
  const { toast } = useToast()
  const { state, selectors, actions } = useGlobalStore()
// const { user, canEditBudgets } = useAuth()
// const canEdit = canEditBudgets(user)
// const isReadOnly = user?.role === 'equipe'
const { user, canEditBudgets } = useAuth()
const canEdit = useMemo(() => {
  if (loading || !user) return false
  return canEditBudgets(user)
}, [user, loading])
  const [search, setSearch]           = useState('')
  const [filterTeam, setFilterTeam]   = useState('')
  const [filterCat, setFilterCat]     = useState('')
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const loading = state.loading

  /* ── Derive budgets from GlobalStore (live-computed spent) ── */
  const budgets = useMemo(() =>
    selectors.computedBudgets.map(normalizeBudget),
    [selectors.computedBudgets]
  )

  /* ── Filtered budgets ── */
  const filtered = useMemo(() => budgets.filter(b => {
    if (search && !b.label?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterTeam && String(b.team_id) !== String(filterTeam)) return false
    if (filterCat  && String(b.category_id ?? b.category?.id ?? b.category?.name) !== String(filterCat)) return false
    return true
  }), [budgets, search, filterTeam, filterCat])

  /* ── Statistics ── */
  const stats = useMemo(() => {
    const total   = budgets.reduce((s, b) => s + (b.amount ?? 0), 0)
    const spent   = budgets.reduce((s, b) => s + (b.spent  ?? 0), 0)
    const alerts  = budgets.filter(b => (b.percentage ?? 0) >= 80).length
    const over    = budgets.filter(b => (b.percentage ?? 0) > 100).length
    return { total, spent, alerts, over, pct: total > 0 ? Math.round((spent / total) * 100) : 0 }
  }, [budgets])

  /* ── Open create/edit ── */
  const openCreate = () => {
    setEditingBudget(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }
  const openEdit = (b) => {
    setEditingBudget(b)
    setForm({
      label:       b.label       ?? b.name ?? '',
      amount:      b.amount      ?? b.allocated_amount ?? '',
      period:      b.period      ?? 'yearly',
      category_id: b.category_id ?? '',
      team_id:     b.team_id     ?? '',
      start_date:  b.start_date  ?? '2025-01-01',
      end_date:    b.end_date    ?? '2025-12-31',
    })
    setModalOpen(true)
  }

  /* ── Save ── */
  const handleSave = () => {
    if (!form.label || !form.amount) {
      toast.error('Champs requis', 'Veuillez renseigner le nom et le montant.')
      return
    }
    setSaving(true)
    const cat  = MOCK_CATEGORIES.find(c => c.id === Number(form.category_id)) ?? null
    const team = MOCK_TEAMS.find(t => t.id === Number(form.team_id)) ?? null
    const payload = {
      ...form,
      name:             form.label,
      allocated_amount: Number(form.amount),
      amount:           Number(form.amount),
      category:         cat ? cat.name : form.category_id ?? '',
      category_id:      form.category_id,
      team_id:          form.team_id,
    }
    if (editingBudget) {
      actions.updateBudget({ ...editingBudget, ...payload })
      toast.success('Budget modifié', `"${form.label}" a été mis à jour.`)
    } else {
      actions.addBudget(payload)
      toast.success('Budget créé', `"${form.label}" a été ajouté.`)
    }
    setSaving(false)
    setModalOpen(false)
  }

  /* ── Delete ── */
  const handleDelete = () => {
    if (!deleteTarget) return
    actions.deleteBudget(deleteTarget.id)
    toast.success('Budget supprimé', `"${deleteTarget.label}" a été retiré.`)
    setDeleteTarget(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Header ── */}
     <PageHeader
  title="Budgets"
  subtitle="Planifiez et suivez vos enveloppes budgétaires"
  icon={<BookOpen size={18} />}
  badge={filtered.length}
  actions={
    canEdit && (
      <button className="btn-primary" onClick={openCreate}>
        <Plus size={14} /> Nouveau budget
      </button>
    )
  }
/>

      {/* ── Stats ── */}
      {loading ? (
        <LoadingSkeleton type="stat" count={4} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <StatCard label="Budget total"     value={fmt(stats.total)} icon={<BookOpen size={15} />}     color="accent" />
          <StatCard label="Total dépensé"    value={fmt(stats.spent)} delta={`${stats.pct}% utilisé`} icon={<TrendingUp size={15} />}   color={stats.pct >= 90 ? 'danger' : 'warn'} />
          <StatCard label="Budgets en alerte" value={stats.alerts}    icon={<AlertTriangle size={15} />} color="warn"
            delta={stats.alerts > 0 ? `≥ 80% utilisé` : 'Sous contrôle ✓'}
            trend={stats.alerts > 0 ? 'down' : undefined}
          />
          <StatCard label="Budgets dépassés" value={stats.over}      icon={<AlertTriangle size={15} />} color={stats.over > 0 ? 'danger' : 'success'}
            delta={stats.over > 0 ? 'Action requise' : 'Aucun dépassement ✓'}
            trend={stats.over > 0 ? 'down' : undefined}
          />
        </div>
      )}

      {/* ── Global progress ── */}
      {!loading && budgets.length > 0 && (
        <div className="card-static" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>Progression globale</p>
              <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 2 }}>
                {fmt(stats.spent)} dépensé sur {fmt(stats.total)} budgétisé
              </p>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: 20,
              background: stats.pct >= 90 ? 'var(--danger-bg)' : stats.pct >= 70 ? 'var(--warn-bg)' : 'var(--success-bg)',
              color: stats.pct >= 90 ? 'var(--danger)' : stats.pct >= 70 ? 'var(--warn)' : 'var(--success)',
              fontSize: 13, fontWeight: 700,
            }}>
              {stats.pct}%
            </span>
          </div>
          <div style={{ height: 10, background: 'var(--ivory)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(stats.pct, 100)}%`,
              background: stats.pct >= 90 ? 'var(--danger)' : stats.pct >= 70 ? 'var(--warn)' : 'var(--success)',
              borderRadius: 10,
              transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>
      )}

      {/* ── Filters & Search ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un budget…" width={260} />
        <select className="input-premium" value={filterCat}  onChange={e => setFilterCat(e.target.value)}  style={{ width: 170 }}>
          <option value="">Toutes catégories</option>
          {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input-premium" value={filterTeam} onChange={e => setFilterTeam(e.target.value)} style={{ width: 150 }}>
          <option value="">Toutes équipes</option>
          {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        {(search || filterCat || filterTeam) && (
          <button className="btn-ghost" onClick={() => { setSearch(''); setFilterCat(''); setFilterTeam('') }}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* ── Budget grid ── */}
      {loading ? (
        <LoadingSkeleton type="cards" count={4} />
      ) : filtered.length === 0 ? (
        <div className="card-static">
          <EmptyState
            icon={<BookOpen size={28} />}
            title="Aucun budget trouvé"
            description="Créez votre premier budget pour commencer à suivre vos dépenses."
            action={<button className="btn-primary" onClick={openCreate}><Plus size={13} /> Créer un budget</button>}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {filtered.map(b => (
            <BudgetCard key={b.id} budget={b} onEdit={openEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBudget ? 'Modifier le budget' : 'Nouveau budget'}
        subtitle={editingBudget ? `Modification de "${editingBudget.label}"` : 'Définissez une enveloppe budgétaire'}
        onSubmit={handleSave}
        loading={saving}
        submitLabel={editingBudget ? 'Enregistrer' : 'Créer le budget'}
      >
        <FormModal.Field label="Nom du budget" required>
          <input className="input-premium" placeholder="Ex: Budget Formation 2025"
            value={form.label} onChange={e => setF('label', e.target.value)} />
        </FormModal.Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormModal.Field label="Montant (MAD)" required>
            <input className="input-premium" type="number" placeholder="0"
              value={form.amount} onChange={e => setF('amount', e.target.value)} />
          </FormModal.Field>
          <FormModal.Field label="Période">
            <select className="input-premium" value={form.period} onChange={e => setF('period', e.target.value)}>
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="yearly">Annuel</option>
            </select>
          </FormModal.Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormModal.Field label="Catégorie (optionnel)">
            <select className="input-premium" value={form.category_id} onChange={e => setF('category_id', e.target.value)}>
              <option value="">Globale (toutes catégories)</option>
              {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormModal.Field>
          <FormModal.Field label="Équipe (optionnel)">
            <select className="input-premium" value={form.team_id} onChange={e => setF('team_id', e.target.value)}>
              <option value="">Toutes les équipes</option>
              {MOCK_TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormModal.Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormModal.Field label="Date de début">
            <input className="input-premium" type="date" value={form.start_date} onChange={e => setF('start_date', e.target.value)} />
          </FormModal.Field>
          <FormModal.Field label="Date de fin">
            <input className="input-premium" type="date" value={form.end_date} onChange={e => setF('end_date', e.target.value)} />
          </FormModal.Field>
        </div>
      </FormModal>

      {/* ── Confirm Delete ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Supprimer le budget ?"
        message={`"${deleteTarget?.label}" sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        danger
      />
    </div>
  )
}
