import axios from 'axios'
import {
  getDashboardForUser,
  getExpensesForUser,
  MOCK_BUDGETS,
  MOCK_CATEGORIES,
  MOCK_TEAMS,
  MOCK_USERS_LIST,
  MOCK_REPORTS,
  ALL_EXPENSES_ENRICHED,
  MOCK_INCOMES,
  INCOME_SOURCES,
  MOCK_INCOME_GOAL,
  getIncomeStatsForUser,
  INCOME_CATEGORIES,
  CategoryModel,
  INCOME_NOTIFICATIONS,
  NotifModel,
  INCOME_GOALS,
  generateInsights,
  exportToCSV,
  MOCK_CASHFLOW,
  INCOME_ACCOUNTS,
  AttachmentModel,
  getExtendedStats,
  computeNextOccurrence,
  generateRecurringSchedule,
} from './mockData.js'

export const USE_MOCK = true

// État mutable des dépenses (pour mutations en démo)
let mockExpenses = [...ALL_EXPENSES_ENRICHED]

// État mutable des revenus
let mockIncomes = [...MOCK_INCOMES]
let mockGoal    = { ...MOCK_INCOME_GOAL }

// Récupérer l'utilisateur connecté depuis localStorage
const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('mock_user')) } catch { return null }
}

const paginate = (data, page = 1, perPage = 20) => ({
  data: data.slice((page - 1) * perPage, page * perPage),
  meta: { total: data.length, per_page: perPage, current_page: page, last_page: Math.max(1, Math.ceil(data.length / perPage)) },
})

