import { useState, useMemo } from 'react'
import { useToast } from '../contexts/ToastContext'
import { useGlobalStore } from '../store/GlobalStore'
import { MOCK_PURCHASE_ORDERS, calcTotals } from '../lib/mockData'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import PageHeader   from '../components/ui/PageHeader'
import StatCard     from '../components/ui/StatCard'
import SearchInput  from '../components/ui/SearchInput'
import ActionMenu   from '../components/ui/ActionMenu'
import EmptyState   from '../components/ui/EmptyState'
import FormModal    from '../components/ui/FormModal'
import StatusBadge  from '../components/StatusBadge'
import { Plus, Pencil, Trash2, Eye, Star, Truck, Wallet, Package, AlertTriangle } from 'lucide-react'
import { fmt } from '../lib/helpers'

const CATEGORIES = ['informatique','fournitures','voyages','materiel','services','autre']

const CATEGORY_COLORS = {
  informatique: '#3b82f6', fournitures: '#8b5cf6', voyages: '#f59e0b',
  materiel: '#10b981', services: '#6366f1', autre: '#9ca3af',
}

const EMPTY = {
  name: '', category: 'informatique', ice: '', if_num: '', rc: '', rib: '',
  email: '', phone: '', address: '', payment_terms: 30, rating: 3, status: 'active',
}

function Stars({ rating, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange?.(s)}
          style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: 1 }}>
          <Star size={13} style={{
            color: s <= rating ? '#f59e0b' : 'var(--pearl)',
            fill:  s <= rating ? '#f59e0b' : 'var(--pearl)',
          }} />
        </button>
      ))}
    </div>
  )
}

