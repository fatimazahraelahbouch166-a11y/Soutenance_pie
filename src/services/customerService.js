/**
 * customerService.js
 * Service layer for customer (CRM) API calls.
 */
import api from '../lib/api'

const customerService = {
  list: (params = {}) =>
    api.get('/customers', { params }).then(r => r.data),

  get: (id) =>
    api.get(`/customers/${id}`).then(r => r.data),

  create: (payload) =>
    api.post('/customers', payload).then(r => r.data),

  update: (id, payload) =>
    api.put(`/customers/${id}`, payload).then(r => r.data),

  delete: (id) =>
    api.delete(`/customers/${id}`).then(r => r.data),

  /** Get purchase history for a customer */
  getPurchases: (id) =>
    api.get(`/customers/${id}/purchases`).then(r => r.data),
}

export default customerService
