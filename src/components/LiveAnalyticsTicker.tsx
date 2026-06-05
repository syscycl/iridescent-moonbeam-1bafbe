import { useState, useEffect } from 'react'
import { Recycle, Users, Leaf, TrendingUp } from 'lucide-react'

// ============================================================
// LIVE ANALYTICS TICKER - Uses CountAPI for REAL visit tracking
// Each count reflects ACTUAL website interactions, not estimates
// ============================================================

const COUNT_API_NS = 'syscycl-live'

interface LiveStats {
  websiteVisits: number    // Actual unique website visits (auto-incremented)
  bottlesCollected: number  // Bottles physically collected (manually updated)
  activeVolunteers: number  // Registered volunteers (manually updated)
  co2Saved: number          // KG of CO2 saved from recycling
}

// Starting baselines - these are REAL operational numbers to date.
// When CountAPI returns a value, we use that. Otherwise fall back.
const BASELINE: LiveStats = {
  websiteVisits: 0,      // Starts at 0, auto-increments on each visit
  bottlesCollected: 0,   // Starts at 0, manually updated as ops begin
  activeVolunteers: 0,   // Starts at 0, manually updated
  co2Saved: 0,           // Starts at 0, calculated: bottles * 0.05kg CO2 per bottle
}

const STORAGE_KEY = 'syscycl-live-stats-v3'

function loadStored(): LiveStats | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return null
}

function saveStored(stats: LiveStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

async function getCount(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNT_API_NS}/${key}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.count === 'number' ? data.count : null
  } catch {
    return null
  }
}

async function incrementCount(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNT_API_NS}/${key}/up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    return typeof data.count === 'number' ? data.count : null
  } catch {
    return null
  }
}

export default function LiveAnalyticsTicker() {
  const [stats, setStats] = useState<LiveStats>(() => loadStored() ?? { ...BASELINE })

  // On mount: increment websiteVisits (one per session)
  useEffect(() => {
    if (sessionStorage.getItem('syscycl-visiting')) return
    sessionStorage.setItem('syscycl-visiting', 'true')

    incrementCount('websiteVisits').then((count) => {
      if (count !== null) {
        setStats(prev => {
          const updated = { ...prev, websiteVisits: count }
          saveStored(updated)
          return updated
        })
      }
    })
  }, [])

  // Auto-refresh all counters every 30 seconds
  useEffect(() => {
    async function refresh() {
      const [visits, bottles, volunteers] = await Promise.all([
        getCount('websiteVisits'),
        getCount('bottlesCollected'),
        getCount('activeVolunteers'),
      ])

      setStats(prev => {
        const updated: LiveStats = {
          websiteVisits: visits ?? prev.websiteVisits,
          bottlesCollected: bottles ?? prev.bottlesCollected,
          activeVolunteers: volunteers ?? prev.activeVolunteers,
          co2Saved: (bottles ?? prev.bottlesCollected) * 0.05, // ~50g CO2 per PET bottle
        }
        saveStored(updated)
        return updated
      })
    }

    refresh()
    const timer = setInterval(refresh, 30000)
    return () => clearInterval(timer)
  }, [])

  const items = [
    {
      icon: TrendingUp,
      label: 'Total Visits',
      value: stats.websiteVisits,
      desc: 'People who visited syscycl.com',
      color: 'text-blue-400',
    },
    {
      icon: Recycle,
      label: 'Bottles Collected',
      value: stats.bottlesCollected,
      desc: 'PET bottles physically collected',
      color: 'text-green-400',
    },
    {
      icon: Users,
      label: 'Volunteers',
      value: stats.activeVolunteers,
      desc: 'Registered student volunteers',
      color: 'text-orange-400',
    },
    {
      icon: Leaf,
      label: 'CO2 Saved (kg)',
      value: Math.round(stats.co2Saved * 10) / 10,
      desc: 'Kilograms of CO2 prevented',
      color: 'text-emerald-400',
    },
  ]

  return (
    <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white py-2.5">
      <div className="max-w-6xl mx-auto px-4">
        {/* Desktop: horizontal row */}
        <div className="hidden sm:flex items-center justify-center gap-6">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2" title={item.desc}>
              <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
              <span className="text-green-200 text-xs">{item.label}:</span>
              <span className="font-bold tabular-nums text-sm">{typeof item.value === 'number' && item.value < 1 ? item.value.toFixed(1) : item.value.toLocaleString()}</span>
            </div>
          ))}
          <span className="text-green-400 text-xs ml-2">Updates live</span>
        </div>

        {/* Mobile: 2x2 grid */}
        <div className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-1.5">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <item.icon className={`w-3.5 h-3.5 ${item.color} flex-shrink-0`} />
              <div className="flex flex-col leading-tight">
                <span className="text-green-300 text-[10px]">{item.label}</span>
                <span className="font-bold tabular-nums text-xs">
                  {typeof item.value === 'number' && item.value < 1 ? item.value.toFixed(1) : item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
