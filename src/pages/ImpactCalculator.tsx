import { motion } from 'framer-motion'
import { BarChart3, Leaf, Droplets, Wind, Recycle } from 'lucide-react'

export default function ImpactCalculator() {
  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Environmental Impact</h1>
        </div>
        <p className="text-sm text-[#6b7280] mb-8">Track the difference our community recycling makes</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Bottles Collected', value: '--', icon: Recycle, color: 'text-[#16a34a]', bg: 'bg-[#f0fdf4]' },
            { label: 'kg CO2 Avoided', value: '--', icon: Wind, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'kg Plastic Diverted', value: '--', icon: Leaf, color: 'text-[#d97706]', bg: 'bg-amber-50' },
            { label: 'Litres Water Saved', value: '--', icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          ].map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm text-center"
            >
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-3xl font-bold font-mono text-[#111827] mb-1">{s.value}</p>
              <p className="text-xs text-[#6b7280]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Educational content */}
        <h2 className="text-xl font-semibold text-[#111827] mb-4">Why PET Recycling Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm"
          >
            <Recycle className="w-8 h-8 text-[#16a34a] mb-3" />
            <h3 className="font-semibold text-[#111827] mb-2">The PET Problem</h3>
            <p className="text-sm text-[#374151] leading-relaxed">
              Polyethylene terephthalate (PET) is the most common plastic used in beverage bottles. While recyclable, many PET bottles end up in landfills or oceans, taking hundreds of years to decompose. A single household can generate 10-20 PET bottles per week.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm"
          >
            <Wind className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-[#111827] mb-2">Climate Impact</h3>
            <p className="text-sm text-[#374151] leading-relaxed">
              Recycling 1 kg of PET saves approximately 3 kg of CO2 equivalent emissions compared to producing new plastic. For a typical household recycling 5 kg of PET bottles per year, that&apos;s 15 kg of CO2 avoided — equivalent to driving 60 km less.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm"
          >
            <Droplets className="w-8 h-8 text-cyan-600 mb-3" />
            <h3 className="font-semibold text-[#111827] mb-2">Water Conservation</h3>
            <p className="text-sm text-[#374151] leading-relaxed">
              Producing virgin PET plastic requires significant water. Recycling PET uses approximately 50% less water than producing new plastic. Every tonne of recycled PET saves roughly 7,500 litres of water.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm"
          >
            <Leaf className="w-8 h-8 text-[#d97706] mb-3" />
            <h3 className="font-semibold text-[#111827] mb-2">Circular Economy</h3>
            <p className="text-sm text-[#374151] leading-relaxed">
              Collected PET bottles can be recycled into new bottles, polyester fiber for clothing, carpeting, and packaging. A single recycled bottle can become part of a fleece jacket, keeping plastic in use and out of landfills.
            </p>
          </motion.div>
        </div>

        {/* Note */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6">
          <p className="text-sm text-[#15803d]">
            Impact data will be populated once collections begin. These numbers will update in real-time as our community recycles together.
          </p>
        </div>
      </div>
    </div>
  )
}
