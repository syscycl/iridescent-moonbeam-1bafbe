import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, CheckCircle2, RefreshCw, Clock, Shield } from 'lucide-react'

export interface ChatReply {
  id: string
  message: string
  timestamp: string
  sender: 'admin'
}

export interface ChatMessage {
  id: string
  name: string
  phone: string
  email: string
  interestType: 'Household Pickup' | 'General Question'
  source: string
  message: string
  timestamp: string
  status: 'new' | 'replied' | 'resolved'
  replies: ChatReply[]
}

const STORAGE_KEY = 'syscycl_chat_messages'
const SOURCE_OPTIONS = ['Instagram', 'Facebook', 'Friend', 'Flyer', 'Website', 'Other']

function getStoredMessages(): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

export function saveMessage(msg: ChatMessage) {
  const msgs = getStoredMessages()
  msgs.push(msg)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
}

export default function ChatPage() {
  const [submitted, setSubmitted] = useState(false)
  const [chatId, setChatId] = useState('')
  const [historyPhone, setHistoryPhone] = useState('')
  const [historyMessages, setHistoryMessages] = useState<ChatMessage[]>([])

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    interestType: '' as 'Household Pickup' | 'General Question' | '',
    source: '',
    message: '',
  })

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (historyPhone.length >= 10) {
      const all = getStoredMessages()
      setHistoryMessages(all.filter((m) => m.phone.replace(/\D/g, '').includes(historyPhone.replace(/\D/g, ''))))
    } else {
      setHistoryMessages([])
    }
  }, [historyPhone])

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.message || !form.interestType) return
    const newMsg: ChatMessage = {
      id: `CHAT-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email || '',
      interestType: form.interestType,
      source: form.source,
      message: form.message,
      timestamp: new Date().toISOString(),
      status: 'new',
      replies: [],
    }
    saveMessage(newMsg)

    // Send notification to Tanisha via Formspree
    import('@/lib/notifications').then(({ sendNotification, getCurrentTimestamp }) => {
      sendNotification({
        type: 'chat',
        name: newMsg.name,
        phone: newMsg.phone,
        email: newMsg.email || undefined,
        message: newMsg.message,
        details: `Interest: ${newMsg.interestType} | Chat ID: ${newMsg.id}`,
        timestamp: getCurrentTimestamp(),
      })
    })

    setChatId(newMsg.id)
    setSubmitted(true)
  }

  const handleReset = () => {
    setForm({ name: '', phone: '', email: '', interestType: '', source: '', message: '' })
    setSubmitted(false)
    setChatId('')
  }

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#16a34a]" />
              <h2 className="text-lg font-semibold text-[#111827]">Your Messages</h2>
            </div>
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 shadow-sm">
              <input
                type="tel"
                value={historyPhone}
                onChange={(e) => setHistoryPhone(e.target.value)}
                placeholder="Enter your phone number to see history"
                className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm mb-4"
              />
              {historyMessages.length === 0 ? (
                <div className="text-center py-8 text-[#9ca3af]">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  {historyPhone.length >= 10 ? 'No messages found' : 'Enter phone to view history'}
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {historyMessages.map((msg) => (
                    <div key={msg.id} className="border border-[#e5e7eb] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-[#6b7280]">{msg.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          msg.status === 'new' ? 'bg-blue-50 text-blue-600' :
                          msg.status === 'replied' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                          'bg-[#f9fafb] text-[#6b7280]'
                        }`}>{msg.status}</span>
                      </div>
                      <p className="text-sm text-[#374151] line-clamp-2">{msg.message}</p>
                      {msg.replies.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msg.replies.map((reply) => (
                            <div key={reply.id} className="border-l-2 border-[#16a34a] pl-2 bg-[#f0fdf4] p-2 rounded-r">
                              <p className="text-xs font-medium text-[#15803d]">Tanisha</p>
                              <p className="text-sm text-[#374151]">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-[#16a34a]" />
                    <h2 className="text-lg font-semibold text-[#111827]">Send a Message</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Name <span className="text-[#ef4444]">*</span></label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        placeholder="Your name"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Phone <span className="text-[#ef4444]">*</span></label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="Your phone number"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="you@example.com (optional)"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-2 block">I am interested in:</label>
                      <div className="flex gap-2 flex-wrap">
                        {['Household Pickup', 'General Question'].map((type) => (
                          <button
                            key={type}
                            onClick={() => update('interestType', type)}
                            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                              form.interestType === type ? 'bg-[#16a34a] text-white border-[#16a34a]' : 'bg-white text-[#374151] border-[#e5e7eb]'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">How did you hear about us?</label>
                      <select
                        value={form.source}
                        onChange={(e) => update('source', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm bg-white"
                      >
                        <option value="">Select</option>
                        {SOURCE_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Message <span className="text-[#ef4444]">*</span></label>
                      <textarea
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        rows={4}
                        placeholder="How can we help you?"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Send Message
                    </button>

                    <p className="text-xs text-[#6b7280] flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Your information is kept private.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl border border-[#e5e7eb] p-8 text-center shadow-sm"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-[#111827] mb-2">Message Sent!</h2>
                  <p className="text-sm text-[#6b7280] mb-4">Our team will respond shortly.</p>
                  <div className="bg-[#f9fafb] rounded-lg p-3 mb-6">
                    <p className="text-xs text-[#6b7280] mb-1">Chat ID</p>
                    <code className="text-lg font-mono font-bold text-[#111827]">{chatId}</code>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
