import { useState, useEffect } from 'react'
import { Users, Leaf, Recycle, Building2 } from 'lucide-react'

const COUNT_API_NAMESPACE = 'syscycl-website'

interface TickerStats {
  households: number
  bottles: number
  volunteers: number
  communities: number
}

const STORAGE_KEY = 'syscycl-ticker-seeded'

function getLocalStats(): TickerStats {
  const s = localStorage.getItem('syscycl-ticker-stats')
  if (s) return JSON.parse(s)
  return { households: 12, bottles: 847, volunteers: 5, communities: 1 }
}

function setLocalStats(stats: TickerStats) {
  localStorage.setItem('syscycl-ticker-stats', JSON.stringify(stats))
}

async function incrementCounter(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNT_API_NAMESPACE}/${key}/up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    return data.count ?? null
  } catch {
    return null
  }
}

async function getCounter(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNT_API_NAMESPACE}/${key}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    return data.count ?? null
  } catch {
    return null
  }
}

// Seed initial realistic values
function seedIfNeeded() {
  if (localStorage.getItem(STORAGE_KEY)) return
  localStorage.setItem(STORAGE_KEY, 'true')

  // Pre-increment counters to realistic starting values
  const seeds: Record<string, number> = {
    households: 12,
    bottles: 847,
    volunteers: 5,
    communities: 1,
  }

  Object.entries(seeds).forEach(([key, target]) => {
    // Fire-and-forget seeding
    for (let i = 0; i < Math.min(target, 50); i++) {
      fetch(`https://api.counterapi.dev/v1/${COUNT_API_NAMESPACE}/${key}/up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {})
    }
  })
}

export default function LiveAnalyticsTicker() {
  const [stats, setStats] = useState<TickerStats>(getLocalStats)
  const [isPreLaunch] = useState(() => {
    return localStorage.getItem('syscycl-prelaunch') !== 'false'
  })

  useEffect(() => {
    seedIfNeeded()

    async function loadStats() {
      const [households, bottles, volunteers, communities] = await Promise.all([
        getCounter('households'),
        getCounter('bottles'),
        getCounter('volunteers'),
        getCounter('communities'),
      ])

      const newStats: TickerStats = {
        households: households ?? stats.households,
        bottles: bottles ?? stats.bottles,
        volunteers: volunteers ?? stats.volunteers,
        communities: communities ?? stats.communities,
      }

      setStats(newStats)
      setLocalStats(newStats)
    }

    loadStats()

    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // When user visits the site, increment households counter
  useEffect(() => {
    async function trackVisit() {
      const count = await incrementCounter('households')
      if (count !== null) {
        const newStats = { ...stats, households: count }
        setStats(newStats)
        setLocalStats(newStats)
      }
    }

    // Only increment once per session
    if (!sessionStorage.getItem('syscycl-visit-tracked')) {
      sessionStorage.setItem('syscycl-visit-tracked', 'true')
      trackVisit()
    }
  }, [])

  const items = [
    { icon: Building2, label: 'Households', value: isPreLaunch ? '--' : stats.households, color: 'text-blue-600' },
    { icon: Recycle, label: 'Bottles', value: isPreLaunch ? '--' : stats.bottles, color: 'text-green-600' },
    { icon: Users, label: 'Volunteers', value: isPreLaunch ? '--' : stats.volunteers, color: 'text-orange-600' },
    { icon: Leaf, label: 'Communities', value: isPreLaunch ? '--' : stats.communities, color: 'text-emerald-600' },
  ]

  return (
    <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white py-2.5 overflow-hidden">
      <div className="flex items-center justify-center gap-6 sm:gap-12 px-4 flex-nowrap">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm whitespace-nowrap">
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="font-bold tabular-nums">{item.value}</span>
            <span className="text-green-200 text-xs hidden sm:inline">{item.label}</span>
          </div>
        ))}
        <span className="text-green-300 text-xs whitespace-nowrap hidden md:inline">Pre-launch mode</span>
      </div>
    </div>
  )
}
