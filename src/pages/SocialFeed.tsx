import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

const POSTS = [
  { src: '/social-post-1-launch.png', title: 'Launch Day', caption: 'We are officially live!' },
  { src: '/social-post-2-educational.png', title: 'Educational', caption: 'Did you know? PET bottles are 100% recyclable.' },
  { src: '/social-post-3-thankyou.png', title: 'Thank You', caption: 'Thanks for your support, Brantford!' },
  { src: '/social-post-4-codaily.png', title: 'CoDaily Feature', caption: 'Featured in CoDaily!' },
  { src: '/social-post-5-partnership.png', title: 'Partnership', caption: 'Exciting partnerships ahead.' },
  { src: '/social-post-6-consent.png', title: 'Consent Policy', caption: 'Your privacy matters to us.' },
]

export default function SocialFeed() {
  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Instagram className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Social Feed</h1>
        </div>
        <p className="text-sm text-[#6b7280] mb-8">Follow our journey on social media</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post, i) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={post.src}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-[#111827]">{post.title}</h3>
                <p className="text-sm text-[#6b7280]">{post.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/syscycl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
          >
            <Instagram className="w-5 h-5" /> Follow @syscycl
          </a>
        </div>
      </div>
    </div>
  )
}
