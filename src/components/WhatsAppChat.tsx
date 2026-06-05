import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, MessageSquare, UserPlus, LogIn, BarChart3, Shield } from 'lucide-react'

export default function WhatsAppChat() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const actions = [
    { label: 'Chat with us', icon: MessageSquare, action: () => { navigate('/chat'); setOpen(false) } },
    { label: 'Sign Up', icon: UserPlus, action: () => { navigate('/register'); setOpen(false) } },
    { label: 'Login', icon: LogIn, action: () => { navigate('/login'); setOpen(false) } },
    { label: 'View Impact', icon: BarChart3, action: () => { navigate('/impact'); setOpen(false) } },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 bg-white rounded-xl shadow-xl border border-[#e5e7eb] overflow-hidden w-64">
          <div className="bg-[#16a34a] p-4 text-white">
            <p className="font-semibold text-sm">Syscycl</p>
            <p className="text-xs text-white/80">How can we help you today?</p>
          </div>
          <div className="p-2">
            {actions.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0fdf4] transition-colors text-left"
              >
                <item.icon className="w-4 h-4 text-[#16a34a]" />
                <span className="text-sm text-[#374151]">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-[#e5e7eb] flex items-center gap-2">
            <Shield className="w-3 h-3 text-[#6b7280]" />
            <p className="text-[11px] text-[#6b7280]">Your privacy is protected</p>
          </div>
          <div className="px-4 py-2 bg-[#f9fafb] border-t border-[#e5e7eb]">
            <p className="text-[10px] text-[#9ca3af]">
              Contact us at manager@syscycl.com
            </p>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg flex items-center justify-center transition-all hover:scale-105"
        aria-label="Chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  )
}
