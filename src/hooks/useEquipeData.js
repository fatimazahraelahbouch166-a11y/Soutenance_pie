// // import { useState, useEffect, useCallback } from 'react'
// // import { useAuth } from '../contexts/AuthContext'
// // import { getExpensesForUser, MOCK_BUDGETS, MOCK_CATEGORIES } from '../lib/mockData'

// // // ── Données mock enrichies pour l'espace Équipe ───────────────
// // const MOCK_TEMPLATES = [
// //   { id: 1, name: 'Déplacement domicile-travail', category_id: 1, amount: 350, description: 'Trajet mensuel domicile-travail' },
// //   { id: 2, name: 'Repas client',                 category_id: 3, amount: 280, description: 'Déjeuner avec client' },
// //   { id: 3, name: 'Formation en ligne',           category_id: 5, amount: 900, description: 'Abonnement formation' },
// // ]

// // const MOCK_MISSIONS = [
// //   { id: 1, title: 'Mission Rabat — Séminaire RH',   start: '2025-03-15', end: '2025-03-17', status: 'completed', city: 'Rabat',   expense_ids: [1, 2] },
// //   { id: 2, title: 'Conférence Tech Casa',           start: '2025-04-05', end: '2025-04-06', status: 'upcoming',  city: 'Casablanca', expense_ids: [] },
// //   { id: 3, title: 'Formation React — Marrakech',    start: '2025-04-20', end: '2025-04-22', status: 'upcoming',  city: 'Marrakech',  expense_ids: [] },
// // ]

// // const MOCK_REPORTS = [
// //   { id: 1, title: 'Mission Rabat Mars 2025', status: 'approved', created_at: '2025-03-18', total: 8400, expense_count: 2 },
// //   { id: 2, title: 'Formation React Avril',   status: 'pending',  created_at: '2025-04-01', total: 5400, expense_count: 1 },
// // ]

// // const MOCK_REIMBURSEMENTS = [
// //   { id: 1, ref: 'RMB-001', amount: 4800, method: 'Virement bancaire', date: '2025-03-25', status: 'paid',    expense: 'Vol Casablanca–Paris' },
// //   { id: 2, ref: 'RMB-002', amount: 3600, method: 'Virement bancaire', date: '2025-03-28', status: 'paid',    expense: 'Hôtel Marriott' },
// //   { id: 3, ref: 'RMB-003', amount: 1250, method: 'Virement bancaire', date: '2025-04-02', status: 'pending', expense: 'Repas équipe R&D' },
// // ]

// // const MOCK_MESSAGES = {
// //   1: [
// //     { id: 1, author: 'Karim Ouali', role: 'chef_equipe', text: 'Bonjour, pouvez-vous rejoindre le justificatif de taxi ?', date: '2025-03-19 09:30', is_me: false },
// //     { id: 2, author: 'Leila Benali', role: 'equipe', text: 'Bien sûr, je l\'ajoute maintenant.', date: '2025-03-19 10:15', is_me: true },
// //     { id: 3, author: 'Karim Ouali', role: 'chef_equipe', text: 'Merci, dépense approuvée.', date: '2025-03-19 11:00', is_me: false },
// //   ],
// // }

// // // ── Calcul kilométrique (barème marocain indicatif) ──────────
// // const KM_RATES = {
// //   voiture:  { label: 'Voiture',     rate: 0.56 },
// //   moto:     { label: 'Moto',        rate: 0.32 },
// //   velo:     { label: 'Vélo',        rate: 0.25 },
// //   transport:{ label: 'Transport en commun', rate: 0.15 },
// // }

// // const CITY_DISTANCES = {
// //   'casablanca-rabat': 87,
// //   'casablanca-marrakech': 241,
// //   'casablanca-fes': 300,
// //   'casablanca-tanger': 340,
// //   'casablanca-agadir': 476,
// //   'rabat-marrakech': 327,
// //   'rabat-fes': 200,
// //   'rabat-tanger': 253,
// //   'fes-marrakech': 430,
// //   'marrakech-agadir': 237,
// // }

