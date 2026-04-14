import { useEffect, useState } from 'react'
import { Plus, Trash2, CheckCircle, AlertTriangle, Search, Download, BookOpen } from 'lucide-react'
import accountingService, { ACCOUNTS } from '../../services/accountingService'
import { useToast } from '../../contexts/ToastContext'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)

const EMPTY_LINE = { account_id: '', account_code: '', account_name: '', debit: '', credit: '' }

function JournalFormModal({ onClose, onSave }) {
  const [date, setDate]         = useState(new Date().toISOString().split('T')[0])
  const [description, setDesc]  = useState('')
  const [lines, setLines]       = useState([{ ...EMPTY_LINE }, { ...EMPTY_LINE }])
  const [saving, setSaving]     = useState(false)
  const toast = useToast()

  const totalDebit  = lines.reduce((s, l) => s + (parseFloat(l.debit)  || 0), 0)
  const totalCredit = lines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0)
  const balanced    = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0

  const updateLine = (i, field, val) => {
    const updated = [...lines]
    updated[i] = { ...updated[i], [field]: val }
    if (field === 'account_id') {
      const acc = ACCOUNTS.find(a => a.id === val)
      if (acc) { updated[i].account_code = acc.code; updated[i].account_name = acc.name }
    }
    setLines(updated)
  }

  const addLine    = ()  => setLines(l => [...l, { ...EMPTY_LINE }])
  const removeLine = (i) => setLines(l => l.filter((_, idx) => idx !== i))

  const handleSave = async () => {
    if (!date || !description) { toast.warning('Champs requis', 'Date et description obligatoires'); return }
    if (!balanced) { toast.error('Déséquilibre', 'Total débit ≠ Total crédit'); return }
    const filled = lines.filter(l => l.account_id)
    if (filled.length < 2) { toast.warning('Lignes insuffisantes', 'Minimum 2 lignes renseignées'); return }
    setSaving(true)
    try {
      await onSave({ date, description, lines: filled })
      toast.success('Écriture enregistrée', description)
      onClose()
    } catch { toast.error('Erreur', 'Impossible de sauvegarder') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(24,23,21,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 780, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--pearl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>Nouvelle écriture comptable</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Saisie au journal général</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Date + Description */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Date *</label>
              <input type="date" className="input-premium" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--slate)', display: 'block', marginBottom: 6 }}>Libellé *</label>
              <input className="input-premium" placeholder="Description de l'écriture…" value={description} onChange={e => setDesc(e.target.value)} />
            </div>
          </div>

          {/* Lines Table */}
          <div style={{ border: '1px solid var(--pearl)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--cream)' }}>
                  {['Compte', 'Libellé compte', 'Débit (MAD)', 'Crédit (MAD)', ''].map(h => (
                    <th key={h} style={{ padding: '9px 12px', fontSize: 10.5, fontWeight: 600, color: 'var(--silver)', textAlign: 'left', letterSpacing: '.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} style={{ borderTop: '1px solid var(--ivory)' }}>
                    <td style={{ padding: '8px 10px', width: 180 }}>
                      <select
                        className="input-premium"
                        style={{ height: 34 }}
                        value={line.account_id}
                        onChange={e => updateLine(i, 'account_id', e.target.value)}
                      >
                        <option value="">— Sélectionner —</option>
                        {ACCOUNTS.map(a => (
                          <option key={a.id} value={a.id}>{a.code} – {a.name}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ fontSize: 12.5, color: 'var(--charcoal)' }}>{line.account_name || '—'}</span>
                    </td>
                    <td style={{ padding: '8px 10px', width: 140 }}>
                      <input
                        type="number" min="0" step="0.01"
                        className="input-premium"
                        style={{ height: 34, textAlign: 'right' }}
                        placeholder="0.00"
                        value={line.debit}
                        onChange={e => updateLine(i, 'debit', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '8px 10px', width: 140 }}>
                      <input
                        type="number" min="0" step="0.01"
                        className="input-premium"
                        style={{ height: 34, textAlign: 'right' }}
                        placeholder="0.00"
                        value={line.credit}
                        onChange={e => updateLine(i, 'credit', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '8px 10px', width: 40 }}>
                      {lines.length > 2 && (
                        <button onClick={() => removeLine(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 4 }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--pearl)', background: 'var(--cream)' }}>
                  <td colSpan={2} style={{ padding: '9px 12px', fontSize: 12, fontWeight: 600, color: 'var(--slate)' }}>TOTAUX</td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: balanced ? 'var(--success)' : 'var(--danger)' }}>
                    {fmt(totalDebit)}
                  </td>
                  <td style={{ padding: '9px 12px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: balanced ? 'var(--success)' : 'var(--danger)' }}>
                    {fmt(totalCredit)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Balance indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            {balanced ? (
              <><CheckCircle size={14} color="var(--success)" /><span style={{ fontSize: 12, color: 'var(--success)' }}>Écriture équilibrée</span></>
            ) : totalDebit > 0 ? (
              <><AlertTriangle size={14} color="var(--danger)" /><span style={{ fontSize: 12, color: 'var(--danger)' }}>Différence : {fmt(Math.abs(totalDebit - totalCredit))} MAD</span></>
            ) : null}
            <button onClick={addLine} className="btn-ghost" style={{ marginLeft: 'auto', height: 30 }}>
              <Plus size={13} /> Ajouter une ligne
            </button>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-primary" onClick={handleSave} disabled={!balanced || saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState({})
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const data = await accountingService.getJournalEntries()
    setEntries(data)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const handleSave = async (entry) => {
    const saved = await accountingService.createJournalEntry(entry)
    setEntries(prev => [saved, ...prev])
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette écriture ?')) return
    await accountingService.deleteJournalEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
    toast.success('Écriture supprimée')
  }

  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const filtered = entries.filter(e =>
    e.reference.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>
      {showForm && <JournalFormModal onClose={() => setShowForm(false)} onSave={handleSave} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Journal Général</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Enregistrement chronologique des écritures</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary"><Download size={14} />Export</button>
          <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={14} />Nouvelle écriture</button>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, position: 'relative', maxWidth: 360 }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
        <input
          className="input-premium"
          style={{ paddingLeft: 34 }}
          placeholder="Rechercher référence, libellé…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card-static" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ width: 20, height: 20, border: '2px solid var(--pearl)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
            Chargement…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <BookOpen size={36} color="var(--pearl)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Aucune écriture trouvée</p>
          </div>
        ) : (
          <table className="premium-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Date</th>
                <th>Libellé</th>
                <th style={{ textAlign: 'right' }}>Total Débit</th>
                <th style={{ textAlign: 'right' }}>Total Crédit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => {
                const totalD = entry.lines.reduce((s, l) => s + l.debit, 0)
                const totalC = entry.lines.reduce((s, l) => s + l.credit, 0)
                return (
                  <>
                    <tr key={entry.id} onClick={() => toggle(entry.id)} style={{ cursor: 'pointer' }}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 500, color: 'var(--accent)' }}>
                          {entry.reference}
                        </span>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{new Date(entry.date).toLocaleDateString('fr-FR')}</td>
                      <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.description}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 500, color: 'var(--charcoal)' }}>{fmt(totalD)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 500, color: 'var(--charcoal)' }}>{fmt(totalC)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button
                            onClick={e => { e.stopPropagation(); handleDelete(entry.id) }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', padding: '4px 6px', borderRadius: 6, transition: 'color .2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded[entry.id] && (
                      <tr key={`${entry.id}-detail`} style={{ background: 'var(--cream)' }}>
                        <td colSpan={6} style={{ padding: '0 16px 12px 32px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 4 }}>
                            <thead>
                              <tr>
                                {['Code', 'Compte', 'Débit', 'Crédit'].map(h => (
                                  <th key={h} style={{ padding: '6px 10px', fontSize: 10, fontWeight: 600, color: 'var(--silver)', letterSpacing: '.08em', textTransform: 'uppercase', textAlign: h.includes('ébit') || h.includes('rédit') ? 'right' : 'left', borderBottom: '1px solid var(--pearl)' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {entry.lines.map((line, idx) => (
                                <tr key={idx}>
                                  <td style={{ padding: '5px 10px', fontSize: 12, fontFamily: 'monospace', color: 'var(--accent)' }}>{line.account_code}</td>
                                  <td style={{ padding: '5px 10px', fontSize: 12, color: 'var(--charcoal)' }}>{line.account_name}</td>
                                  <td style={{ padding: '5px 10px', fontSize: 12, textAlign: 'right', color: line.debit > 0 ? 'var(--charcoal)' : 'var(--silver)' }}>
                                    {line.debit > 0 ? fmt(line.debit) : '—'}
                                  </td>
                                  <td style={{ padding: '5px 10px', fontSize: 12, textAlign: 'right', color: line.credit > 0 ? 'var(--charcoal)' : 'var(--silver)' }}>
                                    {line.credit > 0 ? fmt(line.credit) : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 12 }}>
        {filtered.length} écriture{filtered.length !== 1 ? 's' : ''} • Cliquer sur une ligne pour voir le détail
      </p>
    </div>
  )
}
