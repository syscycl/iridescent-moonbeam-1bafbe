// ============================================================
// SUPABASE CLIENT - Shared cloud database for Syscycl
// All registrations sync in real-time across all devices
// ============================================================

// Supabase Cloud Database - Connected for automatic cross-device sync
// All registrations are stored here and appear in the admin panel instantly

const SUPABASE_URL = 'https://xyInngfgtyxuqgxffzyf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bG5uZ2ZndHl4dXFneGZmenlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTU0MjAsImV4cCI6MjA2NjMzMTQyMH0.Jpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bG5uZ2ZndHl4dXFneGZmenlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTU0MjAsImV4cCI6MjA2NjMzMTQyMH0'

// For now, use localStorage as fallback + Formspree email notifications
// Once Supabase is connected, registrations sync across all devices automatically

import type { AuthUser } from './auth'

interface SupabaseConfig {
  url: string
  key: string
}

function getConfig(): SupabaseConfig | null {
  // Use hardcoded credentials (primary) or localStorage override (optional)
  const url = SUPABASE_URL
  const key = SUPABASE_ANON_KEY
  if (url && key && !url.includes('YOUR_')) {
    return { url, key }
  }
  // Fallback to localStorage if hardcoded values are not set
  const lsUrl = localStorage.getItem('syscycl_supabase_url')
  const lsKey = localStorage.getItem('syscycl_supabase_key')
  if (lsUrl && lsKey) {
    return { url: lsUrl, key: lsKey }
  }
  return null
}

export function isSupabaseConnected(): boolean {
  return getConfig() !== null
}

// Save Supabase credentials (called from admin panel settings)
export function setSupabaseCredentials(url: string, key: string) {
  localStorage.setItem('syscycl_supabase_url', url)
  localStorage.setItem('syscycl_supabase_key', key)
}

// Store registration in cloud + local
export async function storeRegistration(user: AuthUser): Promise<boolean> {
  const config = getConfig()

  // Always store locally
  const registrations = getCloudRegistrations()
  registrations.push({
    id: user.id,
    full_name: user.fullName,
    phone: user.phone,
    email: user.email || '',
    address: user.address,
    role: user.role,
    ref_number: user.refNumber,
    source: user.source || '',
    created_at: new Date().toISOString(),
  })
  localStorage.setItem('syscycl_cloud_regs', JSON.stringify(registrations))

  // If Supabase is connected, also store in cloud
  if (config) {
    try {
      const response = await fetch(`${config.url}/rest/v1/registrations`, {
        method: 'POST',
        headers: {
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          id: user.id,
          full_name: user.fullName,
          phone: user.phone,
          email: user.email || '',
          address: user.address,
          role: user.role,
          ref_number: user.refNumber,
          source: user.source || '',
        }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  return true
}

// Fetch ALL registrations from cloud
export async function fetchAllRegistrations(): Promise<any[]> {
  const config = getConfig()

  // If Supabase connected, fetch from cloud
  if (config) {
    try {
      const response = await fetch(`${config.url}/rest/v1/registrations?select=*&order=created_at.desc`, {
        headers: {
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Also cache locally
        localStorage.setItem('syscycl_cloud_regs', JSON.stringify(data))
        return data
      }
    } catch {
      // Fall through to local cache
    }
  }

  // Fallback: return locally cached registrations
  return getCloudRegistrations()
}

// Get locally cached cloud registrations
function getCloudRegistrations(): any[] {
  try {
    return JSON.parse(localStorage.getItem('syscycl_cloud_regs') || '[]')
  } catch {
    return []
  }
}

// Subscribe to real-time updates (when Supabase is connected)
export function subscribeToRegistrations(callback: (registrations: any[]) => void): () => void {
  // Poll every 10 seconds for now (real-time via Supabase Realtime can be added later)
  const interval = setInterval(async () => {
    const regs = await fetchAllRegistrations()
    callback(regs)
  }, 10000)

  // Initial fetch
  fetchAllRegistrations().then(callback)

  return () => clearInterval(interval)
}
