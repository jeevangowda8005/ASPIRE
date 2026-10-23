import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../lib/api'
const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = localStorage.getItem('aspire_token')
    const cachedUser = localStorage.getItem('aspire_user')
    if (token && cachedUser) setUser(JSON.parse(cachedUser))
    setLoading(false)
  }, [])
  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    localStorage.setItem('aspire_token', res.data.access_token)
    localStorage.setItem('aspire_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }
  const register = async (name, email, password, university) => {
    const res = await authApi.register({ name, email, password, university })
    localStorage.setItem('aspire_token', res.data.access_token)
    localStorage.setItem('aspire_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }
  const logout = () => {
    localStorage.removeItem('aspire_token')
    localStorage.removeItem('aspire_user')
    setUser(null)
  }
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
