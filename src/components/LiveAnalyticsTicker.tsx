import { useState, useEffect } from 'react'
import { TrendingUp, Instagram, UserPlus, Users, Handshake } from 'lucide-react'
import { getCounts } from '@/lib/ticker'

// ============================================================
// LIVE ANALYTICS TICKER — Fully Automated
// Every counter updates automatically when real events happen
// Labels are FULL ENGLISH TEXT — visible on all screen sizes
// ============================================================

interface Stats {
  websiteVisits: number
  instagramViews: number
  registrations: number
  volunteers: number
  sponsors: number
}

const STORAGE_KEY = 'syscycl-ticker-display'

function loadStored(): Stats {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      websiteVisits: stored.websiteVisits ?? 0,
      instagramViews: stored.instagramViews ?? 0,
      registrations: stored.registrations ?? 0,
      volunteers: stored.volunteers ?? 0,
      sponsors: stored.sponsors ?? 0,
    }
  } catch {
    return { websiteVisits: 0, instagramViews: 0, registrations: 0, volunteers: 0, sponsors: 0 }
  }
}

function saveStored(s: Stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

export default function LiveAnalyticsTicker() {
  const [stats, setStats] = useState<Stats>(loadStored)

  // Count this visit (once per session)
  useEffect(() => {
    if (sessionStorage.getItem('syscycl-visit-counted')) return
    sessionStorage.setItem('syscycl-visit-counted', 'true')

    fetch('https://api.counterapi.dev/v1/syscycl-live-v2/websiteVisits/up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    }).catch(() => {})
  }, [])

  // Refresh all counters every 15 seconds
  useEffect(() => {
    async function refresh() {
      const counts = await getCounts()
      setStats(counts)
      saveStored(counts)
    }
    refresh()
    const t = setInterval(refresh, 15000)
    return () => clearInterval(t)
  }, [])

  const items = [
    { icon: TrendingUp, label: 'Website Visits', value: stats.websiteVisits, color: 'text-blue-300' },
    { icon: Instagram, label: 'Instagram Reach', value: stats.instagramViews, color: 'text-pink-300' },
    { icon: UserPlus, label: 'Registrations', value: stats.registrations, color: 'text-green-300' },
    { icon: Users, label: 'Volunteers', value: stats.volunteers, color: 'text-orange-300' },
    { icon: Handshake, label: 'Sponsors', value: stats.sponsors, color: 'text-purple-300' },
  ]

  return (
    <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white py-3">
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop: full labels always visible */}
        <div className="hidden md:flex items-center justify-center gap-5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-green-200 text-sm whitespace-nowrap">{item.label}</span>
              <span className="font-bold tabular-nums text-base">{item.value.toLocaleString()}</span>
            </div>
          ))}
          <span className="flex items-center gap-1 ml-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Live</span>
          </span>
        </div>

        {/* Tablet: compact with labels */}
        <div className="hidden sm:flex md:hidden items-center justify-center gap-3 flex-wrap">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-green-200 text-xs">{item.label}</span>
              <span className="font-bold tabular-nums text-sm">{item.value.toLocaleString()}</span>
            </div>
          ))}
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px]">Live</span>
          </span>
        </div>

        {/* Mobile: scrolling with clear labels */}
        <div className="sm:hidden flex items-center gap-3 overflow-x-auto">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 flex-shrink-0 bg-white/10 rounded-full px-3 py-1">
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
              <span className="text-green-200 text-xs">{item.label}</span>
              <span className="font-bold tabular-nums text-sm">{item.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px]">Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}
