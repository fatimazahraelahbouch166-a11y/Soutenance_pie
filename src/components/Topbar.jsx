/* ─────────────────────────────────────────────────────────────
   Topbar.jsx  — Search palette + Profile dropdown + Notifications
───────────────────────────────────────────────────────────── */
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, Search, X, LayoutDashboard, FileText, CheckSquare,
  PiggyBank, CreditCard, BarChart2, Users, Settings, User,
  Crown, Building2, Truck, Receipt, Package, TrendingUp,
  Tag, LogOut, ChevronRight,
} from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import SubscriptionBadge from './subscription/SubscriptionBadge'
import NotificationCenter, { useNotificationCount } from './NotificationCenter'

/* ── Page title map ──────────────────────────────────────── */
const TITLES = {
  '/app/dashboard':                { title: 'Dashboard',            sub: "Vue d'ensemble"              },
  '/app/expenses':                 { title: 'Dépenses',             sub: 'Gestion & suivi'             },
  '/app/expenses/new':             { title: 'Nouvelle dépense',     sub: 'Formulaire de saisie'        },
  '/app/validation':               { title: 'Validation',           sub: 'Approbation des demandes'    },
  '/app/budgets':                  { title: 'Budgets',              sub: 'Lignes budgétaires'          },
  '/app/reimbursements':           { title: 'Remboursements',       sub: 'Paiements en attente'        },
  '/app/reports':                  { title: 'Rapports',             sub: 'Analyse & exports'           },
  '/app/users':                    { title: 'Utilisateurs',         sub: 'Gestion des accès'           },
  '/app/categories':               { title: 'Catégories',           sub: 'Classification'              },
  '/app/settings':                 { title: 'Paramètres',           sub: 'Configuration'               },
  '/app/profile':                  { title: 'Mon profil',           sub: 'Informations personnelles'   },
  '/app/subscription':             { title: 'Abonnement',           sub: 'Plan & facturation'          },
  '/app/pricing':                  { title: 'Tarifs',               sub: 'Choisir un plan'             },
  '/app/payment':                  { title: 'Paiement',             sub: "Finaliser l'abonnement"      },
  '/app/customers':                { title: 'Clients',              sub: 'CRM & portefeuille'          },
  '/app/suppliers':                { title: 'Fournisseurs',         sub: 'Base fournisseurs'           },
  '/app/quotes':                   { title: 'Ventes & Factures',    sub: 'Devis et facturation'        },
  '/app/stock':                    { title: 'Stock & Achats',       sub: 'Gestion des stocks'          },
  '/app/incomes':                  { title: 'Revenus',              sub: 'Suivi des entrées'           },
  // Accounting module
  '/app/accounting':               { title: 'Comptabilité',         sub: "Vue d'ensemble financière"   },
  '/app/accounting/journal':       { title: 'Journal comptable',    sub: 'Écritures & saisie'          },
  '/app/accounting/ledger':        { title: 'Grand Livre',          sub: 'Soldes par compte'           },
  '/app/accounting/balance':       { title: 'Balance',              sub: 'Débit / Crédit / Solde'      },
  '/app/accounting/bilan':         { title: 'Bilan',                sub: 'Actif & Passif'              },
  '/app/accounting/cpc':           { title: 'CPC',                  sub: 'Compte de produits et charges'},
  '/app/accounting/invoices':      { title: 'Factures',             sub: 'Facturation clients'         },
  '/app/accounting/taxes':         { title: 'TVA',                  sub: 'Gestion de la taxe'          },
  '/app/accounting/payments':      { title: 'Paiements',            sub: 'Encaissements & décaissements'},
}

/* ── Searchable nav items ────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Dashboard',          sub: "Vue d'ensemble",          to: '/app/dashboard',      icon: LayoutDashboard, group: 'Navigation'  },
  { label: 'Dépenses',           sub: 'Liste des dépenses',      to: '/app/expenses',       icon: FileText,        group: 'Navigation'  },
  { label: 'Nouvelle dépense',   sub: 'Créer une dépense',       to: '/app/expenses/new',   icon: FileText,        group: 'Navigation'  },
  { label: 'Validation',         sub: 'Approuver les demandes',  to: '/app/validation',     icon: CheckSquare,     group: 'Navigation'  },
  { label: 'Budgets',            sub: 'Lignes budgétaires',      to: '/app/budgets',        icon: PiggyBank,       group: 'Navigation'  },
  { label: 'Remboursements',     sub: 'Paiements en attente',    to: '/app/reimbursements', icon: CreditCard,      group: 'Navigation'  },
  { label: 'Rapports',           sub: 'Analyse et exports',      to: '/app/reports',        icon: BarChart2,       group: 'Navigation'  },
  { label: 'Revenus',            sub: 'Suivi des revenus',       to: '/app/incomes',        icon: TrendingUp,      group: 'Navigation'  },
  { label: 'Clients',            sub: 'CRM & portefeuille',      to: '/app/customers',      icon: Building2,       group: 'ERP'         },
  { label: 'Fournisseurs',       sub: 'Base fournisseurs',       to: '/app/suppliers',      icon: Truck,           group: 'ERP'         },
  { label: 'Ventes & Factures',  sub: 'Devis et facturation',    to: '/app/quotes',         icon: Receipt,         group: 'ERP'         },
  { label: 'Stock & Achats',     sub: 'Gestion des stocks',      to: '/app/stock',          icon: Package,         group: 'ERP'         },
  { label: 'Utilisateurs',       sub: 'Gérer les accès',         to: '/app/users',          icon: Users,           group: 'Admin'       },
  { label: 'Catégories',         sub: 'Classification',          to: '/app/categories',     icon: Tag,             group: 'Admin'       },
  { label: 'Paramètres',         sub: 'Configuration',           to: '/app/settings',       icon: Settings,        group: 'Admin'       },
  { label: 'Mon profil',         sub: 'Informations personnelles', to: '/app/profile',      icon: User,            group: 'Compte'      },
  { label: 'Abonnement',         sub: 'Plan & facturation',      to: '/app/subscription',   icon: Crown,           group: 'Compte'      },
]

/* ── Shared: close on outside click hook ─────────────────── */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

