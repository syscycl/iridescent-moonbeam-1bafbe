import { motion } from 'framer-motion'
import { Calendar, Clock, Instagram, Facebook, Plus } from 'lucide-react'

interface ScheduledPost {
  id: string
  title: string
  platform: 'instagram' | 'facebook'
  date: string
  status: 'scheduled' | 'draft' | 'published'
}

const SLOTS: ScheduledPost[] = [
  { id: '1', title: 'Launch Announcement', platform: 'instagram', date: 'Coming soon', status: 'draft' },
  { id: '2', title: 'Educational: PET Facts', platform: 'instagram', date: 'Coming soon', status: 'draft' },
  { id: '3', title: 'Volunteer Recruitment', platform: 'facebook', date: 'Coming soon', status: 'draft' },
  { id: '4', title: 'Community Thank You', platform: 'instagram', date: 'Coming soon', status: 'draft' },
]

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-600',
  draft: 'bg-[#f9fafb] text-[#6b7280]',
  published: 'bg-[#f0fdf4] text-[#16a34a]',
}

export default function ContentScheduler() {
  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-6 h-6 text-[#16a34a]" />
              <h1 className="text-[30px] font-semibold text-[#111827]">Content Scheduler</h1>
            </div>
            <p className="text-sm text-[#6b7280]">Plan and schedule your social media posts</p>
          </div>
          <button className="px-4 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-medium hover:bg-[#15803d] transition-colors flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* Calendar placeholder */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#111827]">June 2025</h2>
            <div className="flex gap-1">
              <button className="p-1.5 rounded-md hover:bg-[#f9fafb]">&lt;</button>
              <button className="p-1.5 rounded-md hover:bg-[#f9fafb]">&gt;</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-xs font-medium text-[#6b7280] py-2">{d}</div>
            ))}
            {Array.from({ length: 30 }, (_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="aspect-square flex items-center justify-center rounded-lg text-sm text-[#374151] hover:bg-[#f0fdf4] cursor-pointer border border-transparent hover:border-[#bbf7d0]"
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scheduled posts */}
        <h2 className="font-semibold text-[#111827] mb-4">Upcoming Posts</h2>
        <div className="space-y-3">
          {SLOTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-lg border border-[#e5e7eb] p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                {post.platform === 'instagram' ? <Instagram className="w-5 h-5 text-[#16a34a]" /> : <Facebook className="w-5 h-5 text-[#3b82f6]" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#111827]">{post.title}</p>
                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <Clock className="w-3 h-3" /> {post.date}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[post.status]}`}>
                {post.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
