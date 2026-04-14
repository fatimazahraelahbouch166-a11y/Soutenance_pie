/**
 * reimbursementService.js
 * Mock service for the Reimbursement module.
 * Replace async functions with real axios calls when backend is ready.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

export const STATUS_LABELS = {
  draft:       'Brouillon',
  pending:     'En attente',
  approved:    'Approuvée',
  rejected:    'Rejetée',
  reimbursed:  'Remboursée',
  partial:     'Partielle',
}

export const PRIORITY_LABELS = {
  low:    'Faible',
  medium: 'Moyen',
  high:   'Haute',
  urgent: 'Urgent',
}

export const PAYMENT_METHOD_LABELS = {
  bank_transfer: 'Virement bancaire',
  cash:          'Espèces',
  cheque:        'Chèque',
}

export const TEAMS = ['Direction', 'Technique', 'Commercial', 'RH', 'Finance', 'Marketing']

// ─── Mock expenses (for the expense selector in the form) ─────────────────────

export const MOCK_EXPENSES = [
  { id: 'EXP-001', title: 'Déplacement Paris — réunion Renault',    amount: 4500, category: 'Transport' },
  { id: 'EXP-002', title: 'Hôtel Lyon — mission 3 nuits',           amount: 2800, category: 'Hébergement' },
  { id: 'EXP-003', title: 'Repas client — négociation contrat',      amount: 1200, category: 'Restauration' },
  { id: 'EXP-004', title: 'Matériel informatique bureau RH',         amount: 3600, category: 'Fournitures' },
  { id: 'EXP-005', title: 'Formation React avancée + certification', amount: 8000, category: 'Formation' },
  { id: 'EXP-006', title: 'Carburant déplacements clients S14',      amount: 650,  category: 'Transport' },
  { id: 'EXP-007', title: 'Abonnement outils SaaS — Notion/Figma',  amount: 1800, category: 'Logiciels' },
  { id: 'EXP-008', title: 'Séminaire national — hébergement+repas',  amount: 5200, category: 'Événements' },
]

// ─── Initial mock data ────────────────────────────────────────────────────────

const INITIAL_DATA = [
  {
    id: 1,
    reference: 'RMB-2026-001',
    expense_id: 'EXP-001',
    expense: MOCK_EXPENSES[0],
    employee: 'Sara Alami',
    team: 'Direction',
    requested_amount: 4500,
    approved_amount: 4500,
    reimbursed_amount: 4500,
    remaining_amount: 0,
    status: 'reimbursed',
    priority: 'high',
    payment_method: 'bank_transfer',
    payment_reference: 'VIR-2026-0142',
    requested_date: '2026-03-01',
    approval_date: '2026-03-03',
    reimbursement_date: '2026-03-10',
    due_date: '2026-03-15',
    rejection_reason: null,
    description: 'Déplacement professionnel Paris — réunion stratégique client Renault. Billets de train + taxi inclus.',
    attachments: [
      { id: 1, name: 'ticket_train_aller.pdf', size: 245000, type: 'application/pdf' },
      { id: 2, name: 'hotel_facture.pdf',       size: 128000, type: 'application/pdf' },
      { id: 3, name: 'taxi_recu.jpg',           size: 85000,  type: 'image/jpeg' },
    ],
    comments: [
      { id: 1, author: 'Sara Alami',  role: 'equipe',      text: 'Voici tous les justificatifs du déplacement Paris. Billets + hôtel joints.', date: '2026-03-01T10:30:00' },
      { id: 2, author: 'Karim Ouali', role: 'chef_equipe', text: 'Dossier complet, remboursement approuvé. Virement effectué ce jour.', date: '2026-03-10T14:00:00' },
    ],
    activity_log: [
      { id: 1, action: 'created',    user: 'Sara Alami',  date: '2026-03-01T09:00:00', note: 'Demande de remboursement créée' },
      { id: 2, action: 'submitted',  user: 'Sara Alami',  date: '2026-03-01T10:30:00', note: 'Soumise pour approbation' },
      { id: 3, action: 'approved',   user: 'Karim Ouali', date: '2026-03-03T11:00:00', note: "Approuvée — montant total validé" },
      { id: 4, action: 'reimbursed', user: 'Karim Ouali', date: '2026-03-10T14:00:00', note: 'Virement effectué — réf. VIR-2026-0142' },
    ],
  },
  {
    id: 2,
    reference: 'RMB-2026-002',
    expense_id: 'EXP-002',
    expense: MOCK_EXPENSES[1],
    employee: 'Karim Ouali',
    team: 'Technique',
    requested_amount: 2800,
    approved_amount: 2800,
    reimbursed_amount: 1400,
    remaining_amount: 1400,
    status: 'partial',
    priority: 'medium',
    payment_method: 'cheque',
    payment_reference: 'CHQ-0089',
    requested_date: '2026-03-05',
    approval_date: '2026-03-07',
    reimbursement_date: '2026-03-15',
    due_date: '2026-03-28',
    rejection_reason: null,
    description: 'Hébergement lors de la mission technique Lyon — 3 nuits. Hôtel Ibis Lyon Centre.',
    attachments: [
      { id: 4, name: 'hotel_receipt_lyon.pdf', size: 189000, type: 'application/pdf' },
    ],
    comments: [
      { id: 3, author: 'Karim Ouali', role: 'chef_equipe', text: 'Note de frais jointe. Mission validée par la direction.', date: '2026-03-05T09:00:00' },
      { id: 4, author: 'Sara Alami',  role: 'owner',       text: 'Premier versement de 1 400 MAD effectué. Second versement prévu fin mars.', date: '2026-03-15T16:00:00' },
    ],
    activity_log: [
      { id: 5, action: 'created',   user: 'Karim Ouali', date: '2026-03-05T08:00:00', note: 'Demande créée' },
      { id: 6, action: 'submitted', user: 'Karim Ouali', date: '2026-03-05T09:00:00', note: 'Soumise pour approbation' },
      { id: 7, action: 'approved',  user: 'Sara Alami',  date: '2026-03-07T10:00:00', note: 'Approuvée — montant total validé' },
      { id: 8, action: 'partial',   user: 'Sara Alami',  date: '2026-03-15T16:00:00', note: 'Remboursement partiel — 1 400 MAD versés (chèque CHQ-0089)' },
    ],
  },
  {
    id: 3,
    reference: 'RMB-2026-003',
    expense_id: 'EXP-003',
    expense: MOCK_EXPENSES[2],
    employee: 'Leila Benali',
    team: 'Commercial',
    requested_amount: 1200,
    approved_amount: null,
    reimbursed_amount: 0,
    remaining_amount: 1200,
    status: 'pending',
    priority: 'low',
    payment_method: null,
    payment_reference: null,
    requested_date: '2026-03-18',
    approval_date: null,
    reimbursement_date: null,
    due_date: '2026-04-05',
    rejection_reason: null,
    description: 'Repas avec client potentiel — négociation contrat annuel. Restaurant Le Méridien Casablanca.',
    attachments: [
      { id: 5, name: 'facture_restaurant.jpg', size: 310000, type: 'image/jpeg' },
    ],
    comments: [],
    activity_log: [
      { id: 9,  action: 'created',   user: 'Leila Benali', date: '2026-03-18T12:00:00', note: 'Demande créée' },
      { id: 10, action: 'submitted', user: 'Leila Benali', date: '2026-03-18T12:30:00', note: 'Soumise pour approbation' },
    ],
  },
  {
    id: 4,
    reference: 'RMB-2026-004',
    expense_id: 'EXP-004',
    expense: MOCK_EXPENSES[3],
    employee: 'Ahmed Tazi',
    team: 'RH',
    requested_amount: 3600,
    approved_amount: null,
    reimbursed_amount: 0,
    remaining_amount: 3600,
    status: 'rejected',
    priority: 'medium',
    payment_method: null,
    payment_reference: null,
    requested_date: '2026-02-20',
    approval_date: null,
    reimbursement_date: null,
    due_date: '2026-03-05',
    rejection_reason: 'Justificatifs insuffisants — facture originale fournisseur manquante. Veuillez joindre la facture officielle avec TVA.',
    description: 'Achat matériel informatique pour le bureau RH — 2 écrans + claviers ergonomiques.',
    attachments: [],
    comments: [
      { id: 5, author: 'Ahmed Tazi',  role: 'equipe',      text: "J'ai joint le bon de commande. La facture originale est en cours d'obtention.", date: '2026-02-20T14:00:00' },
      { id: 6, author: 'Karim Ouali', role: 'chef_equipe', text: 'Il manque la facture originale du fournisseur avec numéro de TVA. Demande rejetée en attente de régularisation.', date: '2026-02-22T10:00:00' },
    ],
    activity_log: [
      { id: 11, action: 'created',   user: 'Ahmed Tazi',  date: '2026-02-20T13:00:00', note: 'Demande créée' },
      { id: 12, action: 'submitted', user: 'Ahmed Tazi',  date: '2026-02-20T14:00:00', note: 'Soumise pour approbation' },
      { id: 13, action: 'rejected',  user: 'Karim Ouali', date: '2026-02-22T10:30:00', note: 'Rejetée — justificatifs manquants (facture originale)' },
    ],
  },
  {
    id: 5,
    reference: 'RMB-2026-005',
    expense_id: 'EXP-005',
    expense: MOCK_EXPENSES[4],
    employee: 'Youssef Karimi',
    team: 'Technique',
    requested_amount: 8000,
    approved_amount: 8000,
    reimbursed_amount: 0,
    remaining_amount: 8000,
    status: 'approved',
    priority: 'urgent',
    payment_method: 'bank_transfer',
    payment_reference: null,
    requested_date: '2026-03-25',
    approval_date: '2026-03-27',
    reimbursement_date: null,
    due_date: '2026-04-05',
    rejection_reason: null,
    description: 'Formation React avancée + certification officielle — investissement stratégique validé par la DRH.',
    attachments: [
      { id: 6, name: 'attestation_formation.pdf', size: 420000, type: 'application/pdf' },
      { id: 7, name: 'facture_organisme.pdf',     size: 280000, type: 'application/pdf' },
    ],
    comments: [
      { id: 7, author: 'Youssef Karimi', role: 'equipe', text: 'Formation validée par la DRH. Demande urgente, échéance le 5 avril.', date: '2026-03-25T09:00:00' },
      { id: 8, author: 'Sara Alami',     role: 'owner',  text: 'Approuvé. Virement à planifier avant le 5 avril impérativement.', date: '2026-03-27T11:00:00' },
    ],
    activity_log: [
      { id: 14, action: 'created',   user: 'Youssef Karimi', date: '2026-03-25T08:00:00', note: 'Demande créée' },
      { id: 15, action: 'submitted', user: 'Youssef Karimi', date: '2026-03-25T09:00:00', note: 'Soumise — priorité urgente' },
      { id: 16, action: 'approved',  user: 'Sara Alami',     date: '2026-03-27T11:00:00', note: 'Approuvée — virement à planifier avant le 5 avril' },
    ],
  },
  {
    id: 6,
    reference: 'RMB-2026-006',
    expense_id: 'EXP-006',
    expense: MOCK_EXPENSES[5],
    employee: 'Nadia Fassi',
    team: 'Commercial',
    requested_amount: 650,
    approved_amount: null,
    reimbursed_amount: 0,
    remaining_amount: 650,
    status: 'draft',
    priority: 'low',
    payment_method: null,
    payment_reference: null,
    requested_date: '2026-04-01',
    approval_date: null,
    reimbursement_date: null,
    due_date: '2026-04-20',
    rejection_reason: null,
    description: 'Carburant pour déplacements clients — semaine du 28 mars. Pleins réalisés sur justificatifs.',
    attachments: [],
    comments: [],
    activity_log: [
      { id: 17, action: 'created', user: 'Nadia Fassi', date: '2026-04-01T08:30:00', note: 'Brouillon créé' },
    ],
  },
  {
    id: 7,
    reference: 'RMB-2026-007',
    expense_id: 'EXP-008',
    expense: MOCK_EXPENSES[7],
    employee: 'Omar Drissi',
    team: 'Technique',
    requested_amount: 5200,
    approved_amount: 5200,
    reimbursed_amount: 0,
    remaining_amount: 5200,
    status: 'approved',
    priority: 'high',
    payment_method: 'bank_transfer',
    payment_reference: null,
    requested_date: '2026-03-28',
    approval_date: '2026-04-01',
    reimbursement_date: null,
    due_date: '2026-04-08',
    rejection_reason: null,
    description: 'Séminaire technique national Rabat — hébergement 2 nuits + repas + transport.',
    attachments: [
      { id: 8, name: 'billet_train_rabat.pdf', size: 190000, type: 'application/pdf' },
      { id: 9, name: 'hotel_rabat.pdf',        size: 165000, type: 'application/pdf' },
    ],
    comments: [],
    activity_log: [
      { id: 18, action: 'created',   user: 'Omar Drissi', date: '2026-03-28T10:00:00', note: 'Demande créée' },
      { id: 19, action: 'submitted', user: 'Omar Drissi', date: '2026-03-28T10:30:00', note: 'Soumise pour approbation' },
      { id: 20, action: 'approved',  user: 'Sara Alami',  date: '2026-04-01T09:00:00', note: 'Approuvée' },
    ],
  },
  {
    id: 8,
    reference: 'RMB-2026-008',
    expense_id: 'EXP-007',
    expense: MOCK_EXPENSES[6],
    employee: 'Salma Idrissi',
    team: 'Marketing',
    requested_amount: 1800,
    approved_amount: null,
    reimbursed_amount: 0,
    remaining_amount: 1800,
    status: 'pending',
    priority: 'medium',
    payment_method: null,
    payment_reference: null,
    requested_date: '2026-04-02',
    approval_date: null,
    reimbursement_date: null,
    due_date: '2026-04-15',
    rejection_reason: null,
    description: 'Abonnements outils SaaS équipe Marketing — Notion Business + Figma Pro (annuel).',
    attachments: [
      { id: 10, name: 'facture_notion.pdf', size: 95000, type: 'application/pdf' },
      { id: 11, name: 'facture_figma.pdf',  size: 88000, type: 'application/pdf' },
    ],
    comments: [
      { id: 9, author: 'Salma Idrissi', role: 'equipe', text: 'Renouvellement annuel validé par le responsable Marketing. Factures jointes.', date: '2026-04-02T11:00:00' },
    ],
    activity_log: [
      { id: 21, action: 'created',   user: 'Salma Idrissi', date: '2026-04-02T10:30:00', note: 'Demande créée' },
      { id: 22, action: 'submitted', user: 'Salma Idrissi', date: '2026-04-02T11:00:00', note: 'Soumise pour approbation' },
    ],
  },
]

// ─── In-memory store ──────────────────────────────────────────────────────────

let _data = INITIAL_DATA.map(r => ({ ...r }))
let _nextId = 9

// ─── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function clone(arr) {
  return arr.map(r => ({ ...r }))
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const reimbursementService = {

  /** Fetch all, with optional filters */
  async getAll(filters = {}) {
    await delay(450)
    let result = clone(_data)

    if (filters.status && filters.status !== 'all')
      result = result.filter(r => r.status === filters.status)

    if (filters.employee)
      result = result.filter(r =>
        r.employee.toLowerCase().includes(filters.employee.toLowerCase()))

    if (filters.team)
      result = result.filter(r => r.team === filters.team)

    if (filters.priority)
      result = result.filter(r => r.priority === filters.priority)

    if (filters.payment_method)
      result = result.filter(r => r.payment_method === filters.payment_method)

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(r =>
        r.reference.toLowerCase().includes(q) ||
        r.employee.toLowerCase().includes(q) ||
        String(r.requested_amount).includes(q) ||
        (r.description ?? '').toLowerCase().includes(q)
      )
    }

    if (filters.amount_min)
      result = result.filter(r => r.requested_amount >= Number(filters.amount_min))

    if (filters.amount_max)
      result = result.filter(r => r.requested_amount <= Number(filters.amount_max))

    if (filters.date_from)
      result = result.filter(r => r.requested_date >= filters.date_from)

    if (filters.date_to)
      result = result.filter(r => r.requested_date <= filters.date_to)

    return result
  },

  /** Fetch single by id */
  async getById(id) {
    await delay(300)
    return clone(_data).find(r => r.id === Number(id)) ?? null
  },

  /** Create new reimbursement */
  async create(payload) {
    await delay(500)
    const id = _nextId++
    const item = {
      id,
      reference: `RMB-2026-${String(id).padStart(3, '0')}`,
      expense: MOCK_EXPENSES.find(e => e.id === payload.expense_id) ?? null,
      reimbursed_amount: 0,
      remaining_amount: Number(payload.requested_amount),
      status: 'draft',
      approved_amount: null,
      payment_method: null,
      payment_reference: null,
      approval_date: null,
      reimbursement_date: null,
      rejection_reason: null,
      attachments: [],
      comments: [],
      activity_log: [
        {
          id: Date.now(),
          action: 'created',
          user: 'Sara Alami',
          date: new Date().toISOString(),
          note: 'Demande de remboursement créée',
        },
      ],
      ...payload,
      requested_amount: Number(payload.requested_amount),
    }
    _data = [item, ..._data]
    return { ...item }
  },

  /** Update reimbursement fields */
  async update(id, patch) {
    await delay(400)
    _data = _data.map(r => r.id === Number(id) ? { ...r, ...patch } : r)
    return clone(_data).find(r => r.id === Number(id))
  },

  /** Delete */
  async delete(id) {
    await delay(300)
    _data = _data.filter(r => r.id !== Number(id))
    return true
  },

  /** Submit for approval (draft → pending) */
  async submit(id) {
    await delay(350)
    const item = _data.find(r => r.id === Number(id))
    return reimbursementService.update(id, {
      status: 'pending',
      activity_log: [
        ...item.activity_log,
        { id: Date.now(), action: 'submitted', user: 'Sara Alami', date: new Date().toISOString(), note: 'Soumise pour approbation' },
      ],
    })
  },

  /** Approve */
  async approve(id, approved_amount) {
    await delay(450)
    const item = _data.find(r => r.id === Number(id))
    const amt = approved_amount != null ? Number(approved_amount) : item.requested_amount
    return reimbursementService.update(id, {
      status: 'approved',
      approved_amount: amt,
      remaining_amount: amt - (item.reimbursed_amount ?? 0),
      approval_date: new Date().toISOString().split('T')[0],
      activity_log: [
        ...item.activity_log,
        { id: Date.now(), action: 'approved', user: 'Sara Alami', date: new Date().toISOString(), note: `Approuvée — montant ${amt.toLocaleString('fr-MA')} MAD` },
      ],
    })
  },

  /** Reject */
  async reject(id, reason) {
    await delay(400)
    const item = _data.find(r => r.id === Number(id))
    return reimbursementService.update(id, {
      status: 'rejected',
      rejection_reason: reason,
      activity_log: [
        ...item.activity_log,
        { id: Date.now(), action: 'rejected', user: 'Sara Alami', date: new Date().toISOString(), note: `Rejetée — ${reason}` },
      ],
    })
  },

  /** Mark as (partially or fully) reimbursed */
  async markReimbursed(id, { amount, payment_method, payment_reference, date }) {
    await delay(500)
    const item = _data.find(r => r.id === Number(id))
    const base = item.approved_amount ?? item.requested_amount
    const newPaid = (item.reimbursed_amount ?? 0) + Number(amount)
    const remaining = base - newPaid
    const isPartial = remaining > 0.01
    return reimbursementService.update(id, {
      status: isPartial ? 'partial' : 'reimbursed',
      reimbursed_amount: newPaid,
      remaining_amount: Math.max(0, remaining),
      payment_method,
      payment_reference,
      reimbursement_date: date,
      activity_log: [
        ...item.activity_log,
        {
          id: Date.now(),
          action: isPartial ? 'partial' : 'reimbursed',
          user: 'Sara Alami',
          date: new Date().toISOString(),
          note: `${isPartial ? 'Remboursement partiel' : 'Remboursé intégralement'} — ${Number(amount).toLocaleString('fr-MA')} MAD (${PAYMENT_METHOD_LABELS[payment_method] ?? payment_method})`,
        },
      ],
    })
  },

  /** Add comment */
  async addComment(id, text, author = 'Sara Alami', role = 'owner') {
    await delay(250)
    const item = _data.find(r => r.id === Number(id))
    const comment = { id: Date.now(), author, role, text, date: new Date().toISOString() }
    return reimbursementService.update(id, {
      comments: [...(item.comments ?? []), comment],
    })
  },

  /** Computed dashboard stats */
  async getStats() {
    await delay(250)
    const all = _data
    return {
      total_reimbursed:  all.filter(r => ['reimbursed','partial'].includes(r.status)).reduce((s, r) => s + (r.reimbursed_amount ?? 0), 0),
      pending_count:     all.filter(r => r.status === 'pending').length,
      pending_amount:    all.filter(r => r.status === 'pending').reduce((s, r) => s + r.requested_amount, 0),
      rejected_count:    all.filter(r => r.status === 'rejected').length,
      to_pay:            all.filter(r => r.status === 'approved').reduce((s, r) => s + ((r.approved_amount ?? r.requested_amount) - (r.reimbursed_amount ?? 0)), 0),
      to_pay_count:      all.filter(r => r.status === 'approved').length,
      partial_count:     all.filter(r => r.status === 'partial').length,
      partial_remaining: all.filter(r => r.status === 'partial').reduce((s, r) => s + (r.remaining_amount ?? 0), 0),
    }
  },
}