/* ═══════════════════════════════════════════════════════════
   Search Palette  (⌘K)
═══════════════════════════════════════════════════════════ */
function SearchPalette({ onClose }) {
  const [query, setQuery]       = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const navigate  = useNavigate()
  const inputRef  = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = query.trim()
    ? NAV_ITEMS.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.sub.toLowerCase().includes(query.toLowerCase())
      )
    : NAV_ITEMS.slice(0, 9)

  useEffect(() => { setActiveIdx(0) }, [query])

  const go = (to) => { navigate(to); onClose() }

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && results[activeIdx]) go(results[activeIdx].to)
    if (e.key === 'Escape') onClose()
  }

  const grouped = results.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(24,23,21,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '8vh',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-up"
        style={{
          width: '92%', maxWidth: 540,
          background: '#fff', borderRadius: 'var(--r-xl)',
          boxShadow: '0 28px 80px rgba(24,23,21,0.22)',
          border: '1px solid var(--pearl)', overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKey}
      >
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid var(--ivory)' }}>
          <Search size={16} style={{ color: 'var(--silver)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une page ou fonctionnalité…"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--ink)', background: 'transparent' }}
          />
          {query
            ? <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', lineHeight: 1 }}><X size={14} /></button>
            : <kbd style={{ padding: '2px 7px', borderRadius: 5, fontSize: 11, background: 'var(--ivory)', border: '1px solid var(--pearl)', color: 'var(--silver)', flexShrink: 0 }}>ESC</kbd>
          }
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px 0' }}>
          {results.length === 0 ? (
            <p style={{ padding: '22px 18px', fontSize: 13, color: 'var(--silver)', textAlign: 'center' }}>
              Aucun résultat pour « {query} »
            </p>
          ) : Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p style={{ padding: '6px 18px 3px', fontSize: 10.5, fontWeight: 600, color: 'var(--silver)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                {group}
              </p>
              {items.map(item => {
                const idx = results.indexOf(item)
                const active = idx === activeIdx
                const Icon = item.icon
                return (
                  <button
                    key={item.to}
                    onClick={() => go(item.to)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                      padding: '9px 18px', border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: active ? 'var(--accent-light)' : 'transparent', transition: 'background .1s',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                      background: active ? 'var(--accent)' : 'var(--ivory)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .1s',
                    }}>
                      <Icon size={14} style={{ color: active ? '#fff' : 'var(--muted)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: active ? 'var(--accent)' : 'var(--charcoal)' }}>{item.label}</p>
                      <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 1 }}>{item.sub}</p>
                    </div>
                    {active && <ChevronRight size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 14, padding: '9px 18px', borderTop: '1px solid var(--ivory)', background: 'var(--cream)' }}>
          {[['↑↓', 'naviguer'], ['↵', 'ouvrir'], ['ESC', 'fermer']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{ padding: '1px 6px', borderRadius: 4, fontSize: 10.5, background: '#fff', border: '1px solid var(--pearl)', color: 'var(--slate)' }}>{k}</kbd>
              <span style={{ fontSize: 11, color: 'var(--silver)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Profile Dropdown
═══════════════════════════════════════════════════════════ */
function ProfileDropdown({ user, onClose }) {
  const { logout }   = useAuth()
  const navigate     = useNavigate()
  const ref          = useRef(null)
  useClickOutside(ref, onClose)

  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`

  const MENU = [
    { icon: User,     label: 'Mon profil',   sub: 'Informations personnelles', to: '/app/profile'      },
    { icon: Crown,    label: 'Abonnement',   sub: 'Plan & facturation',        to: '/app/subscription' },
    { icon: Settings, label: 'Paramètres',   sub: 'Configuration',             to: '/app/settings'     },
  ]

  return (
    <div
      ref={ref}
      className="animate-fade-up"
      style={{
        position: 'absolute', top: 'calc(100% + 10px)', right: 0,
        width: 248,
        background: '#fff', border: '1px solid var(--pearl)',
        borderRadius: 'var(--r-lg)',
        boxShadow: '0 16px 48px rgba(24,23,21,0.14)',
        zIndex: 200, overflow: 'hidden',
      }}
    >
      {/* User info */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--ivory)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 600,
          }}>{initials}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name} {user?.last_name}
            </p>
            <p style={{ fontSize: 11.5, color: 'var(--silver)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </p>
          </div>
        </div>

        {/* Subscription badge */}
        <SubscriptionBadge size="sm" showPlan />

        {/* Company */}
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 100, width: 'fit-content',
          background: 'var(--cream)', border: '1px solid var(--pearl)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {user?.company?.name ?? '—'} · {user?.team?.name ?? '—'}
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: '6px 0' }}>
        {MENU.map(({ icon: Icon, label, sub, to }) => (
          <button
            key={to}
            onClick={() => { navigate(to); onClose() }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 14px', border: 'none', background: 'none',
              cursor: 'pointer', textAlign: 'left', transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'var(--ivory)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={13} style={{ color: 'var(--muted)' }} />
            </div>
            <div>
              <p style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--charcoal)' }}>{label}</p>
              <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 1 }}>{sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '4px 8px 8px', borderTop: '1px solid var(--ivory)' }}>
        <button
          onClick={() => { logout(); onClose() }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 10px', border: 'none', borderRadius: 'var(--r-md)',
            background: 'none', cursor: 'pointer',
            fontSize: 13, color: 'var(--danger)', fontWeight: 500,
            transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <LogOut size={14} /> Se déconnecter
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   Topbar
═══════════════════════════════════════════════════════════ */
export default function Topbar({ onSearchOpen }) {
  const { pathname }   = useLocation()
  const { user }       = useAuth()
  const { loading: subLoading } = useSubscription()

  const [notifOpen,   setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const match  = Object.entries(TITLES).find(([p]) => pathname === p || (pathname.startsWith(p + '/') && p !== '/app'))
  const { title, sub } = match?.[1] ?? { title: 'Taadbiir', sub: '' }
  const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`
  const today    = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  const liveCount   = useNotificationCount()
  const unreadCount = liveCount

  /* ⌘K global shortcut — delegates to Layout's GlobalSearch */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); onSearchOpen?.() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onSearchOpen])

  /* Close other dropdowns when one opens */
  const openNotif   = () => { setNotifOpen(v => !v);   setProfileOpen(false) }
  const openProfile = () => { setProfileOpen(v => !v); setNotifOpen(false)   }

  return (
    <>
      <header
        className="topbar flex items-center shrink-0"
        style={{ padding: '0 32px', gap: 16, position: 'relative', zIndex: 100 }}
      >
        {/* Page title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <h1 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{title}</h1>
            {sub && (
              <>
                <span style={{ color: 'var(--warm-border)', fontSize: 13, flexShrink: 0 }}>/</span>
                <span style={{ fontSize: 12, color: 'var(--silver)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* Date */}
          <span style={{ fontSize: 11.5, color: 'var(--silver)', marginRight: 4, whiteSpace: 'nowrap' }}>{today}</span>

          {/* Search */}
          <button
            onClick={() => onSearchOpen?.()}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              height: 32, padding: '0 12px',
              background: 'var(--cream)', border: '1px solid var(--pearl)',
              borderRadius: 'var(--r-md)', cursor: 'pointer',
              fontSize: 12, color: 'var(--silver)', whiteSpace: 'nowrap',
              transition: 'border-color .2s, background .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-mid)'; e.currentTarget.style.background = 'var(--accent-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pearl)'; e.currentTarget.style.background = 'var(--cream)'; }}
          >
            <Search size={13} />
            <span>Rechercher…</span>
            <kbd style={{ marginLeft: 4, padding: '1px 6px', borderRadius: 4, background: 'var(--pearl)', fontSize: 10, color: 'var(--muted)', border: 'none' }}>⌘K</kbd>
          </button>

          {/* Bell — with unread badge */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={openNotif}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: notifOpen ? 'var(--ivory)' : 'none',
                border: 'none', borderRadius: 'var(--r-md)',
                cursor: 'pointer', color: notifOpen ? 'var(--charcoal)' : 'var(--silver)',
                transition: 'background .18s, color .18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--ivory)'; e.currentTarget.style.color = 'var(--charcoal)'; }}
              onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--silver)'; } }}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 5, right: 5,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--danger)', border: '1.5px solid #fff',
                }} />
              )}
            </button>
            {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'var(--pearl)' }} />

          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={openProfile}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: profileOpen ? 'var(--accent)' : 'var(--accent-light)',
                color: profileOpen ? '#fff' : 'var(--accent)',
                fontSize: 10.5, fontWeight: 700, cursor: 'pointer',
                border: `1.5px solid ${profileOpen ? 'var(--accent)' : 'var(--accent-mid)'}`,
                transition: 'all .18s',
              }}
              onMouseEnter={e => { if (!profileOpen) { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--accent)'; } }}
              onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent-mid)'; } }}
            >
              {initials}
            </button>
            {profileOpen && <ProfileDropdown user={user} onClose={() => setProfileOpen(false)} />}
          </div>
        </div>
      </header>

    </>
  )
}
