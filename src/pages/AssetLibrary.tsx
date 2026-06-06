import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Download, Eye, X, FileText } from 'lucide-react'

interface AssetFolder {
  id: string
  name: string
  count: number
  files: string[]
  isMarkdown?: boolean
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
    count: 5,
    files: [
      '/syscycl-teaser-v1-final.mp4',
      '/syscycl-teaser-v3-final.mp4',
      '/syscycl-empathy-video.mp4',
      '/syscycl-instagram-reel.mp4',
      '/innovation-video.mp4',
    ],
  },
  {
    id: 'qr-codes',
    name: 'QR Codes',
    count: 5,
    files: ['/qr-master.png', '/qr-signup.png', '/qr-instagram.png', '/qr-facebook.png', '/qr-website.png'],
  },
  {
    id: 'documents',
    name: 'Strategy Documents',
    count: 4,
    files: ['/SYSCYCL-BRANDING-COLLATERAL.md', '/NAMECHEAP-DEPLOYMENT-GUIDE.md', '/SYSCYCL-FINANCIAL-MODEL.md', '/AUDIT-REPORT.md'],
    isMarkdown: true,
  },
  {
    id: 'qr-posters',
    name: 'QR-Embedded Posters (for Instagram)',
    count: 14,
    files: [
      '/qr-posters/innovation-post-1-enzyme.png', '/qr-posters/innovation-post-2-ocean-cleanup.png',
      '/qr-posters/innovation-post-3-waste-to-fuel.png', '/qr-posters/innovation-post-4-homes.png',
      '/qr-posters/innovation-post-5-infinite.png', '/qr-posters/innovation-post-6-purecycle.png',
      '/qr-posters/innovation-post-7-marketplace.png', '/qr-posters/innovation-post-8-loop.png',
      '/qr-posters/social-post-1-launch.png', '/qr-posters/social-post-2-educational.png',
      '/qr-posters/social-post-3-thankyou.png', '/qr-posters/social-post-4-codaily.png',
      '/qr-posters/social-post-5-partnership.png', '/qr-posters/social-post-6-consent.png',
    ],
  },
  {
    id: 'research',
    name: 'Research Papers',
    count: 4,
    files: [
      '/research-paper-1-economics.png', '/research-paper-2-microplastics.png',
      '/research-shareable-1.png', '/research-shareable-2.png',
    ],
  },
  {
    id: 'research-pdfs',
    name: 'Research Papers (PDF Downloads)',
    count: 2,
    files: [
      '/downloads/research-paper-1-economics.pdf',
      '/downloads/research-paper-2-microplastics.pdf',
    ],
  },
]

export default function AssetLibrary() {
  const [selectedFolder, setSelectedFolder] = useState<AssetFolder | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [mdContent, setMdContent] = useState<string | null>(null)
  const [mdTitle, setMdTitle] = useState<string>('')

  const viewMarkdown = async (file: string) => {
    try {
      const res = await fetch(file)
      const text = await res.text()
      setMdTitle(file.split('/').pop() || file)
      setMdContent(text)
    } catch {
      setMdContent('Error loading document.')
    }
  }

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
                const isMd = file.endsWith('.md')
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
                    ) : isMd ? (
                      <div className="aspect-square bg-[#f9fafb] flex flex-col items-center justify-center p-4 cursor-pointer" onClick={() => viewMarkdown(file)}>
                        <FileText className="w-12 h-12 text-[#374151] mb-2" />
                        <p className="text-xs text-[#374151] text-center truncate w-full">{fileName}</p>
                      </div>
                    ) : (
                      <div className="aspect-square overflow-hidden cursor-pointer" onClick={() => setPreviewImage(file)}>
                        <img src={file} alt={fileName} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs text-[#374151] truncate mb-2">{fileName}</p>
                      <div className="flex gap-1">
                        {isMd ? (
                          <button
                            onClick={() => viewMarkdown(file)}
                            className="flex-1 py-1.5 text-xs border border-[#e5e7eb] rounded-md hover:bg-[#f9fafb] flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View Document
                          </button>
                        ) : !isVideo && (
                          <button
                            onClick={() => setPreviewImage(file)}
                            className="flex-1 py-1.5 text-xs border border-[#e5e7eb] rounded-md hover:bg-[#f9fafb] flex items-center justify-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        )}
                        {!isMd && (
                          <a
                            href={file}
                            download
                            className="flex-1 py-1.5 text-xs bg-[#16a34a] text-white rounded-md hover:bg-[#15803d] flex items-center justify-center gap-1 transition-colors"
                          >
                            <Download className="w-3 h-3" /> Download
                          </a>
                        )}
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

      {/* Markdown viewer dialog */}
      <AnimatePresence>
        {mdContent !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setMdContent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#16a34a]" />
                  <h3 className="font-semibold text-[#111827]">{mdTitle}</h3>
                </div>
                <button
                  onClick={() => setMdContent(null)}
                  className="text-[#6b7280] hover:text-[#111827] transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-auto p-6 bg-[#f9fafb]">
                <pre className="whitespace-pre-wrap text-sm text-[#374151] leading-relaxed font-mono">
                  {mdContent}
                </pre>
              </div>
              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#e5e7eb] bg-white flex justify-end">
                <button
                  onClick={() => setMdContent(null)}
                  className="px-4 py-2 text-sm text-[#374151] border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
