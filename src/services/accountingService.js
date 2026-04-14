// ─────────────────────────────────────────────────────────────────────────────
// accountingService.js  –  Mock service layer for the Accounting module
// Replace these functions with real API calls (axios/fetch) when connecting
// to a backend.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms = 350) => new Promise(r => setTimeout(r, ms))

// ─── CHART OF ACCOUNTS ───────────────────────────────────────────────────────
export const ACCOUNTS = [
  // Assets (1xx)
  { id: 'a1', code: '1110', name: 'Caisse',                      type: 'asset',     balance:  45200.00 },
  { id: 'a2', code: '1120', name: 'Banque Principale',           type: 'asset',     balance: 312450.75 },
  { id: 'a3', code: '1130', name: 'Banque Secondaire',           type: 'asset',     balance:  18900.00 },
  { id: 'a4', code: '1310', name: 'Clients',                     type: 'asset',     balance:  87600.00 },
  { id: 'a5', code: '1320', name: 'Effets à recevoir',           type: 'asset',     balance:  12300.00 },
  { id: 'a6', code: '2110', name: 'Stocks de marchandises',      type: 'asset',     balance:  64800.00 },
  { id: 'a7', code: '2310', name: 'Immobilisations corporelles', type: 'asset',     balance: 185000.00 },
  { id: 'a8', code: '2410', name: 'Amortissements',              type: 'asset',     balance: -42000.00 },
  { id: 'a9', code: '3410', name: 'TVA récupérable',             type: 'asset',     balance:  11240.00 },

  // Liabilities (4xx)
  { id: 'l1', code: '4110', name: 'Fournisseurs',                type: 'liability', balance:  52300.00 },
  { id: 'l2', code: '4120', name: 'Effets à payer',              type: 'liability', balance:   8700.00 },
  { id: 'l3', code: '4410', name: 'TVA collectée',               type: 'liability', balance:  22480.00 },
  { id: 'l4', code: '4420', name: 'TVA à décaisser',             type: 'liability', balance:  11240.00 },
  { id: 'l5', code: '4510', name: 'Charges sociales à payer',    type: 'liability', balance:  18600.00 },
  { id: 'l6', code: '4810', name: 'Emprunts bancaires',          type: 'liability', balance: 120000.00 },
  { id: 'l7', code: '4820', name: 'Dettes diverses',             type: 'liability', balance:   6500.00 },

  // Equity (5xx)
  { id: 'e1', code: '5110', name: 'Capital social',              type: 'equity',    balance: 300000.00 },
  { id: 'e2', code: '5120', name: 'Réserves légales',            type: 'equity',    balance:  45000.00 },
  { id: 'e3', code: '5130', name: 'Résultat net exercice',       type: 'equity',    balance:  96670.75 },
  { id: 'e4', code: '5140', name: 'Report à nouveau',            type: 'equity',    balance:  14500.00 },

  // Revenue (7xx)
  { id: 'r1', code: '7110', name: "Ventes de marchandises",      type: 'revenue',   balance: 524000.00 },
  { id: 'r2', code: '7120', name: 'Ventes de produits finis',    type: 'revenue',   balance: 187500.00 },
  { id: 'r3', code: '7210', name: 'Prestations de services',     type: 'revenue',   balance:  98600.00 },
  { id: 'r4', code: '7410', name: 'Subventions reçues',          type: 'revenue',   balance:  12000.00 },
  { id: 'r5', code: '7510', name: 'Produits financiers',         type: 'revenue',   balance:   3200.00 },

  // Expenses (6xx)
  { id: 'x1', code: '6110', name: 'Achats de marchandises',      type: 'expense',   balance: 312000.00 },
  { id: 'x2', code: '6120', name: 'Achats de matières',          type: 'expense',   balance:  87400.00 },
  { id: 'x3', code: '6210', name: 'Loyer & charges locatives',   type: 'expense',   balance:  36000.00 },
  { id: 'x4', code: '6220', name: 'Salaires et traitements',     type: 'expense',   balance: 128000.00 },
  { id: 'x5', code: '6230', name: 'Charges sociales patronales', type: 'expense',   balance:  32000.00 },
  { id: 'x6', code: '6310', name: 'Télécommunications',          type: 'expense',   balance:   4800.00 },
  { id: 'x7', code: '6320', name: 'Fournitures de bureau',       type: 'expense',   balance:   3200.00 },
  { id: 'x8', code: '6410', name: 'Dotations aux amortissements',type: 'expense',   balance:  14000.00 },
  { id: 'x9', code: '6510', name: 'Charges financières',         type: 'expense',   balance:   8760.00 },
  { id:'x10', code: '6610', name: 'Impôts et taxes',             type: 'expense',   balance:  21600.00 },
]

