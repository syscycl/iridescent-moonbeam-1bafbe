import { useState, useEffect } from 'react'
import { TrendingUp, Instagram, UserPlus, Users, Handshake } from 'lucide-react'

// ============================================================
// LIVE ANALYTICS TICKER
// Tracks 5 real-time metrics via CountAPI (free, no auth needed)
// Each metric auto-increments when the corresponding action happens
// ============================================================

const NS = 'syscycl-live-v2'

interface Stats {
  websiteVisits: number      // Auto: incremented on every page visit
  instagramViews: number     // Auto: incremented when Instagram section is viewed
  registrations: number      // Manual/Auto: incremented on each registration
  volunteers: number         // Manual/Auto: incremented when volunteer registers
  sponsors: number           // Manual/Auto: incremented when sponsor registers
}

const STORAGE_KEY = 'syscycl-ticker-v2'

function loadStored(): Stats | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function saveStored(s: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

async function getCount(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${NS}/${key}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.count === 'number' ? data.count : null
  } catch { return null }
}

async function incrementCount(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${NS}/${key}/up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.count === 'number' ? data.count : null
  } catch { return null }
}

export default function LiveAnalyticsTicker() {
  const [stats, setStats] = useState<Stats>(() => loadStored() ?? {
    websiteVisits: 0,
    instagramViews: 0,
    registrations: 0,
    volunteers: 0,
    sponsors: 0,
  })

  // Count this visit (once per session)
  useEffect(() => {
    if (sessionStorage.getItem('syscycl-counted')) return
    sessionStorage.setItem('syscycl-counted', 'true')

    incrementCount('websiteVisits').then((c) => {
      if (c !== null) {
        setStats(prev => {
          const u = { ...prev, websiteVisits: c }
          saveStored(u)
          return u
        })
      }
    })
  }, [])

  // Refresh all counters every 30 seconds
  useEffect(() => {
    async function refresh() {
      const [v, i, r, vl, s] = await Promise.all([
        getCount('websiteVisits'),
        getCount('instagramViews'),
        getCount('registrations'),
        getCount('volunteers'),
        getCount('sponsors'),
      ])
      setStats(prev => {
        const u: Stats = {
          websiteVisits: v ?? prev.websiteVisits,
          instagramViews: i ?? prev.instagramViews,
          registrations: r ?? prev.registrations,
          volunteers: vl ?? prev.volunteers,
          sponsors: s ?? prev.sponsors,
        }
        saveStored(u)
        return u
      })
    }
    refresh()
    const t = setInterval(refresh, 30000)
    return () => clearInterval(t)
  }, [])

  const items = [
    {
      icon: TrendingUp,
      label: 'Website Visits',
      value: stats.websiteVisits,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
    },
    {
      icon: Instagram,
      label: 'Instagram Reach',
      value: stats.instagramViews,
      color: 'text-pink-400',
      bg: 'bg-pink-500/20',
    },
    {
      icon: UserPlus,
      label: 'Registrations',
      value: stats.registrations,
      color: 'text-green-400',
      bg: 'bg-green-500/20',
    },
    {
      icon: Users,
      label: 'Volunteers',
      value: stats.volunteers,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
    },
    {
      icon: Handshake,
      label: 'Sponsors',
      value: stats.sponsors,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
    },
  ]

  return (
    <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white py-2.5">
      <div className="max-w-6xl mx-auto px-3">
        {/* Desktop: horizontal row */}
        <div className="hidden sm:flex items-center justify-center gap-4 lg:gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${item.bg}`}
              title={item.label}
            >
              <item.icon className={`w-3.5 h-3.5 ${item.color} flex-shrink-0`} />
              <span className="text-green-200 text-[11px] hidden lg:inline whitespace-nowrap">{item.label}:</span>
              <span className="font-bold tabular-nums text-xs">{item.value.toLocaleString()}</span>
            </div>
          ))}
          <span className="text-green-400 text-[10px] ml-1 animate-pulse">Live</span>
        </div>

        {/* Mobile: scrolling ticker */}
        <div className="sm:hidden flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {items.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${item.bg} flex-shrink-0`}
            >
              <item.icon className={`w-3 h-3 ${item.color}`} />
              <span className="text-green-200 text-[10px]">{item.label}</span>
              <span className="font-bold tabular-nums text-[11px]">{item.value.toLocaleString()}</span>
            </div>
          ))}
          <span className="text-green-400 text-[9px] flex-shrink-0 animate-pulse">Live</span>
        </div>
      </div>
    </div>
  )
}
