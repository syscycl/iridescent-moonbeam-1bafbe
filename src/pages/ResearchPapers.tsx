import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3, FileText, Share2, Download,
  ExternalLink, ArrowLeft, Microscope, Droplets,
  Heart, Brain, Fish, AlertTriangle, CheckCircle2,
} from 'lucide-react'

interface Paper {
  id: string
  title: string
  subtitle: string
  issue: string
  color: string
  bgColor: string
  heroImage: string
  shareableImage: string
  pdfUrl: string
  description: string
  keyStats: { label: string; value: string; icon: any; highlight?: boolean }[]
  sources: { name: string; url: string }[]
  actions: string[]
}

const papers: Paper[] = [
  {
    id: 'legacy',
    title: 'The 450-Year Legacy',
    subtitle: 'The Environmental Impact of PET Bottles',
    issue: 'Issue #1 — June 2026',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    heroImage: '/research-paper-1-legacy.png',
    shareableImage: '/research-shareable-1-legacy.png',
    pdfUrl: '/downloads/research-paper-1-legacy.pdf',
    description: 'A plastic bottle tossed today will still be sitting in a landfill in the year 2476. This student research paper examines the long-term environmental consequences of PET plastic waste on Brantford soil, water, and wildlife — and what communities can do to reverse the damage.',
    keyStats: [
      { label: 'Time to decompose', value: '450 years', icon: Heart, highlight: true },
      { label: 'Plastic recycled', value: 'Only 9%', icon: AlertTriangle, highlight: true },
      { label: 'Bottles per Canadian', value: '167/year', icon: BarChart3 },
      { label: 'CO2 per kg recycled', value: '3 kg saved', icon: Heart, highlight: true },
    ],
    sources: [
      { name: 'University of Calgary PET Study', url: 'https://www.ucalgary.ca' },
      { name: 'Nature Journal — Plastic Persistence', url: 'https://www.nature.com' },
      { name: 'Environment and Climate Change Canada', url: 'https://www.canada.ca/environment' },
      { name: 'WHO Environmental Health', url: 'https://www.who.int' },
    ],
    actions: [
      'Participate in door-to-door PET bottle collection programs',
      'Replace single-use bottles with refillable containers',
      'Support local recycling initiatives like Syscycl',
      'Educate your community about the 450-year legacy',
    ],
  },
  {
    id: 'microplastics',
    title: 'Microplastics: The Invisible Threat',
    subtitle: "They're Inside You Right Now",
    issue: 'Issue #2 — June 2026',
    color: '#0d9488',
    bgColor: '#f0fdfa',
    heroImage: '/research-paper-2-microplastics.png',
    shareableImage: '/research-shareable-2.png',
    pdfUrl: '/downloads/research-paper-2-microplastics.pdf',
    description: "Microplastics — tiny plastic particles less than 5mm — have been found in human blood, lungs, placentas, and brain tissue. This research compiles the latest scientific findings on how plastic pollution enters our bodies and what we can do about it.",
    keyStats: [
      { label: 'Particles ingested weekly', value: '1,000+', icon: Droplets, highlight: true },
      { label: 'Plastic eaten weekly', value: '5g', icon: AlertTriangle, highlight: true },
      { label: 'Found in human brain', value: 'Confirmed', icon: Brain, highlight: true },
      { label: 'Ocean plastic by 2050', value: '> Fish', icon: Fish, highlight: true },
    ],
    sources: [
      { name: 'Nature Medicine (2024)', url: 'https://www.nature.com/nm/' },
      { name: 'NIH Microplastics Research', url: 'https://www.nih.gov' },
      { name: 'University of Victoria Study', url: 'https://www.uvic.ca' },
      { name: 'WHO Environmental Health', url: 'https://www.who.int' },
      { name: 'Ellen MacArthur Foundation', url: 'https://ellenmacarthurfoundation.org' },
    ],
    actions: [
      'Use refillable water bottles instead of single-use PET',
      'Avoid plastic tea bags and food packaging',
      'Support local recycling initiatives like Syscycl',
      'Choose glass or stainless steel containers',
    ],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ResearchPapers() {
  const navigate = useNavigate()
  const [activePaper, setActivePaper] = useState<string | null>(null)

  const paper = papers.find((p) => p.id === activePaper)

  if (paper) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#e5e7eb]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            <button
              onClick={() => setActivePaper(null)}
              className="p-2 rounded-lg hover:bg-[#f3f4f6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#6b7280]" />
            </button>
            <div>
              <p className="text-xs text-[#9ca3af]">Syscycl Research Series — {paper.issue}</p>
              <h1 className="text-lg font-semibold text-[#111827]">{paper.title}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Hero Infographic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <img
              src={paper.heroImage}
              alt={paper.title}
              className="w-full rounded-xl border border-[#e5e7eb] shadow-sm"
            />
          </motion.div>

          {/* Shareable version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="text-sm font-medium text-[#6b7280] mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share This Research
            </h3>
            <div className="max-w-md mx-auto">
              <img
                src={paper.shareableImage}
                alt={`${paper.title} - Shareable`}
                className="w-full rounded-xl border border-[#e5e7eb] shadow-sm"
              />
            </div>
            <p className="text-center text-xs text-[#9ca3af] mt-2">
              Right-click or long-press to save and share on social media
            </p>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {paper.keyStats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div
                  key={i}
                  className="rounded-xl border border-[#e5e7eb] p-4 text-center"
                  style={{ backgroundColor: stat.highlight ? paper.bgColor : 'white' }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: paper.color }} />
                  <p className="text-2xl font-bold" style={{ color: stat.highlight ? paper.color : '#111827' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#6b7280] mt-1">{stat.label}</p>
                </div>
              )
            })}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#f9fafb] rounded-xl p-6 mb-8"
          >
            <p className="text-[#374151] leading-relaxed">{paper.description}</p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-[#111827] mb-4">
              {paper.id === 'legacy' ? 'The 450-Year Problem' : 'What You Can Do'}
            </h3>
            <div className="space-y-3">
              {paper.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg border border-[#e5e7eb] p-4">
                  <CheckCircle2 className="w-5 h-5 text-[#16a34a] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#374151]">{action}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-[#111827] mb-4">Sources & References</h3>
            <div className="space-y-2">
              {paper.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white rounded-lg border border-[#e5e7eb] p-3 hover:border-[#16a34a] transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 text-[#9ca3af] group-hover:text-[#16a34a]" />
                  <span className="text-sm text-[#374151] group-hover:text-[#16a34a]">{source.name}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* PDF Download */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-center py-4"
          >
            <a
              href={paper.pdfUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#111827] text-white rounded-lg font-medium hover:bg-[#1f2937] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Full Research Paper (PDF)
            </a>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-8"
          >
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
            >
              Join Syscycl — Start Recycling Today
            </button>
            <p className="text-xs text-[#9ca3af] mt-3">
              An Assumption College School (Student BIZ) Initiative
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#16a34a]/10 rounded-full px-4 py-1.5 mb-4">
            <Microscope className="w-4 h-4 text-[#16a34a]" />
            <span className="text-sm text-[#15803d] font-medium">Syscycl Research Series</span>
          </div>
          <h1 className="text-3xl font-bold text-[#111827] mb-3">Research & Education</h1>
          <p className="text-[#6b7280] max-w-lg mx-auto">
            Free educational resources on recycling, environmental impact, and sustainability. 
            Download, share, and help spread awareness.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActivePaper(p.id)}
              className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={p.heroImage}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: p.bgColor, color: p.color }}
                  >
                    {p.issue}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-1">{p.title}</h3>
                <p className="text-sm text-[#6b7280] mb-4">{p.subtitle}</p>
                <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    Full Infographic
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" />
                    Shareable Version
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Share prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center bg-white rounded-xl border border-[#e5e7eb] p-6"
        >
          <Share2 className="w-8 h-8 text-[#16a34a] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#111827] mb-2">Help Spread the Word</h3>
          <p className="text-sm text-[#6b7280] mb-4">
            These infographics are designed to be shared. Save them and post on Instagram, 
            Facebook, or WhatsApp to help educate your community about recycling.
          </p>
          <p className="text-xs text-[#9ca3af]">
            An Assumption College School (Student BIZ) Initiative. All content is free for educational use.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