// ─── JOURNAL ENTRIES ─────────────────────────────────────────────────────────
export const JOURNAL_ENTRIES = [
  {
    id: 'je1', reference: 'JRN-2024-001', date: '2024-01-05',
    description: 'Vente de marchandises – Client SARL Atlas',
    lines: [
      { account_id: 'a4', account_code: '1310', account_name: 'Clients',          debit: 35400, credit: 0 },
      { account_id: 'r1', account_code: '7110', account_name: 'Ventes marchand.', debit: 0, credit: 30000 },
      { account_id: 'l3', account_code: '4410', account_name: 'TVA collectée',    debit: 0, credit:  5400 },
    ],
  },
  {
    id: 'je2', reference: 'JRN-2024-002', date: '2024-01-08',
    description: 'Achat stock fournisseur El Wafae',
    lines: [
      { account_id: 'a6', account_code: '2110', account_name: 'Stocks',           debit: 18000, credit: 0 },
      { account_id: 'a9', account_code: '3410', account_name: 'TVA récup.',       debit:  3240, credit: 0 },
      { account_id: 'l1', account_code: '4110', account_name: 'Fournisseurs',     debit: 0, credit: 21240 },
    ],
  },
  {
    id: 'je3', reference: 'JRN-2024-003', date: '2024-01-15',
    description: 'Règlement fournisseur El Wafae – virement',
    lines: [
      { account_id: 'l1', account_code: '4110', account_name: 'Fournisseurs',     debit: 21240, credit: 0 },
      { account_id: 'a2', account_code: '1120', account_name: 'Banque',           debit: 0, credit: 21240 },
    ],
  },
  {
    id: 'je4', reference: 'JRN-2024-004', date: '2024-01-20',
    description: 'Paiement salaires janvier',
    lines: [
      { account_id: 'x4', account_code: '6220', account_name: 'Salaires',         debit: 32000, credit: 0 },
      { account_id: 'x5', account_code: '6230', account_name: 'Charges sociales', debit:  8000, credit: 0 },
      { account_id: 'a2', account_code: '1120', account_name: 'Banque',           debit: 0, credit: 40000 },
    ],
  },
  {
    id: 'je5', reference: 'JRN-2024-005', date: '2024-01-25',
    description: 'Encaissement client SARL Atlas',
    lines: [
      { account_id: 'a2', account_code: '1120', account_name: 'Banque',           debit: 35400, credit: 0 },
      { account_id: 'a4', account_code: '1310', account_name: 'Clients',          debit: 0, credit: 35400 },
    ],
  },
  {
    id: 'je6', reference: 'JRN-2024-006', date: '2024-02-03',
    description: 'Prestation de service – Client Tech Solutions',
    lines: [
      { account_id: 'a4', account_code: '1310', account_name: 'Clients',          debit: 14400, credit: 0 },
      { account_id: 'r3', account_code: '7210', account_name: 'Prestations',      debit: 0, credit: 12000 },
      { account_id: 'l3', account_code: '4410', account_name: 'TVA collectée',    debit: 0, credit:  2400 },
    ],
  },
  {
    id: 'je7', reference: 'JRN-2024-007', date: '2024-02-10',
    description: 'Loyer mensuel – Février',
    lines: [
      { account_id: 'x3', account_code: '6210', account_name: 'Loyer',            debit: 3000, credit: 0 },
      { account_id: 'a2', account_code: '1120', account_name: 'Banque',           debit: 0, credit: 3000 },
    ],
  },
  {
    id: 'je8', reference: 'JRN-2024-008', date: '2024-02-28',
    description: 'Dotation amortissement matériel',
    lines: [
      { account_id: 'x8', account_code: '6410', account_name: 'Amortissements',   debit: 1167, credit: 0 },
      { account_id: 'a8', account_code: '2410', account_name: 'Amort. cumulés',   debit: 0, credit: 1167 },
    ],
  },
]

// ─── TAXES ───────────────────────────────────────────────────────────────────
export const TAXES = [
  { id: 't1', name: 'TVA Normal 20%',     rate: 20, type: 'sale',     active: true },
  { id: 't2', name: 'TVA Réduit 7%',      rate: 7,  type: 'sale',     active: true },
  { id: 't3', name: 'TVA 10%',            rate: 10, type: 'sale',     active: true },
  { id: 't4', name: 'TVA Achat 20%',      rate: 20, type: 'purchase', active: true },
  { id: 't5', name: 'TVA Achat 7%',       rate: 7,  type: 'purchase', active: true },
  { id: 't6', name: 'Exonéré (0%)',       rate: 0,  type: 'sale',     active: true },
]

