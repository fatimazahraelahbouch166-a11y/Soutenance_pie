import { useEffect, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import accountingService from '../../services/accountingService'

const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n ?? 0)

// Classify accounts into bilan sections
function buildBilan(accounts) {
  const ACTIF = {
    'Actif Immobilisé':  accounts.filter(a => a.type === 'asset' && ['2310','2410'].includes(a.code)),
    'Actif Circulant':   accounts.filter(a => a.type === 'asset' && ['1310','1320','2110'].includes(a.code)),
    'Trésorerie Actif':  accounts.filter(a => a.type === 'asset' && ['1110','1120','1130'].includes(a.code)),
    'Autres Actifs':     accounts.filter(a => a.type === 'asset' && !['2310','2410','1310','1320','2110','1110','1120','1130'].includes(a.code)),
  }
  const PASSIF = {
    'Capitaux Propres':  accounts.filter(a => a.type === 'equity'),
    'Dettes Long Terme': accounts.filter(a => a.type === 'liability' && ['4810'].includes(a.code)),
    'Dettes Court Terme':accounts.filter(a => a.type === 'liability' && !['4810'].includes(a.code)),
  }
  return { ACTIF, PASSIF }
}

function BilanSection({ title, groups, side }) {
  const colors = {
    actif:  { accent: 'var(--accent)',  sectionBg: 'var(--accent-light)',  rowBg: '#F0F5FA' },
    passif: { accent: '#7C3AED',        sectionBg: '#F3F0FF',              rowBg: '#F8F6FF' },
  }
  const c = colors[side]

  const grandTotal = Object.values(groups).flat().reduce((s, a) => s + Math.abs(a.balance), 0)

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Side header */}
      <div style={{ background: c.accent, borderRadius: '10px 10px 0 0', padding: '14px 20px' }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          {title}
        </h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 2 }}>Total : {fmt(grandTotal)} MAD</p>
      </div>

      <div style={{ border: '1px solid var(--pearl)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
        {Object.entries(groups).map(([groupName, items]) => {
          const groupTotal = items.reduce((s, a) => s + Math.abs(a.balance), 0)
          return (
            <div key={groupName}>
              {/* Group header */}
              <div style={{ background: c.sectionBg, padding: '8px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--pearl)' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: c.accent, textTransform: 'uppercase', letterSpacing: '.06em' }}>{groupName}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c.accent }}>{fmt(groupTotal)}</span>
              </div>

              {/* Items */}
              {items.length === 0 ? (
                <div style={{ padding: '10px 20px', fontSize: 12, color: 'var(--silver)' }}>—</div>
              ) : (
                items.map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 20px', borderBottom: '1px solid var(--ivory)', background: '#fff', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.rowBg}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: c.accent, fontWeight: 600, minWidth: 36 }}>{a.code}</span>
                      <span style={{ fontSize: 13, color: 'var(--charcoal)' }}>{a.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)' }}>{fmt(Math.abs(a.balance))}</span>
                  </div>
                ))
              )}
            </div>
          )
        })}

        {/* Grand total row */}
        <div style={{ background: c.accent + '12', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', borderTop: `2px solid ${c.accent}40` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: c.accent, textTransform: 'uppercase', letterSpacing: '.04em' }}>TOTAL {title}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: c.accent }}>{fmt(grandTotal)} MAD</span>
        </div>
      </div>
    </div>
  )
}

export default function BilanPage() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [period, setPeriod]     = useState('2024')

  useEffect(() => {
    accountingService.getAccounts().then(data => { setAccounts(data); setLoading(false) })
  }, [])

  const { ACTIF, PASSIF } = buildBilan(accounts)
  const totalActif  = accounts.filter(a => a.type === 'asset').reduce((s, a) => s + Math.abs(a.balance), 0)
  const totalPassif = [
    ...accounts.filter(a => a.type === 'equity'),
    ...accounts.filter(a => a.type === 'liability'),
  ].reduce((s, a) => s + Math.abs(a.balance), 0)
  const balanced = Math.abs(totalActif - totalPassif) < 1

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Bilan Comptable</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>État de la situation financière — Exercice {period}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select className="input-premium" style={{ width: 120 }} value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <button className="btn-secondary"><Printer size={14} />Imprimer</button>
          <button className="btn-secondary"><Download size={14} />Export PDF</button>
        </div>
      </div>

      {/* Document header */}
      <div style={{ textAlign: 'center', marginBottom: 24, padding: '16px 0', borderBottom: '2px solid var(--pearl)' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          BILAN AU 31 DÉCEMBRE {period}
        </p>
        <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 4 }}>Exprimé en Dirhams (MAD)</p>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ width: 20, height: 20, border: '2px solid var(--pearl)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 12px' }} />
          Chargement…
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : (
        <>
          {/* Two-column bilan layout */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <BilanSection title="Actif" groups={ACTIF} side="actif" />
            <BilanSection title="Passif & Capitaux" groups={PASSIF} side="passif" />
          </div>

          {/* Totals comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 20 }}>
            <div className="card-static" style={{ padding: '14px 18px' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Total Actif</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{fmt(totalActif)} <span style={{ fontSize: 11 }}>MAD</span></p>
            </div>
            <div className="card-static" style={{ padding: '14px 18px' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Total Passif + Capitaux</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#7C3AED' }}>{fmt(totalPassif)} <span style={{ fontSize: 11 }}>MAD</span></p>
            </div>
            <div className="card-static" style={{ padding: '14px 18px' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>Équilibre</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: balanced ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: balanced ? 'var(--success)' : 'var(--danger)', display: 'inline-block' }} />
                {balanced ? 'Bilan équilibré' : `Écart : ${fmt(Math.abs(totalActif - totalPassif))} MAD`}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
