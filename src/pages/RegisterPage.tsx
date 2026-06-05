import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, Mail, Lock, MapPin, Calendar, HelpCircle,
  MessageSquare, Shield, CheckCircle2, Home, HeartHandshake,
  Building2, Copy, Check, ClipboardList,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const SECURITY_QUESTIONS = [
  'What was the name of your first pet?',
  'What city were you born in?',
  "What is your mother's maiden name?",
  'What was your childhood nickname?',
]

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
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
    address: '', mapPinUrl: '', preferredPickupDay: '', source: '', remarks: '',
    securityQuestion: '', securityAnswer: '',
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
    if (form.fullName.length < 2) e.fullName = 'Name is required (min 2 characters)'
    if (form.phone.length < 10) e.phone = 'Phone is required (min 10 digits)'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.address) e.address = 'Address is required'
    if (!form.securityQuestion) e.securityQuestion = 'Security question is required'
    if (!form.securityAnswer) e.securityAnswer = 'Security answer is required'
    if (!agreed) e.agreed = 'You must agree to the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const userData: any = {
      role,
      fullName: form.fullName,
      phone: form.phone,
      email: form.email || '',
      password: form.password,
      securityQuestion: form.securityQuestion,
      securityAnswer: form.securityAnswer,
      address: form.address,
      mapPinUrl: form.mapPinUrl || undefined,
      preferredPickupDay: form.preferredPickupDay || undefined,
      source: form.source || undefined,
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
    setRegisteredUser(user)
    setSubmitted(true)
  }

  const copyRef = () => {
    if (registeredUser?.refNumber) {
      navigator.clipboard.writeText(registeredUser.refNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 sm:p-8"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-semibold text-[#111827]">Create Your Account</h1>
                <p className="text-sm text-[#6b7280] mt-1">Join Syscycl and start recycling smarter</p>
              </div>

              {/* Role selector */}
              <div className="flex gap-2 mb-6">
                {[
                  { key: 'household' as UserRole, label: 'Contributor', icon: Home, color: 'green' },
                  { key: 'volunteer' as UserRole, label: 'Volunteer', icon: HeartHandshake, color: 'blue' },
                  { key: 'sponsor' as UserRole, label: 'Sponsor', icon: Building2, color: 'amber' },
                ].map((r) => (
                  <button
                    key={r.key}
                    onClick={() => setRole(r.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                      role === r.key
                        ? r.color === 'green' ? 'bg-[#16a34a] text-white border-[#16a34a]' :
                          r.color === 'blue' ? 'bg-[#3b82f6] text-white border-[#3b82f6]' :
                          'bg-[#d97706] text-white border-[#d97706]'
                        : 'bg-white text-[#374151] border-[#e5e7eb] hover:bg-[#f9fafb]'
                    }`}
                  >
                    <r.icon className="w-4 h-4" />
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <User className="w-4 h-4" /> Full Name <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 ${errors.fullName ? 'border-[#ef4444]' : 'border-[#e5e7eb]'}`}
                  />
                  {errors.fullName && <p className="text-xs text-[#ef4444] mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <Phone className="w-4 h-4" /> Phone Number <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="226-555-0123"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 ${errors.phone ? 'border-[#ef4444]' : 'border-[#e5e7eb]'}`}
                  />
                  {errors.phone && <p className="text-xs text-[#ef4444] mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <Lock className="w-4 h-4" /> Password <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Min 6 characters"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 ${errors.password ? 'border-[#ef4444]' : 'border-[#e5e7eb]'}`}
                  />
                  {errors.password && <p className="text-xs text-[#ef4444] mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <Lock className="w-4 h-4" /> Confirm Password <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 ${errors.confirmPassword ? 'border-[#ef4444]' : form.confirmPassword && passwordsMatch ? 'border-[#16a34a]' : 'border-[#e5e7eb]'}`}
                  />
                  {form.confirmPassword && passwordsMatch && (
                    <p className="text-xs text-[#16a34a] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Passwords match</p>
                  )}
                  {errors.confirmPassword && <p className="text-xs text-[#ef4444] mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <MapPin className="w-4 h-4" /> Street Address <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="123 Colborne St W"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 ${errors.address ? 'border-[#ef4444]' : 'border-[#e5e7eb]'}`}
                  />
                  {errors.address && <p className="text-xs text-[#ef4444] mt-1">{errors.address}</p>}
                </div>

                {/* Map Pin URL */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <MapPin className="w-4 h-4" /> Location Pin URL
                  </label>
                  <p className="text-xs text-[#6b7280] mb-1">Paste a Google Maps or Apple Maps pin URL to help us find you</p>
                  <input
                    type="url"
                    value={form.mapPinUrl}
                    onChange={(e) => update('mapPinUrl', e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                  />
                </div>

                {/* Pickup Day */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <Calendar className="w-4 h-4" /> Preferred Pickup Day
                  </label>
                  <select
                    value={form.preferredPickupDay}
                    onChange={(e) => update('preferredPickupDay', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 bg-white"
                  >
                    <option value="">Select a day</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="No preference">No preference</option>
                  </select>
                </div>

                {/* Source */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <HelpCircle className="w-4 h-4" /> How did you hear about us?
                  </label>
                  <select
                    value={form.source}
                    onChange={(e) => update('source', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 bg-white"
                  >
                    <option value="">Select</option>
                    {SOURCE_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>

                {/* Remarks */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <MessageSquare className="w-4 h-4" /> Additional Notes
                  </label>
                  <textarea
                    value={form.remarks}
                    onChange={(e) => update('remarks', e.target.value)}
                    rows={3}
                    placeholder="Any special instructions, gate codes, etc."
                    className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 resize-none"
                  />
                </div>

                {/* Security Question */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <Shield className="w-4 h-4" /> Security Question <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={form.securityQuestion}
                    onChange={(e) => update('securityQuestion', e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 bg-white ${errors.securityQuestion ? 'border-[#ef4444]' : 'border-[#e5e7eb]'}`}
                  >
                    <option value="">Select a security question</option>
                    {SECURITY_QUESTIONS.map((q) => (<option key={q} value={q}>{q}</option>))}
                  </select>
                  {errors.securityQuestion && <p className="text-xs text-[#ef4444] mt-1">{errors.securityQuestion}</p>}
                </div>

                {/* Security Answer */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                    <Shield className="w-4 h-4" /> Security Answer <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.securityAnswer}
                    onChange={(e) => update('securityAnswer', e.target.value)}
                    placeholder="Your answer for password recovery"
                    className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 ${errors.securityAnswer ? 'border-[#ef4444]' : 'border-[#e5e7eb]'}`}
                  />
                  {errors.securityAnswer && <p className="text-xs text-[#ef4444] mt-1">{errors.securityAnswer}</p>}
                </div>

                {/* Volunteer-specific fields */}
                {role === 'volunteer' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 border-t border-[#e5e7eb] pt-4">
                    <p className="text-sm font-medium text-[#3b82f6] flex items-center gap-1.5"><ClipboardList className="w-4 h-4" /> Volunteer Details</p>
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-2 block">Available Days</label>
                      <div className="flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <button key={day} onClick={() => toggleDay(day)} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${form.availableDays.includes(day) ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-white text-[#374151] border-[#e5e7eb]'}`}>
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">T-Shirt Size</label>
                      <select value={form.tShirtSize} onChange={(e) => update('tShirtSize', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm bg-white">
                        <option value="">Select size</option>
                        {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Emergency Contact</label>
                      <input type="text" value={form.emergencyContact} onChange={(e) => update('emergencyContact', e.target.value)} placeholder="Name and phone" className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm" />
                    </div>
                  </motion.div>
                )}

                {/* Sponsor-specific fields */}
                {role === 'sponsor' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 border-t border-[#e5e7eb] pt-4">
                    <p className="text-sm font-medium text-[#d97706] flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Sponsor Details</p>
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Sponsor Type</label>
                      <select value={form.sponsorType} onChange={(e) => update('sponsorType', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm bg-white">
                        <option value="">Select</option>
                        {['Individual', 'Business', 'Organization', 'School'].map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Contribution Interest</label>
                      <select value={form.contributionInterest} onChange={(e) => update('contributionInterest', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm bg-white">
                        <option value="">Select</option>
                        {['Financial', 'In-kind', 'Venue', 'Promotion', 'Other'].map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#374151] mb-1 block">Message</label>
                      <textarea value={form.sponsorMessage} onChange={(e) => update('sponsorMessage', e.target.value)} rows={3} placeholder="Tell us about your sponsorship interest" className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm resize-none" />
                    </div>
                  </motion.div>
                )}

                {/* Terms */}
                <div className="flex items-start gap-2 pt-2">
                  <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
                  <label htmlFor="terms" className="text-xs text-[#374151]">
                    I agree to the <Link to="/privacy" className="text-[#16a34a] hover:underline">Privacy Policy</Link> and <Link to="/consent" className="text-[#16a34a] hover:underline">Consent Policy</Link>
                  </label>
                </div>
                {errors.agreed && <p className="text-xs text-[#ef4444]">{errors.agreed}</p>}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
                >
                  Create Account
                </button>

                <p className="text-center text-sm text-[#6b7280]">
                  Already have an account? <Link to="/login" className="text-[#16a34a] font-medium hover:underline">Log in</Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#111827] mb-2">Welcome to Syscycl!</h2>
              <p className="text-[#6b7280] mb-4">Your registration is complete.</p>
              <div className="bg-[#f9fafb] rounded-lg p-4 mb-4">
                <p className="text-xs text-[#6b7280] mb-1">Your Reference Number</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-mono font-bold text-[#111827]">{registeredUser?.refNumber}</code>
                  <button onClick={copyRef} className="p-1.5 rounded-md hover:bg-[#e5e7eb] transition-colors" aria-label="Copy">
                    {copied ? <Check className="w-4 h-4 text-[#16a34a]" /> : <Copy className="w-4 h-4 text-[#6b7280]" />}
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#374151] mb-6">Save this number — you&apos;ll need it to log in.</p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
              >
                Go to Login
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
