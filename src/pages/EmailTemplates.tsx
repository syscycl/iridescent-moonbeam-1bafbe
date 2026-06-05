import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Building2, Factory, UserCheck, Copy, Check, X, Lightbulb } from 'lucide-react'

interface Template {
  id: string
  title: string
  subject: string
  purpose: string
  recipient: string
  icon: typeof Building2
  color: string
  bgColor: string
  body: string
}

const TEMPLATES: Template[] = [
  {
    id: 'community-access',
    title: 'Community Access Request',
    subject: 'Partnership Proposal: Student-Led PET Bottle Collection for [Community Name]',
    purpose: 'Property Managers',
    recipient: '[Property Manager Name]',
    icon: Building2,
    color: 'text-[#16a34a]',
    bgColor: 'bg-[#f0fdf4]',
    body: `Dear [Property Manager Name],

I hope this message finds you well. My name is [Your Name], and I'm a student at Assumption College School in Brantford. I'm reaching out on behalf of Syscycl — a student-run initiative that provides door-to-door PET plastic bottle collection for households.

We're seeking community partners in the Brantford area to pilot our collection program. Our student volunteers would conduct weekly pickups from participating households, providing a convenient recycling service while promoting environmental stewardship.

WHAT WE OFFER:
- Free weekly PET bottle collection for residents
- All collection handled by trained student volunteers
- Environmental impact reporting for your community
- No cost to the property management

WHAT WE'D NEED:
- Permission to distribute informational materials to residents
- Approval for our volunteers to access designated collection areas
- Support in communicating the program to households (optional)

Our team is fully insured, trained in safety protocols, and committed to professional service. We currently serve [X] households and are looking to expand responsibly.

Would you be open to a brief call or meeting to discuss this opportunity? I'd be happy to share our operational plan and answer any questions.

Thank you for considering this partnership. Together, we can make a meaningful environmental impact in Brantford.

Best regards,
[Your Full Name]
Syscycl — Student BIS Initiative
Assumption College School
Email: manager@syscycl.com
Instagram: @syscycl`,
  },
  {
    id: 'recycling-partner',
    title: 'Recycling Partner Engagement',
    subject: 'Reliable PET Bottle Supply — Student Collection Program Partnership',
    purpose: 'Recycling Buyers',
    recipient: '[Recycling Partner Name]',
    icon: Factory,
    color: 'text-[#3b82f6]',
    bgColor: 'bg-blue-50',
    body: `Dear [Recycling Partner Name],

I'm writing on behalf of Syscycl, a student-run PET bottle collection initiative based in Brantford, Ontario. We're building a community-driven recycling collection program and are looking for reliable recycling partners to ensure the plastic we collect is properly processed.

ABOUT SYSCYCL:
- Door-to-door collection service operated by students
- Focus on clean PET plastic bottles (Type 1)
- Growing household base in Brantford neighborhoods
- Regular weekly collection schedule

WHAT WE'RE LOOKING FOR:
- A recycling partner who can accept bulk PET bottle deliveries
- Transparent pricing and processing standards
- Potential for ongoing partnership as we scale

EXPECTED VOLUME:
- Initial: [X] kg per week (pilot phase)
- Growth target: [X] kg per week within 6 months
- All bottles pre-sorted and cleaned by our volunteers

Would you be interested in discussing a collection arrangement? We'd appreciate the opportunity to learn about your requirements and share more about our operations.

Thank you for supporting student entrepreneurship and environmental action in our community.

Best regards,
[Your Full Name]
Syscycl — Student BIS Initiative
Assumption College School
Email: manager@syscycl.com`,
  },
  {
    id: 'registration-confirmation',
    title: 'Registration Confirmation',
    subject: 'Welcome to Syscycl! Your Registration is Confirmed',
    purpose: 'Auto-Confirmation',
    recipient: '[User Full Name]',
    icon: UserCheck,
    color: 'text-[#d97706]',
    bgColor: 'bg-amber-50',
    body: `Hi [User Full Name],

Welcome to Syscycl! We're excited to have you join our mission to make recycling easier for Brantford households.

YOUR REGISTRATION DETAILS:
Reference Number: [RefNumber]
Account Type: [Role]
Registered Address: [Address]
Preferred Pickup Day: [PickupDay]

WHAT HAPPENS NEXT:
1. We're preparing our collection routes for Brantford neighborhoods
2. You'll receive a notification once collections begin in your area
3. We'll provide you with Syscycl collection bags and a pickup schedule
4. On your designated day, leave your clean PET bottles by your front door

YOUR ACCOUNT:
Log in anytime at [Website URL] to view your account details and track your environmental impact once collections begin.

QUESTIONS?
Reply to this email or reach us at manager@syscycl.com

Thank you for being part of the solution!

The Syscycl Team
Assumption College School (Student BIS Initiative)
Brantford, Ontario
Instagram: @syscycl`,
  },
]

