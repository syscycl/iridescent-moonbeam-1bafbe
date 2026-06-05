import { motion } from 'framer-motion'
import { Lightbulb, ExternalLink } from 'lucide-react'

interface Innovation {
  title: string
  description: string
  image: string
  source: string
}

const INNOVATIONS: Innovation[] = [
  {
    title: 'PET-Eating Enzymes',
    description: 'Scientists have engineered enzymes that can break down PET plastic in just 24 hours, potentially revolutionizing recycling.',
    image: '/innovation-post-1-enzyme.png',
    source: 'Carbios / Nature',
  },
  {
    title: 'Ocean Cleanup System',
    description: 'Autonomous systems are now removing plastic waste from oceans, with plans to clean up 90% of floating ocean plastic.',
    image: '/innovation-post-2-ocean-cleanup.png',
    source: 'The Ocean Cleanup',
  },
  {
    title: 'Waste-to-Fuel Technology',
    description: 'Advanced pyrolysis can convert plastic waste into clean fuel, offering a dual solution for waste and energy.',
    image: '/innovation-post-3-waste-to-fuel.png',
    source: 'Various Research Institutions',
  },
  {
    title: 'Homes from Recycled Plastic',
    description: 'Startup companies are building affordable housing using recycled PET plastic bricks that are durable and insulated.',
    image: '/innovation-post-4-homes.png',
    source: 'Conceptos Plásticos',
  },
  {
    title: 'Infinite Plastic Recycling',
    description: 'New chemical recycling processes can break down any type of PET and rebuild it to virgin quality infinitely.',
    image: '/innovation-post-5-infinite.png',
    source: 'IBM Research / UC Santa Barbara',
  },
  {
    title: 'PureCycle Technology',
    description: 'A purification process that removes color, odor, and contaminants from used plastic, restoring it to virgin-like quality.',
    image: '/innovation-post-6-purecycle.png',
    source: 'PureCycle Technologies',
  },
  {
    title: 'Waste Marketplace Platforms',
    description: 'Digital platforms now connect waste generators with recyclers, making plastic trading transparent and efficient.',
    image: '/innovation-post-7-marketplace.png',
    source: 'Various Startups',
  },
  {
    title: 'Closed Loop Systems',
    description: 'Beverage companies are adopting closed-loop recycling where bottles are collected, recycled, and remade into new bottles.',
    image: '/innovation-post-8-loop.png',
    source: 'Industry Leaders',
  },
]

export default function InnovationsLibrary() {
  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Innovations Library</h1>
        </div>
        <p className="text-sm text-[#6b7280] mb-8">Global innovations shaping the future of plastic recycling</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {INNOVATIONS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden hover:shadow-md transition-all"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#111827] mb-1 text-[15px]">{item.title}</h3>
                <p className="text-sm text-[#374151] leading-relaxed mb-3">{item.description}</p>
                <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                  <ExternalLink className="w-3 h-3" />
                  <span>{item.source}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