// ─── INVOICES ────────────────────────────────────────────────────────────────
export const INVOICES = [
  {
    id: 'inv1', reference: 'FAC-2024-001', customer: 'SARL Atlas',
    date: '2024-01-05', due_date: '2024-02-05',
    items: [
      { product: 'Marchandises Type A', quantity: 100, price: 150,  tax_rate: 20 },
      { product: 'Marchandises Type B', quantity:  50, price: 180,  tax_rate: 20 },
    ],
    subtotal: 24000, tax_amount: 4800, total: 28800,
    status: 'paid',
  },
  {
    id: 'inv2', reference: 'FAC-2024-002', customer: 'SAS Horizon',
    date: '2024-01-18', due_date: '2024-02-18',
    items: [
      { product: 'Prestation conseil',   quantity:  20, price: 800,  tax_rate: 20 },
    ],
    subtotal: 16000, tax_amount: 3200, total: 19200,
    status: 'sent',
  },
  {
    id: 'inv3', reference: 'FAC-2024-003', customer: 'Tech Solutions',
    date: '2024-02-03', due_date: '2024-03-03',
    items: [
      { product: 'Développement logiciel', quantity: 1, price: 12000, tax_rate: 20 },
      { product: 'Maintenance mensuelle',  quantity: 3, price: 500,   tax_rate: 20 },
    ],
    subtotal: 13500, tax_amount: 2700, total: 16200,
    status: 'paid',
  },
  {
    id: 'inv4', reference: 'FAC-2024-004', customer: 'Global Trade SARL',
    date: '2024-02-15', due_date: '2024-03-15',
    items: [
      { product: 'Marchandises Type C',  quantity: 200, price: 95,   tax_rate: 20 },
      { product: 'Emballages',           quantity: 200, price:  8,   tax_rate: 7  },
    ],
    subtotal: 20600, tax_amount: 3904, total: 24504,
    status: 'overdue',
  },
  {
    id: 'inv5', reference: 'FAC-2024-005', customer: 'Innov Corp',
    date: '2024-03-01', due_date: '2024-04-01',
    items: [
      { product: 'Formation ERP',        quantity: 5, price: 2400,  tax_rate: 20 },
    ],
    subtotal: 12000, tax_amount: 2400, total: 14400,
    status: 'draft',
  },
  {
    id: 'inv6', reference: 'FAC-2024-006', customer: 'SARL Atlas',
    date: '2024-03-10', due_date: '2024-04-10',
    items: [
      { product: 'Marchandises Type A',  quantity: 80, price: 155,   tax_rate: 20 },
    ],
    subtotal: 12400, tax_amount: 2480, total: 14880,
    status: 'sent',
  },
]

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
export const PAYMENTS = [
  { id: 'pay1', invoice_id: 'inv1', invoice_ref: 'FAC-2024-001', customer: 'SARL Atlas',      amount: 28800, method: 'bank_transfer', date: '2024-01-28', reference: 'VIR-20240128-001', status: 'completed' },
  { id: 'pay2', invoice_id: 'inv3', invoice_ref: 'FAC-2024-003', customer: 'Tech Solutions',  amount: 16200, method: 'cheque',         date: '2024-02-20', reference: 'CHQ-20240220-001', status: 'completed' },
  { id: 'pay3', invoice_id: 'inv2', invoice_ref: 'FAC-2024-002', customer: 'SAS Horizon',     amount:  9600, method: 'bank_transfer', date: '2024-03-01', reference: 'VIR-20240301-001', status: 'partial' },
  { id: 'pay4', invoice_id: 'inv6', invoice_ref: 'FAC-2024-006', customer: 'SARL Atlas',      amount:  7440, method: 'cash',          date: '2024-03-15', reference: 'ESP-20240315-001', status: 'partial' },
]