// // export function getDistance(from, to) {
// //   const key1 = `${from.toLowerCase()}-${to.toLowerCase()}`
// //   const key2 = `${to.toLowerCase()}-${from.toLowerCase()}`
// //   return CITY_DISTANCES[key1] || CITY_DISTANCES[key2] || null
// // }

// // export function calcMileage(from, to, vehicle) {
// //   const dist = getDistance(from, to)
// //   if (!dist) return null
// //   const rate = KM_RATES[vehicle]?.rate ?? 0.56
// //   return { distance: dist, rate, amount: Math.round(dist * rate * 100) / 100 }
// // }

// // export { MOCK_TEMPLATES, MOCK_MISSIONS, MOCK_REPORTS, MOCK_REIMBURSEMENTS, MOCK_MESSAGES, KM_RATES, MOCK_CATEGORIES }

// // // ── Hook principal ────────────────────────────────────────────
// // export function useEquipeData() {
// //   const { user } = useAuth()
// //   const [templates, setTemplates]   = useState(MOCK_TEMPLATES)
// //   const [missions]                  = useState(MOCK_MISSIONS)
// //   const [reports, setReports]       = useState(MOCK_REPORTS)
// //   const [reimbursements]            = useState(MOCK_REIMBURSEMENTS)

// //   const expenses   = getExpensesForUser(user).filter(e => e.user_id === user?.id)
// //   const myBudgets  = MOCK_BUDGETS.filter(b => !b.team_id || b.team_id === user?.team_id)
// //   const categories = MOCK_CATEGORIES

// //   // Stats du mois
// //   const thisMonth  = expenses.filter(e => e.expense_date >= '2025-03-01')
// //   const stats = {
// //     totalMonth:    thisMonth.reduce((s, e) => s + e.amount, 0),
// //     countMonth:    thisMonth.length,
// //     pending:       expenses.filter(e => e.status === 'pending').length,
// //     pendingAmount: expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
// //     approved:      expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
// //     paid:          expenses.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0),
// //   }

// //   // Historique remboursements mensuel (pour graphique)
// //   const reimbHistory = [
// //     { month: 'Oct', amount: 1200 }, { month: 'Nov', amount: 900 },
// //     { month: 'Déc', amount: 2100 }, { month: 'Jan', amount: 1500 },
// //     { month: 'Fév', amount: 3600 }, { month: 'Mar', amount: 8400 },
// //   ]

// //   const addTemplate = (tpl) => setTemplates(prev => [...prev, { id: Date.now(), ...tpl }])
// //   const removeTemplate = (id) => setTemplates(prev => prev.filter(t => t.id !== id))
// //   const addReport = (r) => setReports(prev => [{ id: Date.now(), ...r, created_at: new Date().toISOString().slice(0,10) }, ...prev])

// //   return {
// //     user, expenses, myBudgets, categories, stats, reimbHistory,
// //     templates, missions, reports, reimbursements,
// //     addTemplate, removeTemplate, addReport,
// //   }
// // }
// import { useState, useEffect, useCallback } from 'react'
// import { useAuth } from '../contexts/AuthContext'
// import { getExpensesForUser, MOCK_BUDGETS, MOCK_CATEGORIES } from '../lib/mockData'

// // ── Données mock enrichies pour l'espace Équipe ───────────────
// const MOCK_TEMPLATES = [
//   { id: 1, name: 'Déplacement domicile-travail', category_id: 1, amount: 350, description: 'Trajet mensuel domicile-travail' },
//   { id: 2, name: 'Repas client',                 category_id: 3, amount: 280, description: 'Déjeuner avec client' },
//   { id: 3, name: 'Formation en ligne',           category_id: 5, amount: 900, description: 'Abonnement formation' },
// ]

// const MOCK_MISSIONS = [
//   { id: 1, title: 'Mission Rabat — Séminaire RH',   start: '2026-03-15', end: '2026-03-17', status: 'completed', city: 'Rabat',   expense_ids: [1, 2] },
//   { id: 2, title: 'Conférence Tech Casa',           start: '2026-04-05', end: '2026-04-06', status: 'upcoming',  city: 'Casablanca', expense_ids: [] },
//   { id: 3, title: 'Formation React — Marrakech',    start: '2026-04-20', end: '2026-04-22', status: 'upcoming',  city: 'Marrakech',  expense_ids: [] },
// ]

