/**
 * incomeService.js
 * Service layer for income/revenue API calls.
 */
import api from '../lib/api'

const incomeService = {
  /** List incomes with optional filters */
  list: (params = {}) =>
    api.get('/incomes', { params }).then(r => r.data),

  /** Get single income entry */
  get: (id) =>
    api.get(`/incomes/${id}`).then(r => r.data),

  /** Create a new income entry */
  create: (payload) =>
    api.post('/incomes', payload).then(r => r.data),

  /** Update income entry */
  update: (id, payload) =>
    api.put(`/incomes/${id}`, payload).then(r => r.data),

  /** Delete income entry */
  delete: (id) =>
    api.delete(`/incomes/${id}`).then(r => r.data),

  /** Get income goals */
  getGoals: () =>
    api.get('/incomes/goals').then(r => r.data),

  /** Update income goal */
  updateGoal: (payload) =>
    api.put('/incomes/goals', payload).then(r => r.data),

  /** Get cash flow forecast */
  getCashFlow: () =>
    api.get('/incomes/cashflow').then(r => r.data),

  /** Get income statistics (total, by source, by month) */
  getStats: (params = {}) =>
    api.get('/incomes/stats', { params }).then(r => r.data),
}

export default incomeService