// ─── MONTHLY STATS (for charts) ──────────────────────────────────────────────
export const MONTHLY_STATS = [
  { month: 'Jan', revenue: 87000, expenses: 61200, result: 25800 },
  { month: 'Fév', revenue: 74500, expenses: 52100, result: 22400 },
  { month: 'Mar', revenue: 96800, expenses: 68300, result: 28500 },
  { month: 'Avr', revenue: 83200, expenses: 59700, result: 23500 },
  { month: 'Mai', revenue: 105600, expenses: 74200, result: 31400 },
  { month: 'Jun', revenue: 91400, expenses: 63800, result: 27600 },
  { month: 'Jul', revenue: 78900, expenses: 55400, result: 23500 },
  { month: 'Aoû', revenue: 68300, expenses: 48900, result: 19400 },
  { month: 'Sep', revenue: 97200, expenses: 68100, result: 29100 },
  { month: 'Oct', revenue: 112500, expenses: 78600, result: 33900 },
  { month: 'Nov', revenue: 103800, expenses: 72400, result: 31400 },
  { month: 'Déc', revenue: 124800, expenses: 86800, result: 38000 },
]

// ─── SERVICE FUNCTIONS ───────────────────────────────────────────────────────

export const accountingService = {
  // Accounts
  getAccounts:  async ()             => { await delay(); return [...ACCOUNTS] },
  getAccount:   async (id)           => { await delay(150); return ACCOUNTS.find(a => a.id === id) },

  // Journal
  getJournalEntries: async ()        => { await delay(); return [...JOURNAL_ENTRIES] },
  createJournalEntry: async (entry)  => {
    await delay(600)
    const newEntry = { ...entry, id: `je${Date.now()}`, reference: `JRN-2024-${String(JOURNAL_ENTRIES.length + 1).padStart(3,'0')}` }
    JOURNAL_ENTRIES.push(newEntry)
    return newEntry
  },
  deleteJournalEntry: async (id)     => { await delay(400); const i = JOURNAL_ENTRIES.findIndex(e => e.id === id); if (i > -1) JOURNAL_ENTRIES.splice(i, 1); return true },

  // Invoices
  getInvoices:   async ()            => { await delay(); return [...INVOICES] },
  getInvoice:    async (id)          => { await delay(150); return INVOICES.find(i => i.id === id) },
  createInvoice: async (inv)         => {
    await delay(600)
    const newInv = { ...inv, id: `inv${Date.now()}`, reference: `FAC-2024-${String(INVOICES.length + 1).padStart(3,'0')}` }
    INVOICES.push(newInv)
    return newInv
  },
  updateInvoiceStatus: async (id, status) => {
    await delay(400)
    const inv = INVOICES.find(i => i.id === id)
    if (inv) inv.status = status
    return inv
  },
  deleteInvoice: async (id)          => { await delay(400); const i = INVOICES.findIndex(e => e.id === id); if (i > -1) INVOICES.splice(i, 1); return true },

  // Taxes
  getTaxes:     async ()             => { await delay(); return [...TAXES] },
  createTax:    async (tax)          => {
    await delay(400)
    const newTax = { ...tax, id: `t${Date.now()}` }
    TAXES.push(newTax)
    return newTax
  },
  updateTax:    async (id, data)     => { await delay(400); const t = TAXES.find(t => t.id === id); if (t) Object.assign(t, data); return t },
  deleteTax:    async (id)           => { await delay(300); const i = TAXES.findIndex(t => t.id === id); if (i > -1) TAXES.splice(i, 1); return true },

  // Payments
  getPayments:  async ()             => { await delay(); return [...PAYMENTS] },
  createPayment: async (pay)         => {
    await delay(500)
    const newPay = { ...pay, id: `pay${Date.now()}` }
    PAYMENTS.push(newPay)
    // Mark invoice as paid/partial
    const inv = INVOICES.find(i => i.id === pay.invoice_id)
    if (inv) inv.status = pay.amount >= inv.total ? 'paid' : 'sent'
    return newPay
  },

  // Stats / KPIs
  getDashboardStats: async () => {
    await delay()
    const revenue  = ACCOUNTS.filter(a => a.type === 'revenue').reduce((s, a) => s + a.balance, 0)
    const expenses = ACCOUNTS.filter(a => a.type === 'expense').reduce((s, a) => s + a.balance, 0)
    const tvaCollected   = ACCOUNTS.find(a => a.code === '4410')?.balance ?? 0
    const tvaRecoverable = ACCOUNTS.find(a => a.code === '3410')?.balance ?? 0
    return {
      revenue,
      expenses,
      result:      revenue - expenses,
      tva_to_pay:  tvaCollected - tvaRecoverable,
      invoices_pending: INVOICES.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0),
      invoices_overdue: INVOICES.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0),
      monthly: MONTHLY_STATS,
    }
  },

  getMonthlyStats: async () => { await delay(200); return MONTHLY_STATS },
}

export default accountingService
