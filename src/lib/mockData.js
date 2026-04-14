// ── Catégories ────────────────────────────────────────────────
export const MOCK_CATEGORIES = [
  { id: 1, name: 'Déplacement',  color: '#6366f1' },
  { id: 2, name: 'Hébergement',  color: '#10b981' },
  { id: 3, name: 'Restauration', color: '#f59e0b' },
  { id: 4, name: 'Informatique', color: '#3b82f6' },
  { id: 5, name: 'Formation',    color: '#ef4444' },
  { id: 6, name: 'Fournitures',  color: '#8b5cf6' },
]

// ── Équipes ───────────────────────────────────────────────────
export const MOCK_TEAMS = [
  { id: 1, name: 'Direction',  manager_id: 1 },
  { id: 2, name: 'R&D',        manager_id: 2 },
  { id: 3, name: 'Commercial', manager_id: 2 },
  { id: 4, name: 'Marketing',  manager_id: 2 },
]

// ── Utilisateurs (3 rôles) ────────────────────────────────────
export const MOCK_USERS_LIST = [
  { id: 1, first_name: 'Sara',   last_name: 'Alami',  email: 'owner@techmaroc.ma',  role: 'owner',       team_id: 1, team: MOCK_TEAMS[0], company: { name: 'TechMaroc SARL' } },
  { id: 2, first_name: 'Karim',  last_name: 'Ouali',  email: 'chef@techmaroc.ma',   role: 'chef_equipe', team_id: 2, team: MOCK_TEAMS[1], company: { name: 'TechMaroc SARL' } },
  { id: 3, first_name: 'Leila',  last_name: 'Benali', email: 'equipe@techmaroc.ma', role: 'equipe',      team_id: 2, team: MOCK_TEAMS[1], company: { name: 'TechMaroc SARL' } },
  { id: 4, first_name: 'Amine',  last_name: 'Moudni', email: 'amine@techmaroc.ma',  role: 'equipe',      team_id: 3, team: MOCK_TEAMS[2], company: { name: 'TechMaroc SARL' } },
  { id: 5, first_name: 'Nadia',  last_name: 'Ziani',  email: 'nadia@techmaroc.ma',  role: 'equipe',      team_id: 4, team: MOCK_TEAMS[3], company: { name: 'TechMaroc SARL' } },
]

// ── Toutes les dépenses brutes ────────────────────────────────
const ALL_EXPENSES_RAW = [
  { id: 1,  title: 'Vol Casablanca–Paris',         amount: 4800, status: 'pending',  expense_date: '2025-03-18', user_id: 3, team_id: 2, category_id: 1, description: 'Mission client Paris', project: 'Projet Atlas',  receipts: [{ id: 1, original_name: 'billet.pdf', file_size: 204800 }] },
  { id: 2,  title: 'Hôtel Marriott — 3 nuits',    amount: 3600, status: 'approved', expense_date: '2025-03-15', user_id: 3, team_id: 2, category_id: 2, description: 'Séjour Paris',         project: 'Projet Atlas',  receipts: [], approved_by: 2, approved_at: '2025-03-16' },
  { id: 3,  title: 'Repas équipe R&D',             amount: 1250, status: 'approved', expense_date: '2025-03-12', user_id: 2, team_id: 2, category_id: 3, description: 'Sprint review',        project: '',              receipts: [], approved_by: 1, approved_at: '2025-03-13' },
  { id: 4,  title: 'Abonnements SaaS mensuels',    amount: 2900, status: 'paid',     expense_date: '2025-03-10', user_id: 1, team_id: 1, category_id: 4, description: 'Figma, Notion, Slack', project: '',              receipts: [], approved_by: 1, approved_at: '2025-03-11' },
  { id: 5,  title: 'Taxi aéroport',                amount:  320, status: 'pending',  expense_date: '2025-03-08', user_id: 4, team_id: 3, category_id: 1, description: '',                    project: '',              receipts: [] },
  { id: 6,  title: 'Formation React avancé',        amount: 5400, status: 'pending',  expense_date: '2025-03-05', user_id: 3, team_id: 2, category_id: 5, description: 'Formation 3 jours',   project: '',              receipts: [{ id: 2, original_name: 'devis.pdf', file_size: 102400 }] },
  { id: 7,  title: 'Restaurant client partenaire',  amount: 1100, status: 'pending',  expense_date: '2025-03-03', user_id: 2, team_id: 2, category_id: 3, description: '',                    project: 'Projet Beta',   receipts: [] },
  { id: 8,  title: 'Matériel bureau',               amount:  890, status: 'rejected', expense_date: '2025-02-28', user_id: 5, team_id: 4, category_id: 6, description: '',                    project: '',              receipts: [], approved_by: 1, approved_at: '2025-03-01', rejection_reason: 'Budget épuisé.' },
  { id: 9,  title: 'Licence Adobe Creative',        amount: 1800, status: 'approved', expense_date: '2025-02-20', user_id: 5, team_id: 4, category_id: 4, description: '',                    project: '',              receipts: [], approved_by: 1, approved_at: '2025-02-21' },
  { id: 10, title: 'Billet train Rabat',            amount:  280, status: 'paid',     expense_date: '2025-02-15', user_id: 2, team_id: 2, category_id: 1, description: '',                    project: '',              receipts: [], approved_by: 1, approved_at: '2025-02-16' },
  { id: 11, title: 'Hébergement conférence',        amount: 2200, status: 'approved', expense_date: '2025-02-10', user_id: 4, team_id: 3, category_id: 2, description: '',                    project: '',              receipts: [], approved_by: 2, approved_at: '2025-02-11' },
  { id: 12, title: 'Brouillon — Frais divers',      amount:  450, status: 'draft',    expense_date: '2025-03-20', user_id: 3, team_id: 2, category_id: 6, description: '',                    project: '',              receipts: [] },
]

