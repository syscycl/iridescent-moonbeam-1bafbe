export type UserRole = 'household' | 'volunteer' | 'sponsor' | 'admin'

export interface AuthUser {
  id: string
  refNumber: string
  role: UserRole
  fullName: string
  phone: string
  email: string
  address: string
  mapPinUrl?: string
  preferredPickupDay?: string
  dayTime?: string
  source?: string
  remarks?: string
  createdAt: string
  // Role-specific fields
  availableDays?: string[]
  tShirtSize?: string
  emergencyContact?: string
  sponsorType?: string
  contributionInterest?: string
  sponsorMessage?: string
}

export interface AdminCredentials {
  username: string
  password: string
}

const ADMIN_KEY = 'syscycl_admin'
const USERS_KEY = 'syscycl_users'

function generateRefNumber(): string {
  const prefix = 'SYS'
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase()
  return `${prefix}-${random}-${timestamp}`
}

export function getUsers(): AuthUser[] {
  try {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getUserByRefNumber(refNumber: string): AuthUser | undefined {
  const users = getUsers()
  return users.find((u) => u.refNumber === refNumber)
}

export function registerUser(userData: Omit<AuthUser, 'id' | 'refNumber' | 'createdAt'>): AuthUser {
  const users = getUsers()
  const newUser: AuthUser = {
    ...userData as any,
    id: crypto.randomUUID(),
    refNumber: generateRefNumber(),
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return newUser
}

export function loginUser(username: string, password: string): AuthUser | null {
  const adminData = localStorage.getItem(ADMIN_KEY)
  if (!adminData) {
    // Auto-seed admin if not exists
    seedAdminUser()
    return loginUser(username, password)
  }

  const admin: AdminCredentials & { refNumber: string; fullName: string } = JSON.parse(adminData)
  if (admin.username === username && admin.password === password) {
    const adminUser: AuthUser = {
      id: 'admin-1',
      refNumber: admin.refNumber,
      role: 'admin',
      fullName: admin.fullName,
      phone: '',
      email: '',
      address: '',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('syscycl_current_user', JSON.stringify(adminUser))
    return adminUser
  }
  return null
}

export function logoutUser(): void {
  localStorage.removeItem('syscycl_current_user')
}

export function getCurrentUser(): AuthUser | null {
  try {
    const data = localStorage.getItem('syscycl_current_user')
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function seedAdminUser(): void {
  const existing = localStorage.getItem(ADMIN_KEY)
  if (!existing) {
    localStorage.setItem(
      ADMIN_KEY,
      JSON.stringify({
        username: 'tanisha',
        password: 'admin123',
        refNumber: 'SYS-ADMIN-001',
        fullName: 'Tanisha (Admin)',
      }),
    )
  }
}

// Stats helpers
export function getRegistrationStats() {
  const users = getUsers().filter((u) => u.role !== 'admin')
  return {
    total: users.length,
    households: users.filter((u) => u.role === 'household').length,
    volunteers: users.filter((u) => u.role === 'volunteer').length,
    sponsors: users.filter((u) => u.role === 'sponsor').length,
  }
}
