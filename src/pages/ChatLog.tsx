import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Search, ChevronDown, ChevronUp, Send,
  CheckCircle2, RotateCcw, XCircle, Reply,
} from 'lucide-react'
import type { ChatMessage, ChatReply } from './ChatPage'

const STORAGE_KEY = 'syscycl_chat_messages'

function getStoredMessages(): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function saveMessages(msgs: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
}

export default function ChatLog() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'resolved'>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySuccess, setReplySuccess] = useState('')

  useEffect(() => {
    setMessages(getStoredMessages())
  }, [])

  const refresh = () => setMessages(getStoredMessages())

  const updateStatus = (id: string, status: ChatMessage['status']) => {
    const msgs = getStoredMessages().map((m) => m.id === id ? { ...m, status } : m)
    saveMessages(msgs)
    setMessages(msgs)
  }

  const sendReply = (msgId: string) => {
    if (!replyText.trim()) return
    const msgs = getStoredMessages()
    const idx = msgs.findIndex((m) => m.id === msgId)
    if (idx === -1) return

    const reply: ChatReply = {
      id: `REPLY-${Date.now()}`,
      message: replyText.trim(),
      timestamp: new Date().toISOString(),
      sender: 'admin',
    }

    msgs[idx].replies.push(reply)
    msgs[idx].status = 'replied'
    saveMessages(msgs)
    setMessages([...msgs])
    setReplyText('')
    setReplySuccess(msgId)
    setTimeout(() => setReplySuccess(''), 2000)
  }

  const filtered = messages
    .filter((m) => filter === 'all' || m.status === filter)
    .filter((m) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.id.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status === 'new').length,
    replied: messages.filter((m) => m.status === 'replied').length,
    resolved: messages.filter((m) => m.status === 'resolved').length,
  }

  const tabs: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'replied', label: 'Replied' },
    { key: 'resolved', label: 'Resolved' },
  ]

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Chat Log</h1>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Messages', value: stats.total, color: 'text-[#111827]' },
            { label: 'New', value: stats.new, color: 'text-blue-600' },
            { label: 'Replied', value: stats.replied, color: 'text-[#16a34a]' },
            { label: 'Resolved', value: stats.resolved, color: 'text-[#6b7280]' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg border border-[#e5e7eb] p-4">
              <p className="text-2xl font-bold font-mono {s.color}">{s.value}</p>
              <p className="text-xs text-[#6b7280]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter + search */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === t.key ? 'bg-[#16a34a] text-white' : 'bg-white text-[#374151] border border-[#e5e7eb] hover:bg-[#f0fdf4]'
              }`}
            >
              {t.label} ({stats[t.key === 'all' ? 'total' : t.key]})
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-[#6b7280]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm w-48"
            />
            <button onClick={refresh} className="p-2 rounded-lg border border-[#e5e7eb] hover:bg-[#f0fdf4]" title="Refresh">
              <RotateCcw className="w-4 h-4 text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#9ca3af]">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#e5e7eb]">
              {filtered.map((msg) => (
                <div key={msg.id}>
                  {/* Row */}
                  <div
                    className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-[#f9fafb] cursor-pointer items-center"
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  >
                    <div className="col-span-2">
                      <span className="text-xs font-mono text-[#6b7280]">{msg.id}</span>
                    </div>
                    <div className="col-span-2 text-sm text-[#374151] truncate">{msg.name}</div>
                    <div className="col-span-2 text-sm text-[#374151] truncate">{msg.phone}</div>
                    <div className="col-span-2 text-xs text-[#6b7280] truncate">{msg.interestType}</div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        msg.status === 'new' ? 'bg-blue-50 text-blue-600' :
                        msg.status === 'replied' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                        'bg-[#f9fafb] text-[#6b7280]'
                      }`}>{msg.status}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      {msg.status === 'new' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, 'replied') }}
                          className="text-xs px-2 py-1 bg-[#f0fdf4] text-[#16a34a] rounded hover:bg-[#bbf7d0] transition-colors"
                        >
                          Mark Replied
                        </button>
                      )}
                      {msg.status !== 'resolved' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, 'resolved') }}
                          className="text-xs px-2 py-1 bg-[#f9fafb] text-[#6b7280] rounded hover:bg-[#e5e7eb] transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                      {msg.status === 'resolved' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); updateStatus(msg.id, 'new') }}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          Reopen
                        </button>
                      )}
                      {expandedId === msg.id ? <ChevronUp className="w-4 h-4 text-[#6b7280]" /> : <ChevronDown className="w-4 h-4 text-[#6b7280]" />}
                    </div>
                  </div>

                  {/* Expanded */}
                  <AnimatePresence>
                    {expandedId === msg.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-4 bg-[#f9fafb] border-t border-[#e5e7eb]">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div><span className="text-xs text-[#6b7280]">Source:</span> <span className="text-[#374151]">{msg.source || '—'}</span></div>
                            <div><span className="text-xs text-[#6b7280]">Email:</span> <span className="text-[#374151]">{msg.email || '—'}</span></div>
                            <div><span className="text-xs text-[#6b7280]">Date:</span> <span className="text-[#374151]">{new Date(msg.timestamp).toLocaleString()}</span></div>
                            <div><span className="text-xs text-[#6b7280]">Chat ID:</span> <span className="font-mono text-[#374151]">{msg.id}</span></div>
                          </div>
                          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4 mb-4">
                            <p className="text-xs text-[#6b7280] mb-1">Message</p>
                            <p className="text-sm text-[#374151] whitespace-pre-wrap">{msg.message}</p>
                          </div>

                          {/* Existing replies */}
                          {msg.replies.length > 0 && (
                            <div className="space-y-2 mb-4">
                              <p className="text-xs font-medium text-[#374151] flex items-center gap-1">
                                <Reply className="w-3 h-3" /> Replies ({msg.replies.length})
                              </p>
                              {msg.replies.map((reply) => (
                                <div key={reply.id} className="border-l-2 border-[#16a34a] bg-[#f0fdf4] rounded-r-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold text-[#15803d]">Tanisha</span>
                                    <span className="text-xs text-[#6b7280]">{new Date(reply.timestamp).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-[#374151] whitespace-pre-wrap">{reply.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply composer */}
                          <div className="bg-white rounded-lg border border-[#e5e7eb] p-4">
                            <p className="text-xs text-[#6b7280] mb-2 flex items-center gap-1">
                              <Reply className="w-3 h-3" /> Compose Reply
                            </p>
                            {replySuccess === msg.id && (
                              <div className="mb-2 text-xs text-[#16a34a] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Reply sent!
                              </div>
                            )}
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={3}
                              placeholder="Type your reply..."
                              className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm resize-none mb-2"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => sendReply(msg.id)}
                                className="px-4 py-2 bg-[#16a34a] text-white text-sm rounded-lg hover:bg-[#15803d] transition-colors flex items-center gap-1.5"
                              >
                                <Send className="w-3 h-3" /> Send Reply
                              </button>
                              <button
                                onClick={() => setReplyText('')}
                                className="px-4 py-2 border border-[#e5e7eb] text-[#374151] text-sm rounded-lg hover:bg-[#f9fafb] transition-colors flex items-center gap-1.5"
                              >
                                <XCircle className="w-3 h-3" /> Clear
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