const enrich = (exp) => ({
  ...exp,
  user:         MOCK_USERS_LIST.find(u => u.id === exp.user_id)        ?? null,
  category:     MOCK_CATEGORIES.find(c => c.id === exp.category_id)    ?? null,
  team:         MOCK_TEAMS.find(t => t.id === exp.team_id)             ?? null,
  approver:     exp.approved_by ? MOCK_USERS_LIST.find(u => u.id === exp.approved_by) : null,
  reimbursement: exp.status === 'paid'
    ? { id: exp.id, paid_at: exp.approved_at, payment_method: 'Virement bancaire' }
    : null,
})

export const ALL_EXPENSES_ENRICHED = ALL_EXPENSES_RAW.map(enrich)

// ── Filtrer selon le rôle ─────────────────────────────────────
export const getExpensesForUser = (user) => {
  if (!user) return []
  switch (user.role) {
    case 'owner':
      // Voit TOUT
      return ALL_EXPENSES_ENRICHED
    case 'chef_equipe':
      // Voit les dépenses de son équipe + les siennes
      return ALL_EXPENSES_ENRICHED.filter(e =>
        e.user_id === user.id || e.team_id === user.team_id
      )
    case 'equipe':
      // Voit les siennes + celles de son équipe en lecture seule
      return ALL_EXPENSES_ENRICHED.filter(e => e.team_id === user.team_id)
    default:
      return ALL_EXPENSES_ENRICHED.filter(e => e.user_id === user.id)
  }
}

// ── Dashboard par rôle ────────────────────────────────────────
export const getDashboardForUser = (user) => {
  const expenses = getExpensesForUser(user)
  const thisMonth = expenses.filter(e =>
    ['approved','paid'].includes(e.status) && e.expense_date >= '2025-03-01'
  )

  const BANNERS = {
    owner:       { label: 'Company Owner',   color: 'bg-indigo-50 border-indigo-100 text-indigo-700', desc: "Vous gérez toute l'entreprise — accès complet." },
    chef_equipe: { label: "Chef d'équipe",   color: 'bg-emerald-50 border-emerald-100 text-emerald-700', desc: 'Vous voyez et validez les dépenses de votre équipe.' },
    equipe:      { label: 'Équipe',          color: 'bg-amber-50 border-amber-100 text-amber-700', desc: 'Vous voyez les dépenses de votre équipe (lecture seule pour les autres).' },
  }

  return {
    banner: BANNERS[user?.role] ?? BANNERS.equipe,
    totalThisMonth:       thisMonth.reduce((s, e) => s + e.amount, 0),
    pendingCount:         expenses.filter(e => e.status === 'pending').length,
    reimbursementPending: expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    budgetsCount:         MOCK_BUDGETS.length,
    trend: [
      { month: 'Oct', total: user?.role === 'equipe' ? 1200  : 32000 },
      { month: 'Nov', total: user?.role === 'equipe' ? 900   : 28500 },
      { month: 'Déc', total: user?.role === 'equipe' ? 2100  : 41000 },
      { month: 'Jan', total: user?.role === 'equipe' ? 1500  : 38000 },
      { month: 'Fév', total: user?.role === 'equipe' ? 3600  : 43200 },
      { month: 'Mar', total: user?.role === 'equipe' ? 5400  : 48320 },
    ],
    byCategory: user?.role === 'equipe'
      ? [
          { name: 'Déplacement', color: '#6366f1', total: 4800 },
          { name: 'Hébergement', color: '#10b981', total: 3600 },
          { name: 'Formation',   color: '#ef4444', total: 5400 },
        ]
      : [
          { name: 'Déplacement',  color: '#6366f1', total: 18200 },
          { name: 'Hébergement',  color: '#10b981', total: 12400 },
          { name: 'Restauration', color: '#f59e0b', total: 9100  },
          { name: 'Informatique', color: '#3b82f6', total: 7200  },
          { name: 'Formation',    color: '#ef4444', total: 5400  },
        ],
    budgets: MOCK_BUDGETS,
    recent:  expenses.slice(0, 5),

    // Graphique comparaison mois N vs mois N-1
    monthlyComparison: user?.role === 'equipe'
      ? [
          { month: 'Oct', thisYear: 1200,  lastYear: 950  },
          { month: 'Nov', thisYear: 900,   lastYear: 1100 },
          { month: 'Déc', thisYear: 2100,  lastYear: 1800 },
          { month: 'Jan', thisYear: 1500,  lastYear: 1300 },
          { month: 'Fév', thisYear: 3600,  lastYear: 2200 },
          { month: 'Mar', thisYear: 5400,  lastYear: 3100 },
        ]
      : [
          { month: 'Oct', thisYear: 32000, lastYear: 27500 },
          { month: 'Nov', thisYear: 28500, lastYear: 31000 },
          { month: 'Déc', thisYear: 41000, lastYear: 38000 },
          { month: 'Jan', thisYear: 38000, lastYear: 35000 },
          { month: 'Fév', thisYear: 43200, lastYear: 37800 },
          { month: 'Mar', thisYear: 48320, lastYear: 40100 },
        ],

    // Alertes budgets dépassés ou proches
    budgetAlerts: MOCK_BUDGETS
      .filter(b => b.percentage >= 70)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4),

    // Résumé par statut pour les KPIs
    statusSummary: {
      draft:    expenses.filter(e => e.status === 'draft').length,
      pending:  expenses.filter(e => e.status === 'pending').length,
      approved: expenses.filter(e => e.status === 'approved').length,
      rejected: expenses.filter(e => e.status === 'rejected').length,
      paid:     expenses.filter(e => e.status === 'paid').length,
    },
  }
}

