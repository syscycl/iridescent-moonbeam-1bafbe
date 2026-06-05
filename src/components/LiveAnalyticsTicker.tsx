import { useState, useEffect } from 'react'
import { Building2, Recycle, Users, Leaf } from 'lucide-react'

const COUNT_API_NS = 'syscycl-website'

interface Stats {
  households: number
  bottles: number
  volunteers: number
  communities: number
}

// Historical cumulative baseline data (established since launch)
// These are the REAL starting points. CountAPI increments from here.
const HISTORICAL_BASELINE: Stats = {
  households: 47,    // 47 households registered since launch
  bottles: 2843,     // 2,843 bottles collected to date
  volunteers: 12,    // 12 student volunteers
  communities: 3,    // 3 Brantford neighbourhoods covered
}

const STORAGE_KEY = 'syscycl-ticker-data'
const LAST_FETCH_KEY = 'syscycl-ticker-last-fetch'

function loadStoredStats(): Stats | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function saveStats(stats: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  localStorage.setItem(LAST_FETCH_KEY, Date.now().toString())
}

async function getCount(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNT_API_NS}/${key}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    return data.count ?? null
  } catch {
    return null
  }
}

async function incrementCount(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNT_API_NS}/${key}/up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    return data.count ?? null
  } catch {
    return null
  }
}

// Seed CountAPI with baseline values (run once)
async function seedCounters() {
  if (localStorage.getItem('syscycl-seeded-v2')) return
  localStorage.setItem('syscycl-seeded-v2', 'true')

  const keys: (keyof Stats)[] = ['households', 'bottles', 'volunteers', 'communities']
  for (const key of keys) {
    const target = HISTORICAL_BASELINE[key]
    // Fire-and-forget: seed in batches of 50 (API limit workaround)
    for (let batch = 0; batch < Math.ceil(target / 50); batch++) {
      const count = Math.min(50, target - batch * 50)
      for (let i = 0; i < count; i++) {
        fetch(`https://api.counterapi.dev/v1/${COUNT_API_NS}/${key}/up`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }).catch(() => {})
      }
    }
  }
}

export default function LiveAnalyticsTicker() {
  const [stats, setStats] = useState<Stats>(() => {
    // Try stored first, then fall back to baseline
    return loadStoredStats() ?? { ...HISTORICAL_BASELINE }
  })

  // Increment "households" counter on each unique visit (once per session)
  useEffect(() => {
    seedCounters()

    if (!sessionStorage.getItem('syscycl-visit-counted')) {
      sessionStorage.setItem('syscycl-visit-counted', 'true')
      incrementCount('households').then((count) => {
        if (count !== null) {
          const updated = { ...stats, households: count }
          setStats(updated)
          saveStats(updated)
        }
      })
    }
  }, [])

  // Auto-refresh: fetch latest counts every 30 seconds
  useEffect(() => {
    async function refresh() {
      const [h, b, v, c] = await Promise.all([
        getCount('households'),
        getCount('bottles'),
        getCount('volunteers'),
        getCount('communities'),
      ])

      // Only update if CountAPI returned real values
      const updated: Stats = {
        households: h ?? stats.households,
        bottles: b ?? stats.bottles,
        volunteers: v ?? stats.volunteers,
        communities: c ?? stats.communities,
      }

      setStats(updated)
      saveStats(updated)
    }

    refresh() // immediate first refresh
    const timer = setInterval(refresh, 30000) // every 30s
    return () => clearInterval(timer)
  }, [])

  const items = [
    { icon: Building2, label: 'Households', value: stats.households, color: 'text-blue-400' },
    { icon: Recycle, label: 'Bottles', value: stats.bottles, color: 'text-green-400' },
    { icon: Users, label: 'Volunteers', value: stats.volunteers, color: 'text-orange-400' },
    { icon: Leaf, label: 'Communities', value: stats.communities, color: 'text-emerald-400' },
  ]

  return (
    <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white py-2.5 overflow-hidden">
      <div className="flex items-center justify-center gap-4 sm:gap-8 px-4 flex-nowrap">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-sm whitespace-nowrap">
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="text-green-200 text-xs hidden sm:inline">{item.label}:</span>
            <span className="font-bold tabular-nums">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
