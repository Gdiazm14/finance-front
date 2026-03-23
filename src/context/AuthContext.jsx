import { createContext, useContext, useState } from 'react'
import { login as loginApi, register as registerApi } from '../api/auth.api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (credentials) => {
    const { data } = await loginApi(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
    }))
    setUser({ id: data.id, name: data.name, email: data.email })
  }

  const register = async (credentials) => {
    const { data } = await registerApi(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
    }))
    setUser({ id: data.id, name: data.name, email: data.email })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}