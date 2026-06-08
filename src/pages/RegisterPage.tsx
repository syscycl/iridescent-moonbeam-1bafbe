  import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, Mail, MapPin, Calendar, HelpCircle,
  MessageSquare, CheckCircle2, Home, HeartHandshake,
  Building2, Copy, Check, AlertTriangle, Send,
  Globe, Navigation, Clock,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { sendNotification, getCurrentTimestamp } from '@/lib/notifications'
import { storeRegistration } from '@/lib/supabase'
import type { UserRole } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const SOURCE_OPTIONS = ['Instagram', 'Facebook', 'Friend', 'Flyer', 'Website', 'Other']

// Major streets in Brantford, Ontario
const BRANTFORD_STREETS = [
  'Colborne Street',
  'Dalhousie Street',
  'Market Street',
  'Queen Street',
  'King George Road',
  'North Park Street',
  'West Street',
  'East Street',
  'Morrell Street',
  'Brant Avenue',
  'Charing Cross Street',
  'Erie Avenue',
  'Grand River Avenue',
  'St. Paul Avenue',
  'Wellington Street',
  'Icomm Drive',
  'Shellard Lane',
  'Gilkison Street',
  'Richmond Street',
  'Darling Street',
  'Nelson Street',
  'Cayuga Street',
  'Tuscarora Street',
  'Seneca Street',
  'Oneida Street',
  'Onondaga Street',
  'Mohawk Street',
  'Tomahawk Drive',
  'Birkdale Crescent',
  'Dover Court',
  'Other (enter manually)',
]