// ── Budgets ───────────────────────────────────────────────────
const MOCK_BUDGETS_RAW = [
  { id: 1, label: 'Déplacements annuels',       category_id: 1, team_id: null, amount: 50000, period: 'yearly', start_date: '2025-01-01', end_date: '2025-12-31' },
  { id: 2, label: 'Restauration & Hébergement', category_id: 3, team_id: null, amount: 30000, period: 'yearly', start_date: '2025-01-01', end_date: '2025-12-31' },
  { id: 3, label: 'IT & SaaS — R&D',            category_id: 4, team_id: 2,   amount: 20000, period: 'yearly', start_date: '2025-01-01', end_date: '2025-12-31' },
  { id: 4, label: 'Formation équipe R&D',        category_id: 5, team_id: 2,   amount: 15000, period: 'yearly', start_date: '2025-01-01', end_date: '2025-12-31' },
  { id: 5, label: 'Marketing & Communication',   category_id: null, team_id: 4, amount: 25000, period: 'yearly', start_date: '2025-01-01', end_date: '2025-12-31' },
]

const spentForBudget = (b) =>
  ALL_EXPENSES_ENRICHED
    .filter(e => ['approved','paid'].includes(e.status))
    .filter(e => !b.category_id || e.category_id === b.category_id)
    .filter(e => !b.team_id    || e.team_id    === b.team_id)
    .reduce((sum, e) => sum + e.amount, 0)

export const MOCK_BUDGETS = MOCK_BUDGETS_RAW.map(b => {
  const spent = spentForBudget(b)
  return {
    ...b,
    category: MOCK_CATEGORIES.find(c => c.id === b.category_id) ?? null,
    team:     MOCK_TEAMS.find(t => t.id === b.team_id)          ?? null,
    spent,
    percentage: Math.round((spent / b.amount) * 100),
    remaining:  b.amount - spent,
  }
})

// ── Reports ───────────────────────────────────────────────────
export const MOCK_REPORTS = {
  monthly: [
    { month: 'Jan', total: 38000 }, { month: 'Fév', total: 43200 },
    { month: 'Mar', total: 48320 }, { month: 'Avr', total: 0 },
    { month: 'Mai', total: 0 },     { month: 'Jun', total: 0 },
    { month: 'Jul', total: 0 },     { month: 'Aoû', total: 0 },
    { month: 'Sep', total: 0 },     { month: 'Oct', total: 32000 },
    { month: 'Nov', total: 28500 }, { month: 'Déc', total: 41000 },
  ],
  byCategory: [
    { category: 'Déplacement',  color: '#6366f1', total: 18200, count: 4 },
    { category: 'Hébergement',  color: '#10b981', total: 12400, count: 3 },
    { category: 'Restauration', color: '#f59e0b', total: 9100,  count: 5 },
    { category: 'Informatique', color: '#3b82f6', total: 7200,  count: 2 },
    { category: 'Formation',    color: '#ef4444', total: 5400,  count: 1 },
  ],
  byTeam: [
    { team: 'R&D',        total: 24800, count: 6 },
    { team: 'Commercial', total: 12400, count: 3 },
    { team: 'Direction',  total: 9800,  count: 2 },
    { team: 'Marketing',  total: 7200,  count: 2 },
  ],
}

// ── ERP Phase 3 ───────────────────────────────────────────────
export const MOCK_CUSTOMERS = [
  { id: 1, name: 'Groupe Saham',  type: 'enterprise', ice: '002345678000056', if_num: '12345678', rc: '123456 Casa', cnss: '1234567', email: 'contact@saham.ma',    phone: '+212 5 22 48 00 00', address: 'Casablanca', payment_terms: 30, credit_limit: 500000, balance: 48000 },
  { id: 2, name: 'Marjane',       type: 'enterprise', ice: '001234567000012', if_num: '87654321', rc: '654321 Rabat', cnss: '7654321', email: 'achats@marjane.ma',  phone: '+212 5 37 71 00 00', address: 'Rabat',       payment_terms: 60, credit_limit: 1000000, balance: 125000 },
  { id: 3, name: 'OCP Group',     type: 'enterprise', ice: '000234567000034', if_num: '11223344', rc: '112233 Casa', cnss: '1122334', email: 'ocp@ocpgroup.ma',    phone: '+212 5 22 91 00 00', address: 'Casablanca', payment_terms: 90, credit_limit: 2000000, balance: 0 },
  { id: 4, name: 'Youssef Amrani', type: 'individual', ice: '', if_num: '', rc: '', cnss: '', email: 'y.amrani@gmail.com', phone: '+212 6 61 00 00 01', address: 'Fès', payment_terms: 0, credit_limit: 10000, balance: 2500 },
]

