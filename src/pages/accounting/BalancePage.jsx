import { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, Download, Scale, Printer } from 'lucide-react'
import accountingService from '../../services/accountingService'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)

const TYPE_ORDER  = ['asset', 'liability', 'equity', 'revenue', 'expense']
const TYPE_LABELS = {
  asset:     'Actif',
  liability: 'Passif',
  equity:    'Capitaux propres',
  revenue:   'Produits',
  expense:   'Charges',
}
const TYPE_COLOR  = {
  asset:     'var(--accent)',
  liability: 'var(--danger)',
  equity:    '#7C3AED',
  revenue:   'var(--success)',
  expense:   'var(--warn)',
}

export default function BalancePage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    accountingService.getAccounts().then(data => { setAccounts(data); setLoading(false) })
  }, [])

  const totalDebit  = accounts.reduce((s, a) => s + (a.balance > 0 ? a.balance : 0), 0)
  const totalCredit = accounts.reduce((s, a) => s + (a.balance < 0 ? Math.abs(a.balance) : 0), 0)
  const diff        = Math.abs(totalDebit - totalCredit)
  const balanced    = diff < 0.01

  const grouped = TYPE_ORDER.reduce((acc, type) => {
    acc[type] = accounts.filter(a => a.type === type)
    return acc
  }, {})

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Balance Générale</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Vérification de l'équilibre débit/crédit — Exercice 2024</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary"><Printer size={14} />Imprimer</button>
          <button className="btn-secondary"><Download size={14} />Export Excel</button>
        </div>
      </div>

      {/* Balance status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 10, marginBottom: 24,
        background: balanced ? 'var(--success-bg)' : 'var(--danger-bg)',
        border: `1px solid ${balanced ? 'var(--success-mid)' : 'var(--danger-mid)'}`,
      }}>
        {balanced
          ? <><CheckCircle size={16} color="var(--success)" /><span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 500 }}>Balance équilibrée — Débit = Crédit</span></>
          : <><AlertTriangle size={16} color="var(--danger)" /><span style={{ fontSize: 13, color: 'var(--danger)', fontWeight: 500 }}>Déséquilibre détecté : différence de {fmt(diff)} MAD</span></>
        }
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--pearl)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
          Chargement…
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <div className="card-static" style={{ overflow: 'hidden' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Code</th>
                <th>Intitulé du compte</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Débit (MAD)</th>
                <th style={{ textAlign: 'right' }}>Crédit (MAD)</th>
              </tr>
            </thead>
            <tbody>
              {TYPE_ORDER.map(type => {
                const rows     = grouped[type]
                const secDebit = rows.reduce((s, a) => s + (a.balance > 0 ? a.balance : 0), 0)
                const secCredit= rows.reduce((s, a) => s + (a.balance < 0 ? Math.abs(a.balance) : 0), 0)

                return (
                  <>
                    {/* Section header */}
                    <tr key={`hdr-${type}`} style={{ background: TYPE_COLOR[type] + '08' }}>
                      <td colSpan={5} style={{ padding: '8px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: TYPE_COLOR[type], textTransform: 'uppercase', letterSpacing: '.09em' }}>
                          {TYPE_LABELS[type]}
                        </span>
                      </td>
                    </tr>

                    {rows.map(account => (
                      <tr key={account.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: 12.5, color: TYPE_COLOR[type], fontWeight: 500 }}>
                          {account.code}
                        </td>
                        <td style={{ fontSize: 13 }}>{account.name}</td>
                        <td>
                          <span style={{
                            fontSize: 10.5, padding: '2px 8px', borderRadius: 100,
                            background: TYPE_COLOR[type] + '15', color: TYPE_COLOR[type], fontWeight: 500,
                          }}>{TYPE_LABELS[type]}</span>
                        </td>
                        <td style={{ textAlign: 'right', fontSize: 13, color: account.balance > 0 ? 'var(--charcoal)' : 'var(--silver)' }}>
                          {account.balance > 0 ? fmt(account.balance) : '—'}
                        </td>
                        <td style={{ textAlign: 'right', fontSize: 13, color: account.balance < 0 ? 'var(--charcoal)' : 'var(--silver)' }}>
                          {account.balance < 0 ? fmt(Math.abs(account.balance)) : '—'}
                        </td>
                      </tr>
                    ))}

                    {/* Section subtotal */}
                    <tr key={`sub-${type}`} style={{ background: 'var(--ivory)' }}>
                      <td colSpan={3} style={{ padding: '8px 16px', fontSize: 11.5, fontWeight: 600, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                        Sous-total {TYPE_LABELS[type]}
                      </td>
                      <td style={{ padding: '8px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>
                        {fmt(secDebit)}
                      </td>
                      <td style={{ padding: '8px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)' }}>
                        {fmt(secCredit)}
                      </td>
                    </tr>
                  </>
                )
              })}
            </tbody>

            {/* Grand Total */}
            <tfoot>
              <tr style={{ borderTop: '3px double var(--warm-border)', background: 'var(--cream)' }}>
                <td colSpan={3} style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  TOTAL GÉNÉRAL
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 15, fontWeight: 700, color: balanced ? 'var(--success)' : 'var(--danger)' }}>
                  {fmt(totalDebit)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 15, fontWeight: 700, color: balanced ? 'var(--success)' : 'var(--danger)' }}>
                  {fmt(totalCredit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Summary cards */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 20 }}>
          {[
            { label: 'Total Débit',  value: fmt(totalDebit),  color: 'var(--accent)' },
            { label: 'Total Crédit', value: fmt(totalCredit), color: 'var(--danger)' },
            { label: 'Différence',   value: fmt(diff), color: balanced ? 'var(--success)' : 'var(--danger)', note: balanced ? 'Équilibrée' : 'Déséquilibré' },
          ].map(c => (
            <div key={c.label} className="card-static" style={{ padding: '14px 18px' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: c.color }}>{c.value} <span style={{ fontSize: 11 }}>MAD</span></p>
              {c.note && <p style={{ fontSize: 11, color: c.color, marginTop: 2 }}>{c.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
