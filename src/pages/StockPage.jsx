import { useState, useMemo } from 'react'
import { useToast } from '../contexts/ToastContext'
import { useGlobalStore } from '../store/GlobalStore'
import { MOCK_STOCK_MOVEMENTS, MOCK_PURCHASE_ORDERS, MOCK_SUPPLIERS, calcTotals } from '../lib/mockData'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import PageHeader  from '../components/ui/PageHeader'
import StatCard    from '../components/ui/StatCard'
import SearchInput from '../components/ui/SearchInput'
import ActionMenu  from '../components/ui/ActionMenu'
import EmptyState  from '../components/ui/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { Plus, AlertTriangle, Package, TrendingUp, TrendingDown, Eye, Pencil, ShoppingCart, Trash2, ArrowUpCircle, ArrowDownCircle, DollarSign } from 'lucide-react'
import { fmt, fmtDate } from '../lib/helpers'

const PO_STATUS = {
  draft:    { label: 'Brouillon',  cls: 'bg-gray-100 text-gray-500' },
  sent:     { label: 'Envoyé',     cls: 'bg-blue-50 text-blue-700' },
  pending:  { label: 'En attente', cls: 'bg-amber-50 text-amber-700' },
  received: { label: 'Reçu',       cls: 'bg-emerald-50 text-emerald-700' },
}