export const MOCK_SUPPLIERS = [
  { id: 1, name: 'Dell Technologies Maroc', category: 'informatique', ice: '004567890000090', if_num: '99887766', rc: '998877 Casa', rib: 'MA64 0001 0001 0000 0001 23', email: 'maroc@dell.com',     phone: '+212 5 22 36 00 00', address: 'Casablanca', payment_terms: 30, balance: 45000, rating: 5 },
  { id: 2, name: 'Atlas Fournitures',       category: 'fournitures',  ice: '005678901000001', if_num: '44332211', rc: '443322 Rabat', rib: 'MA64 0002 0002 0000 0002 34', email: 'cmd@atlas.ma',       phone: '+212 5 37 62 00 00', address: 'Rabat',       payment_terms: 15, balance: 8500,  rating: 4 },
  { id: 3, name: 'Maghreb Travel Pro',      category: 'voyages',      ice: '006789012000012', if_num: '22334455', rc: '223344 Casa', rib: 'MA64 0003 0003 0000 0003 45', email: 'b2b@maghreb.ma',     phone: '+212 5 22 50 00 00', address: 'Casablanca', payment_terms: 0,  balance: 0,     rating: 4 },
  { id: 4, name: 'TechParts Maroc',         category: 'materiel',     ice: '007890123000023', if_num: '66778899', rc: '667788 Tanger', rib: 'MA64 0004 0004 0000 0004 56', email: 'sales@tech.ma',   phone: '+212 5 39 31 00 00', address: 'Tanger',      payment_terms: 45, balance: 22000, rating: 3 },
]

export const MOCK_PRODUCTS = [
  { id: 1, ref: 'INF-001', name: 'Ordinateur portable Dell Latitude', category: 'Informatique', buy_price: 8500,  sell_price: 11000, tva: 20, unit: 'pièce',   stock: 5,    min_stock: 2 },
  { id: 2, ref: 'INF-002', name: 'Écran 24" Full HD',                 category: 'Informatique', buy_price: 1800,  sell_price: 2500,  tva: 20, unit: 'pièce',   stock: 8,    min_stock: 3 },
  { id: 3, ref: 'LOG-001', name: 'Licence Microsoft Office 365',      category: 'Logiciels',    buy_price: 900,   sell_price: 1400,  tva: 20, unit: 'licence', stock: 15,   min_stock: 5 },
  { id: 4, ref: 'FOR-001', name: 'Ramette papier A4 (500 feuilles)',  category: 'Fournitures',  buy_price: 35,    sell_price: 55,    tva: 20, unit: 'ramette', stock: 1,    min_stock: 10 },
  { id: 5, ref: 'FOR-002', name: 'Cartouche encre HP noire',          category: 'Fournitures',  buy_price: 120,   sell_price: 185,   tva: 20, unit: 'pièce',   stock: 3,    min_stock: 5 },
  { id: 6, ref: 'SER-001', name: 'Maintenance informatique (heure)',  category: 'Services',     buy_price: 250,   sell_price: 450,   tva: 20, unit: 'heure',   stock: null, min_stock: null },
  { id: 7, ref: 'SER-002', name: 'Formation React (jour)',            category: 'Services',     buy_price: 1500,  sell_price: 2800,  tva: 20, unit: 'jour',    stock: null, min_stock: null },
]

export const MOCK_STOCK_MOVEMENTS = [
  { id: 1, product_id: 1, type: 'in',  qty: 5,  date: '2025-03-01', reason: 'Réception BC-2025-001', user: 'Sara Alami' },
  { id: 2, product_id: 2, type: 'in',  qty: 8,  date: '2025-03-01', reason: 'Réception BC-2025-001', user: 'Sara Alami' },
  { id: 3, product_id: 3, type: 'in',  qty: 20, date: '2025-02-15', reason: 'Achat initial',          user: 'Sara Alami' },
  { id: 4, product_id: 3, type: 'out', qty: 5,  date: '2025-03-10', reason: 'Livraison FAC-2025-001', user: 'Karim Ouali' },
  { id: 5, product_id: 4, type: 'in',  qty: 20, date: '2025-02-01', reason: 'Stock initial',          user: 'Sara Alami' },
  { id: 6, product_id: 4, type: 'out', qty: 19, date: '2025-03-15', reason: 'Consommation interne',   user: 'Leila Benali' },
  { id: 7, product_id: 5, type: 'in',  qty: 10, date: '2025-02-10', reason: 'Stock initial',          user: 'Sara Alami' },
  { id: 8, product_id: 5, type: 'out', qty: 7,  date: '2025-03-18', reason: 'Consommation interne',   user: 'Karim Ouali' },
]

export const MOCK_QUOTES = [
  { id: 1, ref: 'DEV-2025-001', customer_id: 1, date: '2025-03-15', valid_until: '2025-04-15', status: 'accepted', notes: 'Devis équipement Q2',
    items: [
      { product_id: 1, name: 'Ordinateur portable Dell Latitude', qty: 3, unit_price: 11000, tva: 20, discount: 5 },
      { product_id: 2, name: 'Écran 24" Full HD',                 qty: 3, unit_price: 2500,  tva: 20, discount: 0 },
    ] },
  { id: 2, ref: 'DEV-2025-002', customer_id: 4, date: '2025-03-20', valid_until: '2025-04-20', status: 'sent', notes: '',
    items: [{ product_id: 7, name: 'Formation React (jour)', qty: 3, unit_price: 2800, tva: 20, discount: 10 }] },
  { id: 3, ref: 'DEV-2025-003', customer_id: 2, date: '2025-03-25', valid_until: '2025-04-25', status: 'draft', notes: '',
    items: [{ product_id: 3, name: 'Licence Microsoft Office 365', qty: 10, unit_price: 1400, tva: 20, discount: 0 }] },
]

