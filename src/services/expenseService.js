/**
 * expenseService.js
 * Service layer for all expense-related API calls.
 * Swap api.* calls to real axios/fetch when backend is ready.
 */
import api from '../lib/api'

const expenseService = {
  /**
   * List expenses with optional filters
   * @param {object} params - { status, search, page, category_id, team_id, from, to, amount_min, amount_max }
   */
  list: (params = {}) =>
    api.get('/expenses', { params }).then(r => r.data),

  /**
   * Get a single expense by ID
   */
  get: (id) =>
    api.get(`/expenses/${id}`).then(r => r.data),

  /**
   * Create a new expense
   * @param {object} payload - { title, description, amount, category_id, date, team_id, receipt? }
   */
  create: (payload) =>
    api.post('/expenses', payload).then(r => r.data),

  /**
   * Update an existing expense
   */
  update: (id, payload) =>
    api.put(`/expenses/${id}`, payload).then(r => r.data),

  /**
   * Delete an expense
   */
  delete: (id) =>
    api.delete(`/expenses/${id}`).then(r => r.data),

  /**
   * Submit a draft expense for approval
   */
  submit: (id) =>
    api.post(`/expenses/${id}/submit`).then(r => r.data),

  /**
   * Approve an expense (manager/owner only)
   */
  approve: (id, comment = '') =>
    api.post(`/expenses/${id}/approve`, { comment }).then(r => r.data),

  /**
   * Reject an expense (manager/owner only)
   */
  reject: (id, reason = '') =>
    api.post(`/expenses/${id}/reject`, { reason }).then(r => r.data),

  /**
   * Bulk action on multiple expenses
   * @param {string[]} ids
   * @param {'approve'|'reject'|'delete'} action
   */
  bulkAction: (ids, action) =>
    api.post('/expenses/bulk', { ids, action }).then(r => r.data),

  /**
   * Upload a receipt file for an expense
   */
  uploadReceipt: (id, formData) =>
    api.post(`/expenses/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data),

  /**
   * Add a comment to an expense
   */
  addComment: (id, comment) =>
    api.post(`/expenses/${id}/comments`, { comment }).then(r => r.data),
}

export default expenseService
