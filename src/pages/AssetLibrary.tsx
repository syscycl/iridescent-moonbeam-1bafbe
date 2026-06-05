import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Download, Eye, X } from 'lucide-react'

interface AssetFolder {
  id: string
  name: string
  count: number
  files: string[]
}

const FOLDERS: AssetFolder[] = [
  {
    id: 'inspiration',
    name: 'Inspiration',
    count: 3,
    files: ['/tanisha-inspiration-1.png', '/tanisha-inspiration-2.png', '/tanisha-inspiration-3.png'],
  },
  {
    id: 'innovations',
    name: 'Innovations',
    count: 8,
    files: [
      '/innovation-post-1-enzyme.png', '/innovation-post-2-ocean-cleanup.png',
      '/innovation-post-3-waste-to-fuel.png', '/innovation-post-4-homes.png',
      '/innovation-post-5-infinite.png', '/innovation-post-6-purecycle.png',
      '/innovation-post-7-marketplace.png', '/innovation-post-8-loop.png',
    ],
  },
  {
    id: 'social',
    name: 'Social Media',
    count: 6,
    files: [
      '/social-post-1-launch.png', '/social-post-2-educational.png',
      '/social-post-3-thankyou.png', '/social-post-4-codaily.png',
      '/social-post-5-partnership.png', '/social-post-6-consent.png',
    ],
  },
  {
    id: 'logos',
    name: 'Logos & Branding',
    count: 2,
    files: ['/syscycl-official-logo.png', '/syscycl-horizontal-banner.png'],
  },
  {
    id: 'videos',
    name: 'Videos',
    count: 3,
    files: ['/syscycl-empathy-video.mp4', '/syscycl-instagram-reel.mp4', '/innovation-video.mp4'],
  },
  {
    id: 'qr-codes',
    name: 'QR Codes',
    count: 5,
    files: ['/qr-master.png', '/qr-signup.png', '/qr-instagram.png', '/qr-facebook.png', '/qr-website.png'],
  },
]

export default function AssetLibrary() {
  const [selectedFolder, setSelectedFolder] = useState<AssetFolder | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Asset Library</h1>
        </div>
        <p className="text-sm text-[#6b7280] mb-8">Browse and download Syscycl media assets</p>

        {/* Folders grid */}
        {!selectedFolder ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOLDERS.map((folder, i) => (
              <motion.button
                key={folder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedFolder(folder)}
                className="text-left bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#f0fdf4] flex items-center justify-center mb-4">
                  <FolderOpen className="w-6 h-6 text-[#16a34a]" />
                </div>
                <h3 className="font-semibold text-[#111827] mb-1">{folder.name}</h3>
                <p className="text-sm text-[#6b7280]">{folder.count} files</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => setSelectedFolder(null)}
              className="mb-4 text-sm text-[#16a34a] hover:underline flex items-center gap-1"
            >
              &larr; Back to folders
            </button>
            <h2 className="text-lg font-semibold text-[#111827] mb-4">{selectedFolder.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedFolder.files.map((file) => {
                const isVideo = file.endsWith('.mp4')
                const fileName = file.split('/').pop() || ''
                return (
                  <div
                    key={file}
                    className="bg-white rounded-lg border border-[#e5e7eb] overflow-hidden shadow-sm"
                  >
                    {isVideo ? (
                      <video
                        src={file}
                        className="w-full aspect-video object-cover"
                        controls
                        preload="metadata"
                      />
                    ) : (
                      <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => setPreviewImage(file)}>
                        <img src={file} alt={fileName} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs text-[#374151] truncate mb-2">{fileName}</p>
                      <div className="flex gap-1">
                        {!isVideo && (
                          <button
                            onClick={() => setPreviewImage(file)}
                            className="flex-1 py-1.5 text-xs border border-[#e5e7eb] rounded-md hover:bg-[#f9fafb] flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        )}
                        <a
                          href={file}
                          download
                          className="flex-1 py-1.5 text-xs bg-[#16a34a] text-white rounded-md hover:bg-[#15803d] flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download className="w-3 h-3" /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image preview dialog */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white hover:text-[#e5e7eb]"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
