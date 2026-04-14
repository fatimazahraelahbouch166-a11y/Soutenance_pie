/**
 * supplierService.js
 * Service layer for supplier management API calls.
 */
import api from '../lib/api'

const supplierService = {
  list: (params = {}) =>
    api.get('/suppliers', { params }).then(r => r.data),

  get: (id) =>
    api.get(`/suppliers/${id}`).then(r => r.data),

  create: (payload) =>
    api.post('/suppliers', payload).then(r => r.data),

  update: (id, payload) =>
    api.put(`/suppliers/${id}`, payload).then(r => r.data),

  delete: (id) =>
    api.delete(`/suppliers/${id}`).then(r => r.data),

  /** Get purchase orders from a supplier */
  getOrders: (id) =>
    api.get(`/suppliers/${id}/orders`).then(r => r.data),
}

export default supplierService
