// ============================================================
// SUPABASE CLIENT - Shared cloud database for Syscycl
// All registrations sync in real-time across all devices
// ============================================================

// INSTRUCTIONS TO CONNECT:
// 1. Go to https://supabase.com and create a free account
// 2. Create a new project (takes 2 minutes)
// 3. Go to Project Settings → API
// 4. Copy the "Project URL" and paste below as SUPABASE_URL
// 5. Copy the "anon public" API key and paste below as SUPABASE_ANON_KEY
// 6. In Supabase, go to Table Editor → New Table
//    - Table name: registrations
//    - Columns: id (uuid, primary), full_name (text), phone (text), email (text), address (text), role (text), ref_number (text), source (text), created_at (timestampz)
// 7. Done! All registrations now sync automatically.

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'     // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY' // Replace with your anon key

// For now, use localStorage as fallback + Formspree email notifications
// Once Supabase is connected, registrations sync across all devices automatically

import type { AuthUser } from './auth'

interface SupabaseConfig {
  url: string
  key: string
}

function getConfig(): SupabaseConfig | null {
  const url = localStorage.getItem('syscycl_supabase_url') || SUPABASE_URL
  const key = localStorage.getItem('syscycl_supabase_key') || SUPABASE_ANON_KEY
  if (url && key && !url.includes('YOUR_')) {
    return { url, key }
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
