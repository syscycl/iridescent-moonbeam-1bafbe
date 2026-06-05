import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { loginUser, logoutUser, registerUser, getCurrentUser } from '@/lib/auth'
import type { AuthUser, UserRole } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => AuthUser | null
  logout: () => void
  register: (data: Omit<AuthUser, 'id' | 'refNumber' | 'status'> & { role: UserRole }) => AuthUser | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser())

  useEffect(() => {
    const handleStorage = () => {
      setUser(getCurrentUser())
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const loggedInUser = loginUser(email, password)
    if (loggedInUser) {
      setUser(loggedInUser)
    }
    return loggedInUser
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const register = useCallback(
    (data: Omit<AuthUser, 'id' | 'refNumber' | 'status'> & { role: UserRole }) => {
      const newUser = registerUser(data)
      setUser(newUser)
      return newUser
    },
    [],
  )

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
