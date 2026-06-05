export type UserRole = 'household' | 'volunteer' | 'sponsor' | 'admin'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  refNumber: string
  fullName: string
  phone: string
  password?: string
  securityQuestion?: string
  securityAnswer?: string
  mapPinUrl?: string
  address: string
  preferredPickupDay?: string
  dayTime?: string
  source?: string
  remarks?: string
  email_contact?: string
  status: 'active' | 'pending'
  // volunteer-specific
  availableDays?: string[]
  tShirtSize?: string
  emergencyContact?: string
  // sponsor-specific
  sponsorType?: string
  contributionInterest?: string
  sponsorMessage?: string
}

const ROLE_PREFIXES: Record<UserRole, string> = {
  household: 'SYC-H',
  volunteer: 'SYC-V',
  sponsor: 'SYC-SP',
  admin: 'SYC-ADMIN',
}

export function generateRefNumber(role: UserRole): string {
  const prefix = ROLE_PREFIXES[role]
  const num = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}-${num}`
}

export function registerUser(
  data: Omit<AuthUser, 'id' | 'refNumber' | 'status'> & { role: UserRole },
): AuthUser {
  const users = getAllUsers()
  const newUser: AuthUser = {
    ...data as any,
    id: crypto.randomUUID(),
    refNumber: generateRefNumber(data.role),
    status: 'active',
  }
  users.push(newUser)
  localStorage.setItem('syscycl_users', JSON.stringify(users))
  return newUser
}

export function getAllUsers(): AuthUser[] {
  try {
    return JSON.parse(localStorage.getItem('syscycl_users') || '[]')
  } catch {
    return []
  }
}

export function seedAdminUser(): void {
  const users = getAllUsers()
  if (!users.find((u) => u.email === 'tanisha@syscycl.com')) {
    registerUser({
      role: 'admin',
      fullName: 'Tanisha',
      email: 'tanisha@syscycl.com',
      phone: '',
      password: 'Syscycl2026!',
      securityQuestion: '',
      securityAnswer: '',
      address: '',
      preferredPickupDay: '',
      source: '',
      remarks: '',
      status: 'active',
    } as any)
  }
}

export function loginUser(email: string, password: string): AuthUser | null {
  seedAdminUser()
  const user = getAllUsers().find((u) => u.email === email && u.password === password)
  if (!user) return null
  const session = {
    userId: user.id,
    role: user.role,
    token: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
  localStorage.setItem('syscycl_session', JSON.stringify(session))
  return user
}

export function logoutUser(): void {
  localStorage.removeItem('syscycl_session')
}

export function getCurrentUser(): AuthUser | null {
  try {
    const session = JSON.parse(localStorage.getItem('syscycl_session') || 'null')
    if (!session || new Date(session.expiresAt) < new Date()) {
      logoutUser()
      return null
    }
    return getAllUsers().find((u) => u.id === session.userId) || null
  } catch {
    return null
  }
}
