import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Search, Download, BookOpen, Filter } from 'lucide-react'
import accountingService, { JOURNAL_ENTRIES } from '../../services/accountingService'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)

const TYPE_LABELS = {
  asset:     { label: 'Actif',    color: 'var(--accent)' },
  liability: { label: 'Passif',   color: 'var(--danger)' },
  equity:    { label: 'Capitaux', color: '#7C3AED' },
  revenue:   { label: 'Produits', color: 'var(--success)' },
  expense:   { label: 'Charges',  color: 'var(--warn)' },
}

function buildLedger(accounts, entries) {
  // For each account, collect all lines from all journal entries
  return accounts.map(account => {
    const transactions = []
    let runningBalance = 0

    entries.forEach(entry => {
      entry.lines
        .filter(line => line.account_id === account.id)
        .forEach(line => {
          const isDebit = line.debit > 0
          runningBalance += isDebit ? line.debit : -line.credit
          transactions.push({
            date:        entry.date,
            reference:   entry.reference,
            description: entry.description,
            debit:       line.debit,
            credit:      line.credit,
            balance:     runningBalance,
          })
        })
    })

    // Sort by date
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date))

    // Recalculate running balance after sort
    let bal = 0
    transactions.forEach(t => {
      bal += t.debit - t.credit
      t.balance = bal
    })

    return { ...account, transactions }
  })
}

export default function LedgerPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [typeFilter, setType]   = useState('all')
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    accountingService.getAccounts().then(accs => {
      const ledger = buildLedger(accs, JOURNAL_ENTRIES)
      setAccounts(ledger)
      setLoading(false)
    })
  }, [])

  const filtered = accounts.filter(a => {
    const matchSearch = a.code.includes(search) || a.name.toLowerCase().includes(search.toLowerCase())
    const matchType   = typeFilter === 'all' || a.type === typeFilter
    return matchSearch && matchType
  })

  const toggle = id => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Grand Livre</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Détail des mouvements par compte</p>
        </div>
        <button className="btn-secondary"><Download size={14} />Export PDF</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '0 0 280px' }}>
          <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--silver)' }} />
          <input className="input-premium" style={{ paddingLeft: 32 }} placeholder="Rechercher compte…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-premium" style={{ width: 200 }} value={typeFilter} onChange={e => setType(e.target.value)}>
          <option value="all">Tous les types</option>
          <option value="asset">Actif</option>
          <option value="liability">Passif</option>
          <option value="equity">Capitaux propres</option>
          <option value="revenue">Produits</option>
          <option value="expense">Charges</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--pearl)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
          Chargement…
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(account => {
            const isOpen = expanded[account.id]
            const cfg    = TYPE_LABELS[account.type] ?? { label: account.type, color: 'var(--muted)' }
            const totalD = account.transactions.reduce((s, t) => s + t.debit, 0)
            const totalC = account.transactions.reduce((s, t) => s + t.credit, 0)
            const solde  = totalD - totalC

            return (
              <div key={account.id} className="card-static" style={{ overflow: 'hidden' }}>
                {/* Account Header Row */}
                <div
                  onClick={() => toggle(account.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px', cursor: 'pointer', background: '#fff',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  {isOpen ? <ChevronDown size={14} color="var(--silver)" /> : <ChevronRight size={14} color="var(--silver)" />}

                  <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: cfg.color, minWidth: 44 }}>
                    {account.code}
                  </span>

                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--charcoal)' }}>
                    {account.name}
                  </span>

                  <span style={{
                    fontSize: 10.5, fontWeight: 500, padding: '3px 9px', borderRadius: 100,
                    background: cfg.color + '15', color: cfg.color,
                  }}>{cfg.label}</span>

                  <div style={{ display: 'flex', gap: 24, minWidth: 360, justifyContent: 'flex-end' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Débit</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)' }}>{fmt(totalD)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 10, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Crédit</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)' }}>{fmt(totalC)}</p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 100 }}>
                      <p style={{ fontSize: 10, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Solde</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: solde >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {solde >= 0 ? '' : '-'}{fmt(Math.abs(solde))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--pearl)', background: 'var(--cream)' }}>
                    {account.transactions.length === 0 ? (
                      <p style={{ padding: '16px 32px', fontSize: 12.5, color: 'var(--muted)' }}>Aucun mouvement enregistré</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {['Date', 'Référence', 'Libellé', 'Débit', 'Crédit', 'Solde cumulé'].map(h => (
                              <th key={h} style={{
                                padding: '8px 16px', fontSize: 10, fontWeight: 600, color: 'var(--silver)',
                                textTransform: 'uppercase', letterSpacing: '.07em',
                                textAlign: ['Débit','Crédit','Solde cumulé'].includes(h) ? 'right' : 'left',
                                borderBottom: '1px solid var(--pearl)'
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {account.transactions.map((t, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--ivory)' }}>
                              <td style={{ padding: '7px 16px', fontSize: 12, color: 'var(--muted)' }}>
                                {new Date(t.date).toLocaleDateString('fr-FR')}
                              </td>
                              <td style={{ padding: '7px 16px', fontSize: 11.5, fontFamily: 'monospace', color: 'var(--accent)' }}>
                                {t.reference}
                              </td>
                              <td style={{ padding: '7px 16px', fontSize: 12.5, color: 'var(--charcoal)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {t.description}
                              </td>
                              <td style={{ padding: '7px 16px', fontSize: 12.5, textAlign: 'right', color: t.debit > 0 ? 'var(--charcoal)' : 'var(--silver)' }}>
                                {t.debit > 0 ? fmt(t.debit) : '—'}
                              </td>
                              <td style={{ padding: '7px 16px', fontSize: 12.5, textAlign: 'right', color: t.credit > 0 ? 'var(--charcoal)' : 'var(--silver)' }}>
                                {t.credit > 0 ? fmt(t.credit) : '—'}
                              </td>
                              <td style={{ padding: '7px 16px', fontSize: 12.5, textAlign: 'right', fontWeight: 500, color: t.balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                {t.balance >= 0 ? '' : '-'}{fmt(Math.abs(t.balance))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ borderTop: '2px solid var(--warm-border)', background: '#fff' }}>
                            <td colSpan={3} style={{ padding: '9px 16px', fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Total</td>
                            <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>{fmt(totalD)}</td>
                            <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--charcoal)' }}>{fmt(totalC)}</td>
                            <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: solde >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                              {solde >= 0 ? '' : '-'}{fmt(Math.abs(solde))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <BookOpen size={36} color="var(--pearl)" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 14, color: 'var(--muted)' }}>Aucun compte trouvé</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