// const MOCK_REPORTS = [
//   { id: 1, title: 'Mission Rabat Mars 2025', status: 'approved', created_at: '2026-03-18', total: 8400, expense_count: 2 },
//   { id: 2, title: 'Formation React Avril',   status: 'pending',  created_at: '2026-04-01', total: 5400, expense_count: 1 },
// ]

// const MOCK_REIMBURSEMENTS = [
//   { id: 1, ref: 'RMB-001', amount: 4800, method: 'Virement bancaire', date: '2026-03-25', status: 'paid',    expense: 'Vol Casablanca–Paris' },
//   { id: 2, ref: 'RMB-002', amount: 3600, method: 'Virement bancaire', date: '2026-03-28', status: 'paid',    expense: 'Hôtel Marriott' },
//   { id: 3, ref: 'RMB-003', amount: 1250, method: 'Virement bancaire', date: '2026-04-02', status: 'pending', expense: 'Repas équipe R&D' },
// ]

// const MOCK_MESSAGES = {
//   1: [
//     { id: 1, author: 'Karim Ouali', role: 'chef_equipe', text: 'Bonjour, pouvez-vous rejoindre le justificatif de taxi ?', date: '2025-03-19 09:30', is_me: false },
//     { id: 2, author: 'Leila Benali', role: 'equipe', text: 'Bien sûr, je l\'ajoute maintenant.', date: '2025-03-19 10:15', is_me: true },
//     { id: 3, author: 'Karim Ouali', role: 'chef_equipe', text: 'Merci, dépense approuvée.', date: '2025-03-19 11:00', is_me: false },
//   ],
// }

// // ── Calcul kilométrique (barème marocain indicatif) ──────────
// const KM_RATES = {
//   voiture:  { label: 'Voiture',     rate: 0.56 },
//   moto:     { label: 'Moto',        rate: 0.32 },
//   velo:     { label: 'Vélo',        rate: 0.25 },
//   transport:{ label: 'Transport en commun', rate: 0.15 },
// }

// const CITY_DISTANCES = {
//   'casablanca-rabat': 87,
//   'casablanca-marrakech': 241,
//   'casablanca-fes': 300,
//   'casablanca-tanger': 340,
//   'casablanca-agadir': 476,
//   'rabat-marrakech': 327,
//   'rabat-fes': 200,
//   'rabat-tanger': 253,
//   'fes-marrakech': 430,
//   'marrakech-agadir': 237,
// }

// export function getDistance(from, to) {
//   const key1 = `${from.toLowerCase()}-${to.toLowerCase()}`
//   const key2 = `${to.toLowerCase()}-${from.toLowerCase()}`
//   return CITY_DISTANCES[key1] || CITY_DISTANCES[key2] || null
// }

// export function calcMileage(from, to, vehicle) {
//   const dist = getDistance(from, to)
//   if (!dist) return null
//   const rate = KM_RATES[vehicle]?.rate ?? 0.56
//   return { distance: dist, rate, amount: Math.round(dist * rate * 100) / 100 }
// }

// export { MOCK_TEMPLATES, MOCK_MISSIONS, MOCK_REPORTS, MOCK_REIMBURSEMENTS, MOCK_MESSAGES, KM_RATES, MOCK_CATEGORIES }

// // ── Hook principal ────────────────────────────────────────────
// export function useEquipeData() {
//   const { user } = useAuth()
//   const [templates, setTemplates]   = useState(MOCK_TEMPLATES)
//   const [missions]                  = useState(MOCK_MISSIONS)
//   const [reports, setReports]       = useState(MOCK_REPORTS)
//   const [reimbursements]            = useState(MOCK_REIMBURSEMENTS)

//   const expenses   = getExpensesForUser(user).filter(e => e.user_id === user?.id)
//   const myBudgets  = MOCK_BUDGETS.filter(b => !b.team_id || b.team_id === user?.team_id)
//   const categories = MOCK_CATEGORIES

