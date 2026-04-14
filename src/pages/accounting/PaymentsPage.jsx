import { useEffect, useState } from 'react'
import { Plus, Search, Download, CreditCard, Banknote, Building2, FileText } from 'lucide-react'
import accountingService from '../../services/accountingService'
import { useToast } from '../../contexts/ToastContext'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)

const METHOD_CONFIG = {
  bank_transfer: { label: 'Virement bancaire', icon: Building2,  color: 'var(--accent)' },
  cheque:        { label: 'Chèque',            icon: FileText,   color: '#7C3AED' },
  cash:          { label: 'Espèces',           icon: Banknote,   color: 'var(--success)' },
}
const STATUS_CONFIG = {
  completed: { label: 'Encaissé',  cls: 'badge badge-paid' },
  partial:   { label: 'Partiel',   cls: 'badge badge-partial' },
  pending:   { label: 'En attente',cls: 'badge badge-pending' },
}

function PaymentFormModal({ invoices, onClose, onSave }) {
  const [invoiceId, setInvoiceId] = useState('')
  const [amount, setAmount]       = useState('')
  const [method, setMethod]       = useState('bank_transfer')
  const [date, setDate]           = useState(new Date().toISOString().split('T')[0])
  const [reference, setReference] = useState('')
  const [saving, setSaving]       = useState(false)
  const toast = useToast()

  const selectedInvoice = invoices.find(i => i.id === invoiceId)

  const handleSave = async () => {
    if (!invoiceId || !amount) { toast.warning('Champs requis', 'Facture et montant obligatoires'); return }
    setSaving(true)
    try {
      await onSave({
        invoice_id:  invoiceId,
        invoice_ref: selectedInvoice?.reference,
        customer:    selectedInvoice?.customer,
        amount:      parseFloat(amount),
        method, date, reference,
        status:      parseFloat(amount) >= (selectedInvoice?.total ?? 0) ? 'completed' : 'partial',
      })
      toast.success('Paiement enregistré', `${fmt(amount)} MAD`)
      onClose()
    } catch { toast.error('Erreur', 'Impossible d\'enregistrer') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(24,23,21,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--pearl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Enregistrer un paiement</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Facture *</label>
            <select className="input-premium" value={invoiceId} onChange={e => { setInvoiceId(e.target.value); const inv = invoices.find(i => i.id === e.target.value); if (inv) setAmount(String(inv.total)) }}>
              <option value="">— Sélectionner une facture —</option>
              {invoices.filter(i => i.status !== 'paid').map(i => (
                <option key={i.id} value={i.id}>{i.reference} – {i.customer} ({fmt(i.total)} MAD)</option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div style={{ background: 'var(--cream)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: 'var(--charcoal)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{selectedInvoice.customer}</span>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{fmt(selectedInvoice.total)} MAD</span>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Montant (MAD) *</label>
              <input type="number" min="0" step="0.01" className="input-premium" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Date de paiement</label>
              <input type="date" className="input-premium" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 8 }}>Mode de paiement *</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {Object.entries(METHOD_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon
                return (
                  <button
                    key={key}
                    onClick={() => setMethod(key)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '12px 8px', borderRadius: 10, cursor: 'pointer',
                      border: method === key ? `2px solid ${cfg.color}` : '2px solid var(--pearl)',
                      background: method === key ? cfg.color + '10' : '#fff',
                      transition: 'all .2s',
                    }}
                  >
                    <Icon size={18} color={method === key ? cfg.color : 'var(--silver)'} />
                    <span style={{ fontSize: 10.5, fontWeight: 500, color: method === key ? cfg.color : 'var(--muted)', textAlign: 'center', lineHeight: 1.3 }}>{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Référence</label>
            <input className="input-premium" placeholder="Numéro de virement, chèque…" value={reference} onChange={e => setReference(e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer le paiement'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [methodFilter, setMF]   = useState('all')
  const [showForm, setShowForm] = useState(false)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const [pay, inv] = await Promise.all([
      accountingService.getPayments(),
      accountingService.getInvoices(),
    ])
    setPayments(pay)
    setInvoices(inv)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleSave = async (data) => {
    const saved = await accountingService.createPayment(data)
    setPayments(prev => [saved, ...prev])
  }

  const filtered = payments.filter(p => {
    const matchSearch = p.invoice_ref.toLowerCase().includes(search.toLowerCase()) ||
                        p.customer.toLowerCase().includes(search.toLowerCase()) ||
                        p.reference.toLowerCase().includes(search.toLowerCase())
    const matchMethod = methodFilter === 'all' || p.method === methodFilter
    return matchSearch && matchMethod
  })

  const totals = {
    total:    payments.reduce((s, p) => s + p.amount, 0),
    transfer: payments.filter(p => p.method === 'bank_transfer').reduce((s, p) => s + p.amount, 0),
    cheque:   payments.filter(p => p.method === 'cheque').reduce((s, p) => s + p.amount, 0),
    cash:     payments.filter(p => p.method === 'cash').reduce((s, p) => s + p.amount, 0),
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>
      {showForm && <PaymentFormModal invoices={invoices} onClose={() => setShowForm(false)} onSave={handleSave} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Paiements</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Suivi des règlements clients</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary"><Download size={14} />Export</button>
          <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={14} />Nouveau paiement</button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total encaissé',     value: totals.total,    color: 'var(--accent)',  icon: CreditCard },
          { label: 'Virements',          value: totals.transfer, color: 'var(--accent)',  icon: Building2 },
          { label: 'Chèques',            value: totals.cheque,   color: '#7C3AED',        icon: FileText },
          { label: 'Espèces',            value: totals.cash,     color: 'var(--success)', icon: Banknote },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card-static" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <p style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color }}>{fmt(value)} <span style={{ fontSize: 9.5 }}>MAD</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ position: 'relative', flex: '0 0 280px' }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
          <input className="input-premium" style={{ paddingLeft: 32 }} placeholder="Référence, client, numéro…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-premium" style={{ width: 200 }} value={methodFilter} onChange={e => setMF(e.target.value)}>
          <option value="all">Tous les modes</option>
          <option value="bank_transfer">Virement bancaire</option>
          <option value="cheque">Chèque</option>
          <option value="cash">Espèces</option>
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
            <CreditCard size={36} color="var(--pearl)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Aucun paiement trouvé</p>
          </div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Facture</th>
                <th>Client</th>
                <th>Référence paiement</th>
                <th>Mode</th>
                <th style={{ textAlign: 'right' }}>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(payment => {
                const methodCfg = METHOD_CONFIG[payment.method] ?? METHOD_CONFIG.cash
                const statusCfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.completed
                const MethodIcon = methodCfg.icon
                return (
                  <tr key={payment.id}>
                    <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>
                        {payment.invoice_ref}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{payment.customer}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>
                      {payment.reference || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: methodCfg.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MethodIcon size={12} color={methodCfg.color} />
                        </div>
                        <span style={{ fontSize: 12.5, color: 'var(--charcoal)' }}>{methodCfg.label}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: 'var(--charcoal)' }}>
                      {fmt(payment.amount)} <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--muted)' }}>MAD</span>
                    </td>
                    <td>
                      <span className={statusCfg.cls}><span className="badge-dot" />{statusCfg.label}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid var(--warm-border)', background: 'var(--cream)' }}>
                <td colSpan={5} style={{ padding: '10px 16px', fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  Total
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>
                  {fmt(filtered.reduce((s, p) => s + p.amount, 0))} MAD
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}
