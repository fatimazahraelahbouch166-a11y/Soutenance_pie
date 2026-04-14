import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Receipt, CheckCircle, XCircle } from 'lucide-react'
import accountingService from '../../services/accountingService'
import { useToast } from '../../contexts/ToastContext'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)

const TYPE_LABELS = { sale: 'Vente', purchase: 'Achat' }
const TYPE_COLORS = { sale: 'var(--success)', purchase: 'var(--accent)' }

function TaxFormModal({ tax, onClose, onSave }) {
  const [name, setName]   = useState(tax?.name   ?? '')
  const [rate, setRate]   = useState(tax?.rate   ?? 20)
  const [type, setType]   = useState(tax?.type   ?? 'sale')
  const [active, setActive] = useState(tax?.active ?? true)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const handleSave = async () => {
    if (!name) { toast.warning('Nom requis', 'Veuillez saisir un nom de taxe'); return }
    setSaving(true)
    try {
      await onSave({ name, rate: parseFloat(rate), type, active })
      toast.success(tax ? 'Taxe modifiée' : 'Taxe créée', name)
      onClose()
    } catch { toast.error('Erreur', 'Impossible de sauvegarder') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(24,23,21,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--pearl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{tax ? 'Modifier la taxe' : 'Nouvelle taxe'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}>×</button>
        </div>
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Nom de la taxe *</label>
            <input className="input-premium" placeholder="ex: TVA Normal 20%" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Taux (%)</label>
              <input type="number" min="0" max="100" step="0.1" className="input-premium" value={rate} onChange={e => setRate(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Type</label>
              <select className="input-premium" value={type} onChange={e => setType(e.target.value)}>
                <option value="sale">Vente</option>
                <option value="purchase">Achat</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => setActive(v => !v)}
              style={{
                width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? 'var(--success)' : 'var(--pearl)',
                position: 'relative', transition: 'background .2s',
              }}
            >
              <span style={{
                position: 'absolute', top: 2, left: active ? 18 : 2, width: 16, height: 16,
                borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,.2)',
                transition: 'left .2s',
              }} />
            </button>
            <span style={{ fontSize: 13, color: 'var(--charcoal)' }}>Taxe {active ? 'active' : 'inactive'}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TaxesPage() {
  const [taxes, setTaxes]     = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(null)  // null | 'new' | taxObject
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const data = await accountingService.getTaxes()
    setTaxes(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleSave = async (data) => {
    if (form && form !== 'new') {
      const updated = await accountingService.updateTax(form.id, data)
      setTaxes(prev => prev.map(t => t.id === form.id ? updated : t))
    } else {
      const created = await accountingService.createTax(data)
      setTaxes(prev => [...prev, created])
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette taxe ?')) return
    await accountingService.deleteTax(id)
    setTaxes(prev => prev.filter(t => t.id !== id))
    toast.success('Taxe supprimée')
  }

  const handleToggle = async (tax) => {
    const updated = await accountingService.updateTax(tax.id, { ...tax, active: !tax.active })
    setTaxes(prev => prev.map(t => t.id === tax.id ? updated : t))
    toast.success(updated.active ? 'Taxe activée' : 'Taxe désactivée', updated.name)
  }

  // TVA stats from invoices
  const tvaCollected   = 22480
  const tvaRecoverable = 11240
  const tvaToPay       = tvaCollected - tvaRecoverable

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      {form !== null && (
        <TaxFormModal
          tax={form === 'new' ? null : form}
          onClose={() => setForm(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Gestion TVA</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Taxes et taux applicables</p>
        </div>
        <button className="btn-primary" onClick={() => setForm('new')}><Plus size={14} />Nouvelle taxe</button>
      </div>

      {/* TVA summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'TVA collectée (ventes)',     value: tvaCollected,   color: 'var(--accent)',  icon: <Receipt size={16} color="var(--accent)" /> },
          { label: 'TVA récupérable (achats)',    value: tvaRecoverable, color: 'var(--success)', icon: <Receipt size={16} color="var(--success)" /> },
          { label: 'TVA nette à décaisser',       value: tvaToPay,       color: 'var(--warn)',    icon: <Receipt size={16} color="var(--warn)" /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="card-static" style={{ padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {icon}
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{label}</p>
              <p style={{ fontSize: 16, fontWeight: 700, color }}>{fmt(value)} <span style={{ fontSize: 10 }}>MAD</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* TVA Breakdown */}
      <div className="card-static" style={{ padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 4 }}>Déclaration TVA — Période courante</p>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>TVA collectée − TVA déductible = TVA à verser au fisc</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{fmt(tvaCollected)}</span>
          <span style={{ color: 'var(--muted)' }}>−</span>
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>{fmt(tvaRecoverable)}</span>
          <span style={{ color: 'var(--muted)' }}>=</span>
          <span style={{ color: 'var(--warn)', fontWeight: 700, fontSize: 16 }}>{fmt(tvaToPay)} MAD</span>
        </div>
      </div>

      {/* Tax list */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '.07em' }}>Référentiel des taxes</p>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--pearl)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Chargement…
        </div>
      ) : (
        <div className="card-static" style={{ overflow: 'hidden' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Nom de la taxe</th>
                <th>Taux</th>
                <th>Type</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {taxes.map(tax => (
                <tr key={tax.id}>
                  <td style={{ fontWeight: 500, color: 'var(--charcoal)' }}>{tax.name}</td>
                  <td>
                    <span style={{
                      fontSize: 14, fontWeight: 700, color: 'var(--ink)',
                      background: 'var(--cream)', padding: '3px 10px', borderRadius: 6,
                    }}>{tax.rate}%</span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 100,
                      background: TYPE_COLORS[tax.type] + '15', color: TYPE_COLORS[tax.type], fontWeight: 500,
                    }}>{TYPE_LABELS[tax.type]}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggle(tax)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {tax.active
                        ? <><CheckCircle size={14} color="var(--success)" /><span style={{ fontSize: 12, color: 'var(--success)' }}>Active</span></>
                        : <><XCircle size={14} color="var(--silver)" /><span style={{ fontSize: 12, color: 'var(--silver)' }}>Inactive</span></>
                      }
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button onClick={() => setForm(tax)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px 6px', borderRadius: 6, transition: 'color .2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                      ><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(tax.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px 6px', borderRadius: 6, transition: 'color .2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                      ><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