export default function StockPage() {
  const toast = useToast()
  const { state, selectors, actions } = useGlobalStore()
  const products = selectors.computedProducts
  const [tab, setTab] = useState('stock')
  const [movements]               = useState(MOCK_STOCK_MOVEMENTS)
  const [orders, setOrders]       = useState(MOCK_PURCHASE_ORDERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [mvtModal, setMvtModal]   = useState(false)
  const [editing, setEditing]     = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [form, setForm] = useState({
    ref: '', name: '', category: '', buy_price: '', sell_price: '', tva: 20, unit: 'pièce', stock: 0, min_stock: 5
  })
  const [mvtForm, setMvtForm] = useState({ type: 'in', qty: '', reason: '' })
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setM = (k, v) => setMvtForm(f => ({ ...f, [k]: v }))

  const alertCount = products.filter(p => p.stock !== null && p.stock <= p.min_stock).length
  const totalValue = products.filter(p => p.stock !== null).reduce((s, p) => s + (p.stock * p.buy_price), 0)

  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setModalOpen(true) }
  const openCreate = () => { setEditing(null); setForm({ ref: '', name: '', category: '', buy_price: '', sell_price: '', tva: 20, unit: 'pièce', stock: 0, min_stock: 5 }); setModalOpen(true) }

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Erreur', 'Nom du produit requis.')
    const payload = { ...form, buy_price: +form.buy_price, sell_price: +form.sell_price, stock: +form.stock, min_stock: +form.min_stock }
    if (editing) {
      actions.updateProduct({ ...editing, ...payload })
      toast.success('Produit modifié', `"${form.name}" mis à jour.`)
    } else {
      actions.addProduct(payload)
      toast.success('Produit créé', `"${form.name}" ajouté au catalogue.`)
    }
    setModalOpen(false)
  }

  const handleMvt = () => {
    if (!mvtForm.qty || +mvtForm.qty <= 0) return toast.error('Erreur', 'Quantité invalide.')
    const qty = +mvtForm.qty
    const delta = mvtForm.type === 'in' ? qty : -qty
    actions.adjustStock(selectedProduct.id, delta)
    toast.success(mvtForm.type === 'in' ? 'Entrée enregistrée' : 'Sortie enregistrée',
      `${qty} ${selectedProduct.unit} ${mvtForm.type === 'in' ? 'ajoutés' : 'retirés'}.`)
    setMvtModal(false)
    setMvtForm({ type: 'in', qty: '', reason: '' })
  }

  const receiveOrder = (id) => {
    const order = orders.find(o => o.id === id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'received' } : o))
    order.items.forEach(item => {
      if (item.product_id) {
        actions.adjustStock(item.product_id, item.qty)
      }
    })
    toast.success('Commande reçue', `${order.ref} — stock mis à jour automatiquement.`)
  }

  const [search, setSearch] = useState('')

  const filteredProducts = useMemo(() =>
    search
      ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.ref?.toLowerCase().includes(search.toLowerCase()))
      : products
  , [products, search])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <PageHeader
        title="Stock & Inventaire"
        subtitle="Gérez votre catalogue produits et les mouvements de stock"
        icon={<Package size={18} />}
        badge={products.length}
        actions={
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={14} /> Nouveau produit
          </button>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Références"       value={products.length}            icon={<Package size={15} />}     color="accent" />
        <StatCard label="Valeur du stock"   value={fmt(totalValue)}            icon={<DollarSign size={15} />}  color="success" />
        <StatCard label="Alertes seuil"     value={alertCount}                 icon={<AlertTriangle size={15} />} color={alertCount > 0 ? 'warn' : 'accent'}
          delta={alertCount > 0 ? 'Réapprovisionnement requis' : 'Niveaux corrects ✓'}
          trend={alertCount > 0 ? 'down' : undefined}
        />
        <StatCard label="Commandes en cours" value={orders.filter(o => o.status !== 'received').length} icon={<ShoppingCart size={15} />} color="accent" />
      </div>

      {/* Low stock alert banner */}
      {alertCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', background: 'var(--warn-bg)',
          border: '1px solid var(--warn-mid)', borderRadius: 12,
        }}>
          <AlertTriangle size={15} style={{ color: 'var(--warn)', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--warn)', fontSize: 13 }}>
              {alertCount} produit{alertCount > 1 ? 's' : ''} sous le seuil de réapprovisionnement
            </span>
            <p style={{ fontSize: 11.5, color: 'var(--warn)', marginTop: 1, opacity: 0.8 }}>
              Vérifiez le catalogue ci-dessous et créez des commandes fournisseurs.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card-static" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--ivory)', padding: '0 16px' }}>
          <div style={{ display: 'flex' }}>
            {[
              { key: 'stock',     label: 'Catalogue & Stock' },
              { key: 'movements', label: 'Mouvements' },
              { key: 'orders',    label: 'Commandes fournisseurs' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding: '12px 16px', fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                color: tab === t.key ? 'var(--accent)' : 'var(--silver)',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${tab === t.key ? 'var(--accent)' : 'transparent'}`,
                transition: 'all 0.15s', whiteSpace: 'nowrap', marginBottom: -1,
              }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stock tab */}
      {tab === 'stock' && (
        <div style={{ padding: '12px 16px 16px' }}>
          <div style={{ marginBottom: 14 }}>
            <SearchInput value={search} onChange={setSearch} placeholder="Rechercher produit, référence…" width={280} />
          </div>
          {filteredProducts.length === 0 ? (
            <EmptyState icon={<Package size={28} />} title="Aucun produit trouvé" />
          ) : (
            <table className="premium-table">
              <thead>
                <tr>
                  {['Référence','Désignation','Catégorie','P.A. HT','P.V. HT','Stock','Seuil',''].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const isAlert = p.stock !== null && p.stock <= p.min_stock
                  return (
                    <tr key={p.id} style={{ background: isAlert ? 'var(--warn-bg)' : undefined }}>
                      <td style={{ fontFamily: 'monospace', fontSize: 11.5, color: 'var(--silver)' }}>{p.ref}</td>
                      <td style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{p.name}</td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--ivory)', color: 'var(--slate)', fontSize: 11.5, fontWeight: 500 }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--slate)' }}>{fmt(p.buy_price)}</td>
                      <td style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--slate)' }}>{fmt(p.sell_price)}</td>
                      <td>
                        {p.stock !== null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            {isAlert && <AlertTriangle size={12} style={{ color: 'var(--warn)', flexShrink: 0 }} />}
                            <span style={{ fontWeight: 700, color: isAlert ? 'var(--warn)' : 'var(--charcoal)', fontVariantNumeric: 'tabular-nums' }}>
                              {p.stock} {p.unit}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11.5, color: 'var(--silver)', fontStyle: 'italic' }}>Service</span>
                        )}
                      </td>
                      <td style={{ color: 'var(--silver)', fontSize: 12.5 }}>{p.min_stock ?? '—'}</td>
                      <td>
                        <ActionMenu items={[
                          ...(p.stock !== null ? [{ label: 'Mouvement stock', icon: <Package size={12} />, onClick: () => { setSelectedProduct(p); setMvtModal(true) } }] : []),
                          { label: 'Modifier', icon: <Pencil size={12} />, onClick: () => openEdit(p) },
                        ]} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Mouvements tab */}
      {tab === 'movements' && (
        <div style={{ padding: '12px 16px 16px' }}>
          <table className="premium-table">
            <thead>
              <tr>
                {['Produit','Type','Quantité','Date','Motif','Utilisateur'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {movements.map(m => {
                const p = products.find(x => x.id === m.product_id)
                return (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{p?.name ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {m.type === 'in'
                          ? <ArrowUpCircle size={14} style={{ color: 'var(--success)' }} />
                          : <ArrowDownCircle size={14} style={{ color: 'var(--danger)' }} />}
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: m.type === 'in' ? 'var(--success)' : 'var(--danger)' }}>
                          {m.type === 'in' ? 'Entrée' : 'Sortie'}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: m.type === 'in' ? 'var(--success)' : 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>
                      {m.type === 'in' ? '+' : '-'}{m.qty} {p?.unit}
                    </td>
                    <td style={{ color: 'var(--silver)' }}>{fmtDate(m.date)}</td>
                    <td style={{ color: 'var(--slate)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.reason}</td>
                    <td style={{ color: 'var(--silver)', fontSize: 12 }}>{m.user}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Commandes tab */}
      {tab === 'orders' && (
        <div style={{ padding: '12px 16px 16px' }}>
          <table className="premium-table">
            <thead>
              <tr>
                {['Référence','Fournisseur','Date','Livraison prévue','Montant TTC','Statut',''].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const s  = MOCK_SUPPLIERS.find(x => x.id === o.supplier_id)
                const t  = calcTotals(o.items)
                return (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>{o.ref}</td>
                    <td style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{s?.name}</td>
                    <td style={{ color: 'var(--silver)' }}>{fmtDate(o.date)}</td>
                    <td style={{ color: 'var(--silver)' }}>{fmtDate(o.expected_date)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{fmt(t.ttc)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>
                      {o.status !== 'received' && (
                        <button onClick={() => receiveOrder(o.id)}
                          className="btn-ghost" style={{ height: 28, fontSize: 12, padding: '0 10px', color: 'var(--success)' }}>
                          ✓ Réceptionner
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      </div>{/* end card-static tabs wrapper */}

      {/* Modal produit — using FormModal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Modifier le produit' : 'Nouveau produit'} size="md">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Référence', key: 'ref', placeholder: 'INF-001' },
            { label: 'Catégorie', key: 'category', placeholder: 'Informatique' },
          ].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>{f.label}</label>
              <input className="input-premium" placeholder={f.placeholder} value={form[f.key]} onChange={e => setF(f.key, e.target.value)} />
            </div>
          ))}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>Désignation <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input className="input-premium" value={form.name} onChange={e => setF('name', e.target.value)} autoFocus />
          </div>
          {[
            { label: 'Prix achat HT (MAD)', key: 'buy_price', type: 'number' },
            { label: 'Prix vente HT (MAD)', key: 'sell_price', type: 'number' },
            { label: 'Stock actuel', key: 'stock', type: 'number' },
            { label: 'Seuil minimum', key: 'min_stock', type: 'number' },
          ].map(f => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>{f.label}</label>
              <input className="input-premium" type="number" value={form[f.key]} onChange={e => setF(f.key, e.target.value)} />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>TVA (%)</label>
            <select className="input-premium" value={form.tva} onChange={e => setF('tva', +e.target.value)}>
              {[0,7,10,14,20].map(t => <option key={t} value={t}>{t}%</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>Unité</label>
            <select className="input-premium" value={form.unit} onChange={e => setF('unit', e.target.value)}>
              {['pièce','kg','litre','mètre','boîte','heure','jour','licence'].map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={() => setModalOpen(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
            <button onClick={handleSave} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {editing ? 'Enregistrer' : 'Créer le produit'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal mouvement */}
      <Modal open={mvtModal} onClose={() => setMvtModal(false)}
        title={`Mouvement de stock — ${selectedProduct?.name}`} size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { type: 'in',  label: '+ Entrée stock', color: 'var(--success)', bg: 'var(--success-bg)' },
              { type: 'out', label: '- Sortie stock',  color: 'var(--danger)',  bg: 'var(--danger-bg)'  },
            ].map(opt => (
              <button key={opt.type} type="button" onClick={() => setM('type', opt.type)} style={{
                padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                border: `2px solid ${mvtForm.type === opt.type ? opt.color : 'var(--pearl)'}`,
                background: mvtForm.type === opt.type ? opt.bg : '#fff',
                color: mvtForm.type === opt.type ? opt.color : 'var(--silver)',
                fontWeight: mvtForm.type === opt.type ? 600 : 400,
                fontSize: 13, transition: 'all 0.15s',
              }}>
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>
              Quantité ({selectedProduct?.unit})
            </label>
            <input className="input-premium" type="number" value={mvtForm.qty}
              onChange={e => setM('qty', e.target.value)} autoFocus />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>Motif</label>
            <input className="input-premium" value={mvtForm.reason}
              onChange={e => setM('reason', e.target.value)}
              placeholder="Ex : Livraison client FAC-2025-004" />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setMvtModal(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Annuler</button>
            <button onClick={handleMvt} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Enregistrer</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
