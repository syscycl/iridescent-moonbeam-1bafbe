// ============================================================
// TICKER COUNTER AUTOMATION
// Every significant event auto-increments the live ticker counters
// via CountAPI (free, no auth, works across all devices)
// ============================================================

const NS = 'syscycl-live-v2'
const SEEN_KEY = 'syscycl-ticker-seen'

// Track which events we've already counted in this session
// (so refreshing doesn't double-count)
function alreadyCounted(event: string): boolean {
  const seen = JSON.parse(sessionStorage.getItem(SEEN_KEY) || '{}')
  if (seen[event]) return true
  seen[event] = true
  sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen))
  return false
}

// Fire-and-forget increment (never blocks, never fails)
function increment(key: string) {
  fetch(`https://api.counterapi.dev/v1/${NS}/${key}/up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  }).catch(() => {}) // Silently ignore errors
}

// Called from registerUser() — every registration auto-updates ticker
export function trackRegistration(role: 'household' | 'volunteer' | 'sponsor') {
  // Always increment total registrations
  increment('registrations')

  // Also increment role-specific counter
  if (role === 'volunteer') {
    increment('volunteers')
  } else if (role === 'sponsor') {
    increment('sponsors')
  }
  // Household registrations go to total only (not a separate counter)
}

// Called when Instagram section scrolls into view
export function trackInstagramView() {
  if (alreadyCounted('instagram')) return
  increment('instagramViews')
}

// Called when someone opens the chat
export function trackChatOpen() {
  if (alreadyCounted('chat')) return
  increment('chatOpens')
}

// Manual increment for admin use (e.g., from social media insights)
export function manualIncrement(counter: 'websiteVisits' | 'instagramViews' | 'registrations' | 'volunteers' | 'sponsors') {
  increment(counter)
}

// Get current counts (for display)
export async function getCounts(): Promise<{
  websiteVisits: number
  instagramViews: number
  registrations: number
  volunteers: number
  sponsors: number
}> {
  const fetchCount = async (key: string): Promise<number> => {
    try {
      const res = await fetch(`https://api.counterapi.dev/v1/${NS}/${key}`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      const data = await res.json()
      return data.count ?? 0
    } catch {
      return 0
    }
  }

  const [websiteVisits, instagramViews, registrations, volunteers, sponsors] =
    await Promise.all([
      fetchCount('websiteVisits'),
      fetchCount('instagramViews'),
      fetchCount('registrations'),
      fetchCount('volunteers'),
      fetchCount('sponsors'),
    ])

  return { websiteVisits, instagramViews, registrations, volunteers, sponsors }
}
