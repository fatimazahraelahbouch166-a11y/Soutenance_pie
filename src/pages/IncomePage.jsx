import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import InsightsCard   from '../components/income/InsightsCard'
import CashFlowChart  from '../components/income/CashFlowChart'
import SimulationPanel from '../components/income/SimulationPanel'
import UserScore       from '../components/income/UserScore'
import { TagsInput, CategoryManager, ExportButton, NotificationBell } from '../components/income/IncomeComponents'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts'
import api from '../lib/api'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import { fmt, fmtDate } from '../lib/helpers'
import {
  Plus, TrendingUp, TrendingDown, Search, Filter, X,
  CheckCircle, AlertTriangle, Target, Repeat, Calendar,
  ChevronDown, ChevronUp, Pencil, Trash2, ArrowDownToLine,
  Wallet, DollarSign, BarChart2, Zap, Sparkles, Clock,
  ChevronsUp, ChevronsDown, Minus, ArrowRight, Settings, Tag, Users, Hash
} from 'lucide-react'

// ═══════════════════════════════════════════════════════
//  DESIGN SYSTEM — premium palette
// ═══════════════════════════════════════════════════════
const D = {
  // Brand
  primary:      '#284E7B',
  primary600:   '#1e3d60',
  primary400:   '#3d6fa3',
  secondary:    '#659ABD',
  light:        '#ADD4F3',
  bg:           '#EFF3F5',
  neutral:      '#8F908D',

  // Semantic
  green:        '#16a34a',
  greenBg:      '#f0fdf4',
  greenBorder:  '#bbf7d0',
  greenDark:    '#14532d',

  amber:        '#d97706',
  amberBg:      '#fffbeb',
  amberBorder:  '#fde68a',

  red:          '#dc2626',
  redBg:        '#fef2f2',
  redBorder:    '#fecaca',

  // Neutrals
  white:        '#ffffff',
  gray50:       '#f9fafb',
  gray100:      '#f3f4f6',
  gray200:      '#e5e7eb',
  gray300:      '#d1d5db',
  gray400:      '#9ca3af',
  gray500:      '#6b7280',
  gray600:      '#4b5563',
  gray700:      '#374151',
  gray800:      '#1f2937',
  gray900:      '#111827',

  // Shadows
  shadowSm:   '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd:   '0 4px 12px rgba(40,78,123,0.10), 0 1px 3px rgba(0,0,0,0.06)',
  shadowLg:   '0 8px 24px rgba(40,78,123,0.14), 0 2px 8px rgba(0,0,0,0.08)',
  shadowXl:   '0 16px 40px rgba(40,78,123,0.18), 0 4px 12px rgba(0,0,0,0.10)',
}

const SOURCES = [
  { id:'salary',     label:'Salaire',       color:'#284E7B', bg:'#EFF3F5' },
  { id:'freelance',  label:'Freelance',     color:'#16a34a', bg:'#f0fdf4' },
  { id:'business',   label:'Business',      color:'#d97706', bg:'#fffbeb' },
  { id:'investment', label:'Investissement',color:'#7c3aed', bg:'#f5f3ff' },
  { id:'rental',     label:'Location',      color:'#0891b2', bg:'#ecfeff' },
  { id:'other',      label:'Autre',         color:'#8F908D', bg:'#f3f4f6' },
]
const SOURCE_MAP = Object.fromEntries(SOURCES.map(s => [s.id, s]))

const EMPTY_FORM = {
  amount:'', date:new Date().toISOString().slice(0,10),
  source:'salary', category:'fixed', status:'planned',
  description:'', is_recurring:false, recurrence:'monthly',
  client_name:'', tags:[], notes:'', category_id:'',
}

// Sparkline data (mini)
const SPARKLINES = {
  thisMonth:  [18200, 22400, 19800, 25100, 28600, 35700],
  planned:    [21000, 24000, 22500, 28000, 32000, 29000],
  ytd:        [22500, 28200, 35700, 0, 0, 0],
  goal:       [60, 72, 85, 78, 91, 119],
}

// ═══════════════════════════════════════════════════════
//  ATOMS
// ═══════════════════════════════════════════════════════

const css = {
  card: {
    background: D.white,
    borderRadius: 16,
    border: `1px solid ${D.gray200}`,
    boxShadow: D.shadowSm,
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },
  inp: {
    width: '100%', padding: '9px 12px',
    borderRadius: 10, fontSize: 13,
    border: `1.5px solid ${D.gray200}`,
    background: D.white, color: D.gray800,
    outline: 'none', fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'border-color 0.15s',
  },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '9px 16px', borderRadius: 10, fontSize: 13,
    fontWeight: 500, cursor: 'pointer', border: 'none',
    transition: 'all 0.15s ease', fontFamily: 'Inter, system-ui, sans-serif',
  },
}

// Mini Sparkline SVG
const Sparkline = ({ data = [], color = D.primary, height = 32 }) => {
  if (!data.length) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 72, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  const path = `M ${pts.join(' L ')}`
  const area = `M ${pts[0]} L ${pts.join(' L ')} L ${w},${h} L 0,${h} Z`
  return (
    <svg width={w} height={h} style={{ display:'block' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.15} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#','')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1].split(',')[0]} cy={pts[pts.length-1].split(',')[1]}
        r={2.5} fill={color} />
    </svg>
  )
}

// KPI Card premium
const KpiCard = ({ label, value, sub, trend, icon: Icon, color = D.primary, sparkData, index = 0 }) => {
  const [hov, setHov] = useState(false)
  const trendUp   = trend === 'up'
  const trendDown = trend === 'down'
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...css.card,
        padding: '20px 20px 16px',
        boxShadow: hov ? D.shadowLg : D.shadowSm,
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Top row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{
          width:36, height:36, borderRadius:10,
          background: `linear-gradient(135deg, ${color}18 0%, ${color}30 100%)`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {Icon && <Icon size={16} style={{ color }} />}
        </div>
        <Sparkline data={sparkData} color={color} />
      </div>
      {/* Value */}
      <p style={{ fontSize:11, fontWeight:600, color:D.gray400, letterSpacing:'0.06em',
        textTransform:'uppercase', marginBottom:4 }}>{label}</p>
      <p style={{ fontSize:26, fontWeight:700, color:D.gray900, letterSpacing:'-0.03em',
        lineHeight:1, marginBottom:8, fontVariantNumeric:'tabular-nums',
        fontFamily:'Inter, system-ui, sans-serif' }}>{value}</p>
      {/* Trend */}
      {sub && (
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:3,
            padding:'2px 7px', borderRadius:20, fontSize:11, fontWeight:600,
            background: trendUp ? '#fef2f2' : trendDown ? '#f0fdf4' : D.gray100,
            color: trendUp ? D.red : trendDown ? D.green : D.gray500,
          }}>
            {trendUp   && <ChevronsUp  size={10} />}
            {trendDown && <ChevronsDown size={10} />}
            {!trendUp && !trendDown && <Minus size={9} />}
            {sub}
          </span>
        </div>
      )}
    </div>
  )
}

