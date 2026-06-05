import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageIcon, X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react'

type Category = 'all' | 'inspiration' | 'innovation' | 'social'

interface GalleryItem {
  src: string
  title: string
  category: Category
}

const ITEMS: GalleryItem[] = [
  { src: '/tanisha-inspiration-1.png', title: 'Our Inspiration', category: 'inspiration' },
  { src: '/tanisha-inspiration-2.png', title: 'The Journey', category: 'inspiration' },
  { src: '/tanisha-inspiration-3.png', title: 'Vision', category: 'inspiration' },
  { src: '/innovation-post-1-enzyme.png', title: 'PET-Eating Enzymes', category: 'innovation' },
  { src: '/innovation-post-2-ocean-cleanup.png', title: 'Ocean Cleanup', category: 'innovation' },
  { src: '/innovation-post-3-waste-to-fuel.png', title: 'Waste to Fuel', category: 'innovation' },
  { src: '/innovation-post-4-homes.png', title: 'Recycled Homes', category: 'innovation' },
  { src: '/innovation-post-5-infinite.png', title: 'Infinite Recycling', category: 'innovation' },
  { src: '/innovation-post-6-purecycle.png', title: 'PureCycle Tech', category: 'innovation' },
  { src: '/innovation-post-7-marketplace.png', title: 'Waste Marketplace', category: 'innovation' },
  { src: '/innovation-post-8-loop.png', title: 'Closed Loop', category: 'innovation' },
  { src: '/social-post-1-launch.png', title: 'Launch Day', category: 'social' },
  { src: '/social-post-2-educational.png', title: 'Educational Post', category: 'social' },
  { src: '/social-post-3-thankyou.png', title: 'Thank You', category: 'social' },
  { src: '/social-post-4-codaily.png', title: 'CoDaily Feature', category: 'social' },
  { src: '/social-post-5-partnership.png', title: 'Partnership', category: 'social' },
  { src: '/social-post-6-consent.png', title: 'Consent Policy', category: 'social' },
]

export default function Gallery() {
  const [active, setActive] = useState<Category>('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = active === 'all' ? ITEMS : ITEMS.filter((i) => i.category === active)
  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'inspiration', label: 'Inspiration' },
    { key: 'innovation', label: 'Innovation' },
    { key: 'social', label: 'Social Media' },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightbox === null) return
    if (e.key === 'Escape') setLightbox(null)
    if (e.key === 'ArrowLeft') setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
    if (e.key === 'ArrowRight') setLightbox((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : prev))
  }, [lightbox, filtered.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ImageIcon className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Gallery</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === c.key ? 'bg-[#16a34a] text-white' : 'bg-white text-[#374151] border border-[#e5e7eb] hover:bg-[#f0fdf4]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setLightbox(i)}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              >
                <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end p-3">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="https://instagram.com/syscycl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm transition-colors hover:opacity-90"
            style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
          >
            <Instagram className="w-5 h-5" /> Follow @syscycl on Instagram
          </a>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 text-white hover:text-[#e5e7eb]"
              aria-label="Close"
            >
              <X className="w-8 h-8" />
            </button>

            {lightbox > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#e5e7eb]"
                aria-label="Previous"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {lightbox < filtered.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#e5e7eb]"
                aria-label="Next"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-[80vh] mx-4">
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white font-medium">{filtered[lightbox].title}</p>
                <p className="text-white/60 text-sm">{lightbox + 1} / {filtered.length}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