const mockRouter = async (method, url, params = {}, body = {}) => {
  await new Promise(r => setTimeout(r, 280))
  const user = getCurrentUser()

  // ── Dashboard ─────────────────────────────────────────────
  if (url === '/dashboard') return getDashboardForUser(user)

  // ── Listes statiques ──────────────────────────────────────
  if (url === '/categories') return MOCK_CATEGORIES
  if (url === '/teams')      return MOCK_TEAMS
  if (url === '/users')      return MOCK_USERS_LIST

  // ── Budgets ───────────────────────────────────────────────
  if (url === '/budgets' && method === 'GET') {
    if (user?.role === 'manager') {
      return MOCK_BUDGETS.filter(b => !b.team_id || b.team_id === user.team_id)
    }
    return MOCK_BUDGETS
  }

  // ── Reports ───────────────────────────────────────────────
  if (url === '/reports/monthly')     return MOCK_REPORTS.monthly
  if (url === '/reports/by-category') return MOCK_REPORTS.byCategory
  if (url === '/reports/by-team')     return MOCK_REPORTS.byTeam

  // ── Liste des dépenses (filtrée par rôle) ─────────────────
  if (url === '/expenses' && method === 'GET') {
    // Repartir de l'état mutable
    let list = mockExpenses.filter(e => {
      if (!user) return false
      if (user.role === 'owner') return true
      if (user.role === 'chef_equipe') return e.user_id === user.id || e.team_id === user.team_id
      // equipe: voit toute son équipe en lecture
return e.team_id === user.team_id
    })
    if (params.status) list = list.filter(e => e.status === params.status)
    if (params.search) list = list.filter(e => e.title.toLowerCase().includes(params.search.toLowerCase()))
    return paginate(list, params.page || 1)
  }

  // ── Détail dépense ────────────────────────────────────────
  const detailMatch = url.match(/^\/expenses\/(\d+)$/)
  if (detailMatch && method === 'GET') {
    const exp = mockExpenses.find(e => e.id === +detailMatch[1])
    if (!exp) throw { response: { status: 404, data: { message: 'Introuvable' } } }
    return exp
  }

  // ── Créer une dépense ─────────────────────────────────────
  if (url === '/expenses' && method === 'POST') {
    const MOCK_CATEGORIES_LOCAL = MOCK_CATEGORIES
    const MOCK_TEAMS_LOCAL = MOCK_TEAMS
    const newExp = {
      id: Date.now(),
      title:        body.title || '',
      amount:       +body.amount || 0,
      expense_date: body.expense_date || new Date().toISOString().slice(0, 10),
      description:  body.description || '',
      project:      body.project || '',
      status:       body.submit === '1' ? 'pending' : 'draft',
      user_id:      user?.id,
      team_id:      +body.team_id || user?.team_id || null,
      category_id:  +body.category_id || null,
      receipts:     [],
      user:         user,
      category:     MOCK_CATEGORIES_LOCAL.find(c => c.id === +body.category_id) ?? null,
      team:         MOCK_TEAMS_LOCAL.find(t => t.id === +body.team_id) ?? null,
      approver:     null,
      reimbursement: null,
    }
    mockExpenses = [newExp, ...mockExpenses]
    return newExp
  }

  // ── Actions sur dépense ───────────────────────────────────
  const actionMatch = url.match(/^\/expenses\/(\d+)\/(approve|reject|submit)$/)
  if (actionMatch && method === 'POST') {
    const id = +actionMatch[1]
    const action = actionMatch[2]
    mockExpenses = mockExpenses.map(e => {
      if (e.id !== id) return e
      if (action === 'approve') return { ...e, status: 'approved', approved_at: new Date().toISOString(), approver: user }
      if (action === 'reject')  return { ...e, status: 'rejected', rejection_reason: body.reason || '', approved_at: new Date().toISOString() }
      if (action === 'submit')  return { ...e, status: 'pending' }
      return e
    })
    return mockExpenses.find(e => e.id === id)
  }

  // ── Supprimer dépense ─────────────────────────────────────
  if (detailMatch && method === 'DELETE') {
    mockExpenses = mockExpenses.filter(e => e.id !== +detailMatch[1])
    return { message: 'Supprimée.' }
  }

  // ── Remboursements ────────────────────────────────────────
  if (url === '/reimbursements') {
    const list = mockExpenses.filter(e => ['approved', 'paid'].includes(e.status))
    return paginate(list, params.page || 1)
  }

  const paidMatch = url.match(/^\/reimbursements\/(\d+)\/mark-paid$/)
  if (paidMatch && method === 'POST') {
    const id = +paidMatch[1]
    mockExpenses = mockExpenses.map(e =>
      e.id === id
        ? { ...e, status: 'paid', reimbursement: { id, paid_at: new Date().toISOString().slice(0, 10), payment_method: body.payment_method || 'Virement' } }
        : e
    )
    return mockExpenses.find(e => e.id === id)
  }


  // ── Revenus — stats ──────────────────────────────────────
  if (url === '/incomes/stats') {
    return getIncomeStatsForUser(user)
  }

  // ── Revenus — liste ───────────────────────────────────────
  if (url === '/incomes' && method === 'GET') {
    let list = mockIncomes.filter(i => {
      if (!user) return false
      if (user.role === 'owner') return true
      return i.user_id === user.id
    })
    if (params.status)   list = list.filter(i => i.status === params.status)
    if (params.source)   list = list.filter(i => i.source === params.source)
    if (params.category) list = list.filter(i => i.category === params.category)
    if (params.from)     list = list.filter(i => i.date >= params.from)
    if (params.to)       list = list.filter(i => i.date <= params.to)
    if (params.search)   list = list.filter(i => i.description.toLowerCase().includes(params.search.toLowerCase()))
    list = list.sort((a, b) => new Date(b.date) - new Date(a.date))
    return paginate(list, params.page || 1, params.per_page || 15)
  }

  // ── Revenus — créer ───────────────────────────────────────
  if (url === '/incomes' && method === 'POST') {
    const src = INCOME_SOURCES.find(s => s.id === body.source) ?? INCOME_SOURCES.at(-1)
    const newIncome = {
      id: Date.now(),
      amount:       +body.amount || 0,
      date:         body.date || new Date().toISOString().slice(0, 10),
      source:       body.source || 'other',
      category:     body.category || 'variable',
      status:       body.status || 'planned',
      description:  body.description || '',
      user_id:      user?.id,
      is_recurring: !!body.is_recurring,
      recurrence:   body.recurrence || null,
      next_date:    body.next_date || null,
      source_info:  src,
      user:         user,
    }
    mockIncomes = [newIncome, ...mockIncomes]
    return newIncome
  }

  // ── Revenus — modifier ────────────────────────────────────
  const incomeMatch = url.match(/^\/incomes\/(\d+)$/)
  if (incomeMatch && method === 'PUT') {
    const id = +incomeMatch[1]
    const src = INCOME_SOURCES.find(s => s.id === body.source) ?? INCOME_SOURCES.at(-1)
    mockIncomes = mockIncomes.map(i => i.id === id
      ? { ...i, ...body, id, source_info: src, user: i.user }
      : i
    )
    return mockIncomes.find(i => i.id === id)
  }

  // ── Revenus — marquer reçu ────────────────────────────────
  const incomeReceiveMatch = url.match(/^\/incomes\/(\d+)\/receive$/)
  if (incomeReceiveMatch && method === 'POST') {
    const id = +incomeReceiveMatch[1]
    mockIncomes = mockIncomes.map(i => i.id === id ? { ...i, status: 'received' } : i)
    return mockIncomes.find(i => i.id === id)
  }

  // ── Revenus — supprimer ───────────────────────────────────
  if (incomeMatch && method === 'DELETE') {
    mockIncomes = mockIncomes.filter(i => i.id !== +incomeMatch[1])
    return { message: 'Revenu supprimé.' }
  }

  // ── Objectif revenu ───────────────────────────────────────
  if (url === '/incomes/goal' && method === 'GET')  return mockGoal
  if (url === '/incomes/goal' && method === 'POST') {
    mockGoal = { ...mockGoal, ...body }
    return mockGoal
  }

  // ── Sources disponibles ───────────────────────────────────
  if (url === '/incomes/sources') return INCOME_SOURCES


  
  // ── Income Categories ─────────────────────────────────
  if (url === '/incomes/categories' && method === 'GET')
    return CategoryModel.list()
  if (url === '/incomes/categories' && method === 'POST')
    return CategoryModel.create(body)
  const catMatch = url.match(/^\/incomes\/categories\/(\d+)$/)
  if (catMatch && method === 'PUT')    return CategoryModel.update(catMatch[1], body)
  if (catMatch && method === 'DELETE') { CategoryModel.delete(catMatch[1]); return { message: 'Catégorie supprimée' } }

  // ── Income Notifications ───────────────────────────────
  if (url === '/incomes/notifications' && method === 'GET')
    return NotifModel.listForUser(user?.id)
  const notifMatch = url.match(/^\/incomes\/notifications\/(\d+)\/read$/)
  if (notifMatch && method === 'POST') { NotifModel.markRead(notifMatch[1]); return { message: 'Lu' } }

  // ── Income Insights ────────────────────────────────────
  if (url === '/incomes/insights') {
    const stats = getIncomeStatsForUser(user)
    return generateInsights(stats)
  }

  // ── Income Export (CSV download) ────────────────────────
  if (url === '/incomes/export' && method === 'POST') {
    const all = mockIncomes.filter(i => user?.role === 'owner' ? true : i.user_id === user?.id)
    exportToCSV(all)
    return { message: 'Export lancé' }
  }


  
  // ── Extended stats (cashflow, recurring schedule, accounts) ──
  if (url === '/incomes/extended-stats') {
    return getExtendedStats(user)
  }

  // ── Cash flow data ─────────────────────────────────────
  if (url === '/incomes/cashflow') return MOCK_CASHFLOW

  // ── Accounts ───────────────────────────────────────────
  if (url === '/incomes/accounts' && method === 'GET') return INCOME_ACCOUNTS

  // ── Attachments ────────────────────────────────────────
  const attachListMatch = url.match(/^\/incomes\/(\d+)\/attachments$/)
  if (attachListMatch && method === 'GET')
    return AttachmentModel.listForIncome(attachListMatch[1])
  if (attachListMatch && method === 'POST') {
    const att = AttachmentModel.add(attachListMatch[1], {
      name: body.name || 'fichier.pdf',
      size: body.size || 0,
      type: body.type || 'application/pdf',
      url:  body.url  || '#',
    })
    return att
  }
  const attachDelMatch = url.match(/^\/incomes\/attachments\/(\d+)$/)
  if (attachDelMatch && method === 'DELETE') {
    AttachmentModel.delete(attachDelMatch[1])
    return { message: 'Pièce jointe supprimée' }
  }

  // ── Recurring schedule ─────────────────────────────────
  if (url === '/incomes/schedule') {
    const { MOCK_INCOMES: mi } = await import('./mockData.js').catch(() => ({ MOCK_INCOMES: [] }))
    return (mockIncomes || [])
      .filter(i => i.is_recurring)
      .flatMap(i => generateRecurringSchedule(i, 3))
  }

  // ── Mark received + auto-generate next recurring ───────
  const receiveMatch = url.match(/^\/incomes\/(\d+)\/receive$/)
  if (receiveMatch && method === 'POST') {
    const id  = +receiveMatch[1]
    const inc = mockIncomes.find(i => i.id === id)
    if (!inc) throw { response: { status: 404, data: { message: 'Introuvable' } } }
    // Mark received
    mockIncomes = mockIncomes.map(i => i.id === id ? { ...i, status: 'received' } : i)
    // Auto-generate next if recurring
    if (inc.is_recurring && inc.recurrence) {
      const nextDate = computeNextOccurrence(inc.date, inc.recurrence)
      if (nextDate) {
        const src = (await import('./mockData.js').catch(()=>({})))?.INCOME_SOURCES
          ?.find?.(s => s.id === inc.source) ?? { color:'#284E7B' }
        const newInc = {
          ...inc, id: Date.now(), date: nextDate, status: 'planned',
          next_occurrence: computeNextOccurrence(nextDate, inc.recurrence),
          source_info: src, user,
        }
        mockIncomes = [newInc, ...mockIncomes]
      }
    }
    // Notification
    NotifModel.add(user?.id, { type: 'received', rev_id: id,
      message: `✓ ${inc.description} — ${inc.amount.toLocaleString('fr-MA')} MAD reçu.` })
    return mockIncomes.find(i => i.id === id)
  }


    throw { response: { status: 404, data: { message: `Route mock inconnue : ${method} ${url}` } } }
}

// ── Axios instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

if (USE_MOCK) {
  api.interceptors.request.use(async config => {
    const url    = (config.url || '').replace(config.baseURL || '', '')
    const method = (config.method || 'GET').toUpperCase()
    const params = config.params || {}
    let   body   = {}
    try { body = config.data ? JSON.parse(config.data) : {} } catch { body = {} }

    // Laisser les routes auth passer normalement (gérées par AuthContext)
    if (['/login', '/register', '/logout', '/me'].includes(url)) return config

    try {
      const data   = await mockRouter(method, url, params, body)
      const source = axios.CancelToken.source()
      config.cancelToken = source.token
      source.cancel({ isMock: true, data })
    } catch (err) {
      const source = axios.CancelToken.source()
      config.cancelToken = source.token
      source.cancel({ isMock: true, error: err })
    }
    return config
  })

  api.interceptors.response.use(
    res => res,
    err => {
      if (axios.isCancel(err)) {
        const p = err.message
        if (p?.isMock) {
          if (p.error) return Promise.reject(p.error)
          return Promise.resolve({ data: p.data, status: 200 })
        }
      }
      if (err.response?.status === 401) {
        localStorage.removeItem('mock_user')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )
} else {
  api.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  )
}

export default api