//   // Stats du mois
//   // Filtre dynamique sur les 3 derniers mois pour avoir des données visibles
//   const threeMonthsAgo = new Date()
//   threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
//   const cutoff = threeMonthsAgo.toISOString().slice(0, 10)
//   const thisMonth  = expenses.filter(e => e.expense_date >= '2026-01-01')
//   const stats = {
//     totalMonth:    thisMonth.reduce((s, e) => s + e.amount, 0),
//     countMonth:    thisMonth.length,
//     pending:       expenses.filter(e => e.status === 'pending').length,
//     pendingAmount: expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
//     approved:      expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
//     paid:          expenses.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0),
//   }

//   // Historique remboursements mensuel (pour graphique)
//   const reimbHistory = [
//     { month: 'Oct', amount: 1200 }, { month: 'Nov', amount: 900 },
//     { month: 'Déc', amount: 2100 }, { month: 'Jan', amount: 1500 },
//     { month: 'Fév', amount: 3600 }, { month: 'Mar', amount: 8400 },
//     { month: 'Avr', amount: 4800 },
//   ]

//   const addTemplate = (tpl) => setTemplates(prev => [...prev, { id: Date.now(), ...tpl }])
//   const removeTemplate = (id) => setTemplates(prev => prev.filter(t => t.id !== id))
//   const addReport = (r) => setReports(prev => [{ id: Date.now(), ...r, created_at: new Date().toISOString().slice(0,10) }, ...prev])

//   return {
//     user, expenses, myBudgets, categories, stats, reimbHistory,
//     templates, missions, reports, reimbursements,
//     addTemplate, removeTemplate, addReport,
//   }
// }
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getExpensesForUser, MOCK_BUDGETS, MOCK_CATEGORIES } from '../lib/mockData'

// ── Données mock ──────────────────────────────────────────────
const MOCK_TEMPLATES = [
  { id: 1, name: 'Déplacement domicile-travail', category_id: 1, amount: 350,  description: 'Trajet mensuel domicile-travail' },
  { id: 2, name: 'Repas client',                 category_id: 3, amount: 280,  description: 'Déjeuner avec client' },
  { id: 3, name: 'Formation en ligne',           category_id: 5, amount: 900,  description: 'Abonnement formation' },
]

const MOCK_MISSIONS = [
  { id: 1, title: 'Mission Rabat — Séminaire RH', start: '2026-03-15', end: '2026-03-17', status: 'completed', city: 'Rabat',       expense_ids: [1, 2] },
  { id: 2, title: 'Conférence Tech Casa',          start: '2026-04-05', end: '2026-04-06', status: 'upcoming',  city: 'Casablanca',  expense_ids: [] },
  { id: 3, title: 'Formation React — Marrakech',   start: '2026-04-20', end: '2026-04-22', status: 'upcoming',  city: 'Marrakech',   expense_ids: [] },
]

const MOCK_REPORTS_DATA = [
  { id: 1, title: 'Mission Rabat Mars 2026', status: 'approved', created_at: '2026-03-18', total: 8400, expense_count: 2 },
  { id: 2, title: 'Formation React Avril',   status: 'pending',  created_at: '2026-04-01', total: 5400, expense_count: 1 },
]

const MOCK_REIMBURSEMENTS = [
  { id: 1, ref: 'RMB-001', amount: 4800, method: 'Virement bancaire', date: '2026-03-25', status: 'paid',    expense: 'Vol Casablanca–Paris' },
  { id: 2, ref: 'RMB-002', amount: 3600, method: 'Virement bancaire', date: '2026-03-28', status: 'paid',    expense: 'Hôtel Marriott' },
  { id: 3, ref: 'RMB-003', amount: 1250, method: 'Virement bancaire', date: '2026-04-02', status: 'pending', expense: 'Repas équipe R&D' },
]