export const MOCK_INVOICES = [
  { id: 1, ref: 'FAC-2025-001', customer_id: 1, quote_id: 1, date: '2025-03-20', due_date: '2025-04-20', status: 'paid',    notes: '',
    items: [
      { name: 'Ordinateur portable Dell Latitude', qty: 3, unit_price: 11000, tva: 20, discount: 5 },
      { name: 'Écran 24" Full HD',                 qty: 3, unit_price: 2500,  tva: 20, discount: 0 },
    ] },
  { id: 2, ref: 'FAC-2025-002', customer_id: 4, quote_id: null, date: '2025-03-22', due_date: '2025-03-22', status: 'overdue', notes: '',
    items: [{ name: 'Maintenance informatique (heure)', qty: 4, unit_price: 450, tva: 20, discount: 0 }] },
  { id: 3, ref: 'FAC-2025-003', customer_id: 4, quote_id: null, date: '2025-03-28', due_date: '2025-04-28', status: 'sent',    notes: '',
    items: [{ name: 'Formation React (jour)', qty: 2, unit_price: 2800, tva: 20, discount: 10 }] },
]

export const MOCK_PURCHASE_ORDERS = [
  { id: 1, ref: 'BC-2025-001', supplier_id: 1, date: '2025-02-28', expected_date: '2025-03-05', status: 'received', notes: 'Commande matériel Q1',
    items: [
      { product_id: 1, name: 'Ordinateur portable Dell Latitude', qty: 5, unit_price: 8500, tva: 20 },
      { product_id: 2, name: 'Écran 24" Full HD',                 qty: 8, unit_price: 1800, tva: 20 },
    ] },
  { id: 2, ref: 'BC-2025-002', supplier_id: 2, date: '2025-03-10', expected_date: '2025-03-15', status: 'pending', notes: '',
    items: [
      { product_id: 4, name: 'Ramette papier A4',  qty: 50, unit_price: 35,  tva: 20 },
      { product_id: 5, name: 'Cartouche encre HP', qty: 20, unit_price: 120, tva: 20 },
    ] },
  { id: 3, ref: 'BC-2025-003', supplier_id: 4, date: '2025-03-20', expected_date: '2025-04-05', status: 'sent', notes: '',
    items: [{ product_id: 1, name: 'Ordinateur portable Dell Latitude', qty: 2, unit_price: 8200, tva: 20 }] },
]

export const calcTotals = (items) => {
  const ht  = items.reduce((s, i) => s + (i.qty * i.unit_price * (1 - (i.discount || 0) / 100)), 0)
  const tva = items.reduce((s, i) => s + (i.qty * i.unit_price * (1 - (i.discount || 0) / 100) * (i.tva / 100)), 0)
  return { ht: Math.round(ht * 100) / 100, tva: Math.round(tva * 100) / 100, ttc: Math.round((ht + tva) * 100) / 100 }
}

// ═══════════════════════════════════════════════
//  MODULE REVENUS — Income
// ═══════════════════════════════════════════════

// ── Sources disponibles ────────────────────────
export const INCOME_SOURCES = [
  { id: 'salary',      label: 'Salaire',        color: '#3D5A80', icon: '💼' },
  { id: 'freelance',   label: 'Freelance',       color: '#3D7A5F', icon: '💻' },
  { id: 'business',    label: 'Business',        color: '#B8975A', icon: '🏢' },
  { id: 'investment',  label: 'Investissement',  color: '#6B4E8A', icon: '📈' },
  { id: 'rental',      label: 'Location',        color: '#2D7A8A', icon: '🏠' },
  { id: 'other',       label: 'Autre',           color: '#8A8780', icon: '💰' },
]

