/**
 * authService.js
 * Abstraction over the auth API endpoints.
 * Replace api calls with real HTTP when backend is ready.
 */
import api from '../lib/api'

const authService = {
  /**
   * Login a user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user, token}>}
   */
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then(r => r.data),

  /**
   * Register a new user + company
   * @param {object} payload - { first_name, last_name, email, password, company_name }
   */
  register: (payload) =>
    api.post('/auth/register', payload).then(r => r.data),

  /**
   * Fetch the currently authenticated user
   */
  me: () =>
    api.get('/auth/me').then(r => r.data),

  /**
   * Logout the current session
   */
  logout: () =>
    api.post('/auth/logout').then(r => r.data),
}

export default authService
