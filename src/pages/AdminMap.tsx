import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Info } from 'lucide-react'

interface Neighborhood {
  id: string
  name: string
  households: number
  lat: number
  lng: number
  status: 'active' | 'planned' | 'proposed'
}

const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'sienna', name: 'Sienna Woods', households: 320, lat: 43.1711, lng: -80.2764, status: 'planned' },
  { id: 'wyndfield', name: 'Wyndfield', households: 280, lat: 43.1652, lng: -80.2641, status: 'planned' },
  { id: 'west-brant', name: 'West Brant', households: 410, lat: 43.1517, lng: -80.2923, status: 'proposed' },
  { id: 'north-end', name: 'North End', households: 190, lat: 43.1545, lng: -80.2618, status: 'proposed' },
  { id: 'eagle-place', name: 'Eagle Place', households: 220, lat: 43.1425, lng: -80.2682, status: 'proposed' },
  { id: 'holmedale', name: 'Holmedale', households: 150, lat: 43.1389, lng: -80.2647, status: 'proposed' },
  { id: 'terrace-hill', name: 'Terrace Hill', households: 260, lat: 43.1467, lng: -80.2721, status: 'proposed' },
  { id: 'west-br', name: 'West Brant (Core)', households: 180, lat: 43.1489, lng: -80.2887, status: 'proposed' },
]

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]', dot: 'bg-[#16a34a]' },
  planned: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-600' },
  proposed: { bg: 'bg-[#f9fafb]', text: 'text-[#6b7280]', dot: 'bg-[#9ca3af]' },
}

export default function AdminMap() {
  const [hovered, setHovered] = useState<string | null>(null)
  const totalHouseholds = NEIGHBORHOODS.reduce((sum, n) => sum + n.households, 0)

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Service Map</h1>
        </div>
        <p className="text-sm text-[#6b7280] mb-6">Visual planning map for Syscycl collection zones in Brantford</p>

        {/* Summary bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
            <p className="text-2xl font-bold font-mono text-[#111827]">{NEIGHBORHOODS.length}</p>
            <p className="text-xs text-[#6b7280]">Neighborhoods</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
            <p className="text-2xl font-bold font-mono text-[#111827]">~{totalHouseholds}</p>
            <p className="text-xs text-[#6b7280]">Est. Households</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
            <p className="text-2xl font-bold font-mono text-[#16a34a]">0</p>
            <p className="text-xs text-[#6b7280]">Active Zones</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
            <p className="text-2xl font-bold font-mono text-blue-600">2</p>
            <p className="text-xs text-[#6b7280]">Planned</p>
          </div>
        </div>

        {/* Map area */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 mb-6">
          <div className="relative bg-[#f0fdf4] rounded-lg border border-[#bbf7d0] p-8 min-h-[400px] flex items-center justify-center overflow-hidden">
            {/* Decorative grid lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-6 grid-rows-4 h-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-[#16a34a]" />
                ))}
              </div>
            </div>

            {/* Neighborhood pins */}
            {NEIGHBORHOODS.map((n, i) => {
              const colors = statusColors[n.status]
              const isHovered = hovered === n.id
              // Position pins in a rough grid layout
              const positions = [
                { left: '15%', top: '20%' }, { left: '35%', top: '15%' },
                { left: '10%', top: '50%' }, { left: '40%', top: '35%' },
                { left: '25%', top: '65%' }, { left: '50%', top: '55%' },
                { left: '65%', top: '30%' }, { left: '75%', top: '60%' },
              ]
              const pos = positions[i] || { left: '50%', top: '50%' }

              return (
                <motion.button
                  key={n.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute z-10"
                  style={{ left: pos.left, top: pos.top }}
                >
                  <div className={`w-4 h-4 rounded-full ${colors.dot} border-2 border-white shadow-md transition-all ${isHovered ? 'scale-150' : ''}`} />
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-[#e5e7eb] p-3 whitespace-nowrap z-20">
                      <p className="text-sm font-semibold text-[#111827]">{n.name}</p>
                      <p className="text-xs text-[#6b7280]">~{n.households} households</p>
                      <p className={`text-xs capitalize ${colors.text}`}>{n.status}</p>
                      <p className="text-xs text-[#9ca3af] font-mono">{n.lat.toFixed(4)}, {n.lng.toFixed(4)}</p>
                    </div>
                  )}
                </motion.button>
              )
            })}

            {/* Center label */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-[#6b7280]">
              Brantford, ON
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            {Object.entries(statusColors).map(([status, colors]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                <span className={`text-xs capitalize ${colors.text}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhood cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NEIGHBORHOODS.map((n) => {
            const colors = statusColors[n.status]
            return (
              <motion.div
                key={n.id}
                whileHover={{ y: -2 }}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                className="bg-white rounded-lg border border-[#e5e7eb] p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#16a34a]" />
                  <span className="font-medium text-sm text-[#111827]">{n.name}</span>
                </div>
                <p className="text-xs text-[#6b7280] mb-1">~{n.households} households</p>
                <p className="text-xs font-mono text-[#9ca3af] mb-2">{n.lat.toFixed(4)}, {n.lng.toFixed(4)}</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {n.status}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            This is a visual planning map. Actual household counts are estimates based on available data. Collection routes will be finalized based on registration demand.
          </p>
        </div>
      </div>
    </div>
  )
}