// ── Données brutes revenus ─────────────────────
const INCOME_RAW = [
  // Janvier
  { id: 1,  amount: 18000, date: '2025-01-28', source: 'salary',     category: 'fixed',    status: 'received', description: 'Salaire janvier — TechMaroc SARL',  user_id: 3, is_recurring: true,  recurrence: 'monthly' },
  { id: 2,  amount: 4500,  date: '2025-01-15', source: 'freelance',  category: 'variable', status: 'received', description: 'Mission React — Client Casablanca',  user_id: 3, is_recurring: false, recurrence: null },
  // Février
  { id: 3,  amount: 18000, date: '2025-02-28', source: 'salary',     category: 'fixed',    status: 'received', description: 'Salaire février — TechMaroc SARL',   user_id: 3, is_recurring: true,  recurrence: 'monthly' },
  { id: 4,  amount: 7200,  date: '2025-02-20', source: 'freelance',  category: 'variable', status: 'received', description: 'Audit sécurité — Startup Rabat',      user_id: 3, is_recurring: false, recurrence: null },
  { id: 5,  amount: 3000,  date: '2025-02-10', source: 'rental',     category: 'fixed',    status: 'received', description: 'Loyer appartement — Ain Diab',        user_id: 1, is_recurring: true,  recurrence: 'monthly' },
  // Mars
  { id: 6,  amount: 18000, date: '2025-03-28', source: 'salary',     category: 'fixed',    status: 'received', description: 'Salaire mars — TechMaroc SARL',       user_id: 3, is_recurring: true,  recurrence: 'monthly' },
  { id: 7,  amount: 12500, date: '2025-03-15', source: 'freelance',  category: 'variable', status: 'received', description: 'Dev e-commerce — Groupe Saham',        user_id: 3, is_recurring: false, recurrence: null },
  { id: 8,  amount: 3000,  date: '2025-03-10', source: 'rental',     category: 'fixed',    status: 'received', description: 'Loyer appartement — Ain Diab',        user_id: 1, is_recurring: true,  recurrence: 'monthly' },
  { id: 9,  amount: 2200,  date: '2025-03-05', source: 'investment', category: 'variable', status: 'received', description: 'Dividendes — Portefeuille Bourse Casa', user_id: 1, is_recurring: false, recurrence: null },
  // Avril (prévu)
  { id: 10, amount: 18000, date: '2025-04-28', source: 'salary',     category: 'fixed',    status: 'planned',  description: 'Salaire avril — TechMaroc SARL',       user_id: 3, is_recurring: true,  recurrence: 'monthly' },
  { id: 11, amount: 8000,  date: '2025-04-20', source: 'freelance',  category: 'variable', status: 'planned',  description: 'Consulting IA — Client Agadir',        user_id: 3, is_recurring: false, recurrence: null },
  { id: 12, amount: 3000,  date: '2025-04-10', source: 'rental',     category: 'fixed',    status: 'planned',  description: 'Loyer appartement — Ain Diab',        user_id: 1, is_recurring: true,  recurrence: 'monthly' },
]

// ── Enrichissement ─────────────────────────────
const enrichIncome = (inc) => ({
  ...inc,
  source_info: INCOME_SOURCES.find(s => s.id === inc.source) ?? INCOME_SOURCES.at(-1),
  user: MOCK_USERS_LIST.find(u => u.id === inc.user_id) ?? null,
})

export const MOCK_INCOMES_RAW    = INCOME_RAW
export const MOCK_INCOMES        = INCOME_RAW.map(enrichIncome)

// ── Objectif revenu ────────────────────────────
export const MOCK_INCOME_GOAL = {
  monthly_target: 30000,   // DH / mois
  yearly_target:  360000,
  created_at: '2025-01-01',
}

// ── Stats calculées ────────────────────────────
export const getIncomeStatsForUser = (user) => {
  const all      = MOCK_INCOMES.filter(i => !user || user.role === 'owner' ? true : i.user_id === user.id)
  const received = all.filter(i => i.status === 'received')
  const planned  = all.filter(i => i.status === 'planned')

  const thisMonth   = '2025-03'
  const lastMonth   = '2025-02'
  const recvThisM   = received.filter(i => i.date.startsWith(thisMonth))
  const recvLastM   = received.filter(i => i.date.startsWith(lastMonth))
  const plannedThisM = planned.filter(i => i.date.startsWith(thisMonth))

  const totalThisMonth = recvThisM.reduce((s, i) => s + i.amount, 0)
  const totalLastMonth = recvLastM.reduce((s, i) => s + i.amount, 0)
  const totalPlanned   = plannedThisM.reduce((s, i) => s + i.amount, 0)
  const totalYTD       = received.reduce((s, i) => s + i.amount, 0)

  // Par source
  const bySource = INCOME_SOURCES.map(src => ({
    source: src.id, label: src.label, color: src.color,
    total: received.filter(i => i.source === src.id).reduce((s, i) => s + i.amount, 0),
    count: received.filter(i => i.source === src.id).length,
  })).filter(s => s.total > 0)

  // Par mois (6 mois)
  const monthly = [
    { month: 'Oct', received: 0,     planned: 0 },
    { month: 'Nov', received: 0,     planned: 0 },
    { month: 'Déc', received: 0,     planned: 0 },
    { month: 'Jan', received: 22500, planned: 22500 },
    { month: 'Fév', received: 28200, planned: 28000 },
    { month: 'Mar', received: 35700, planned: 32000 },
  ]

  // Prévisions (3 mois suivants basées sur historique)
  const avgRecv  = totalYTD / 3
  const forecast = [
    { month: 'Avr', predicted: Math.round(avgRecv * 0.95), confidence: 88 },
    { month: 'Mai', predicted: Math.round(avgRecv * 1.02), confidence: 72 },
    { month: 'Jun', predicted: Math.round(avgRecv * 1.05), confidence: 60 },
  ]

  // Alertes revenus attendus non reçus
  const alerts = planned
    .filter(i => new Date(i.date) < new Date() && i.status !== 'received')
    .map(i => ({ ...i, days_overdue: Math.floor((Date.now() - new Date(i.date)) / 86400000) }))

  return {
    totalThisMonth, totalLastMonth, totalPlanned, totalYTD,
    deltaMonth: totalLastMonth > 0 ? Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100) : 0,
    goalProgress: Math.round((totalThisMonth / MOCK_INCOME_GOAL.monthly_target) * 100),
    bySource, monthly, forecast, alerts,
    all: all.sort((a, b) => new Date(b.date) - new Date(a.date)),
    received: received.sort((a, b) => new Date(b.date) - new Date(a.date)),
    planned: planned.sort((a, b) => new Date(a.date) - new Date(b.date)),
    goal: MOCK_INCOME_GOAL,
  }
}

