import { useEffect, useState } from 'react'
import { Plus, Trash2, Eye, Search, Download, Printer, FileText, X, Send } from 'lucide-react'
import accountingService from '../../services/accountingService'
import { useToast } from '../../contexts/ToastContext'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)
const STATUS_CONFIG = {
  draft:   { label: 'Brouillon', cls: 'badge badge-draft'   },
  sent:    { label: 'Envoyée',   cls: 'badge badge-sent'    },
  paid:    { label: 'Payée',     cls: 'badge badge-paid'    },
  overdue: { label: 'En retard', cls: 'badge badge-overdue' },
}

const EMPTY_ITEM = { product: '', quantity: 1, price: 0, tax_rate: 20 }
const CUSTOMERS  = ['SARL Atlas', 'SAS Horizon', 'Tech Solutions', 'Global Trade SARL', 'Innov Corp', 'SARL Maghreb']
const TAX_RATES  = [0, 7, 10, 20]

// ─── Invoice Form Modal ───────────────────────────────────────────────────────
function InvoiceFormModal({ onClose, onSave }) {
  const [customer, setCustomer] = useState('')
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate]   = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]
  })
  const [items, setItems]       = useState([{ ...EMPTY_ITEM }])
  const [saving, setSaving]     = useState(false)
  const toast = useToast()

  const updateItem = (i, field, val) => {
    const next = [...items]
    next[i] = { ...next[i], [field]: field === 'product' ? val : parseFloat(val) || 0 }
    setItems(next)
  }

  const subtotal   = items.reduce((s, it) => s + it.quantity * it.price, 0)
  const tax_amount = items.reduce((s, it) => s + it.quantity * it.price * (it.tax_rate / 100), 0)
  const total      = subtotal + tax_amount

  const handleSave = async (status = 'draft') => {
    if (!customer) { toast.warning('Client requis', 'Veuillez sélectionner un client'); return }
    if (items.some(it => !it.product)) { toast.warning('Produits incomplets', 'Renseignez tous les produits'); return }
    setSaving(true)
    try {
      await onSave({ customer, date, due_date: dueDate, items, subtotal, tax_amount, total, status })
      toast.success('Facture créée', `${customer} — ${fmt(total)} MAD`)
      onClose()
    } catch { toast.error('Erreur', 'Impossible de créer la facture') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(24,23,21,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 820, maxHeight: '92vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--pearl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Nouvelle Facture</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Facturation client</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}>×</button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Client + Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Client *</label>
              <select className="input-premium" value={customer} onChange={e => setCustomer(e.target.value)}>
                <option value="">— Sélectionner —</option>
                {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Date facture</label>
              <input type="date" className="input-premium" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Échéance</label>
              <input type="date" className="input-premium" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Line Items */}
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Lignes de facture</p>
          <div style={{ border: '1px solid var(--pearl)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  {['Désignation', 'Qté', 'Prix HT', 'TVA %', 'Montant HT', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 600, color: 'var(--silver)', textAlign: h.includes('Montant') || h.includes('Prix') ? 'right' : 'left', letterSpacing: '.07em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--ivory)' }}>
                    <td style={{ padding: '8px 10px' }}>
                      <input className="input-premium" style={{ height: 34 }} placeholder="Désignation…" value={item.product} onChange={e => updateItem(i, 'product', e.target.value)} />
                    </td>
                    <td style={{ padding: '8px 10px', width: 70 }}>
                      <input type="number" min="1" className="input-premium" style={{ height: 34, textAlign: 'center' }} value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
                    </td>
                    <td style={{ padding: '8px 10px', width: 120 }}>
                      <input type="number" min="0" step="0.01" className="input-premium" style={{ height: 34, textAlign: 'right' }} value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} />
                    </td>
                    <td style={{ padding: '8px 10px', width: 90 }}>
                      <select className="input-premium" style={{ height: 34 }} value={item.tax_rate} onChange={e => updateItem(i, 'tax_rate', e.target.value)}>
                        {TAX_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 500, color: 'var(--charcoal)', width: 120 }}>
                      {fmt(item.quantity * item.price)}
                    </td>
                    <td style={{ padding: '8px 8px', width: 36 }}>
                      {items.length > 1 && (
                        <button onClick={() => setItems(it => it.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 3 }}>
                          <X size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--pearl)', background: 'var(--cream)' }}>
              <button onClick={() => setItems(it => [...it, { ...EMPTY_ITEM }])} className="btn-ghost" style={{ height: 30 }}>
                <Plus size={13} />Ajouter une ligne
              </button>
            </div>
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <div style={{ minWidth: 300 }}>
              {[
                { label: 'Sous-total HT', value: subtotal },
                { label: 'TVA',            value: tax_amount },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--ivory)' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)' }}>{fmt(value)} MAD</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Total TTC</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{fmt(total)} MAD</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-secondary" onClick={() => handleSave('draft')} disabled={saving}>
              Enregistrer brouillon
            </button>
            <button className="btn-primary" onClick={() => handleSave('sent')} disabled={saving}>
              <Send size={14} />{saving ? 'Envoi…' : 'Valider & Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Invoice Preview Modal ────────────────────────────────────────────────────
function InvoicePreviewModal({ invoice, onClose, onStatusChange }) {
  const cfg = STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.draft
  const toast = useToast()

  const handleStatus = async (status) => {
    await accountingService.updateInvoiceStatus(invoice.id, status)
    onStatusChange(invoice.id, status)
    toast.success('Statut mis à jour', `Facture ${invoice.reference} → ${STATUS_CONFIG[status]?.label}`)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(24,23,21,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>

        {/* Modal header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--pearl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{invoice.reference}</span>
            <span className={cfg.cls}><span className="badge-dot" />{cfg.label}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" style={{ height: 32, padding: '0 12px', fontSize: 12 }}><Printer size={13} />Imprimer</button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}>×</button>
          </div>
        </div>

        {/* Invoice content */}
        <div style={{ padding: '24px' }}>
          {/* Invoice header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), #1E3A5C)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="6.5" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.95"/>
                  <rect x="10.75" y="9" width="2.5" height="9" rx="1.25" fill="white" fillOpacity="0.95"/>
                  <path d="M8 18h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45"/>
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Taadbiir SARL</p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>123 Rue Mohammed V, Casablanca</p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>ICE: 001234567890123</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>FACTURE</p>
              <p style={{ fontSize: 14, fontFamily: 'monospace', color: 'var(--accent)' }}>{invoice.reference}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Date : {new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>Échéance : {new Date(invoice.due_date).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Client */}
          <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Facturé à</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{invoice.customer}</p>
          </div>

          {/* Items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
            <thead>
              <tr style={{ background: 'var(--accent)', borderRadius: 8 }}>
                {['Désignation', 'Qté', 'PU HT', 'TVA', 'Total HT'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 600, color: '#fff', textAlign: ['PU HT','Total HT'].includes(h) ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--ivory)' }}>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>{item.product}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'right' }}>{fmt(item.price)}</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center' }}>{item.tax_rate}%</td>
                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{fmt(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <div style={{ minWidth: 260 }}>
              {[
                { label: 'Sous-total HT', value: invoice.subtotal },
                { label: 'TVA',            value: invoice.tax_amount },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--ivory)' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{label}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--charcoal)' }}>{fmt(value)} MAD</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>TOTAL TTC</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>{fmt(invoice.total)} MAD</span>
              </div>
            </div>
          </div>

          {/* Status actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid var(--pearl)', paddingTop: 16 }}>
            {invoice.status === 'draft'   && <button className="btn-primary"  onClick={() => handleStatus('sent')}><Send size={14} />Envoyer</button>}
            {invoice.status === 'sent'    && <button className="btn-primary"  onClick={() => handleStatus('paid')} style={{ background: 'var(--success)' }}>Marquer payée</button>}
            {invoice.status === 'overdue' && <button className="btn-primary"  onClick={() => handleStatus('paid')} style={{ background: 'var(--success)' }}>Marquer payée</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [showForm, setShowForm]  = useState(false)
  const [preview, setPreview]    = useState(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const data = await accountingService.getInvoices()
    setInvoices(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleSave = async (inv) => {
    const saved = await accountingService.createInvoice(inv)
    setInvoices(prev => [saved, ...prev])
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette facture ?')) return
    await accountingService.deleteInvoice(id)
    setInvoices(prev => prev.filter(i => i.id !== id))
    toast.success('Facture supprimée')
  }

  const handleStatusChange = (id, status) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    if (preview?.id === id) setPreview(p => ({ ...p, status }))
  }

  const filtered = invoices.filter(i => {
    const matchSearch = i.reference.toLowerCase().includes(search.toLowerCase()) || i.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    return matchSearch && matchStatus
  })

  const totals = {
    total:   invoices.reduce((s, i) => s + i.total, 0),
    paid:    invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0),
    pending: invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0),
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>
      {showForm && <InvoiceFormModal onClose={() => setShowForm(false)} onSave={handleSave} />}
      {preview  && <InvoicePreviewModal invoice={preview} onClose={() => setPreview(null)} onStatusChange={handleStatusChange} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Factures</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Gestion de la facturation clients</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary"><Download size={14} />Export</button>
          <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={14} />Nouvelle facture</button>
        </div>
      </div>

      {/* KPI strips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total facturé',    value: totals.total,   color: 'var(--accent)' },
          { label: 'Encaissé',         value: totals.paid,    color: 'var(--success)' },
          { label: 'En attente',       value: totals.pending, color: '#7C3AED' },
          { label: 'En retard',        value: totals.overdue, color: 'var(--danger)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card-static" style={{ padding: '12px 16px' }}>
            <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{label}</p>
            <p style={{ fontSize: 16, fontWeight: 700, color }}>{fmt(value)} <span style={{ fontSize: 10 }}>MAD</span></p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ position: 'relative', flex: '0 0 280px' }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
          <input className="input-premium" style={{ paddingLeft: 32 }} placeholder="Référence, client…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-premium" style={{ width: 160 }} value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="all">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="sent">Envoyée</option>
          <option value="paid">Payée</option>
          <option value="overdue">En retard</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-static" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ width: 20, height: 20, border: '2px solid var(--pearl)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            Chargement…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <FileText size={36} color="var(--pearl)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Aucune facture trouvée</p>
          </div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Client</th>
                <th>Date</th>
                <th>Échéance</th>
                <th style={{ textAlign: 'right' }}>Montant HT</th>
                <th style={{ textAlign: 'right' }}>TVA</th>
                <th style={{ textAlign: 'right' }}>Total TTC</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const cfg = STATUS_CONFIG[inv.status] ?? STATUS_CONFIG.draft
                return (
                  <tr key={inv.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>
                        {inv.reference}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{inv.customer}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>{new Date(inv.date).toLocaleDateString('fr-FR')}</td>
                    <td style={{ fontSize: 12.5, color: inv.status === 'overdue' ? 'var(--danger)' : 'var(--muted)' }}>
                      {new Date(inv.due_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ textAlign: 'right', fontSize: 12.5 }}>{fmt(inv.subtotal)}</td>
                    <td style={{ textAlign: 'right', fontSize: 12.5, color: 'var(--muted)' }}>{fmt(inv.tax_amount)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--charcoal)' }}>{fmt(inv.total)}</td>
                    <td><span className={cfg.cls}><span className="badge-dot" />{cfg.label}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => setPreview(inv)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px 6px', borderRadius: 6, transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                        ><Eye size={13} /></button>
                        <button onClick={() => handleDelete(inv.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px 6px', borderRadius: 6, transition: 'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                        ><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 12 }}>
        {filtered.length} facture{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