export default function SuppliersPage() {
  const { toast } = useToast()
  const { state, actions } = useGlobalStore()
  const suppliers = state.suppliers
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailId, setDetailId]   = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModalOpen(true) }
  const openEdit   = (s)  => { setEditing(s); setForm({ ...s }); setModalOpen(true) }

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Erreur', 'Nom du fournisseur requis.')
      return
    }
    setSaving(true)
    if (editing) {
      actions.updateSupplier({ ...editing, ...form })
      toast.success('Fournisseur modifié', `"${form.name}" a été mis à jour.`)
    } else {
      actions.addSupplier({ ...form, balance: 0 })
      toast.success('Fournisseur créé', `"${form.name}" a été ajouté.`)
    }
    setSaving(false)
    setModalOpen(false)
  }

  const handleDelete = () => {
    const s = suppliers.find(x => x.id === deleteId)
    actions.deleteSupplier(deleteId)
    setDeleteId(null)
    toast.success('Supprimé', `"${s?.name}" a été supprimé.`)
  }

  const detail    = suppliers.find(s => s.id === detailId)
  const detailPOs = MOCK_PURCHASE_ORDERS.filter(p => p.supplier_id === detailId)

  const filtered = useMemo(() => suppliers.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (catFilter    && s.category !== catFilter)          return false
    if (statusFilter && (s.status ?? 'active') !== statusFilter) return false
    return true
  }), [suppliers, search, catFilter, statusFilter])

  const totalPending = MOCK_PURCHASE_ORDERS.filter(p => p.status !== 'received').reduce((s, p) => s + calcTotals(p.items).ttc, 0)
  const totalBalance = suppliers.reduce((s, f) => s + (f.balance || 0), 0)
  const activeCount  = suppliers.filter(s => (s.status ?? 'active') === 'active').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <PageHeader
        title="Fournisseurs"
        subtitle="Gérez vos fournisseurs et commandes d'achat"
        icon={<Truck size={18} />}
        badge={suppliers.length}
        actions={
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={14} /> Nouveau fournisseur
          </button>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Total fournisseurs" value={suppliers.length}  icon={<Truck size={15} />}     color="accent" />
        <StatCard label="Actifs"             value={activeCount}       icon={<Package size={15} />}   color="success" />
        <StatCard label="Achats en cours"    value={fmt(totalPending)} icon={<AlertTriangle size={15} />} color="warn"
          delta={`${MOCK_PURCHASE_ORDERS.filter(p => p.status !== 'received').length} commande(s)`} />
        <StatCard label="Total dû"           value={fmt(totalBalance)} icon={<Wallet size={15} />}    color={totalBalance > 0 ? 'danger' : 'accent'}
          delta={totalBalance > 0 ? 'À régler' : 'Aucun encours ✓'} />
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un fournisseur…" width={280} />
        <select className="input-premium" value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ width: 170 }}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
        </select>
        <select className="input-premium" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 150 }}>
          <option value="">Tous statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
        {(search || catFilter || statusFilter) && (
          <button className="btn-ghost" onClick={() => { setSearch(''); setCatFilter(''); setStatusFilter('') }}>
            Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card-static" style={{ overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Truck size={28} />}
            title="Aucun fournisseur trouvé"
            description="Ajoutez votre premier fournisseur pour commencer."
            action={<button className="btn-primary" onClick={openCreate}><Plus size={13} /> Ajouter</button>}
          />
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                {['Fournisseur', 'Catégorie', 'Contact', 'Note', 'Statut', 'Dû', ''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: `${CATEGORY_COLORS[s.category] ?? '#6b7280'}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Truck size={14} style={{ color: CATEGORY_COLORS[s.category] ?? 'var(--silver)' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--charcoal)', fontSize: 13 }}>{s.name}</p>
                        {s.ice && <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 1 }}>ICE : {s.ice}</p>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 500,
                      background: `${CATEGORY_COLORS[s.category] ?? '#6b7280'}18`,
                      color: CATEGORY_COLORS[s.category] ?? 'var(--silver)',
                      textTransform: 'capitalize',
                    }}>
                      {s.category}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontSize: 12.5, color: 'var(--charcoal)' }}>{s.email}</p>
                    <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 1 }}>{s.phone}</p>
                  </td>
                  <td><Stars rating={s.rating} /></td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 500,
                      background: (s.status ?? 'active') === 'active' ? 'var(--success-bg)' : 'var(--ivory)',
                      color:      (s.status ?? 'active') === 'active' ? 'var(--success)'    : 'var(--silver)',
                    }}>
                      {(s.status ?? 'active') === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: (s.balance ?? 0) > 0 ? 'var(--warn)' : 'var(--silver)', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(s.balance ?? 0)}
                  </td>
                  <td>
                    <ActionMenu items={[
                      { label: 'Voir détail', icon: <Eye size={12} />,    onClick: () => setDetailId(s.id) },
                      { label: 'Modifier',    icon: <Pencil size={12} />, onClick: () => openEdit(s) },
                      'divider',
                      { label: 'Supprimer',   icon: <Trash2 size={12} />, onClick: () => setDeleteId(s.id), danger: true },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
        onSubmit={handleSave}
        loading={saving}
        submitLabel={editing ? 'Enregistrer' : 'Créer le fournisseur'}
      >
        <FormModal.Field label="Raison sociale" required>
          <input className="input-premium" placeholder="Fournisseur SARL"
            value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
        </FormModal.Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormModal.Field label="Catégorie">
            <select className="input-premium" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
            </select>
          </FormModal.Field>
          <FormModal.Field label="Délai paiement">
            <select className="input-premium" value={form.payment_terms} onChange={e => set('payment_terms', +e.target.value)}>
              {[0,15,30,45,60,90].map(t => <option key={t} value={t}>{t === 0 ? 'Comptant' : `${t} jours`}</option>)}
            </select>
          </FormModal.Field>
          <FormModal.Field label="Email">
            <input className="input-premium" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </FormModal.Field>
          <FormModal.Field label="Téléphone">
            <input className="input-premium" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </FormModal.Field>
          <FormModal.Field label="ICE">
            <input className="input-premium" value={form.ice} onChange={e => set('ice', e.target.value)} />
          </FormModal.Field>
          <FormModal.Field label="Statut">
            <select className="input-premium" value={form.status ?? 'active'} onChange={e => set('status', e.target.value)}>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </FormModal.Field>
        </div>
        <FormModal.Field label="RIB bancaire">
          <input className="input-premium" placeholder="MA64 0001 0001 0000 0000 0001 23"
            value={form.rib} onChange={e => set('rib', e.target.value)} />
        </FormModal.Field>
        <FormModal.Field label="Note de performance">
          <Stars rating={form.rating} onChange={r => set('rating', r)} />
        </FormModal.Field>
      </FormModal>

      {/* Detail Modal */}
      <Modal open={!!detailId} onClose={() => setDetailId(null)} title={detail?.name ?? ''} size="md">
        {detail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Catégorie', value: detail.category },
                { label: 'Délai paiement', value: `${detail.payment_terms} jours` },
                { label: 'Email', value: detail.email },
                { label: 'Téléphone', value: detail.phone },
              ].map(item => (
                <div key={item.label} style={{ padding: '10px 14px', background: 'var(--ivory)', borderRadius: 10 }}>
                  <p style={{ fontSize: 10.5, color: 'var(--silver)', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)', textTransform: item.label === 'Catégorie' ? 'capitalize' : 'none' }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--silver)' }}>Note :</span>
              <Stars rating={detail.rating} />
            </div>
            {detail.rib && (
              <div style={{ padding: '10px 14px', background: 'var(--accent-light)', borderRadius: 10 }}>
                <p style={{ fontSize: 10.5, color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>RIB Bancaire</p>
                <p style={{ fontSize: 12.5, fontFamily: 'monospace', color: 'var(--charcoal)' }}>{detail.rib}</p>
              </div>
            )}
            {detailPOs.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                  Dernières commandes
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {detailPOs.map(po => {
                    const t = calcTotals(po.items)
                    return (
                      <div key={po.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--ivory)', borderRadius: 10 }}>
                        <span style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--charcoal)' }}>{po.ref}</span>
                        <span style={{ fontSize: 12, color: 'var(--silver)' }}>{po.date}</span>
                        <span style={{ fontWeight: 600, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{fmt(t.ttc)}</span>
                        <StatusBadge status={po.status} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le fournisseur"
        message="Ce fournisseur sera supprimé. Ses commandes resteront dans le système."
        confirmLabel="Supprimer"
        danger
      />
    </div>
  )
}