export default function EmailTemplates() {
  const [selected, setSelected] = useState<Template | null>(null)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    if (!selected) return
    const text = `Subject: ${selected.subject}\n\n${selected.body}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Email Templates</h1>
        </div>
        <p className="text-sm text-[#6b7280] mb-8">
          Ready-to-send emails for community engagement. Click any template to view and copy.
        </p>

        {/* Template cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {TEMPLATES.map((t) => (
            <motion.button
              key={t.id}
              whileHover={{ y: -2 }}
              onClick={() => { setSelected(t); setCopied(false) }}
              className="text-left bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 hover:shadow-md transition-all w-full"
            >
              <div className={`w-10 h-10 rounded-lg ${t.bgColor} flex items-center justify-center mb-4`}>
                <t.icon className={`w-5 h-5 ${t.color}`} />
              </div>
              <h3 className="text-[16px] font-semibold text-[#111827] mb-1">{t.title}</h3>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${t.bgColor} ${t.color} mb-2`}>
                {t.purpose}
              </span>
              <p className="text-xs text-[#6b7280] line-clamp-1">Subject: {t.subject}</p>
              <p className="text-xs text-[#9ca3af] mt-1">To: {t.recipient}</p>
              <span className="text-xs text-[#16a34a] font-medium mt-3 inline-block">View & Copy &rarr;</span>
            </motion.button>
          ))}
        </div>

        {/* How to use */}
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#16a34a]" />
            <h3 className="font-semibold text-[#111827]">How to Use</h3>
          </div>
          <ol className="space-y-2 text-sm text-[#374151]">
            <li className="flex items-start gap-2"><span className="font-bold text-[#16a34a]">1.</span> Click any template card above</li>
            <li className="flex items-start gap-2"><span className="font-bold text-[#16a34a]">2.</span> Click &quot;Copy Full Email&quot;</li>
            <li className="flex items-start gap-2"><span className="font-bold text-[#16a34a]">3.</span> Paste into Gmail/Outlook</li>
            <li className="flex items-start gap-2"><span className="font-bold text-[#16a34a]">4.</span> Replace [bracketed] fields with actual info</li>
            <li className="flex items-start gap-2"><span className="font-bold text-[#16a34a]">5.</span> Send from manager@syscycl.com</li>
          </ol>
        </div>
      </div>

      {/* Viewer dialog */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb]">
                <div className="flex items-center gap-2">
                  <selected.icon className={`w-5 h-5 ${selected.color}`} />
                  <h3 className="font-semibold text-[#111827]">{selected.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 rounded-md hover:bg-[#f9fafb]">
                  <X className="w-5 h-5 text-[#6b7280]" />
                </button>
              </div>
              <div className="p-4 border-b border-[#e5e7eb] bg-[#f9fafb]">
                <p className="text-sm text-[#374151]"><span className="font-medium">Subject:</span> {selected.subject}</p>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="text-sm text-[#374151] whitespace-pre-wrap font-sans leading-relaxed">{selected.body}</pre>
              </div>
              <div className="p-4 border-t border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
                <p className="text-xs text-[#6b7280]">Replace all [bracketed] text before sending</p>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-[#16a34a] text-white rounded-lg text-sm font-medium hover:bg-[#15803d] transition-colors flex items-center gap-1.5"
                >
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Full Email</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