const MOCK_MESSAGES = {
  1: [
    { id: 1, author: 'Karim Ouali',  role: 'chef_equipe', text: "Bonjour, pouvez-vous joindre le justificatif de taxi ?", date: '2026-03-19 09:30', is_me: false },
    { id: 2, author: 'Leila Benali', role: 'equipe',       text: "Bien sûr, je l'ajoute maintenant.",                       date: '2026-03-19 10:15', is_me: true },
    { id: 3, author: 'Karim Ouali',  role: 'chef_equipe', text: 'Merci, dépense approuvée.',                                date: '2026-03-19 11:00', is_me: false },
  ],
}

// ── Calcul kilométrique ───────────────────────────────────────
export const KM_RATES = {
  voiture:   { label: 'Voiture',           rate: 0.56 },
  moto:      { label: 'Moto',              rate: 0.32 },
  velo:      { label: 'Vélo',              rate: 0.25 },
  transport: { label: 'Transport en commun', rate: 0.15 },
}

const CITY_DISTANCES = {
  'casablanca-rabat': 87, 'casablanca-marrakech': 241, 'casablanca-fes': 300,
  'casablanca-tanger': 340, 'casablanca-agadir': 476, 'rabat-marrakech': 327,
  'rabat-fes': 200, 'rabat-tanger': 253, 'fes-marrakech': 430, 'marrakech-agadir': 237,
}

export function getDistance(from, to) {
  const k1 = `${from.toLowerCase()}-${to.toLowerCase()}`
  const k2 = `${to.toLowerCase()}-${from.toLowerCase()}`
  return CITY_DISTANCES[k1] || CITY_DISTANCES[k2] || null
}

export function calcMileage(from, to, vehicle) {
  const dist = getDistance(from, to)
  if (!dist) return null
  const rate = KM_RATES[vehicle]?.rate ?? 0.56
  return { distance: dist, rate, amount: Math.round(dist * rate * 100) / 100 }
}

export { MOCK_TEMPLATES, MOCK_MISSIONS, MOCK_REIMBURSEMENTS, MOCK_MESSAGES, MOCK_CATEGORIES }

// ── Hook principal ────────────────────────────────────────────
export function useEquipeData() {
  const { user } = useAuth()

  const [templates,      setTemplates]      = useState(MOCK_TEMPLATES)
  const [missions]                          = useState(MOCK_MISSIONS)
  const [reports,        setReports]        = useState(MOCK_REPORTS_DATA)
  const [reimbursements]                    = useState(MOCK_REIMBURSEMENTS)

  // Dépenses de l'utilisateur connecté uniquement
  // const expenses   = getExpensesForUser(user).filter(e => e.user_id === user?.id)
  const expenses = getExpensesForUser(user ?? null)?.filter(
  e => e.user_id === user?.id
) ?? []
  const myBudgets  = MOCK_BUDGETS.filter(b => !b.team_id || b.team_id === user?.team_id)
  const categories = MOCK_CATEGORIES

  // Stats — toutes les dépenses depuis 2026
  const thisYear = expenses.filter(e => e.expense_date >= '2026-01-01')

  const stats = {
    totalMonth:    thisYear.reduce((s, e) => s + e.amount, 0),
    countMonth:    thisYear.length,
    pending:       expenses.filter(e => e.status === 'pending').length,
    pendingAmount: expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0),
    approved:      expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0),
    paid:          expenses.filter(e => e.status === 'paid').reduce((s, e) => s + e.amount, 0),
  }

  const reimbHistory = [
    { month: 'Oct', amount: 1200 }, { month: 'Nov', amount: 900  },
    { month: 'Déc', amount: 2100 }, { month: 'Jan', amount: 1500 },
    { month: 'Fév', amount: 3600 }, { month: 'Mar', amount: 8400 },
    { month: 'Avr', amount: 4800 },
  ]

  const addTemplate    = (tpl) => setTemplates(p => [...p, { id: Date.now(), ...tpl }])
  const removeTemplate = (id)  => setTemplates(p => p.filter(t => t.id !== id))
  const addReport      = (r)   => setReports(p => [{ id: Date.now(), ...r, created_at: new Date().toISOString().slice(0,10) }, ...p])

  return {
    user, expenses, myBudgets, categories,
    stats, reimbHistory,
    templates, missions, reports, reimbursements,
    addTemplate, removeTemplate, addReport,
  }
}