// Custom chart tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:D.white, border:`1px solid ${D.gray200}`, borderRadius:12,
      padding:'10px 14px', boxShadow:D.shadowLg, minWidth:140 }}>
      <p style={{ fontSize:11, color:D.gray400, marginBottom:8, fontWeight:600,
        textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:i < payload.length-1 ? 4 : 0 }}>
          <span style={{ width:8, height:8, borderRadius:2, background:p.fill||p.stroke, flexShrink:0 }} />
          <span style={{ fontSize:12, color:D.gray500, flex:1 }}>{p.name}</span>
          <span style={{ fontSize:13, fontWeight:700, color:D.gray800, fontVariantNumeric:'tabular-nums' }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

// Section card wrapper
const Card = ({ title, subtitle, badge, action, children, style, noPad }) => (
  <div style={{ ...css.card, overflow:'hidden', ...style }}>
    {(title || action) && (
      <div style={{ padding: noPad ? '20px 20px 0' : '20px 20px 0',
        display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <p style={{ fontSize:14, fontWeight:600, color:D.gray800 }}>{title}</p>
            {badge}
          </div>
          {subtitle && <p style={{ fontSize:12, color:D.gray400, marginTop:3 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    <div style={{ padding: noPad ? '0' : '0 20px 20px' }}>{children}</div>
  </div>
)

// Priority badge for alerts
const PriorityBadge = ({ days }) => {
  const cfg = days > 7
    ? { label:'Urgent',    bg:D.redBg,   color:D.red,   border:D.redBorder }
    : days > 0
    ? { label:'En retard', bg:D.amberBg, color:D.amber, border:D.amberBorder }
    : { label:'Dû',        bg:'#fffbeb', color:'#92400e', border:'#fde68a' }
  return (
    <span style={{ padding:'3px 9px', borderRadius:20, fontSize:10.5, fontWeight:700,
      background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, letterSpacing:'0.02em' }}>
      {cfg.label}
    </span>
  )
}

// Status badge
const StatusBadge = ({ status }) => {
  const cfgMap = {
    received: { label:'Reçu',      bg:D.greenBg,  color:D.green, border:D.greenBorder },
    planned:  { label:'Prévu',     bg:D.amberBg,  color:D.amber, border:D.amberBorder },
    overdue:  { label:'En retard', bg:D.redBg,    color:D.red,   border:D.redBorder },
  }
  const cfg = cfgMap[status] || cfgMap.planned
  return (
    <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600,
      background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  )
}

// Source chip
const SourceChip = ({ source }) => {
  const s = SOURCE_MAP[source] ?? SOURCE_MAP.other
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6,
      padding:'3px 9px', borderRadius:8, background:s.bg, border:`1px solid ${s.color}22` }}>
      <span style={{ width:6, height:6, borderRadius:2, background:s.color, flexShrink:0 }} />
      <span style={{ fontSize:11.5, color:s.color, fontWeight:600 }}>{s.label}</span>
    </div>
  )
}

// Field wrapper
const Field = ({ label, required, children }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
    <label style={{ fontSize:12.5, fontWeight:600, color:D.gray600 }}>
      {label}{required && <span style={{ color:D.red, marginLeft:2 }}>*</span>}
    </label>
    {children}
  </div>
)

// Animated goal gauge (modern arc)
const GoalGauge = ({ pct, goal, actual }) => {
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(Math.min(pct, 100)), 100)
    return () => clearTimeout(t)
  }, [pct])

  const capped = animated
  const color  = pct >= 100 ? D.green : pct >= 70 ? D.amber : D.primary
  const glow   = pct >= 100 ? '#16a34a' : pct >= 70 ? '#d97706' : '#284E7B'
  // Arc math: semicircle from left to right, r=70
  const R   = 70
  const cx  = 100, cy = 95
  const arc = (pct) => {
    const angle = Math.PI * (pct / 100)
    const x = cx - R * Math.cos(angle)
    const y = cy - R * Math.sin(angle)
    return `M ${cx - R} ${cy} A ${R} ${R} 0 ${pct > 50 ? 1 : 0} 1 ${x} ${y}`
  }
  const trackLen  = Math.PI * R  // ≈ 219.9
  const fillLen   = (capped / 100) * trackLen

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ position:'relative', width:200, height:110 }}>
        <svg viewBox="0 0 200 110" style={{ width:200, height:110, overflow:'visible' }}>
          {/* Track */}
          <path d={`M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`}
            fill="none" stroke={D.gray100} strokeWidth={14} strokeLinecap="round" />
          {/* Fill */}
          <path d={`M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`}
            fill="none" stroke={color} strokeWidth={14} strokeLinecap="round"
            strokeDasharray={`${fillLen} ${trackLen}`}
            style={{ transition:'stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          {/* Glow dot at end */}
          {capped > 2 && capped < 98 && (() => {
            const a = Math.PI * (capped / 100)
            const ex = cx - R * Math.cos(a)
            const ey = cy - R * Math.sin(a)
            return <circle cx={ex} cy={ey} r={6} fill={color}
              style={{ filter:`drop-shadow(0 0 4px ${glow}60)` }} />
          })()}
          {/* Center text */}
          <text x={cx} y={cy - 8} textAnchor="middle"
            style={{ fontSize:28, fontWeight:800, fill:D.gray800,
              fontFamily:'Inter, system-ui, sans-serif', fontVariantNumeric:'tabular-nums' }}>
            {pct}%
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle"
            style={{ fontSize:11, fill:D.gray400, fontFamily:'Inter, system-ui, sans-serif' }}>
            {pct >= 100 ? 'Objectif atteint' : 'de l\'objectif'}
          </text>
        </svg>
      </div>
      {/* Bar detail */}
      <div style={{ width:'100%', padding:'12px 16px',
        background:`linear-gradient(135deg, ${D.bg} 0%, ${D.white} 100%)`,
        borderRadius:12, border:`1px solid ${D.gray200}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:11, color:D.gray500 }}>Réalisé</span>
          <span style={{ fontSize:12, fontWeight:700, color:D.gray800, fontVariantNumeric:'tabular-nums' }}>
            {fmt(actual)}
          </span>
        </div>
        <div style={{ height:6, background:D.gray100, borderRadius:10, overflow:'hidden', marginBottom:6 }}>
          <div style={{
            height:'100%', width:`${Math.min(pct, 100)}%`, borderRadius:10,
            background:`linear-gradient(90deg, ${D.primary} 0%, ${D.secondary} 100%)`,
            transition:'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontSize:11, color:D.gray400 }}>Objectif: {fmt(goal)}</span>
          <span style={{ fontSize:11, fontWeight:600,
            color: pct >= 100 ? D.green : D.primary }}>
            {pct >= 100
              ? `🎉 +${fmt(actual - goal)}`
              : `Reste ${fmt(Math.max(0, goal - actual))}`}
          </span>
        </div>
      </div>
    </div>
  )
}

// Skeleton loader
const Skeleton = ({ w = '100%', h = 16, r = 8 }) => (
  <div style={{
    width:w, height:h, borderRadius:r,
    background:`linear-gradient(90deg, ${D.gray100} 0%, ${D.gray200} 50%, ${D.gray100} 100%)`,
    backgroundSize:'200% 100%',
    animation:'shimmer 1.5s infinite',
  }}>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
)

// ═══════════════════════════════════════════════════════
//  PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════
export default function IncomePage() {
  const { user } = useAuth()
  const toast = useToast()

  const [stats,   setStats]   = useState(null)
  const [incomes, setIncomes] = useState([])
  const [meta,    setMeta]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('all')
  const [page,    setPage]    = useState(1)
  const [search,  setSearch]  = useState('')
  const [filters, setFilters] = useState({ source:'', category:'', from:'', to:'' })
  const [showFilters, setShowFilters] = useState(false)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [goalModal,   setGoalModal]   = useState(false)
  const [deleteId,    setDeleteId]    = useState(null)
  const [editing,     setEditing]     = useState(null)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [goalForm,    setGoalForm]    = useState({ monthly_target:'' })
  const [saving,      setSaving]      = useState(false)
  const [hoverSrc,    setHoverSrc]    = useState(null)
  const [sortCol,     setSortCol]     = useState('date')
  const [sortDir,     setSortDir]     = useState('desc')
  const [hovRow,      setHovRow]      = useState(null)
  const [chartPeriod, setChartPeriod] = useState('monthly')
  const [categories,  setCategories]  = useState([])
  const [insights,    setInsights]    = useState([])
  const [notifications, setNotifs]   = useState([])
  const [catModal,    setCatModal]    = useState(false)
  const [activeTag,   setActiveTag]   = useState('')
  const [cashflow,    setCashflow]    = useState([])
  const [accounts,    setAccounts]    = useState([])
  const [schedule,    setSchedule]    = useState([])
  const [activeView,  setActiveView]  = useState('dashboard')  // dashboard | cashflow | simulation | score
  const [activeAccount, setActiveAccount] = useState(null)
  const [successId,   setSuccessId]   = useState(null)

  const setF  = (k,v) => setFilters(f=>({...f,[k]:v}))
  const setFm = (k,v) => setForm(f=>({...f,[k]:v}))

  const loadStats   = useCallback(async () => {
    const [statsR, catsR, insightsR, cfR, accR] = await Promise.all([
      api.get('/incomes/stats'),
      api.get('/incomes/categories'),
      api.get('/incomes/insights'),
      api.get('/incomes/cashflow'),
      api.get('/incomes/accounts'),
    ])
    setStats(statsR.data)
    setCategories(catsR.data || [])
    setInsights(insightsR.data || [])
    setCashflow(cfR.data || [])
    setAccounts(accR.data || [])
    // Recurring schedule
    const stats_data = statsR.data
    const { MOCK_INCOMES: mi, generateRecurringSchedule: grs } = await import('../lib/mockData.js').catch(() => ({}))
    if (mi && grs) {
      const sched = mi.filter(i => i.is_recurring).flatMap(i => grs(i, 3))
      setSchedule(sched)
    }
  }, [])
  const loadIncomes = useCallback(() => {
    const params = { page, status:tab==='all'?'':tab, source:filters.source, tag:activeTag,
      category:filters.category, from:filters.from, to:filters.to, search }
    return api.get('/incomes',{params}).then(r => { setIncomes(r.data.data??r.data); setMeta(r.data.meta) })
  }, [tab,page,search,filters,activeTag])

  useEffect(() => {
    setLoading(true)
    Promise.all([loadStats(), loadIncomes()]).finally(() => setLoading(false))
  }, [loadStats, loadIncomes])

  const sorted = useMemo(() => [...incomes].sort((a,b) => {
    let va=a[sortCol],vb=b[sortCol]
    if (sortCol==='amount'){va=+va;vb=+vb}
    return (va<vb?-1:va>vb?1:0)*(sortDir==='asc'?1:-1)
  }), [incomes,sortCol,sortDir])

  const toggleSort = col => {
    if (sortCol===col) setSortDir(d=>d==='asc'?'desc':'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit   = inc => {
    setEditing(inc)
    setForm({ amount:inc.amount, date:inc.date, source:inc.source, category:inc.category,
      status:inc.status, description:inc.description, is_recurring:inc.is_recurring,
      recurrence:inc.recurrence||'monthly' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.amount||!form.date||!form.description.trim())
      return toast.error('Champs requis','Montant, date et description sont obligatoires.')
    setSaving(true)
    try {
      if (editing) { await api.put(`/incomes/${editing.id}`,form); toast.success('Modifié','Revenu mis à jour.') }
      else         { await api.post('/incomes',form); toast.success('Ajouté',`${fmt(+form.amount)} enregistré.`) }
      setModalOpen(false); loadStats(); loadIncomes()
    } catch { toast.error('Erreur','Impossible de sauvegarder.') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/incomes/${deleteId}`); toast.success('Supprimé','Revenu supprimé.'); setDeleteId(null); loadStats(); loadIncomes() }
    catch { toast.error('Erreur','Impossible de supprimer.') }
  }

  const handleMarkReceived = async id => {
    setSuccessId(id)
    await api.post(`/incomes/${id}/receive`)
    toast.success('✓ Reçu','Statut mis à jour.')
    setTimeout(() => { setSuccessId(null); loadStats(); loadIncomes() }, 800)
  }



  const handleSaveGoal = async () => {
    if (!goalForm.monthly_target) return toast.error('Erreur','Objectif requis.')
    setSaving(true)
    try {
      await api.post('/incomes/goal',{ monthly_target:+goalForm.monthly_target, yearly_target:+goalForm.monthly_target*12 })
      toast.success('Objectif mis à jour',`Cible : ${fmt(+goalForm.monthly_target)}/mois`)
      setGoalModal(false); loadStats()
    } catch { toast.error('Erreur','Impossible de sauvegarder.') }
    finally { setSaving(false) }
  }

  // ── Category CRUD ──────────────────────────────────────
  const handleCreateCat = async (data) => {
    await api.post('/incomes/categories', data)
    const r = await api.get('/incomes/categories'); setCategories(r.data || [])
    toast.success('Catégorie créée', data.name)
  }
  const handleUpdateCat = async (id, data) => {
    await api.put(`/incomes/categories/${id}`, data)
    const r = await api.get('/incomes/categories'); setCategories(r.data || [])
  }
  const handleDeleteCat = async (id) => {
    await api.delete(`/incomes/categories/${id}`)
    const r = await api.get('/incomes/categories'); setCategories(r.data || [])
  }

  const activeFilters = Object.values(filters).filter(Boolean).length + (activeTag ? 1 : 0)

  // ── Loading state ────────────────────────────────────
  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, fontFamily:'Inter, system-ui, sans-serif' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
        {[...Array(4)].map((_,i) => (
          <div key={i} style={{ ...css.card, padding:20 }}>
            <Skeleton h={36} w={36} r={10} /><br/>
            <Skeleton h={12} w="60%" /><br/>
            <Skeleton h={28} w="80%" /><br/>
            <Skeleton h={22} w="50%" r={20} />
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:14 }}>
        <div style={{ ...css.card, padding:20, height:300 }}><Skeleton h="100%" r={12} /></div>
        <div style={{ ...css.card, padding:20, height:300 }}><Skeleton h="100%" r={12} /></div>
      </div>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20,
      fontFamily:'Inter, system-ui, sans-serif', color:D.gray800 }}>

      <style>{`
        .inc-row:hover { background: ${D.bg} !important; }
        .inc-btn:hover { transform:scale(1.08); box-shadow:${D.shadowMd}; }
        .inc-tab:hover { background: ${D.gray100}; }
        input:focus, select:focus { border-color: ${D.primary} !important; box-shadow:0 0 0 3px ${D.primary}20; }
        .recv-btn:hover { background: ${D.green} !important; color:#fff !important; }
        .goal-btn:hover { background:${D.primary} !important; color:#fff !important; }
        .primary-btn:hover { background:${D.primary600} !important; transform:scale(1.01); }
        .ghost-btn:hover { background:${D.gray100} !important; }
        .filter-btn:hover { border-color:${D.primary} !important; }
        .kpi-edit:hover { text-decoration:underline; }
        @keyframes bounceIn { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeSlide 0.3s ease forwards; }
      `}</style>

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <div className="fade-in" style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10,
              background:`linear-gradient(135deg, ${D.primary} 0%, ${D.secondary} 100%)`,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <TrendingUp size={16} style={{ color:'#fff' }} />
            </div>
            <h1 style={{ fontSize:22, fontWeight:700, color:D.gray900, letterSpacing:'-0.03em' }}>
              Revenus
            </h1>
          </div>
          <p style={{ fontSize:13, color:D.gray400, marginTop:3, marginLeft:42 }}>
            Analysez et anticipez vos entrées financières
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="ghost-btn"
            onClick={() => setCatModal(true)}
            style={{ ...css.btn, background:D.white, color:D.gray600, border:`1.5px solid ${D.gray200}` }}>
            <Settings size={14} /> Catégories
          </button>
          <button className="ghost-btn"
            onClick={() => { setGoalForm({ monthly_target:stats?.goal?.monthly_target||'' }); setGoalModal(true) }}
            style={{ ...css.btn, background:D.white, color:D.gray600, border:`1.5px solid ${D.gray200}` }}>
            <Target size={14} /> Objectif
          </button>
          <ExportButton data={sorted} totalRows={sorted.length} />
          <button className="primary-btn"
            onClick={openCreate}
            style={{ ...css.btn, background:D.primary, color:'#fff',
              boxShadow:`0 4px 14px ${D.primary}40` }}>
            <Plus size={14} /> Ajouter un revenu
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          NAV TABS + ACCOUNT SWITCHER
      ══════════════════════════════════════════ */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        {/* View tabs */}
        <div style={{ display:'flex', background:'#f3f4f6', borderRadius:12, padding:4, gap:3 }}>
          {[
            { key:'dashboard',  label:'Vue générale' },
            { key:'cashflow',   label:'Cash Flow'    },
            { key:'simulation', label:'Simulateur'   },
            { key:'score',      label:'Mon score'    },
          ].map(v => (
            <button key={v.key} onClick={() => setActiveView(v.key)}
              style={{ padding:'7px 16px', borderRadius:9, border:'none', fontSize:13,
                fontWeight: activeView===v.key ? 600 : 400, cursor:'pointer',
                background: activeView===v.key ? '#fff' : 'transparent',
                color:      activeView===v.key ? '#1f2937' : '#9ca3af',
                boxShadow:  activeView===v.key ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                transition:'all .15s', whiteSpace:'nowrap',
              }}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Account switcher */}
        {accounts.length > 0 && (
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => setActiveAccount(null)}
              style={{ padding:'6px 12px', borderRadius:8, border:`1.5px solid ${!activeAccount?'#284E7B':'#e5e7eb'}`,
                background: !activeAccount ? '#EFF3F5' : '#fff', color: !activeAccount ? '#284E7B' : '#6b7280',
                fontSize:12, fontWeight:500, cursor:'pointer', transition:'all .15s' }}>
              Tous
            </button>
            {accounts.map(acc => (
              <button key={acc.id} onClick={() => setActiveAccount(acc.id)}
                style={{ padding:'6px 12px', borderRadius:8, border:`1.5px solid ${activeAccount===acc.id?acc.color:'#e5e7eb'}`,
                  background: activeAccount===acc.id ? `${acc.color}12` : '#fff',
                  color: activeAccount===acc.id ? acc.color : '#6b7280',
                  fontSize:12, fontWeight:500, cursor:'pointer', transition:'all .15s' }}>
                {acc.icon} {acc.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          KPI CARDS
      ══════════════════════════════════════════ */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          <KpiCard label="Reçu ce mois" value={fmt(stats.totalThisMonth)}
            sub={`${stats.deltaMonth>=0?'+':''}${stats.deltaMonth}% vs mois dernier`}
            trend={stats.deltaMonth>=0?'up':'down'}
            icon={DollarSign} color={D.green} sparkData={SPARKLINES.thisMonth} index={0} />
          <KpiCard label="Prévu ce mois" value={fmt(stats.totalPlanned)}
            sub={`${stats.planned?.length??0} revenu${(stats.planned?.length??0)>1?'s':''} attendu${(stats.planned?.length??0)>1?'s':''}`}
            icon={Calendar} color={D.primary} sparkData={SPARKLINES.planned} index={1} />
          <KpiCard label="Total YTD" value={fmt(stats.totalYTD)}
            sub="Jan → Mar 2025"
            icon={BarChart2} color="#7c3aed" sparkData={SPARKLINES.ytd} index={2} />
          <KpiCard label="Objectif mensuel" value={`${stats.goalProgress}%`}
            sub={stats.goalProgress>=100?'Objectif atteint ✓':`${fmt((stats.goal?.monthly_target||0)-stats.totalThisMonth)} restant`}
            trend={stats.goalProgress>=100?'down':undefined}
            icon={Target} color={D.amber} sparkData={SPARKLINES.goal} index={3} />
        </div>
      )}

      {/* ══════════════════════════════════════════
          INSIGHTS
      ══════════════════════════════════════════ */}
      {insights.length > 0 && (
        <InsightsCard stats={stats} insights={insights} onAction={() => {}} />
      )}

      {/* ══════════════════════════════════════════
          ALERTES PRIORITAIRES
      ══════════════════════════════════════════ */}
      {stats?.alerts?.length > 0 && (
        <div className="fade-in" style={{ ...css.card, overflow:'hidden' }}>
          {/* Header */}
          <div style={{ padding:'14px 20px', background:`linear-gradient(135deg, ${D.redBg} 0%, #fff8f8 100%)`,
            borderBottom:`1px solid ${D.redBorder}`, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:D.redBg,
              border:`1px solid ${D.redBorder}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <AlertTriangle size={13} style={{ color:D.red }} />
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:D.red }}>
                {stats.alerts.length} revenu{stats.alerts.length>1?'s':''} en attente de confirmation
              </p>
              <p style={{ fontSize:11, color:'#ef4444' }}>Vérifiez et confirmez la réception</p>
            </div>
          </div>
          {/* Rows */}
          <div style={{ padding:'8px 0' }}>
            {stats.alerts.map((a, i) => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12,
                padding:'10px 20px', borderBottom: i<stats.alerts.length-1 ? `1px solid ${D.gray100}` : 'none',
                transition:'background 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.background=D.gray50}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                {/* Priority dot */}
                <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0,
                  background: a.days_overdue>7?D.red:a.days_overdue>0?D.amber:'#eab308',
                  boxShadow: `0 0 0 3px ${a.days_overdue>7?D.redBg:a.days_overdue>0?D.amberBg:'#fefce8'}` }} />
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:D.gray800, overflow:'hidden',
                    textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.description}</p>
                  <p style={{ fontSize:11, color:D.gray400, marginTop:1 }}>
                    Attendu le {fmtDate(a.date)}
                  </p>
                </div>
                {/* Delay indicator */}
                <PriorityBadge days={a.days_overdue} />
                <span style={{ fontSize:11, color:D.gray400, whiteSpace:'nowrap' }}>
                  {a.days_overdue > 0 ? `${a.days_overdue}j de retard` : 'Dû aujourd\'hui'}
                </span>
                {/* Amount */}
                <span style={{ fontSize:14, fontWeight:700, color:D.gray800,
                  fontVariantNumeric:'tabular-nums', minWidth:80, textAlign:'right' }}>
                  {fmt(a.amount)}
                </span>
                {/* Action */}
                <button className="recv-btn"
                  onClick={() => handleMarkReceived(a.id)}
                  style={{ ...css.btn,
                    background: successId===a.id ? D.green : D.greenBg,
                    color: successId===a.id ? '#fff' : D.green,
                    border:`1.5px solid ${D.greenBorder}`,
                    padding:'6px 12px', fontSize:12, transition:'all 0.2s',
                    animation: successId===a.id ? 'bounceIn 0.4s ease' : 'none',
                  }}>
                  {successId===a.id
                    ? <CheckCircle size={13} />
                    : <><ArrowDownToLine size={12}/> Marquer reçu</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          CASHFLOW VIEW
      ══════════════════════════════════════════ */}
      {activeView === 'cashflow' && cashflow.length > 0 && (
        <CashFlowChart data={cashflow} />
      )}

      {/* SIMULATION VIEW */}
      {activeView === 'simulation' && stats && (
        <SimulationPanel
          currentTotal={stats.totalThisMonth || 0}
          goal={stats.goal?.monthly_target || 30000}
          monthlyData={stats.monthly || []}
        />
      )}

      {/* SCORE VIEW */}
      {activeView === 'score' && stats && (
        <UserScore stats={stats} />
      )}

      {/* DASHBOARD VIEW — show existing content */}
      {activeView === 'dashboard' && <>

      {/* ══════════════════════════════════════════
          ROW 1 : CHART MENSUEL + OBJECTIF
      ══════════════════════════════════════════ */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:14 }}>

          {/* Chart mensuel */}
          <Card title="Revenus mensuels" subtitle="Reçu vs Prévu sur 6 mois"
            action={
              <div style={{ display:'flex', background:D.gray100, borderRadius:8, padding:3, gap:2 }}>
                {['monthly','yearly'].map(p => (
                  <button key={p} className="inc-tab"
                    onClick={()=>setChartPeriod(p)}
                    style={{ padding:'4px 12px', borderRadius:6, border:'none', fontSize:11.5, cursor:'pointer',
                      fontWeight:chartPeriod===p?600:400,
                      background:chartPeriod===p?D.white:'transparent',
                      color:chartPeriod===p?D.gray800:D.gray400,
                      boxShadow:chartPeriod===p?D.shadowSm:'none',
                      transition:'all .15s' }}>
                    {p==='monthly'?'Mensuel':'Annuel'}
                  </button>
                ))}
              </div>
            }>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.monthly} margin={{top:4,right:4,bottom:0,left:-16}} barGap={4} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="2 8" stroke={D.gray100} vertical={false} />
                <XAxis dataKey="month" tick={{fontSize:11,fill:D.gray400,fontFamily:'Inter'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize:11,fill:D.gray400,fontFamily:'Inter'}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{fill:`${D.primary}08`}} />
                <Bar dataKey="planned"  name="Prévu"  fill={D.light}    radius={[6,6,0,0]} maxBarSize={22} />
                <Bar dataKey="received" name="Reçu"   fill={D.primary}  radius={[6,6,0,0]} maxBarSize={22} />
                {stats.goal?.monthly_target && (
                  <ReferenceLine y={stats.goal.monthly_target} stroke={D.amber}
                    strokeDasharray="5 3" strokeWidth={1.5}
                    label={{value:'Objectif',position:'insideTopRight',fontSize:10,fill:D.amber,fontWeight:600}} />
                )}
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div style={{ display:'flex', gap:20, paddingTop:12, borderTop:`1px solid ${D.gray100}`, marginTop:4 }}>
              {[
                {label:'Prévu',    color:D.light,   shape:'square'},
                {label:'Reçu',    color:D.primary, shape:'square'},
                {label:'Objectif',color:D.amber,   shape:'dash'},
              ].map(l=>(
                <div key={l.label} style={{display:'flex',alignItems:'center',gap:6}}>
                  {l.shape==='dash'
                    ? <div style={{width:16,height:2,background:D.amber,borderRadius:1,borderTop:`2px dashed ${D.amber}`}}/>
                    : <span style={{width:10,height:10,borderRadius:3,background:l.color,display:'block'}}/>}
                  <span style={{fontSize:11.5,color:D.gray500}}>{l.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Objectif gauge */}
          <Card title="Objectif du mois"
            subtitle={`Cible : ${fmt(stats.goal?.monthly_target??0)}`}
            action={
              <button className="kpi-edit"
                onClick={()=>{ setGoalForm({monthly_target:stats.goal?.monthly_target||''}); setGoalModal(true) }}
                style={{ fontSize:11.5, color:D.primary, background:'none', border:'none',
                  cursor:'pointer', fontWeight:600, padding:'4px 8px', borderRadius:6 }}>
                Modifier
              </button>
            }>
            <GoalGauge
              pct={stats.goalProgress}
              goal={stats.goal?.monthly_target??0}
              actual={stats.totalThisMonth}
            />
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════
          ROW 2 : SOURCE DONUT + PRÉVISIONS
      ══════════════════════════════════════════ */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

          {/* Répartition source */}
          <Card title="Répartition par source" subtitle="Revenus reçus par type de revenu">
            <div style={{ display:'flex', gap:20, alignItems:'center' }}>
              {/* Donut */}
              <div style={{ flexShrink:0, position:'relative' }}>
                <ResponsiveContainer width={148} height={148}>
                  <PieChart>
                    <Pie data={stats.bySource} dataKey="total" nameKey="label"
                      innerRadius={44} outerRadius={64} paddingAngle={3} strokeWidth={0}
                      onMouseEnter={(_,i)=>setHoverSrc(i)} onMouseLeave={()=>setHoverSrc(null)}>
                      {stats.bySource.map((s,i)=>(
                        <Cell key={i} fill={s.color}
                          opacity={hoverSrc===null||hoverSrc===i?1:0.25}
                          style={{cursor:'pointer',transition:'opacity .2s'}} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div style={{ position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%,-50%)', textAlign:'center', pointerEvents:'none' }}>
                  <p style={{ fontSize:13, fontWeight:700, color:D.gray800 }}>
                    {hoverSrc!==null ? `${Math.round((stats.bySource[hoverSrc]?.total/stats.bySource.reduce((a,x)=>a+x.total,0))*100)}%` : ''}
                  </p>
                </div>
              </div>
              {/* Legend */}
              <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:8 }}>
                {stats.bySource.map((s,i)=>{
                  const total = stats.bySource.reduce((acc,x)=>acc+x.total,0)
                  const pct   = total>0?Math.round((s.total/total)*100):0
                  return (
                    <div key={i} onMouseEnter={()=>setHoverSrc(i)} onMouseLeave={()=>setHoverSrc(null)}
                      style={{ display:'flex', alignItems:'center', gap:8,
                        opacity:hoverSrc===null||hoverSrc===i?1:0.4,
                        transition:'opacity .2s', cursor:'default',
                        padding:'4px 8px', borderRadius:8,
                        background:hoverSrc===i?`${s.color}10`:'transparent' }}>
                      <span style={{width:8,height:8,borderRadius:2,background:s.color,flexShrink:0}}/>
                      <span style={{flex:1,fontSize:12,color:D.gray600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.label}</span>
                      <span style={{fontSize:11,color:D.gray400,minWidth:28}}>{pct}%</span>
                      <span style={{fontSize:12,fontWeight:700,color:D.gray800,fontVariantNumeric:'tabular-nums',minWidth:68,textAlign:'right'}}>
                        {fmt(s.total)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Prévisions IA */}
          <Card title="Prévisions"
            subtitle="Estimation basée sur l'historique"
            badge={
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:20,
                background:`linear-gradient(135deg, #7c3aed20, #7c3aed10)`,
                border:'1px solid #7c3aed30', fontSize:11, fontWeight:600, color:'#7c3aed' }}>
                <Sparkles size={10}/> IA
              </span>
            }>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {stats.forecast.map((f,i)=>{
                const trend = i===0?2:i===1?7:-3 // mock trend
                return (
                  <div key={i} style={{
                    padding:'14px 16px', borderRadius:12,
                    background:`linear-gradient(135deg, ${D.bg} 0%, ${D.white} 100%)`,
                    border:`1px solid ${D.gray200}`,
                    transition:'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow=D.shadowMd;e.currentTarget.style.transform='translateY(-1px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:32, height:32, borderRadius:8,
                          background:`linear-gradient(135deg,${D.primary}20,${D.primary}10)`,
                          display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <Calendar size={14} style={{color:D.primary}} />
                        </div>
                        <div>
                          <p style={{fontSize:13,fontWeight:700,color:D.gray800}}>{f.month} <span style={{color:D.gray400,fontWeight:400}}>2025</span></p>
                          <div style={{display:'flex',alignItems:'center',gap:4}}>
                            {trend>=0
                              ? <ChevronsUp size={10} style={{color:D.green}}/>
                              : <ChevronsDown size={10} style={{color:D.red}}/>}
                            <span style={{fontSize:10,color:trend>=0?D.green:D.red,fontWeight:600}}>
                              {trend>=0?'+':''}{trend}% vs mois dernier
                            </span>
                          </div>
                        </div>
                      </div>
                      <p style={{fontSize:17,fontWeight:800,color:D.primary,fontVariantNumeric:'tabular-nums',
                        fontFamily:'Inter, system-ui, sans-serif'}}>~{fmt(f.predicted)}</p>
                    </div>
                    {/* Confidence bar */}
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                        <span style={{fontSize:10.5,color:D.gray400,fontWeight:500}}>Indice de confiance</span>
                        <span style={{fontSize:10.5,fontWeight:700,
                          color:f.confidence>=80?D.green:f.confidence>=60?D.amber:D.red}}>
                          {f.confidence}%
                        </span>
                      </div>
                      <div style={{height:5,background:D.gray100,borderRadius:10,overflow:'hidden'}}>
                        <div style={{
                          height:'100%', width:`${f.confidence}%`, borderRadius:10,
                          background:f.confidence>=80
                            ?`linear-gradient(90deg,${D.green},#22c55e)`
                            :f.confidence>=60
                            ?`linear-gradient(90deg,${D.amber},#f59e0b)`
                            :`linear-gradient(90deg,${D.red},#f87171)`,
                          transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
                        }}/>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      </> /* end dashboard view */}

      {/* ══════════════════════════════════════════
          RECURRING SCHEDULE PREVIEW (always visible)
      ══════════════════════════════════════════ */}
      {schedule.length > 0 && (
        <div style={{
          background:'#fff', borderRadius:16, border:'1px solid #e5e7eb',
          boxShadow:'0 1px 3px rgba(0,0,0,0.06)', overflow:'hidden',
        }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f3f4f6',
            display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:8,background:'#EFF3F5',
              display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Repeat size={13} style={{color:'#284E7B'}}/>
            </div>
            <p style={{fontSize:13,fontWeight:700,color:'#1f2937'}}>Revenus récurrents à venir</p>
            <span style={{marginLeft:'auto',fontSize:11,color:'#9ca3af'}}>
              {schedule.length} occurrence{schedule.length>1?'s':''} prévue{schedule.length>1?'s':''}
            </span>
          </div>
          <div style={{padding:'8px 0'}}>
            {schedule.slice(0,4).map((s,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,
                padding:'9px 20px',borderBottom:i<3?'1px solid #f9fafb':'none'}}>
                <div style={{width:36,height:36,borderRadius:9,background:'#EFF3F5',
                  display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Repeat size={14} style={{color:'#284E7B'}}/>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:500,color:'#1f2937'}}>{s.description}</p>
                  <p style={{fontSize:11,color:'#9ca3af'}}>
                    Prochaine occurrence : {new Date(s.date).toLocaleDateString('fr-FR')}
                    {' · '}
                    <span style={{color:'#659ABD',fontWeight:500}}>
                      {s.recurrence === 'monthly' ? 'Mensuel' : s.recurrence === 'weekly' ? 'Hebdo' : 'Annuel'}
                    </span>
                  </p>
                </div>
                <span style={{fontSize:14,fontWeight:700,color:'#1f2937',
                  fontVariantNumeric:'tabular-nums'}}>{Number(s.amount).toLocaleString('fr-MA')} MAD</span>
                <span style={{padding:'3px 9px',borderRadius:20,fontSize:11,fontWeight:600,
                  background:'#fffbeb',color:'#d97706',border:'1px solid #fde68a'}}>Prévu</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          TABLE REVENUS
      ══════════════════════════════════════════ */}
      <div style={{ ...css.card, overflow:'hidden' }}>

        {/* Table header */}
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${D.gray100}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:D.gray800 }}>
                Historique des revenus
                {meta && <span style={{ fontSize:12, color:D.gray400, fontWeight:400, marginLeft:8 }}>
                  · {meta.total} entrées
                </span>}
              </p>
            </div>
            <button className="filter-btn ghost-btn"
              onClick={()=>setShowFilters(v=>!v)}
              style={{ ...css.btn, background: activeFilters>0 ? `${D.primary}12` : D.white,
                color: activeFilters>0 ? D.primary : D.gray500,
                border:`1.5px solid ${activeFilters>0 ? D.primary : D.gray200}`,
                padding:'6px 12px', fontSize:12 }}>
              <Filter size={12}/> Filtres {activeFilters>0&&`(${activeFilters})`}
            </button>
          </div>

          {/* Tag filters */}
          {(['#urgent','#client','#fixe','#variable'].map(tag => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              style={{
                display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px',
                borderRadius:20, fontSize:12, cursor:'pointer', fontWeight:600,
                border:`1.5px solid ${activeTag === tag ? D.primary : D.gray200}`,
                background: activeTag === tag ? `${D.primary}12` : D.white,
                color: activeTag === tag ? D.primary : D.gray500,
                marginRight:4, transition:'all .15s',
              }}>
              <Hash size={10}/>{tag.replace('#','')}
            </button>
          )))}
          {activeTag && (
            <button onClick={() => setActiveTag('')}
              style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'3px 8px',
                borderRadius:20, fontSize:11, cursor:'pointer', border:`1px solid ${D.gray200}`,
                background:D.white, color:D.gray400 }}>
              <X size={10}/> Effacer tag
            </button>
          )}

          {/* Tabs */}
          <div style={{ display:'inline-flex', background:D.gray100, borderRadius:10, padding:3, gap:2 }}>
            {[{key:'all',label:'Tous'},{key:'received',label:'✓ Reçus'},{key:'planned',label:'⏳ Prévus'}].map(t=>(
              <button key={t.key} className="inc-tab"
                onClick={()=>{setTab(t.key);setPage(1)}}
                style={{ padding:'5px 14px', borderRadius:8, border:'none', fontSize:12.5, cursor:'pointer',
                  fontWeight:tab===t.key?600:400,
                  background:tab===t.key?D.white:'transparent',
                  color:tab===t.key?D.gray800:D.gray400,
                  boxShadow:tab===t.key?D.shadowSm:'none',
                  transition:'all .15s' }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div style={{ padding:'12px 20px', borderBottom:`1px solid ${D.gray100}`,
            background:D.gray50, display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:8, alignItems:'end' }}>
            <div style={{ position:'relative' }}>
              <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:D.gray400 }} />
              <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}
                placeholder="Rechercher…" style={{ ...css.inp, paddingLeft:32 }} />
            </div>
            <select value={filters.source} onChange={e=>setF('source',e.target.value)} style={css.inp}>
              <option value="">Toutes les sources</option>
              {SOURCES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <select value={filters.category} onChange={e=>setF('category',e.target.value)} style={css.inp}>
              <option value="">Toutes catégories</option>
              <option value="fixed">Fixe</option>
              <option value="variable">Variable</option>
            </select>
            <div style={{ display:'flex', gap:6 }}>
              <input type="date" value={filters.from} onChange={e=>setF('from',e.target.value)} style={{...css.inp,flex:1}} />
              <input type="date" value={filters.to}   onChange={e=>setF('to',e.target.value)}   style={{...css.inp,flex:1}} />
            </div>
            {activeFilters>0 && (
              <button className="ghost-btn"
                onClick={()=>{setFilters({source:'',category:'',from:'',to:''});setSearch('')}}
                style={{...css.btn,background:D.white,color:D.gray500,border:`1.5px solid ${D.gray200}`,padding:'8px 12px',fontSize:12}}>
                <X size={12}/> Effacer
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {sorted.length===0 ? (
          <div style={{ padding:'72px 0', textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:16, background:D.gray100,
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Wallet size={24} style={{ color:D.gray300 }} />
            </div>
            <p style={{ fontSize:15, fontWeight:600, color:D.gray700, marginBottom:6 }}>Aucun revenu trouvé</p>
            <p style={{ fontSize:13, color:D.gray400, marginBottom:20 }}>
              {activeFilters>0 ? 'Essayez de modifier vos filtres' : 'Commencez par ajouter un revenu'}
            </p>
            <button className="primary-btn" onClick={openCreate}
              style={{ ...css.btn, background:D.primary, color:'#fff', margin:'0 auto' }}>
              <Plus size={14}/> Ajouter un revenu
            </button>
          </div>
        ) : (
          <>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${D.gray100}` }}>
                  {[
                    {key:'date',        label:'Date'},
                    {key:'description', label:'Description'},
                    {key:'source',      label:'Source'},
                    {key:'category',    label:'Type'},
                    {key:'amount',      label:'Montant'},
                    {key:'status',      label:'Statut'},
                    {key:null,          label:''},
                  ].map(col=>(
                    <th key={col.label} onClick={()=>col.key&&toggleSort(col.key)}
                      style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700,
                        color:D.gray400, textTransform:'uppercase', letterSpacing:'0.06em',
                        cursor:col.key?'pointer':'default', userSelect:'none',
                        background:sortCol===col.key?`${D.primary}08`:'transparent',
                        whiteSpace:'nowrap', transition:'background 0.15s' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        {col.label}
                        {col.key && (
                          <span style={{ color:sortCol===col.key?D.primary:D.gray300 }}>
                            {sortCol===col.key&&sortDir==='asc'
                              ? <ChevronUp size={12}/>
                              : <ChevronDown size={12}/>}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(inc => {
                  const isHov = hovRow===inc.id
                  return (
                    <tr key={inc.id} className="inc-row"
                      onMouseEnter={()=>setHovRow(inc.id)}
                      onMouseLeave={()=>setHovRow(null)}
                      style={{ borderBottom:`1px solid ${D.gray100}`,
                        background:isHov?D.bg:'transparent',
                        transition:'background 0.1s' }}>
                      <td style={{ padding:'12px 16px', fontSize:12.5, color:D.gray400, whiteSpace:'nowrap' }}>
                        {fmtDate(inc.date)}
                      </td>
                      <td style={{ padding:'12px 16px', maxWidth:200 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                          {inc.is_recurring && (
                            <div title="Récurrent" style={{ width:18, height:18, borderRadius:5,
                              background:`${D.primary}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <Repeat size={10} style={{ color:D.primary }} />
                            </div>
                          )}
                          <span style={{ fontSize:13, color:D.gray800, fontWeight:500,
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {inc.description}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <SourceChip source={inc.source} />
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ padding:'3px 9px', borderRadius:8, fontSize:11.5, fontWeight:600,
                          background:inc.category==='fixed'?`${D.primary}12`:`${D.amber}15`,
                          color:inc.category==='fixed'?D.primary:D.amber }}>
                          {inc.category==='fixed'?'Fixe':'Variable'}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontSize:14, fontWeight:700, color:D.gray900,
                          fontVariantNumeric:'tabular-nums' }}>{fmt(inc.amount)}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <StatusBadge status={inc.status} />
                      </td>
                      {/* Actions — visible on hover */}
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6,
                          opacity:isHov?1:0, transition:'opacity 0.15s' }}>
                          {inc.status==='planned' && (
                            <button className="inc-btn recv-btn"
                              onClick={()=>handleMarkReceived(inc.id)}
                              title="Marquer reçu"
                              style={{ width:30, height:30, borderRadius:8, cursor:'pointer',
                                background:D.greenBg, color:D.green,
                                border:`1.5px solid ${D.greenBorder}`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                transition:'all 0.15s' }}>
                              <ArrowDownToLine size={13}/>
                            </button>
                          )}
                          <button className="inc-btn"
                            onClick={()=>openEdit(inc)}
                            style={{ width:30, height:30, borderRadius:8, cursor:'pointer',
                              background:D.bg, color:D.gray500,
                              border:`1.5px solid ${D.gray200}`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              transition:'all 0.15s' }}>
                            <Pencil size={12}/>
                          </button>
                          <button className="inc-btn"
                            onClick={()=>setDeleteId(inc.id)}
                            style={{ width:30, height:30, borderRadius:8, cursor:'pointer',
                              background:D.redBg, color:D.red,
                              border:`1.5px solid ${D.redBorder}`,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              transition:'all 0.15s' }}>
                            <Trash2 size={12}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'12px 20px', borderTop:`1px solid ${D.gray100}` }}>
                <span style={{ fontSize:12.5, color:D.gray400 }}>
                  Page <b style={{color:D.gray700}}>{meta.current_page}</b> sur {meta.last_page}
                </span>
                <div style={{ display:'flex', gap:6 }}>
                  {[-1,1].map(dir => (
                    <button key={dir} className="ghost-btn"
                      disabled={dir===-1?page<=1:page>=meta.last_page}
                      onClick={()=>setPage(p=>p+dir)}
                      style={{ ...css.btn, background:D.white, color:D.gray600,
                        border:`1.5px solid ${D.gray200}`, padding:'6px 14px', fontSize:12.5,
                        opacity:(dir===-1?page<=1:page>=meta.last_page)?0.4:1 }}>
                      {dir===-1?'← Précédent':'Suivant →'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════
          MODAL AJOUT / MODIFICATION
      ══════════════════════════════════════════ */}
      <Modal open={modalOpen} onClose={()=>setModalOpen(false)}
        title={editing?'Modifier le revenu':'Nouveau revenu'}>
        <div style={{ display:'flex', flexDirection:'column', gap:16, fontFamily:'Inter, system-ui, sans-serif' }}>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Montant (MAD)" required>
              <input type="number" value={form.amount} onChange={e=>setFm('amount',e.target.value)}
                placeholder="ex: 18 000" style={css.inp} />
            </Field>
            <Field label="Date" required>
              <input type="date" value={form.date} onChange={e=>setFm('date',e.target.value)} style={css.inp} />
            </Field>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Source" required>
              <select value={form.source} onChange={e=>setFm('source',e.target.value)} style={css.inp}>
                {SOURCES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Catégorie">
              <select value={form.category} onChange={e=>setFm('category',e.target.value)} style={css.inp}>
                <option value="fixed">Fixe (salaire, loyer…)</option>
                <option value="variable">Variable (freelance…)</option>
              </select>
            </Field>
          </div>

          <Field label="Statut">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[{v:'planned',label:'Prévu',icon:Clock},{v:'received',label:'Déjà reçu',icon:CheckCircle}].map(opt=>{
                const active = form.status===opt.v
                return (
                  <label key={opt.v} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                    borderRadius:10, cursor:'pointer',
                    border:`2px solid ${active?(opt.v==='received'?D.green:D.primary):D.gray200}`,
                    background:active?(opt.v==='received'?D.greenBg:`${D.primary}08`):D.white,
                    transition:'all 0.15s' }}>
                    <input type="radio" name="status" value={opt.v} checked={active}
                      onChange={()=>setFm('status',opt.v)} style={{display:'none'}} />
                    <opt.icon size={15} style={{ color:active?(opt.v==='received'?D.green:D.primary):D.gray400 }} />
                    <span style={{ fontSize:13, fontWeight:active?600:400,
                      color:active?(opt.v==='received'?D.green:D.primary):D.gray600 }}>
                      {opt.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </Field>

          <Field label="Description" required>
            <input value={form.description} onChange={e=>setFm('description',e.target.value)}
              placeholder="ex: Salaire juin — TechMaroc" style={css.inp} />
          </Field>

          {/* Client + Tags row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Nom du client">
              <input value={form.client_name||''} onChange={e=>setFm('client_name',e.target.value)}
                placeholder="ex: Groupe Saham" style={css.inp} />
            </Field>
            <Field label="Catégorie">
              <select value={form.category_id||''} onChange={e=>setFm('category_id',e.target.value)} style={css.inp}>
                <option value="">Sans catégorie</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </Field>
          </div>

          {/* Tags */}
          <Field label="Tags">
            <TagsInput value={form.tags||[]} onChange={v=>setFm('tags',v)} />
          </Field>

          {/* Notes */}
          <Field label="Notes internes">
            <textarea value={form.notes||''} onChange={e=>setFm('notes',e.target.value)}
              placeholder="Informations complémentaires…"
              rows={2} style={{ ...css.inp, resize:'vertical', lineHeight:1.5 }} />
          </Field>

          {/* Récurrence */}
          <div style={{ padding:'14px 16px', background:D.gray50, borderRadius:12,
            border:`1.5px solid ${form.is_recurring?D.primary:D.gray200}`, transition:'border-color 0.15s' }}>
            <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
              <input type="checkbox" checked={form.is_recurring}
                onChange={e=>setFm('is_recurring',e.target.checked)}
                style={{ marginTop:2, accentColor:D.primary, width:15, height:15 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13, fontWeight:600, color:D.gray800, display:'flex', alignItems:'center', gap:6 }}>
                  <Repeat size={13} style={{ color:D.primary }} /> Revenu récurrent
                </p>
                <p style={{ fontSize:11.5, color:D.gray400, marginTop:2 }}>
                  Sera automatiquement recréé à chaque période
                </p>
                {form.is_recurring && (
                  <select value={form.recurrence} onChange={e=>setFm('recurrence',e.target.value)}
                    style={{ ...css.inp, marginTop:10, width:'auto', minWidth:180 }}>
                    <option value="monthly">Chaque mois</option>
                    <option value="quarterly">Chaque trimestre</option>
                    <option value="yearly">Chaque année</option>
                  </select>
                )}
              </div>
            </label>
          </div>

          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:4, borderTop:`1px solid ${D.gray100}` }}>
            <button className="ghost-btn" onClick={()=>setModalOpen(false)}
              style={{ ...css.btn, background:D.white, color:D.gray600, border:`1.5px solid ${D.gray200}` }}>
              Annuler
            </button>
            <button className="primary-btn" onClick={handleSave} disabled={saving}
              style={{ ...css.btn, background:saving?D.gray300:D.primary, color:'#fff',
                boxShadow:saving?'none':`0 4px 14px ${D.primary}40`, cursor:saving?'default':'pointer' }}>
              {saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Ajouter le revenu'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ══════════════════════════════════════════
          MODAL OBJECTIF
      ══════════════════════════════════════════ */}
      <Modal open={goalModal} onClose={()=>setGoalModal(false)} title="Définir votre objectif">
        <div style={{ display:'flex', flexDirection:'column', gap:16, fontFamily:'Inter, system-ui, sans-serif' }}>
          <div style={{ padding:'14px 16px', borderRadius:12,
            background:`linear-gradient(135deg,${D.bg} 0%,${D.white} 100%)`,
            border:`1px solid ${D.gray200}`, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10,
              background:`linear-gradient(135deg,${D.primary}20,${D.primary}10)`,
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Target size={16} style={{ color:D.primary }} />
            </div>
            <p style={{ fontSize:13, color:D.gray600, lineHeight:1.5 }}>
              Définissez votre cible mensuelle. Taadbiir vous montrera votre progression en temps réel sur le dashboard.
            </p>
          </div>
          <Field label="Objectif mensuel (MAD)" required>
            <input type="number" value={goalForm.monthly_target}
              onChange={e=>setGoalForm(f=>({...f,monthly_target:e.target.value}))}
              placeholder="ex: 30 000" style={css.inp} />
          </Field>
          {/* Per-category goals */}
          <div style={{ borderTop:`1px solid ${D.gray100}`, paddingTop:14 }}>
            <p style={{ fontSize:12.5, fontWeight:600, color:D.gray700, marginBottom:10 }}>
              Objectifs par catégorie (optionnel)
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {categories.slice(0,3).map(cat => (
                <div key={cat.id} style={{ display:'flex', alignItems:'center', gap:10,
                  padding:'8px 12px', borderRadius:10, border:`1px solid ${D.gray200}`, background:D.gray50 }}>
                  <span style={{fontSize:16}}>{cat.icon}</span>
                  <span style={{flex:1,fontSize:13,color:D.gray700}}>{cat.name}</span>
                  <input type="number" placeholder="ex: 10 000"
                    style={{...css.inp,width:120}}
                    onChange={e => setGoalForm(f => ({
                      ...f,
                      byCategory: { ...(f.byCategory||{}), [cat.id]: +e.target.value }
                    }))}
                  />
                  <span style={{fontSize:11,color:D.gray400}}>MAD/mois</span>
                </div>
              ))}
            </div>
          </div>

          {goalForm.monthly_target && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                {label:'Annuel',  value:fmt(+goalForm.monthly_target*12)},
                {label:'Quotidien',value:fmt(Math.round(+goalForm.monthly_target/30))},
              ].map(s=>(
                <div key={s.label} style={{ padding:'10px 14px', borderRadius:10, background:D.gray50,
                  border:`1px solid ${D.gray200}`, textAlign:'center' }}>
                  <p style={{ fontSize:10.5, color:D.gray400, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</p>
                  <p style={{ fontSize:16, fontWeight:700, color:D.gray800, fontVariantNumeric:'tabular-nums', marginTop:3 }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:4 }}>
            <button className="ghost-btn" onClick={()=>setGoalModal(false)}
              style={{ ...css.btn, background:D.white, color:D.gray600, border:`1.5px solid ${D.gray200}` }}>
              Annuler
            </button>
            <button className="primary-btn" onClick={handleSaveGoal} disabled={saving}
              style={{ ...css.btn, background:saving?D.gray300:D.primary, color:'#fff',
                boxShadow:`0 4px 14px ${D.primary}40` }}>
              {saving?'Enregistrement…':'Sauvegarder l\'objectif'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ══════════════════════════════════════════
          MODAL CATÉGORIES
      ══════════════════════════════════════════ */}
      <Modal open={catModal} onClose={()=>setCatModal(false)} title="Gérer les catégories">
        <div style={{ display:'flex', flexDirection:'column', gap:16, fontFamily:'Inter, system-ui, sans-serif' }}>
          <div style={{ padding:'10px 14px', borderRadius:10, background:D.bg,
            border:`1px solid ${D.gray200}`, fontSize:12.5, color:D.gray600 }}>
            <Settings size={13} style={{verticalAlign:'middle',marginRight:6,color:D.primary}}/>
            Créez vos propres catégories de revenus et associez-les à chaque entrée.
          </div>
          <CategoryManager
            categories={categories}
            onCreate={handleCreateCat}
            onUpdate={handleUpdateCat}
            onDelete={handleDeleteCat}
          />
        </div>
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog open={!!deleteId} onClose={()=>setDeleteId(null)} onConfirm={handleDelete}
        title="Supprimer ce revenu"
        message="Ce revenu sera supprimé définitivement et retiré de toutes les statistiques."
        confirmLabel="Supprimer" danger />

    </div>
  )
}