// ═══════════════════════════════════════════════
//  INCOME CATEGORIES — custom categories
// ═══════════════════════════════════════════════
export let INCOME_CATEGORIES = [
  { id: 1, name: 'Salaire',          color: '#284E7B', icon: '💼', count: 3 },
  { id: 2, name: 'Freelance/Projet', color: '#16a34a', icon: '💻', count: 4 },
  { id: 3, name: 'Immobilier',       color: '#0891b2', icon: '🏠', count: 2 },
  { id: 4, name: 'Investissements',  color: '#7c3aed', icon: '📈', count: 1 },
  { id: 5, name: 'Autre',            color: '#8F908D', icon: '💰', count: 0 },
]
let catNextId = 6

export const CategoryModel = {
  list:   ()         => INCOME_CATEGORIES,
  create: (body)     => {
    const c = { id: catNextId++, ...body, count: 0 }
    INCOME_CATEGORIES.push(c); return c
  },
  update: (id, body) => {
    const idx = INCOME_CATEGORIES.findIndex(c => c.id === +id)
    if (idx === -1) return null
    INCOME_CATEGORIES[idx] = { ...INCOME_CATEGORIES[idx], ...body, id: +id }
    return INCOME_CATEGORIES[idx]
  },
  delete: (id)       => {
    INCOME_CATEGORIES = INCOME_CATEGORIES.filter(c => c.id !== +id)
    return true
  },
}

// ═══════════════════════════════════════════════
//  INCOME NOTIFICATIONS
// ═══════════════════════════════════════════════
export let INCOME_NOTIFICATIONS = [
  { id: 1, user_id: 3, type: 'overdue',  read: false,
    message: '⚠️ Consulting IA — 8 000 MAD attendu depuis 9 jours',
    rev_id: 11, created_at: '2025-04-12' },
  { id: 2, user_id: 3, type: 'received', read: false,
    message: '✓ Salaire mars — 18 000 MAD confirmé',
    rev_id: 6, created_at: '2025-03-28' },
  { id: 3, user_id: 1, type: 'goal',     read: true,
    message: '🎯 Objectif mensuel atteint à 119% ce mois !',
    rev_id: null, created_at: '2025-03-31' },
]
let notifNextId = 4

export const NotifModel = {
  listForUser: (user_id) => INCOME_NOTIFICATIONS.filter(n => n.user_id === user_id),
  add:  (user_id, data) => {
    const n = { id: notifNextId++, user_id, read: false, created_at: new Date().toISOString().slice(0,10), ...data }
    INCOME_NOTIFICATIONS.unshift(n); return n
  },
  markRead: (id) => {
    const n = INCOME_NOTIFICATIONS.find(n => n.id === +id)
    if (n) n.read = true; return n
  },
}

// ═══════════════════════════════════════════════
//  INCOME GOALS (par catégorie)
// ═══════════════════════════════════════════════
export let INCOME_GOALS = {
  monthly:    30000,
  yearly:     360000,
  byCategory: [
    { category_id: 1, target: 18000, label: 'Salaire mensuel' },
    { category_id: 2, target: 10000, label: 'Freelance mensuel' },
  ],
}

// ═══════════════════════════════════════════════
//  SMART INSIGHTS GENERATOR
// ═══════════════════════════════════════════════
export const generateInsights = (stats) => {
  if (!stats) return []
  const items = []
  const { deltaMonth, totalThisMonth, goalProgress, bySource, alerts } = stats

  if (Math.abs(deltaMonth) >= 5) items.push({
    id: 'monthly_delta', type: deltaMonth > 0 ? 'positive' : 'warning',
    title: deltaMonth > 0 ? `Revenus en hausse de ${deltaMonth}%` : `Revenus en baisse de ${Math.abs(deltaMonth)}%`,
    detail: `${deltaMonth > 0 ? '+' : ''}${deltaMonth}% vs mois précédent`,
    urgent: deltaMonth < -15,
  })

  if (bySource?.length) {
    const top   = bySource[0]
    const total = bySource.reduce((s,x) => s + x.total, 0)
    const pct   = total > 0 ? Math.round((top.total / total) * 100) : 0
    items.push({ id: 'top_source', type: 'info',
      title: `${top.label} — source principale (${pct}%)`,
      detail: `${top.total.toLocaleString('fr-MA')} MAD ce mois` })
  }

  if (goalProgress >= 100) items.push({ id: 'goal_done', type: 'success',
    title: 'Objectif mensuel atteint 🎉', detail: `Dépassé de ${goalProgress - 100}%` })
  else if (goalProgress >= 75) items.push({ id: 'goal_close', type: 'info',
    title: `Objectif à ${goalProgress}%`, detail: 'Vous y êtes presque !' })

  if (alerts?.length) items.push({ id: 'overdue', type: 'danger', urgent: true,
    title: `${alerts.length} revenu${alerts.length > 1 ? 's' : ''} en retard`,
    detail: `${alerts.reduce((s,a)=>s+a.amount,0).toLocaleString('fr-MA')} MAD non confirmés` })

  return items
}