// Country codes for phone
const COUNTRY_CODES = [
  { code: '+1', country: 'Canada', flag: 'CA' },
  { code: '+1', country: 'USA', flag: 'US' },
  { code: '+91', country: 'India', flag: 'IN' },
  { code: '+44', country: 'UK', flag: 'GB' },
  { code: '+92', country: 'Pakistan', flag: 'PK' },
  { code: '+971', country: 'UAE', flag: 'AE' },
  { code: '+86', country: 'China', flag: 'CN' },
  { code: '+63', country: 'Philippines', flag: 'PH' },
  { code: '+27', country: 'South Africa', flag: 'ZA' },
  { code: '+61', country: 'Australia', flag: 'AU' },
]

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjyngrb'

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
  const [emailSent, setEmailSent] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [showMapHelper, setShowMapHelper] = useState(false)
  const [streetDropdown, setStreetDropdown] = useState('')
  const [streetManual, setStreetManual] = useState('')
  const [countryCode, setCountryCode] = useState('+1')

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    address: '', mapPinUrl: '', pickupDate: '', pickupTime: '', dayTime: '', source: '', remarks: '',
    availableDays: [] as string[], tShirtSize: '', emergencyContact: '',
    sponsorType: '', contributionInterest: '', sponsorMessage: '',
  })

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n })
  }

  const handleStreetChange = (value: string) => {
    setStreetDropdown(value)
    if (value === 'Other (enter manually)') {
      update('address', streetManual)
    } else {
      update('address', value)
    }
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
    if (form.phone.length < 7) e.phone = 'Valid phone number is required'
    if (!form.address || form.address === 'Other (enter manually)') e.address = 'Street address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const fullPhone = `${countryCode} ${form.phone}`
    const userData: any = {
      role, fullName: form.fullName, phone: fullPhone, email: form.email || '',
      address: form.address, mapPinUrl: form.mapPinUrl || undefined,
      pickupDate: form.pickupDate || undefined,
      pickupTime: form.pickupTime || undefined,
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
      sendNotification({
        type: user.role === 'sponsor' ? 'sponsor' : 'registration',
        name: user.fullName,
        phone: fullPhone,
        email: user.email,
        details: `Role: ${user.role} | Ref: ${user.refNumber} | Address: ${user.address} | Pickup Date: ${form.pickupDate || 'Not set'} | Source: ${user.source || 'N/A'}`,
        timestamp: getCurrentTimestamp(),
      })
      storeRegistration(user).catch(() => {})
    }

    setRegisteredUser(user)
    setSubmitted(true)
    setEmailSent(false)
  }

  const sendToAdmin = async () => {
    if (!registeredUser) return
    setSendingEmail(true)
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Syscycl Registration from ${registeredUser.fullName} (${registeredUser.role})`,
          _replyto: registeredUser.email || 'noreply@syscycl.com',
          role: registeredUser.role,
          refNumber: registeredUser.refNumber,
          name: registeredUser.fullName,
          phone: registeredUser.phone,
          email: registeredUser.email || 'Not provided',
          address: registeredUser.address,
          pickupDate: form.pickupDate || 'Not provided',
          pickupTime: form.pickupTime || 'Not provided',
          mapPinUrl: form.mapPinUrl || 'Not provided',
          source: form.source || 'Not provided',
          remarks: form.remarks || 'None',
          availableDays: form.availableDays.length > 0 ? form.availableDays.join(', ') : 'N/A',
          tShirtSize: form.tShirtSize || 'N/A',
          emergencyContact: form.emergencyContact || 'N/A',
          sponsorType: form.sponsorType || 'N/A',
          contributionInterest: form.contributionInterest || 'N/A',
          sponsorMessage: form.sponsorMessage || 'N/A',
          timestamp: getCurrentTimestamp(),
        }),
      })
      if (response.ok) setEmailSent(true)
    } catch { /* silently fail */ }
    finally { setSendingEmail(false) }
  }
    const reset = () => {
    setSubmitted(false)
    setRegisteredUser(null)
    setEmailSent(false)
    setSendingEmail(false)
    setStreetDropdown('')
    setStreetManual('')
    setShowMapHelper(false)
    setForm({
      fullName: '', phone: '', email: '', address: '', mapPinUrl: '',
      pickupDate: '', pickupTime: '', dayTime: '', source: '', remarks: '',
      availableDays: [], tShirtSize: '', emergencyContact: '',
      sponsorType: '', contributionInterest: '', sponsorMessage: '',
    })
    setErrors({})
  }

  const openGoogleMaps = () => {
    const query = form.address ? encodeURIComponent(form.address + ', Brantford, Ontario') : 'Brantford, Ontario'
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
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
            onClick={() => { navigator.clipboard.writeText(registeredUser.refNumber); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-medium hover:bg-[#15803d] transition-colors mb-4"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Reference ID'}
          </button>

          {!emailSent ? (
            <button
              onClick={sendToAdmin}
              disabled={sendingEmail}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#d97706] text-white rounded-lg text-sm font-medium hover:bg-[#b45309] transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {sendingEmail ? 'Sending...' : 'Send my details to the admin'}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-sm text-[#16a34a] font-medium mb-4">
              <Check className="w-4 h-4" />
              Details sent to admin successfully!
            </div>
          )}

          <p className="text-sm text-[#d97706] font-medium mb-2">Please take a screenshot of this page for your records.</p>
          <p className="text-xs text-[#6b7280] mb-6">We&apos;ll send a confirmation to your email shortly.</p>
          <button onClick={reset} className="text-sm text-[#16a34a] hover:underline">Register Another Person</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Demo banner */}
        <div className="mb-4 bg-[#fefce8] border border-[#fde047] rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ca8a04] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#854d0e]">Demo Notice</p>
            <p className="text-sm text-[#a16207]">This is a Student BIZ demo project. Your registration will be sent to our team via email.</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 md:p-8">
          <h1 className="text-2xl font-semibold text-[#111827] text-center mb-2">Join Syscycl</h1>
          <p className="text-sm text-[#6b7280] text-center mb-6">An Assumption College School (Student BIZ) Initiative</p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6">
            {Object.entries(roleConfig).map(([key, c]) => {
              const I = c.icon
              return (
                <button key={key} onClick={() => setRole(key as UserRole)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all border ${role === key ? 'text-white border-transparent' : 'bg-white text-[#6b7280] border-[#e5e7eb] hover:border-[#d1d5db]'}`}
                  style={role === key ? { backgroundColor: c.color } : {}}>
                  <I className="w-4 h-4" />
                  {c.label}
                </button>
              )
            })}
          </div>

          {/* Form fields */}
          <div className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <User className="w-4 h-4 text-[#9ca3af]" /> Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Your full name"
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.fullName ? 'border-red-300' : 'border-[#e5e7eb]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]`} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Street Address — Dropdown */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <MapPin className="w-4 h-4 text-[#9ca3af]" /> Street Address <span className="text-red-500">*</span>
              </label>
              <select
                value={streetDropdown}
                onChange={(e) => handleStreetChange(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? 'border-red-300' : 'border-[#e5e7eb]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a] bg-white mb-2`}
              >
                <option value="">Select a street in Brantford</option>
                {BRANTFORD_STREETS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {streetDropdown === 'Other (enter manually)' && (
                <input
                  type="text"
                  value={streetManual}
                  onChange={(e) => { setStreetManual(e.target.value); update('address', e.target.value) }}
                  placeholder="Enter your street address"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                />
              )}
              {form.address && form.address !== 'Other (enter manually)' && (
                <p className="text-xs text-[#16a34a] mt-1">Selected: {form.address}</p>
              )}
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* Google Maps Pin Helper */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <Navigation className="w-4 h-4 text-[#9ca3af]" /> Pin Your Location on Map
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.mapPinUrl}
                  onChange={(e) => update('mapPinUrl', e.target.value)}
                  placeholder="Paste Google Maps link after pinning"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                />
                <button
                  type="button"
                  onClick={() => setShowMapHelper(!showMapHelper)}
                  className="px-3 py-2.5 bg-[#f3f4f6] text-[#374151] rounded-lg text-sm hover:bg-[#e5e7eb] transition-colors whitespace-nowrap"
                >
                  How to Pin
                </button>
              </div>
              {showMapHelper && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                  <p className="font-medium mb-1">To pin your house on Google Maps:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Click &quot;Open Google Maps&quot; below</li>
                    <li>Search for your address in Brantford</li>
                    <li>Right-click on your house → &quot;What&apos;s here?&quot;</li>
                    <li>Copy the URL from the address bar</li>
                    <li>Paste it in the field above</li>
                  </ol>
                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                  >
                    <Globe className="w-3 h-3" />
                    Open Google Maps
                  </button>
                </div>
              )}
            </div>            {/* Phone with Country Code */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <Phone className="w-4 h-4 text-[#9ca3af]" /> Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-32 px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 flex-shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={`${c.code}-${c.country}`} value={c.code}>{c.code} {c.country}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="(226) 555-0123"
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-300' : 'border-[#e5e7eb]'} text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]`}
                />
              </div>
              <p className="text-xs text-[#9ca3af] mt-1">Selected: {countryCode}</p>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                <Mail className="w-4 h-4 text-[#9ca3af]" /> Email Address
              </label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]" />
            </div>

            {/* Date of Pickup — Calendar */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                  <Calendar className="w-4 h-4 text-[#9ca3af]" /> Pickup Date
                </label>
                <input
                  type="date"
                  value={form.pickupDate}
                  onChange={(e) => update('pickupDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#111827] mb-1.5">
                  <Clock className="w-4 h-4 text-[#9ca3af]" /> Pickup Time
                </label>
                <select
                  value={form.pickupTime}
                  onChange={(e) => update('pickupTime', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                >
                  <option value="">Select time</option>
                  <option value="Morning (8-11 AM)">Morning (8-11 AM)</option>
                  <option value="Afternoon (12-3 PM)">Afternoon (12-3 PM)</option>
                  <option value="Evening (4-7 PM)">Evening (4-7 PM)</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Anytime">Anytime</option>
                </select>
              </div>
            </div>

            {/* How did you hear */}
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

            {/* Remarks */}
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

            {/* Sponsor-specific — NO meeting appointment date/time */}
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
