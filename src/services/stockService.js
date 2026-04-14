/**
 * stockService.js
 * Service layer for inventory/stock management API calls.
 */
import api from '../lib/api'

const stockService = {
  list: (params = {}) =>
    api.get('/stock', { params }).then(r => r.data),

  get: (id) =>
    api.get(`/stock/${id}`).then(r => r.data),

  create: (payload) =>
    api.post('/stock', payload).then(r => r.data),

  update: (id, payload) =>
    api.put(`/stock/${id}`, payload).then(r => r.data),

  delete: (id) =>
    api.delete(`/stock/${id}`).then(r => r.data),

  /** Get stock movements (in/out) */
  getMovements: (params = {}) =>
    api.get('/stock/movements', { params }).then(r => r.data),

  /** Add a stock movement */
  addMovement: (payload) =>
    api.post('/stock/movements', payload).then(r => r.data),
}

export default stockService
