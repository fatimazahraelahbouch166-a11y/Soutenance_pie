
import { NavLink } from 'react-router-dom'
import { useAuth, CAN } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useGlobalStore } from '../store/GlobalStore'
import {
  LayoutDashboard, FileText, CheckSquare, PiggyBank, CreditCard,
  BarChart2, Users, Settings, LogOut, Plus, Tag, User, Crown,
  Building2, Truck, Receipt, Package, ChevronDown, ChevronRight,
  TrendingUp, BookOpen, Scale, Landmark, ReceiptText, Wallet,
  ShoppingCart, AlertTriangle,
} from 'lucide-react'
import { TrialPill } from './subscription/TrialCountdown'

const ROLE_CONFIG = {
  owner:       { label: 'Company Owner', dot: '#3D5A80' },
  chef_equipe: { label: "Chef d'équipe",  dot: '#3D7A5F' },
  equipe:      { label: 'Équipe',         dot: '#8A6A2E' },
}

function NavItem({ to, icon: Icon, label, badge, alert }) {
  return (
    <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
      <Icon size={14} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span style={{
          background: alert ? 'var(--danger)' : 'var(--accent)',
          color: '#fff', fontSize: 9.5, fontWeight: 700,
          padding: '1px 6px', borderRadius: 100, lineHeight: '16px', flexShrink: 0,
        }}>{badge}</span>
      )}
    </NavLink>
  )
}

function SectionLabel({ text }) {
  return <p className="section-label">{text}</p>
}

