/**
 * budgetService.js
 * Service layer for budget management API calls.
 */
import api from '../lib/api'

const budgetService = {
  /** List all budgets */
  list: (params = {}) =>
    api.get('/budgets', { params }).then(r => r.data),

  /** Get single budget */
  get: (id) =>
    api.get(`/budgets/${id}`).then(r => r.data),

  /**
   * Create a new budget
   * @param {object} payload - { name, amount, category, team_id, period }
   */
  create: (payload) =>
    api.post('/budgets', payload).then(r => r.data),

  /** Update budget */
  update: (id, payload) =>
    api.put(`/budgets/${id}`, payload).then(r => r.data),

  /** Delete budget */
  delete: (id) =>
    api.delete(`/budgets/${id}`).then(r => r.data),

  /** Get budget alerts (budgets near or over limit) */
  getAlerts: () =>
    api.get('/budgets/alerts').then(r => r.data),
}

export default budgetService