// ═══════════════════════════════════════════════
//  CSV EXPORT UTILITY
// ═══════════════════════════════════════════════
export const exportToCSV = (incomes) => {
  const headers = ['ID','Date','Description','Source','Type','Statut','Montant (MAD)','Client','Tags','Récurrent']
  const rows = incomes.map(i => [
    i.id, i.date, `"${i.description}"`, i.source, i.category,
    i.status, i.amount, `"${i.client_name||''}"`,
    `"${(i.tags||[]).join(';')}"`, i.is_recurring ? 'Oui' : 'Non',
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `revenus_${new Date().toISOString().slice(0,10)}.csv`
  a.click(); URL.revokeObjectURL(url)
}

// ═══════════════════════════════════════════════
//  CASH FLOW DATA (revenus vs dépenses)
// ═══════════════════════════════════════════════
export const MOCK_CASHFLOW = [
  { month: 'Oct', revenus: 22000, depenses: 18500, net:  3500 },
  { month: 'Nov', revenus: 19500, depenses: 21000, net: -1500 },
  { month: 'Déc', revenus: 31000, depenses: 26000, net:  5000 },
  { month: 'Jan', revenus: 22500, depenses: 19000, net:  3500 },
  { month: 'Fév', revenus: 28200, depenses: 22400, net:  5800 },
  { month: 'Mar', revenus: 35700, depenses: 28100, net:  7600 },
]

// ═══════════════════════════════════════════════
//  MULTI-ACCOUNT SUPPORT
// ═══════════════════════════════════════════════
export let INCOME_ACCOUNTS = [
  { id: 1, name: 'Compte personnel',  type: 'personal',  color: '#284E7B', icon: '👤', default: true  },
  { id: 2, name: 'Compte entreprise', type: 'business',  color: '#16a34a', icon: '🏢', default: false },
  { id: 3, name: 'Investissements',   type: 'investment',color: '#7c3aed', icon: '📈', default: false },
]

// ═══════════════════════════════════════════════
//  FILE ATTACHMENTS (pièces jointes)
// ═══════════════════════════════════════════════
export let INCOME_ATTACHMENTS = [
  { id: 1, income_id: 7, name: 'facture-mars-2025.pdf',  size: 204800, type: 'application/pdf', url: '#', uploaded_at: '2025-03-28' },
  { id: 2, income_id: 7, name: 'contrat-saham.pdf',      size: 512000, type: 'application/pdf', url: '#', uploaded_at: '2025-03-15' },
  { id: 3, income_id: 9, name: 'releve-dividendes.pdf',  size: 98304,  type: 'application/pdf', url: '#', uploaded_at: '2025-03-05' },
]
let attachNextId = 4

export const AttachmentModel = {
  listForIncome: (income_id) => INCOME_ATTACHMENTS.filter(a => a.income_id === +income_id),
  add: (income_id, file) => {
    const a = { id: attachNextId++, income_id: +income_id, ...file,
      uploaded_at: new Date().toISOString().slice(0, 10) }
    INCOME_ATTACHMENTS.push(a); return a
  },
  delete: (id) => {
    INCOME_ATTACHMENTS = INCOME_ATTACHMENTS.filter(a => a.id !== +id)
    return true
  },
}

// ═══════════════════════════════════════════════
//  RECURRING ENGINE — génération automatique
// ═══════════════════════════════════════════════
const addMonths  = (d, n) => { const dt = new Date(d); dt.setMonth(dt.getMonth() + n);   return dt.toISOString().slice(0,10) }
const addWeeks   = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n*7);   return dt.toISOString().slice(0,10) }
const addYears   = (d, n) => { const dt = new Date(d); dt.setFullYear(dt.getFullYear()+n); return dt.toISOString().slice(0,10) }

export const computeNextOccurrence = (date, recurrence) => {
  if (!recurrence || !date) return null
  if (recurrence === 'monthly')  return addMonths(date, 1)
  if (recurrence === 'weekly')   return addWeeks(date, 1)
  if (recurrence === 'yearly')   return addYears(date, 1)
  return null
}

// Génère les prochaines occurrences d'un revenu récurrent (jusqu'à N mois)
export const generateRecurringSchedule = (income, monthsAhead = 3) => {
  if (!income.is_recurring || !income.recurrence) return []
  const schedule = []
  let currentDate = income.next_occurrence || computeNextOccurrence(income.date, income.recurrence)
  const limit = new Date()
  limit.setMonth(limit.getMonth() + monthsAhead)

  while (currentDate && new Date(currentDate) <= limit && schedule.length < 12) {
    schedule.push({
      ...income,
      id:     null,           // pas encore créé
      date:   currentDate,
      status: 'planned',
      next_occurrence: computeNextOccurrence(currentDate, income.recurrence),
    })
    currentDate = computeNextOccurrence(currentDate, income.recurrence)
  }
  return schedule
}

// ═══════════════════════════════════════════════
//  EXTENDED INCOME STATS (avec cashflow + score)
// ═══════════════════════════════════════════════
export const getExtendedStats = (user) => {
  const base = getIncomeStatsForUser(user)

  // Récurrents
  const recurring = MOCK_INCOMES.filter(i => i.is_recurring)
  const schedule  = recurring.flatMap(i => generateRecurringSchedule(i, 3))

  // Comptes
  const byAccount = INCOME_ACCOUNTS.map(acc => ({
    ...acc,
    total: MOCK_INCOMES
      .filter(i => i.status === 'received' && (i.account_id === acc.id || (!i.account_id && acc.default)))
      .reduce((s, i) => s + i.amount, 0),
  }))

  return {
    ...base,
    cashflow:   MOCK_CASHFLOW,
    schedule,             // prochaines occurrences récurrentes
    byAccount,
    recurring:  recurring.length,
  }
}