function CollapsibleSection({ label, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 9,
          padding: '7px 10px', borderRadius: 'var(--r-md)',
          fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none',
          cursor: 'pointer', transition: 'background .18s, color .18s', marginBottom: 2,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--ivory)'; e.currentTarget.style.color = 'var(--charcoal)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--muted)' }}
      >
        <Icon size={14} />
        <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
      </button>
      {open && (
        <div style={{ marginLeft: 10, paddingLeft: 12, borderLeft: '1px solid var(--pearl)' }}>
          {children}
        </div>
      )}
    </>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { state }        = useGlobalStore()

  const role       = user?.role
  const canApprove = CAN?.approve?.(role)
  const isOwner    = role === 'owner'
  const canErp     = CAN?.erp?.(role)
  const roleCfg    = ROLE_CONFIG[role] ?? ROLE_CONFIG.equipe
  const initials   = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`

  // Live badge counts from GlobalStore
  const pendingExpenses = state.expenses.filter(e => e.status === 'pending').length
  const overdueInvoices = state.invoices.filter(i => i.status === 'overdue').length
  const lowStockCount   = state.products.filter(p => p.stock !== null && p.min_stock !== null && p.stock <= p.min_stock).length
  const pendingReimb    = state.reimbursements.filter(r => r.status === 'approved').length

  return (
    <aside className="sidebar flex flex-col shrink-0">

      {/* ── Brand ── */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--pearl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent) 0%, #1E3A5C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(61,90,128,.30)', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6.5" width="16" height="2.5" rx="1.25" fill="white" fillOpacity="0.95"/>
              <rect x="10.75" y="9" width="2.5" height="9" rx="1.25" fill="white" fillOpacity="0.95"/>
              <path d="M8 18h8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45"/>
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>Taadbiir</p>
            <p style={{ fontSize: 11, color: 'var(--silver)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.company?.name ?? 'Entreprise'}
            </p>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, background: 'var(--cream)', border: '1px solid var(--pearl)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: roleCfg.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--slate)', letterSpacing: '.02em' }}>{roleCfg.label}</span>
        </div>
      </div>

      {/* ── New expense CTA ── */}
      {CAN?.createExpense?.(role) && (
        <div style={{ padding: '12px 14px' }}>
          <NavLink to="/app/expenses/new" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            height: 36, width: '100%', borderRadius: 'var(--r-md)',
            background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 500,
            textDecoration: 'none', boxShadow: '0 1px 4px rgba(61,90,128,.28)',
            transition: 'background .2s, transform .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <Plus size={14} /> Nouvelle dépense
          </NavLink>
        </div>
      )}

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '0 10px', overflowY: 'auto', paddingBottom: 12 }}>

        {/* PRINCIPAL */}
        <SectionLabel text="Principal" />
        <NavItem to="/app/dashboard" icon={LayoutDashboard} label="Dashboard" />

        {/* FINANCES */}
        <SectionLabel text="Finances" />
        <NavItem to="/app/expenses"      icon={FileText}   label="Dépenses" />
        {canApprove && (
          <NavItem to="/app/validation"  icon={CheckSquare} label="Validation" badge={pendingExpenses} alert={pendingExpenses > 5} />
        )}
        <NavItem to="/app/budgets"       icon={PiggyBank}  label="Budgets" />
        {isOwner && (
          <NavItem to="/app/reimbursements" icon={CreditCard} label="Remboursements" badge={pendingReimb} />
        )}
        <NavItem to="/app/incomes"       icon={TrendingUp} label="Revenus" />
        <NavItem to="/app/reports"       icon={BarChart2}  label="Rapports" />

        {/* VENTES */}
        {canErp && (
          <>
            <SectionLabel text="Ventes" />
            <NavItem to="/app/customers" icon={Building2}  label="Clients" />
            <NavItem to="/app/quotes"    icon={Receipt}    label="Devis & Factures"
              badge={overdueInvoices > 0 ? overdueInvoices : 0} alert={overdueInvoices > 0} />
          </>
        )}

        {/* ACHATS & STOCK */}
        {canErp && (
          <>
            <SectionLabel text="Achats & Stock" />
            <NavItem to="/app/suppliers" icon={Truck}    label="Fournisseurs" />
            <NavItem to="/app/stock"     icon={Package}  label="Stock & Produits"
              badge={lowStockCount > 0 ? lowStockCount : 0} alert={lowStockCount > 0} />
          </>
        )}

        {/* COMPTABILITÉ */}
        {isOwner && (
          <>
            <SectionLabel text="Comptabilité" />
            <CollapsibleSection label="Comptabilité" icon={BookOpen} defaultOpen={false}>
              <NavItem to="/app/accounting"          icon={LayoutDashboard} label="Vue d'ensemble" />
              <NavItem to="/app/accounting/journal"  icon={BookOpen}        label="Journal" />
              <NavItem to="/app/accounting/ledger"   icon={BookOpen}        label="Grand Livre" />
              <NavItem to="/app/accounting/balance"  icon={Scale}           label="Balance" />
              <NavItem to="/app/accounting/bilan"    icon={Landmark}        label="Bilan" />
              <NavItem to="/app/accounting/cpc"      icon={TrendingUp}      label="CPC" />
              <NavItem to="/app/accounting/invoices" icon={ReceiptText}     label="Factures" />
              <NavItem to="/app/accounting/taxes"    icon={Receipt}         label="TVA" />
              <NavItem to="/app/accounting/payments" icon={Wallet}          label="Paiements" />
            </CollapsibleSection>
          </>
        )}

        {/* ADMINISTRATION */}
        {isOwner && (
          <>
            <SectionLabel text="Administration" />
            <NavItem to="/app/users"      icon={Users}    label="Utilisateurs" />
            <NavItem to="/app/categories" icon={Tag}      label="Catégories" />
            <NavItem to="/app/settings"   icon={Settings} label="Paramètres" />
          </>
        )}
        {/* ===== ESPACE ÉQUIPE (VISIBLE SEULEMENT POUR equipe) ===== */}
{role === 'equipe' && (
  <>
    <SectionLabel text="Espace Équipe" />

    <NavItem to="/app/equipe/dashboard" icon={LayoutDashboard} label="Dashboard équipe" />

    <NavItem to="/app/equipe/timeline" icon={FileText} label="Suivi des dépenses" />

    <NavItem to="/app/equipe/reimbursements" icon={CreditCard} label="Mes remboursements" />

    <NavItem to="/app/equipe/templates" icon={Tag} label="Modèles" />

    <NavItem to="/app/equipe/missions" icon={Truck} label="Mes missions" />
<NavItem to="/app/equipe/resume-mensuel" icon={BarChart2} label="Résumé mensuel" />
    {/* <NavItem to="/app/equipe/summary" icon={BarChart2} label="Résumé mensuel" /> */}

    {/* <NavItem 
      to="/app/equipe/budget-alerts" 
      icon={AlertTriangle} 
      label="Alertes budget"
    /> */}
    <NavItem to="/app/equipe/alertes-budget" icon={AlertTriangle} label="Alertes budget" />
  </>
)}
        {/* COMPTE */}
        <SectionLabel text="Compte" />
        <NavItem to="/app/profile" icon={User} label="Mon profil" />
        <NavLink
          to="/app/subscription"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Crown size={14} /> Abonnement
          </span>
          <TrialPill />
        </NavLink>
      </nav>

      {/* ── User card ── */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--pearl)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 'var(--r-md)', cursor: 'default',
          transition: 'background .18s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--ivory)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontSize: 10.5, fontWeight: 600, flexShrink: 0,
          }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.first_name} {user?.last_name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--silver)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.team?.name ?? '—'}
            </p>
          </div>
          <button
            onClick={logout}
            title="Déconnexion"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--silver)', padding: 4, borderRadius: 6, transition: 'color .18s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--silver)'}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

