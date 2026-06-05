import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, Mail, MapPin, Calendar, HelpCircle,
  MessageSquare, CheckCircle2, Home, HeartHandshake,
  Building2, Copy, Check,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const SOURCE_OPTIONS = ['Instagram', 'Facebook', 'Friend', 'Flyer', 'Website', 'Other']

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const { register } = useAuth()

  const [role, setRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'household',
  )
  const [submitted, setSubmitted] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<AuthUser | null>(null)
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    address: '', mapPinUrl: '', dayTime: '', source: '', remarks: '',
    availableDays: [] as string[], tShirtSize: '', emergencyContact: '',
    sponsorType: '', contributionInterest: '', sponsorMessage: '',
  })

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (form.fullName.length < 2) e.fullName = 'Name is required'
    if (form.phone.length < 10) e.phone = 'Phone is required'
    if (!form.address) e.address = 'Address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const userData: any = {
      role, fullName: form.fullName, phone: form.phone, email: form.email || '',
      address: form.address, mapPinUrl: form.mapPinUrl || undefined,
      dayTime: form.dayTime || undefined, source: form.source || undefined,
      remarks: form.remarks || undefined,
    }
    if (role === 'volunteer') {
      userData.availableDays = form.availableDays
      userData.tShirtSize = form.tShirtSize || undefined
      userData.emergencyContact = form.emergencyContact || undefined
    }
    if (role === 'sponsor') {
      userData.sponsorType = form.sponsorType || undefined
      userData.contributionInterest = form.contributionInterest || undefined
      userData.sponsorMessage = form.sponsorMessage || undefined
    }
    const user = register(userData)

    if (user) {
      // Send notification to Tanisha via Formspree
      import('@/lib/notifications').then(({ sendNotification, getCurrentTimestamp }) => {
        sendNotification({
          type: user.role === 'sponsor' ? 'sponsor' : 'registration',
          name: user.fullName,
          phone: user.phone,
          email: user.email,
          details: `Role: ${user.role} | Ref: ${user.refNumber} | Address: ${user.address} | Source: ${user.source || 'N/A'}`,
          timestamp: getCurrentTimestamp(),
        })
      })
    }

    setRegisteredUser(user)
    setSubmitted(true)
  }

  const reset = () => {
    setSubmitted(false)
    setRegisteredUser(null)
    setForm({
      fullName: '', phone: '', email: '', address: '', mapPinUrl: '',
      dayTime: '', source: '', remarks: '',
      availableDays: [], tShirtSize: '', emergencyContact: '',
      sponsorType: '', contributionInterest: '', sponsorMessage: '',
    })
    setErrors({})
  }

  const roleConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    household: { label: 'Contributor', icon: Home, color: '#16a34a', bg: '#f0fdf4' },
    volunteer: { label: 'Volunteer', icon: HeartHandshake, color: '#3b82f6', bg: '#eff6ff' },
    sponsor: { label: 'Sponsor', icon: Building2, color: '#d97706', bg: '#fffbeb' },
  }

  if (submitted && registeredUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f9fafb] py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
          </div>
          <h2 className="text-2xl font-semibold text-[#111827] mb-2">Registration Successful!</h2>
          <p className="text-[#6b7280] mb-6">Welcome to Syscycl! Your unique reference ID is:</p>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 mb-4">
            <p className="text-3xl font-mono font-bold text-[#16a34a]">{registeredUser.refNumber}</p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(registeredUser.refNumber)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-medium hover:bg-[#15803d] transition-colors mb-4"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Reference ID'}
          </button>
          <p className="text-sm text-[#d97706] font-medium mb-2">
            Please take a screenshot of this page for your records.
          </p>
          <p className="text-xs text-[#6b7280] mb-6">
            We'll send a confirmation to your email shortly.
          </p>
          <button onClick={reset} className="text-sm text-[#16a34a] hover:underline">
            Register Another Person
          </button>
        </motion.div>
      </div>
    )
  }



  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 md:p-8"
        >
          <h1 className="text-2xl font-semibold text-[#111827] text-center mb-2">Join Syscycl</h1>
          <p className="text-sm text-[#6b7280] text-center mb-6">
            An Assumption College School (Student BIZ) Initiative
          </p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6">
            {Object.entries(roleConfig).map(([key, c]) => {
              const I = c.icon
              return (
                <button
                  key={key}
                  onClick={() => setRole(key as UserRole)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                    role === key
                      ? 'text-white border-transparent'
                      : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#d1d5db]'
                  }`}
                  style={role === key ? { backgroundColor: c.color } : {}}
                >
                  <I className="w-4 h-4" />
                  {c.label}
                </button>
              )
            })}
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <User className="w-4 h-4 text-[#9ca3af]" /> Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Your full name"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.fullName ? 'border-red-300' : 'border-[#e5e7eb]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]`} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <MapPin className="w-4 h-4 text-[#9ca3af]" /> Street Address <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Your street address"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? 'border-red-300' : 'border-[#e5e7eb]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]`} />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <MapPin className="w-4 h-4 text-[#9ca3af]" /> Location Map URL
              </label>
              <input type="url" value={form.mapPinUrl} onChange={(e) => update('mapPinUrl', e.target.value)} placeholder="Google Maps or Apple Maps pin URL"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <Phone className="w-4 h-4 text-[#9ca3af]" /> Phone Number <span className="text-red-500">*</span>
              </label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Your phone number"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-300' : 'border-[#e5e7eb]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]`} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <Mail className="w-4 h-4 text-[#9ca3af]" /> Email Address
              </label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <Calendar className="w-4 h-4 text-[#9ca3af]" /> Preferred Day & Time
              </label>
              <input type="text" value={form.dayTime} onChange={(e) => update('dayTime', e.target.value)} placeholder="e.g., Tuesdays at 10 AM"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]" />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <HelpCircle className="w-4 h-4 text-[#9ca3af]" /> How did you hear about us?
              </label>
              <select value={form.source} onChange={(e) => update('source', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] bg-white">
                <option value="">Select</option>
                {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <MessageSquare className="w-4 h-4 text-[#9ca3af]" /> Remarks / Comments
              </label>
              <textarea value={form.remarks} onChange={(e) => update('remarks', e.target.value)} placeholder="Any special instructions" rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] resize-none" />
            </div>

            {/* Volunteer-specific */}
            <AnimatePresence>
              {role === 'volunteer' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2 border-t border-[#e5e7eb]">
                  <p className="text-sm font-medium text-[#3b82f6]">Volunteer Information</p>
                  <div>
                    <label className="text-sm text-[#6b7280] mb-1 block">Available Days</label>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <button key={day} onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.availableDays.includes(day) ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-white text-[#6b7280] border-[#e5e7eb]'}`}>
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-[#6b7280] mb-1 block">T-Shirt Size</label>
                    <select value={form.tShirtSize} onChange={(e) => update('tShirtSize', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#e5e7eb] text-sm bg-white">
                      <option value="">Select size</option>
                      {['S', 'M', 'L', 'XL', 'XXL'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-[#6b7280] mb-1 block">Emergency Contact</label>
                    <input type="text" value={form.emergencyContact} onChange={(e) => update('emergencyContact', e.target.value)} placeholder="Name and phone number" className="w-full px-4 py-2 rounded-lg border border-[#e5e7eb] text-sm" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sponsor-specific */}
            <AnimatePresence>
              {role === 'sponsor' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-2 border-t border-[#e5e7eb]">
                  <p className="text-sm font-medium text-[#d97706]">Sponsor Information</p>
                  <div>
                    <label className="text-sm text-[#6b7280] mb-1 block">Sponsor Type</label>
                    <select value={form.sponsorType} onChange={(e) => update('sponsorType', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#e5e7eb] text-sm bg-white">
                      <option value="">Select type</option>
                      {['Individual', 'Business', 'Organization', 'School'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-[#6b7280] mb-1 block">Contribution Interest</label>
                    <select value={form.contributionInterest} onChange={(e) => update('contributionInterest', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-[#e5e7eb] text-sm bg-white">
                      <option value="">Select interest</option>
                      {['Financial', 'In-kind', 'Venue', 'Promotion', 'Other'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-[#6b7280] mb-1 block">Message</label>
                    <textarea value={form.sponsorMessage} onChange={(e) => update('sponsorMessage', e.target.value)} placeholder="Tell us about your sponsorship interest" rows={3} className="w-full px-4 py-2 rounded-lg border border-[#e5e7eb] text-sm resize-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={handleSubmit} className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors mt-2">
              Register
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
