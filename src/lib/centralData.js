/**
 * centralData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for ALL mock data.
 * All modules reference these arrays. IDs are consistent across modules.
 * When connecting to a backend, replace these exports with API service calls.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── CUSTOMERS ──────────────────────────────────────────────────────────────
export const CENTRAL_CUSTOMERS = [
  {
    id: 1, name: 'Groupe Saham',   type: 'enterprise',
    ice: '002345678000056', email: 'contact@saham.ma',
    phone: '+212 5 22 48 00 00', address: 'Casablanca',
    payment_terms: 30, credit_limit: 500000,
    total_billed: 117040, total_paid: 117040, balance: 0,
    status: 'active', created_at: '2024-01-10',
  },
  {
    id: 2, name: 'Marjane',        type: 'enterprise',
    ice: '001234567000012', email: 'achats@marjane.ma',
    phone: '+212 5 37 71 00 00', address: 'Rabat',
    payment_terms: 60, credit_limit: 1000000,
    total_billed: 19200, total_paid: 0, balance: 19200,
    status: 'active', created_at: '2024-02-05',
  },
  {
    id: 3, name: 'OCP Group',      type: 'enterprise',
    ice: '000234567000034', email: 'ocp@ocpgroup.ma',
    phone: '+212 5 22 91 00 00', address: 'Casablanca',
    payment_terms: 90, credit_limit: 2000000,
    total_billed: 0, total_paid: 0, balance: 0,
    status: 'active', created_at: '2024-03-01',
  },
  {
    id: 4, name: 'Youssef Amrani', type: 'individual',
    ice: '', email: 'y.amrani@gmail.com',
    phone: '+212 6 61 00 00 01', address: 'Fès',
    payment_terms: 0, credit_limit: 10000,
    total_billed: 22164, total_paid: 0, balance: 22164,
    status: 'active', created_at: '2024-01-20',
  },
]

// ─── SUPPLIERS ──────────────────────────────────────────────────────────────
export const CENTRAL_SUPPLIERS = [
  { id: 1, name: 'Dell Technologies Maroc', category: 'informatique', email: 'maroc@dell.com',     phone: '+212 5 22 36 00 00', address: 'Casablanca', payment_terms: 30, balance: 45000, rating: 5, status: 'active' },
  { id: 2, name: 'Atlas Fournitures',       category: 'fournitures',  email: 'cmd@atlas.ma',       phone: '+212 5 37 62 00 00', address: 'Rabat',       payment_terms: 15, balance: 8500,  rating: 4, status: 'active' },
  { id: 3, name: 'Maghreb Travel Pro',      category: 'voyages',      email: 'b2b@maghreb.ma',     phone: '+212 5 22 50 00 00', address: 'Casablanca', payment_terms: 0,  balance: 0,     rating: 4, status: 'active' },
  { id: 4, name: 'TechParts Maroc',         category: 'materiel',     email: 'sales@techparts.ma', phone: '+212 5 39 31 00 00', address: 'Tanger',      payment_terms: 45, balance: 22000, rating: 3, status: 'active' },
]

// ─── PRODUCTS / STOCK ────────────────────────────────────────────────────────
export const CENTRAL_PRODUCTS = [
  { id: 1, ref: 'INF-001', name: 'Ordinateur portable Dell Latitude', category: 'Informatique', supplier_id: 1, buy_price: 8500,  sell_price: 11000, tva: 20, unit: 'pièce',   stock: 5,    min_stock: 2,  status: 'active' },
  { id: 2, ref: 'INF-002', name: 'Écran 24" Full HD',                 category: 'Informatique', supplier_id: 1, buy_price: 1800,  sell_price: 2500,  tva: 20, unit: 'pièce',   stock: 8,    min_stock: 3,  status: 'active' },
  { id: 3, ref: 'LOG-001', name: 'Licence Microsoft Office 365',      category: 'Logiciels',    supplier_id: 1, buy_price: 900,   sell_price: 1400,  tva: 20, unit: 'licence', stock: 15,   min_stock: 5,  status: 'active' },
  { id: 4, ref: 'FOR-001', name: 'Ramette papier A4 (500 feuilles)',  category: 'Fournitures',  supplier_id: 2, buy_price: 35,    sell_price: 55,    tva: 20, unit: 'ramette', stock: 1,    min_stock: 10, status: 'low_stock' },
  { id: 5, ref: 'FOR-002', name: 'Cartouche encre HP noire',          category: 'Fournitures',  supplier_id: 2, buy_price: 120,   sell_price: 185,   tva: 20, unit: 'pièce',   stock: 3,    min_stock: 5,  status: 'low_stock' },
  { id: 6, ref: 'SER-001', name: 'Maintenance informatique (heure)',  category: 'Services',     supplier_id: null, buy_price: 250, sell_price: 450,  tva: 20, unit: 'heure',   stock: null, min_stock: null, status: 'active' },
  { id: 7, ref: 'SER-002', name: 'Formation React (jour)',            category: 'Services',     supplier_id: null, buy_price: 1500,sell_price: 2800,  tva: 20, unit: 'jour',    stock: null, min_stock: null, status: 'active' },
]

// ─── TAXES ──────────────────────────────────────────────────────────────────
export const CENTRAL_TAXES = [
  { id: 't1', name: 'TVA Normal 20%', rate: 20, type: 'sale',     active: true  },
  { id: 't2', name: 'TVA Réduit 7%',  rate: 7,  type: 'sale',     active: true  },
  { id: 't3', name: 'TVA 10%',        rate: 10, type: 'sale',     active: true  },
  { id: 't4', name: 'TVA Achat 20%',  rate: 20, type: 'purchase', active: true  },
  { id: 't5', name: 'Exonéré (0%)',   rate: 0,  type: 'sale',     active: true  },
]

// ─── QUOTES ──────────────────────────────────────────────────────────────────
export const CENTRAL_QUOTES = [
  {
    id: 1, reference: 'DEV-2025-001', customer_id: 1, customer_name: 'Groupe Saham',
    date: '2025-03-15', valid_until: '2025-04-15', status: 'accepted', notes: 'Devis équipement Q2',
    items: [
      { product_id: 1, name: 'Ordinateur portable Dell Latitude', qty: 3, unit_price: 11000, tva: 20, discount: 5 },
      { product_id: 2, name: 'Écran 24" Full HD',                 qty: 3, unit_price: 2500,  tva: 20, discount: 0 },
    ],
    subtotal: 39900, tax_amount: 7500, total: 47400,
    invoice_id: 1,   // converted to invoice
  },
  {
    id: 2, reference: 'DEV-2025-002', customer_id: 4, customer_name: 'Youssef Amrani',
    date: '2025-03-20', valid_until: '2025-04-20', status: 'sent', notes: '',
    items: [{ product_id: 7, name: 'Formation React (jour)', qty: 3, unit_price: 2800, tva: 20, discount: 10 }],
    subtotal: 7560, tax_amount: 1512, total: 9072,
    invoice_id: null,
  },
  {
    id: 3, reference: 'DEV-2025-003', customer_id: 2, customer_name: 'Marjane',
    date: '2025-03-25', valid_until: '2025-04-25', status: 'draft', notes: '',
    items: [{ product_id: 3, name: 'Licence Microsoft Office 365', qty: 10, unit_price: 1400, tva: 20, discount: 0 }],
    subtotal: 14000, tax_amount: 2800, total: 16800,
    invoice_id: null,
  },
]

// ─── INVOICES ────────────────────────────────────────────────────────────────
export const CENTRAL_INVOICES = [
  {
    id: 1, reference: 'FAC-2025-001', customer_id: 1, customer_name: 'Groupe Saham',
    quote_id: 1, date: '2025-03-20', due_date: '2025-04-20', status: 'paid',
    items: [
      { product_id: 1, name: 'Ordinateur portable Dell Latitude', qty: 3, unit_price: 11000, tva: 20, discount: 5 },
      { product_id: 2, name: 'Écran 24" Full HD',                 qty: 3, unit_price: 2500,  tva: 20, discount: 0 },
    ],
    subtotal: 39900, tax_amount: 7500, total: 47400,
    paid_amount: 47400, remaining_amount: 0,
    revenue_id: 'rev-1',  // linked revenue
  },
  {
    id: 2, reference: 'FAC-2025-002', customer_id: 4, customer_name: 'Youssef Amrani',
    quote_id: null, date: '2025-03-22', due_date: '2025-03-22', status: 'overdue',
    items: [{ product_id: 6, name: 'Maintenance informatique (heure)', qty: 4, unit_price: 450, tva: 20, discount: 0 }],
    subtotal: 1800, tax_amount: 360, total: 2160,
    paid_amount: 0, remaining_amount: 2160,
    revenue_id: null,
  },
  {
    id: 3, reference: 'FAC-2025-003', customer_id: 4, customer_name: 'Youssef Amrani',
    quote_id: null, date: '2025-03-28', due_date: '2025-04-28', status: 'sent',
    items: [{ product_id: 7, name: 'Formation React (jour)', qty: 2, unit_price: 2800, tva: 20, discount: 10 }],
    subtotal: 5040, tax_amount: 1008, total: 6048,
    paid_amount: 0, remaining_amount: 6048,
    revenue_id: null,
  },
  {
    id: 4, reference: 'FAC-2025-004', customer_id: 2, customer_name: 'Marjane',
    quote_id: null, date: '2025-04-01', due_date: '2025-05-01', status: 'sent',
    items: [{ product_id: 3, name: 'Licence Microsoft Office 365', qty: 10, unit_price: 1400, tva: 20, discount: 0 }],
    subtotal: 14000, tax_amount: 2800, total: 16800,
    paid_amount: 0, remaining_amount: 16800,
    revenue_id: null,
  },
]

// ─── REVENUES ───────────────────────────────────────────────────────────────
export const CENTRAL_REVENUES = [
  {
    id: 'rev-1', reference: 'REV-2025-001',
    title: 'Vente équipement — Groupe Saham',
    amount: 47400, category: 'Ventes', source: 'invoice',
    invoice_id: 1, customer_id: 1, customer_name: 'Groupe Saham',
    status: 'received', date: '2025-03-25',
    description: 'Paiement de la facture FAC-2025-001',
  },
  {
    id: 'rev-2', reference: 'REV-2025-002',
    title: 'Prestation conseil — Innov Corp',
    amount: 28800, category: 'Prestations', source: 'service',
    invoice_id: null, customer_id: null, customer_name: 'Innov Corp',
    status: 'received', date: '2025-03-28',
    description: 'Prestation consulting Q1',
  },
  {
    id: 'rev-3', reference: 'REV-2025-003',
    title: 'Formation ERP — 5 jours',
    amount: 14000, category: 'Formations', source: 'service',
    invoice_id: null, customer_id: null, customer_name: 'Tech Solutions',
    status: 'received', date: '2025-04-02',
    description: 'Formation ERP pour équipe client',
  },
  {
    id: 'rev-4', reference: 'REV-2025-004',
    title: 'Vente licences logiciels',
    amount: 12600, category: 'Ventes', source: 'invoice',
    invoice_id: null, customer_id: 3, customer_name: 'OCP Group',
    status: 'received', date: '2025-04-05',
    description: 'Licences Microsoft Q2',
  },
]

// ─── EXPENSES ────────────────────────────────────────────────────────────────
export const CENTRAL_EXPENSES = [
  {
    id: 1, reference: 'EXP-2025-001',
    title: 'Vol Casablanca–Paris', amount: 4800, status: 'pending',
    date: '2025-03-18', category: 'Déplacement', category_color: '#6366f1',
    employee_id: 3, employee_name: 'Leila Benali', team: 'R&D',
    description: 'Mission client Paris',
    budget_id: 1, reimbursement_id: null,
  },
  {
    id: 2, reference: 'EXP-2025-002',
    title: 'Hôtel Marriott — 3 nuits', amount: 3600, status: 'approved',
    date: '2025-03-15', category: 'Hébergement', category_color: '#10b981',
    employee_id: 3, employee_name: 'Leila Benali', team: 'R&D',
    description: 'Séjour Paris',
    budget_id: 2, reimbursement_id: 1,
    approved_by: 'Karim Ouali', approved_at: '2025-03-16',
  },
  {
    id: 3, reference: 'EXP-2025-003',
    title: 'Repas équipe R&D', amount: 1250, status: 'approved',
    date: '2025-03-12', category: 'Restauration', category_color: '#f59e0b',
    employee_id: 2, employee_name: 'Karim Ouali', team: 'R&D',
    description: 'Sprint review',
    budget_id: 2, reimbursement_id: null,
    approved_by: 'Sara Alami', approved_at: '2025-03-13',
  },
  {
    id: 4, reference: 'EXP-2025-004',
    title: 'Abonnements SaaS mensuels', amount: 2900, status: 'paid',
    date: '2025-03-10', category: 'Informatique', category_color: '#3b82f6',
    employee_id: 1, employee_name: 'Sara Alami', team: 'Direction',
    description: 'Figma, Notion, Slack',
    budget_id: 3, reimbursement_id: 2,
    approved_by: 'Sara Alami', approved_at: '2025-03-11',
  },
  {
    id: 5, reference: 'EXP-2025-005',
    title: 'Taxi aéroport', amount: 320, status: 'pending',
    date: '2025-03-08', category: 'Déplacement', category_color: '#6366f1',
    employee_id: 4, employee_name: 'Amine Moudni', team: 'Commercial',
    description: '',
    budget_id: 1, reimbursement_id: null,
  },
  {
    id: 6, reference: 'EXP-2025-006',
    title: 'Formation React avancé', amount: 5400, status: 'pending',
    date: '2025-03-05', category: 'Formation', category_color: '#ef4444',
    employee_id: 3, employee_name: 'Leila Benali', team: 'R&D',
    description: 'Formation 3 jours',
    budget_id: 4, reimbursement_id: null,
  },
  {
    id: 7, reference: 'EXP-2025-007',
    title: 'Restaurant client partenaire', amount: 1100, status: 'approved',
    date: '2025-03-03', category: 'Restauration', category_color: '#f59e0b',
    employee_id: 2, employee_name: 'Karim Ouali', team: 'R&D',
    description: '',
    budget_id: 2, reimbursement_id: null,
  },
  {
    id: 8, reference: 'EXP-2025-008',
    title: 'Matériel bureau', amount: 890, status: 'rejected',
    date: '2025-02-28', category: 'Fournitures', category_color: '#8b5cf6',
    employee_id: 5, employee_name: 'Nadia Ziani', team: 'Marketing',
    description: '',
    budget_id: null, reimbursement_id: null,
    rejection_reason: 'Budget épuisé.',
  },
]

// ─── REIMBURSEMENTS ──────────────────────────────────────────────────────────
export const CENTRAL_REIMBURSEMENTS = [
  {
    id: 1, reference: 'REM-2025-001',
    expense_id: 2, expense_ref: 'EXP-2025-002', expense_title: 'Hôtel Marriott — 3 nuits',
    employee_id: 3, employee_name: 'Leila Benali',
    requested_amount: 3600, approved_amount: 3600, reimbursed_amount: 0,
    remaining_amount: 3600, status: 'approved',
    payment_method: 'virement', reimbursement_date: null,
    rejection_reason: null, created_at: '2025-03-16',
    accounting_ref: 'ACC-REM-001',
  },
  {
    id: 2, reference: 'REM-2025-002',
    expense_id: 4, expense_ref: 'EXP-2025-004', expense_title: 'Abonnements SaaS mensuels',
    employee_id: 1, employee_name: 'Sara Alami',
    requested_amount: 2900, approved_amount: 2900, reimbursed_amount: 2900,
    remaining_amount: 0, status: 'paid',
    payment_method: 'virement', reimbursement_date: '2025-03-20',
    rejection_reason: null, created_at: '2025-03-11',
    accounting_ref: 'ACC-REM-002',
  },
]

// ─── BUDGETS ─────────────────────────────────────────────────────────────────
export const CENTRAL_BUDGETS = [
  {
    id: 1, name: 'Déplacements annuels', category: 'Déplacement',
    team_id: null, allocated_amount: 50000, period: 'yearly',
    start_date: '2025-01-01', end_date: '2025-12-31',
    spent_amount: 12620, remaining_amount: 37380,
    status: 'active',
  },
  {
    id: 2, name: 'Restauration & Hébergement', category: 'Restauration',
    team_id: null, allocated_amount: 30000, period: 'yearly',
    start_date: '2025-01-01', end_date: '2025-12-31',
    spent_amount: 24580, remaining_amount: 5420,
    status: 'alert',
  },
  {
    id: 3, name: 'IT & SaaS — R&D', category: 'Informatique',
    team_id: 2, allocated_amount: 20000, period: 'yearly',
    start_date: '2025-01-01', end_date: '2025-12-31',
    spent_amount: 13600, remaining_amount: 6400,
    status: 'active',
  },
  {
    id: 4, name: 'Formation équipe R&D', category: 'Formation',
    team_id: 2, allocated_amount: 15000, period: 'yearly',
    start_date: '2025-01-01', end_date: '2025-12-31',
    spent_amount: 5400, remaining_amount: 9600,
    status: 'active',
  },
  {
    id: 5, name: 'Marketing & Communication', category: 'Marketing',
    team_id: 4, allocated_amount: 25000, period: 'yearly',
    start_date: '2025-01-01', end_date: '2025-12-31',
    spent_amount: 21800, remaining_amount: 3200,
    status: 'alert',
  },
]

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
export const CENTRAL_PAYMENTS = [
  { id: 'pay1', invoice_id: 1, invoice_ref: 'FAC-2025-001', customer_name: 'Groupe Saham',  amount: 47400, method: 'bank_transfer', date: '2025-03-25', reference: 'VIR-2025-0325', status: 'completed' },
]

// ─── ACCOUNTING ENTRIES ──────────────────────────────────────────────────────
export const CENTRAL_ACCOUNTING_ENTRIES = [
  {
    id: 'ACC-001', reference: 'ACC-2025-001',
    date: '2025-03-25', description: 'Encaissement FAC-2025-001 — Groupe Saham',
    source_module: 'invoice', source_id: 1, source_ref: 'FAC-2025-001',
    debit_account: '1120', credit_account: '7110', amount: 47400, status: 'posted',
  },
  {
    id: 'ACC-002', reference: 'ACC-2025-002',
    date: '2025-03-16', description: 'Approbation dépense EXP-2025-002 — Leila Benali',
    source_module: 'expense', source_id: 2, source_ref: 'EXP-2025-002',
    debit_account: '6xxx', credit_account: '4xxx', amount: 3600, status: 'posted',
  },
  {
    id: 'ACC-003', reference: 'ACC-2025-003',
    date: '2025-03-20', description: 'Remboursement REM-2025-002 — Sara Alami',
    source_module: 'reimbursement', source_id: 2, source_ref: 'REM-2025-002',
    debit_account: '4xxx', credit_account: '1120', amount: 2900, status: 'posted',
  },
  {
    id: 'ACC-004', reference: 'ACC-2025-004',
    date: '2025-03-28', description: 'Revenu REV-2025-002 — Prestation conseil',
    source_module: 'revenue', source_id: 'rev-2', source_ref: 'REV-2025-002',
    debit_account: '1310', credit_account: '7210', amount: 28800, status: 'posted',
  },
]

// ─── MONTHLY STATS (for charts) ──────────────────────────────────────────────
export const CENTRAL_MONTHLY_STATS = [
  { month: 'Oct', revenue: 42000, expenses: 32000, result: 10000 },
  { month: 'Nov', revenue: 38500, expenses: 28500, result: 10000 },
  { month: 'Déc', revenue: 51000, expenses: 41000, result: 10000 },
  { month: 'Jan', revenue: 47000, expenses: 38000, result:  9000 },
  { month: 'Fév', revenue: 55000, expenses: 43000, result: 12000 },
  { month: 'Mar', revenue: 62000, expenses: 48200, result: 13800 },
  { month: 'Avr', revenue: 58400, expenses: 44600, result: 13800 },
  { month: 'Mai', revenue: 64000, expenses: 47800, result: 16200 },
  { month: 'Jun', revenue: 71200, expenses: 52400, result: 18800 },
]

// ─── HELPER FUNCTIONS ────────────────────────────────────────────────────────
export const calcTotals = (items) => {
  const ht  = items.reduce((s, i) => s + (i.qty * i.unit_price * (1 - (i.discount || 0) / 100)), 0)
  const tva = items.reduce((s, i) => s + (i.qty * i.unit_price * (1 - (i.discount || 0) / 100) * ((i.tva || 0) / 100)), 0)
  return { ht: Math.round(ht * 100) / 100, tva: Math.round(tva * 100) / 100, ttc: Math.round((ht + tva) * 100) / 100 }
}

export const getCustomerById   = (id) => CENTRAL_CUSTOMERS.find(c => c.id === id)
export const getSupplierById   = (id) => CENTRAL_SUPPLIERS.find(s => s.id === id)
export const getProductById    = (id) => CENTRAL_PRODUCTS.find(p => p.id === id)

// Compute budget percentage
export const budgetPct = (b) => {
  const alloc = b.allocated_amount ?? b.amount ?? 1
  const spent = b.spent_amount ?? b.spent ?? 0
  return Math.round((spent / alloc) * 100)
}
