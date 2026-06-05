import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageIcon, X, ChevronLeft, ChevronRight, Instagram, Sparkles, ExternalLink } from 'lucide-react'

type Category = 'all' | 'inspiration' | 'innovation' | 'social'

interface GalleryItem {
  src: string
  title: string
  category: Category
  sourceUrl?: string
  sourceName?: string
}

const ITEMS: GalleryItem[] = [
  { src: '/tanisha-inspiration-1.png', title: 'Our Inspiration', category: 'inspiration' },
  { src: '/tanisha-inspiration-2.png', title: 'The Journey', category: 'inspiration' },
  { src: '/tanisha-inspiration-3.png', title: 'Vision', category: 'inspiration' },
  { src: '/innovation-post-1-enzyme.png', title: 'PET-Eating Enzymes', category: 'innovation', sourceUrl: 'https://www.carbios.com', sourceName: 'Carbios' },
  { src: '/innovation-post-2-ocean-cleanup.png', title: 'Ocean Cleanup', category: 'innovation', sourceUrl: 'https://theoceancleanup.com', sourceName: 'The Ocean Cleanup' },
  { src: '/innovation-post-3-waste-to-fuel.png', title: 'Waste to Fuel', category: 'innovation', sourceUrl: 'https://www.plasticenergy.com', sourceName: 'Plastic Energy' },
  { src: '/innovation-post-4-homes.png', title: 'Recycled Homes', category: 'innovation', sourceUrl: 'https://ecobricks.org', sourceName: 'EcoBricks' },
  { src: '/innovation-post-5-infinite.png', title: 'Infinite Recycling', category: 'innovation', sourceUrl: 'https://www.eastman.com', sourceName: 'Eastman' },
  { src: '/innovation-post-6-purecycle.png', title: 'PureCycle Tech', category: 'innovation', sourceUrl: 'https://purecycle.com', sourceName: 'PureCycle Technologies' },
  { src: '/innovation-post-7-marketplace.png', title: 'AI Waste Marketplace', category: 'innovation', sourceUrl: 'https://www.terracycle.com', sourceName: 'TerraCycle' },
  { src: '/innovation-post-8-loop.png', title: 'Closed Loop', category: 'innovation', sourceUrl: 'https://www.loopstore.com', sourceName: 'Loop by TerraCycle' },
  { src: '/social-post-1-launch.png', title: 'Launch Day', category: 'social' },
  { src: '/social-post-2-educational.png', title: 'Educational Post', category: 'social' },
  { src: '/social-post-3-thankyou.png', title: 'Thank You', category: 'social' },
  { src: '/social-post-4-codaily.png', title: 'CoDaily Feature', category: 'social' },
  { src: '/social-post-5-partnership.png', title: 'Partnership', category: 'social' },
  { src: '/social-post-6-consent.png', title: 'Consent Policy', category: 'social' },
  { src: '/instagram-post-household-qr-v2.png', title: 'Instagram: Household QR', category: 'social' },
  { src: '/instagram-post-volunteer-qr-v2.png', title: 'Instagram: Volunteer QR', category: 'social' },
  { src: '/instagram-post-sponsor-qr-v2.png', title: 'Instagram: Sponsor QR', category: 'social' },
]

export default function Gallery() {
  const [active, setActive] = useState<Category>('social')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = active === 'all' ? ITEMS : ITEMS.filter((i) => i.category === active)
  const categories: { key: Category; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'inspiration', label: 'Inspiration' },
    { key: 'innovation', label: 'Innovation' },
    { key: 'social', label: 'Social Media' },
  ]

  const featuredPost = ITEMS.find((i) => i.src === '/social-post-1-launch.png')

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

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-[#e5e7eb] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d97706]" />
              <span className="text-sm font-semibold text-[#111827]">Featured Post</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="aspect-square md:aspect-auto overflow-hidden">
                <img
                  src={featuredPost.src}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="inline-block self-start px-3 py-1 bg-[#f0fdf4] text-[#15803d] text-xs font-medium rounded-full mb-4">
                  Social Media
                </span>
                <h2 className="text-2xl font-semibold text-[#111827] mb-3">{featuredPost.title}</h2>
                <p className="text-[#6b7280] leading-relaxed mb-6">
                  This is where our journey began. Our launch day post introduced Syscycl to the Brantford community
                  and marked the start of our mission to make recycling effortless for every household.
                </p>
                <button
                  onClick={() => {
                    const idx = filtered.findIndex((i) => i.src === featuredPost.src)
                    if (idx !== -1) setLightbox(idx)
                  }}
                  className="self-start px-5 py-2.5 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors text-sm"
                >
                  View Full Size
                </button>
              </div>
            </div>
          </motion.div>
        )}

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

        {/* Coming soon message */}
        <div className="text-center mt-10 mb-8">
          <p className="text-[#6b7280] text-sm">
            More posts coming soon. Follow @syscycl on Instagram for daily updates.
          </p>
        </div>

        {/* Instagram CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#6b7280] mb-4">Follow our daily journey on Instagram</p>
          <a href="https://instagram.com/syscycl" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#833ab4] via-[#e1306c] to-[#fd1d1d] text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
            <Instagram className="w-5 h-5" />
            Follow @syscycl
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
                {filtered[lightbox].sourceUrl && (
                  <a
                    href={filtered[lightbox].sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-white text-xs transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Learn more: {filtered[lightbox].sourceName}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
