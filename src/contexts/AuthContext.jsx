import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = [
  {
    id: 1, first_name: 'Sara', last_name: 'Alami',
    email: 'owner@techmaroc.ma', password: 'password',
    role: 'owner',
    team: { id: 1, name: 'Direction' },
    company: { id: 1, name: 'TechMaroc SARL', currency: 'MAD' }
  },
  {
    id: 2, first_name: 'Karim', last_name: 'Ouali',
    email: 'chef@techmaroc.ma', password: 'password',
    role: 'chef_equipe',
    team: { id: 2, name: 'R&D' },
    company: { id: 1, name: 'TechMaroc SARL', currency: 'MAD' }
  },
  {
    id: 3, first_name: 'Leila', last_name: 'Benali',
    email: 'equipe@techmaroc.ma', password: 'password',
    role: 'equipe',
    team: { id: 2, name: 'R&D' },
    company: { id: 1, name: 'TechMaroc SARL', currency: 'MAD' }
  },
]

export const ROLE_LABELS = {
  owner:       'Company Owner',
  chef_equipe: "Chef d'équipe",
  equipe:      'Équipe',
}
export const ROLES = {
  OWNER: 'owner',
  CHEF: 'chef_equipe',
  EQUIPE: 'equipe',
}
export const canEditBudgets = (user) => {
  if (!user) return false
  return ['owner', 'chef_equipe'].includes(user.role)
}

export const canViewBudgets = (user) => {
  if (!user) return false
  return ['owner', 'chef_equipe', 'equipe'].includes(user.role)
}

export const ROLE_COLORS = {
  owner:       'bg-indigo-50 text-indigo-700',
  chef_equipe: 'bg-emerald-50 text-emerald-700',
  equipe:      'bg-amber-50 text-amber-700',
}

export const CAN = {
  seeAllExpenses:  (r) => r === 'owner',
  seeTeamExpenses: (r) => r === 'chef_equipe',
  seeTeamReadOnly: (r) => r === 'equipe',
  approve:         (r) => ['owner','chef_equipe'].includes(r),
  reimburse:       (r) => r === 'owner',
  admin:           (r) => r === 'owner',
  createExpense:   (r) => ['chef_equipe','equipe'].includes(r),
  erp:             (r) => ['owner','chef_equipe'].includes(r),
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mock_user')
      if (saved) setUser(JSON.parse(saved))
    } catch { localStorage.removeItem('mock_user') }
    finally { setLoading(false) }
  }, [])

  const login = async (email, password) => {
    await new Promise(r => setTimeout(r, 600))
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) {
      const err = new Error('Identifiants incorrects.')
      err.response = { data: { message: 'Identifiants incorrects.' } }
      throw err
    }
    const { password: _, ...safe } = found
    localStorage.setItem('mock_user', JSON.stringify(safe))
    setUser(safe)
    return safe
  }

  const register = async (payload) => {
    await new Promise(r => setTimeout(r, 800))
    if (MOCK_USERS.find(u => u.email === payload.email)) {
      const err = new Error('Email déjà utilisé.')
      err.response = { status: 422, data: { errors: { email: ['Cet email est déjà utilisé.'] } } }
      throw err
    }
    const newUser = {
      id: Date.now(),
      first_name: payload.first_name,
      last_name:  payload.last_name,
      email:      payload.email,
      role:       payload.role || 'equipe',
      team:       null,
      company:    { id: Date.now(), name: payload.company_name, currency: payload.currency || 'MAD' },
    }
    localStorage.setItem('mock_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = async () => {
    localStorage.removeItem('mock_user')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, CAN, ROLE_LABELS, canEditBudgets,canViewBudgets }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
