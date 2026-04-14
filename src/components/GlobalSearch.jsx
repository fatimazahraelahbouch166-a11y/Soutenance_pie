/**
 * GlobalSearch.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-app search palette — searches expenses, invoices, customers, revenues,
 * products, suppliers all at once.
 *
 * Trigger: press ⌘K / Ctrl+K or click the search bar in Topbar.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, X, FileText, Users, TrendingUp, Package,
  Truck, DollarSign, ArrowRight, Command,
} from 'lucide-react'
import { useGlobalStore } from '../store/GlobalStore'

const MODULE_META = {
  expense:    { icon: DollarSign, color: '#8A6A2E', bg: '#F5EDD8' },
  invoice:    { icon: FileText,   color: '#3D5A80', bg: '#EBF0F7' },
  customer:   { icon: Users,      color: '#0891B2', bg: '#E0F7FA' },
  revenue:    { icon: TrendingUp, color: '#3D7A5F', bg: '#EBF4EF' },
  product:    { icon: Package,    color: '#6366f1', bg: '#EEF2FF' },
  supplier:   { icon: Truck,      color: '#7C3AED', bg: '#F3F0FF' },
}

const QUICK_LINKS = [
  { label: 'Dashboard',         to: '/app/dashboard',            icon: Command,    color: '#3D5A80' },
  { label: 'Nouvelle dépense',  to: '/app/expenses/new',         icon: DollarSign, color: '#8A6A2E' },
  { label: 'Factures',          to: '/app/accounting/invoices',  icon: FileText,   color: '#3D5A80' },
  { label: 'Journal comptable', to: '/app/accounting/journal',   icon: FileText,   color: '#7C3AED' },
  { label: 'Clients',           to: '/app/customers',            icon: Users,      color: '#0891B2' },
  { label: 'Stock',             to: '/app/stock',                icon: Package,    color: '#6366f1' },
]

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [hoverIdx, setHover]  = useState(-1)
  const inputRef  = useRef(null)
  const navigate  = useNavigate()
  const { selectors } = useGlobalStore()

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults([])
      setHover(-1)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open ? onClose() : open // parent handles open
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const r = selectors.globalSearch(query)
    setResults(r)
    setHover(-1)
  }, [query])

  const go = useCallback((link) => {
    navigate(link)
    onClose()
  }, [navigate, onClose])

  // Keyboard navigation
  const handleKey = (e) => {
    const total = results.length > 0 ? results.length : QUICK_LINKS.length
    if (e.key === 'ArrowDown') { e.preventDefault(); setHover(h => (h + 1) % total) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHover(h => (h - 1 + total) % total) }
    if (e.key === 'Enter') {
      const items = results.length > 0 ? results : QUICK_LINKS
      if (hoverIdx >= 0 && hoverIdx < items.length) go(items[hoverIdx].link ?? items[hoverIdx].to)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(24,23,21,.50)',
          zIndex: 2000, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: '12vh', left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 600,
        background: '#fff', borderRadius: 18,
        boxShadow: '0 24px 80px rgba(0,0,0,.20)',
        zIndex: 2001, overflow: 'hidden',
      }}>

        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--pearl)' }}>
          <Search size={17} color="var(--silver)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Rechercher — dépense, facture, client, produit…"
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 15,
              background: 'transparent', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <kbd style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: 'var(--cream)', border: '1px solid var(--pearl)', color: 'var(--silver)' }}>ESC</kbd>
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', padding: 2, borderRadius: 4 }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Results or quick links */}
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
          {query.length < 2 ? (
            <>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.09em', padding: '6px 18px 4px' }}>
                Accès rapide
              </p>
              {QUICK_LINKS.map((item, i) => (
                <button
                  key={item.to}
                  onClick={() => go(item.to)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 18px', background: hoverIdx === i ? 'var(--cream)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(-1)}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: item.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={14} color={item.color} />
                  </div>
                  <span style={{ fontSize: 13.5, color: 'var(--charcoal)', fontFamily: 'var(--font-sans)' }}>{item.label}</span>
                  <ArrowRight size={12} color="var(--silver)" style={{ marginLeft: 'auto' }} />
                </button>
              ))}
            </>
          ) : results.length === 0 ? (
            <div style={{ padding: '28px 18px', textAlign: 'center' }}>
              <Search size={28} color="var(--pearl)" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Aucun résultat pour « {query} »</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.09em', padding: '6px 18px 4px' }}>
                {results.length} résultat{results.length > 1 ? 's' : ''}
              </p>
              {results.map((r, i) => {
                const meta = MODULE_META[r.type] ?? { icon: FileText, color: 'var(--accent)', bg: 'var(--accent-light)' }
                const Icon = meta.icon
                return (
                  <button
                    key={i}
                    onClick={() => go(r.link)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 18px', background: hoverIdx === i ? 'var(--cream)' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .15s',
                    }}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(-1)}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={meta.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}>{r.label}</p>
                      {r.sub && <p style={{ fontSize: 11, color: 'var(--silver)' }}>{r.sub}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 100, background: meta.bg, color: meta.color, fontWeight: 600 }}>{r.module}</span>
                      {r.amount && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--charcoal)' }}>{r.amount.toLocaleString('fr-MA')} MAD</span>}
                      {r.status && <span style={{ fontSize: 10.5, color: 'var(--silver)' }}>{r.status}</span>}
                    </div>
                  </button>
                )
              })}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '8px 18px', borderTop: '1px solid var(--pearl)', display: 'flex', gap: 16 }}>
          {[
            { key: '↑ ↓', desc: 'naviguer' },
            { key: 'Enter', desc: 'ouvrir' },
            { key: 'Esc', desc: 'fermer' },
          ].map(({ key, desc }) => (
            <div key={key} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <kbd style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--cream)', border: '1px solid var(--pearl)', color: 'var(--silver)' }}>{key}</kbd>
              <span style={{ fontSize: 11, color: 'var(--silver)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
