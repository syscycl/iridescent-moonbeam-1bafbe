import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthUser } from '@/lib/auth'
import { registerUser, loginUser, logoutUser, getCurrentUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  register: (userData: Omit<AuthUser, 'id' | 'refNumber' | 'createdAt'>) => AuthUser
  login: (username: string, password: string) => AuthUser | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser)

  const register = useCallback((userData: Omit<AuthUser, 'id' | 'refNumber' | 'createdAt'>) => {
    const newUser = registerUser(userData)
    return newUser
  }, [])

  const login = useCallback((username: string, password: string) => {
    const loggedInUser = loginUser(username, password)
    if (loggedInUser) {
      setUser(loggedInUser)
    }
    return loggedInUser
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
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
