/**
 * quoteService.js
 * Service layer for quotes and invoices API calls.
 */
import api from '../lib/api'

const quoteService = {
  list: (params = {}) =>
    api.get('/quotes', { params }).then(r => r.data),

  get: (id) =>
    api.get(`/quotes/${id}`).then(r => r.data),

  create: (payload) =>
    api.post('/quotes', payload).then(r => r.data),

  update: (id, payload) =>
    api.put(`/quotes/${id}`, payload).then(r => r.data),

  delete: (id) =>
    api.delete(`/quotes/${id}`).then(r => r.data),

  /** Convert a quote to an invoice */
  convertToInvoice: (id) =>
    api.post(`/quotes/${id}/convert`).then(r => r.data),

  /** Send quote to customer */
  send: (id) =>
    api.post(`/quotes/${id}/send`).then(r => r.data),

  // Invoices
  listInvoices: (params = {}) =>
    api.get('/invoices', { params }).then(r => r.data),

  getInvoice: (id) =>
    api.get(`/invoices/${id}`).then(r => r.data),

  markPaid: (id) =>
    api.post(`/invoices/${id}/pay`).then(r => r.data),
}

export default quoteService
