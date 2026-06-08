import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Home, HeartHandshake, Building2,
  MapPin, MessageSquare, Mail, FolderOpen, UserCheck, Search,
  AlertTriangle, MailCheck, Plus, X, Database, ExternalLink,
  RefreshCw, CheckCircle2,
} from 'lucide-react'
import { getAllUsers, registerUser } from '@/lib/auth'
import { fetchAllRegistrations, subscribeToRegistrations, isSupabaseConnected, setSupabaseCredentials } from '@/lib/supabase'

interface CloudReg {
  id: string
  full_name: string
  phone: string
  email: string
  address: string
  role: string
  ref_number: string
  source: string
  created_at: string
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<CloudReg[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'household' | 'volunteer' | 'sponsor'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [setupSuccess, setSetupSuccess] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Manual entry form state
  const [newReg, setNewReg] = useState({
    fullName: '', phone: '', email: '', address: '',
    role: 'household' as 'household' | 'volunteer' | 'sponsor',
    source: '',
  })

  // Load registrations from cloud + local on mount
  useEffect(() => {
    loadRegistrations()
    // Subscribe to real-time updates (polls every 10s)
    const unsubscribe = subscribeToRegistrations((regs) => {
      setUsers(mergeRegistrations(regs))
      setLastUpdated(new Date().toLocaleTimeString())
    })
    return unsubscribe
  }, [])

  async function loadRegistrations() {
    const cloudRegs = await fetchAllRegistrations()
    setUsers(mergeRegistrations(cloudRegs))
    setLastUpdated(new Date().toLocaleTimeString())
  }

  // Merge cloud registrations with local ones (deduplicate by ref_number)
  function mergeRegistrations(cloudRegs: any[]): CloudReg[] {
    const localUsers = getAllUsers()
    const localAsCloud: CloudReg[] = localUsers.map(u => ({
      id: u.id,
      full_name: u.fullName,
      phone: u.phone,
      email: u.email || '',
      address: u.address,
      role: u.role,
      ref_number: u.refNumber,
      source: u.source || '',
      created_at: new Date().toISOString(),
    }))

    // Merge: cloud first, then local entries not in cloud
    const byRef = new Map<string, CloudReg>()
    cloudRegs.forEach(r => {
      if (r.ref_number) byRef.set(r.ref_number, { ...r, full_name: r.full_name || r.fullName || '' })
    })
    localAsCloud.forEach(r => {
      if (!byRef.has(r.ref_number)) byRef.set(r.ref_number, r)
    })

    return Array.from(byRef.values()).sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  const stats = {
    total: users.length,
    households: users.filter((u) => u.role === 'household').length,
    volunteers: users.filter((u) => u.role === 'volunteer').length,
    sponsors: users.filter((u) => u.role === 'sponsor').length,
  }

  const handleManualAdd = () => {
    if (!newReg.fullName || !newReg.phone || !newReg.address) return
    registerUser({
      role: newReg.role,
      fullName: newReg.fullName,
      phone: newReg.phone,
      email: newReg.email || '',
      address: newReg.address,
      source: newReg.source || 'Email/Manual',
    })
    loadRegistrations()
    setAddSuccess(true)
    setTimeout(() => setAddSuccess(false), 3000)
    setNewReg({ fullName: '', phone: '', email: '', address: '', role: 'household', source: '' })
    setShowAddForm(false)
  }

  const handleSetupSupabase = () => {
    if (supabaseUrl && supabaseKey) {
      setSupabaseCredentials(supabaseUrl, supabaseKey)
      setSetupSuccess(true)
      setTimeout(() => {
        setSetupSuccess(false)
        setShowSetup(false)
        loadRegistrations()
      }, 2000)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      u.full_name.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.ref_number.toLowerCase().includes(q)
    return matchRole && matchSearch
  })

  const links = [
    { label: 'Service Map', icon: MapPin, path: '/admin/map', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Chat Log', icon: MessageSquare, path: '/chats', color: 'text-[#16a34a]', bg: 'bg-[#f0fdf4]' },
    { label: 'Email Templates', icon: Mail, path: '/admin/email-templates', color: 'text-[#d97706]', bg: 'bg-amber-50' },
    { label: 'Asset Library', icon: FolderOpen, path: '/innovations', color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-6 h-6 text-[#16a34a]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Management Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, icon: Users, color: 'text-[#111827]' },
            { label: 'Households', value: stats.households, icon: Home, color: 'text-[#16a34a]' },
            { label: 'Volunteers', value: stats.volunteers, icon: HeartHandshake, color: 'text-[#3b82f6]' },
            { label: 'Sponsors', value: stats.sponsors, icon: Building2, color: 'text-[#d97706]' },
          ].map((s) => (
            <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-sm">
              <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
              <p className="text-3xl font-bold font-mono text-[#111827]">{s.value}</p>
              <p className="text-sm text-[#6b7280]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <h2 className="text-lg font-semibold text-[#111827] mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {links.map((link) => (
            <motion.button
              key={link.path}
              whileHover={{ y: -2 }}
              onClick={() => navigate(link.path)}
              className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-left hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-lg ${link.bg} flex items-center justify-center mb-3`}>
                <link.icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <span className="text-sm font-medium text-[#374151]">{link.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Cloud Database Status */}
        <div className={`rounded-xl border p-4 mb-6 ${isSupabaseConnected() ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {isSupabaseConnected() ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium mb-1">
                  {isSupabaseConnected()
                    ? 'Cloud database connected - registrations sync automatically'
                    : 'Auto-sync not yet configured - registrations stored in this browser'}
                </p>
                {lastUpdated && (
                  <p className="text-xs text-[#6b7280]">Last updated: {lastUpdated}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isSupabaseConnected() && (
                <button
                  onClick={() => setShowSetup(!showSetup)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Database className="w-3 h-3" />
                  Connect Cloud DB
                </button>
              )}
              <button
                onClick={loadRegistrations}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#f3f4f6] text-[#6b7280] text-xs font-medium rounded-lg hover:bg-[#e5e7eb] transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Supabase Setup Form */}
        {showSetup && !isSupabaseConnected() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 mb-6"
          >
            <h3 className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Connect Supabase Cloud Database (Free)
            </h3>
            <p className="text-xs text-[#6b7280] mb-4">
              This enables ALL registrations to sync automatically across devices.
              No credit card required. Takes 3 minutes to set up.
            </p>
            <ol className="text-xs text-[#374151] space-y-1.5 mb-4 list-decimal list-inside">
              <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a free account</li>
              <li>Click "New Project" and give it a name (e.g., "syscycl")</li>
              <li>In the left sidebar, click <strong>Table Editor</strong> then <strong>New Table</strong></li>
              <li>Table name: <code className="bg-[#f3f4f6] px-1 rounded">registrations</code></li>
              <li>Enable <strong>Row Level Security (RLS)</strong> and add a policy: Enable read access for all users, Enable insert access for all users</li>
              <li>Go to <strong>Project Settings → API</strong> and copy the URL and anon key below</li>
            </ol>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Supabase Project URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xxxx.supabase.co"
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Anon Public API Key</label>
                <input
                  type="text"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbG..."
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleSetupSupabase}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save & Connect
            </button>
            {setupSuccess && (
              <p className="mt-2 text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected! Dashboard will now auto-sync.
              </p>
            )}
          </motion.div>
        )}

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">
                About cross-device registration tracking
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                This is a Student BIZ demo project. Registrations are <strong>sent via email to manager@syscycl.com</strong> automatically.
                To see ALL registrations here, either: (1) Click "Connect Cloud DB" above for automatic sync, or (2) Click "Add Registration" to manually add entries from your email.
              </p>
            </div>
          </div>
        </div>

        {/* All Registrations */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-[#111827]">All Registrations</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#16a34a] text-white text-xs font-medium rounded-full hover:bg-[#15803d] transition-colors"
            >
              {showAddForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showAddForm ? 'Cancel' : 'Add Registration'}
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, ref ID..."
              className="pl-9 pr-4 py-2 rounded-lg border border-[#e5e7eb] text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
            />
          </div>
        </div>

        {/* Role filter tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'household', 'volunteer', 'sponsor'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                roleFilter === f ? 'bg-[#16a34a] text-white' : 'bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]'
              }`}
            >
              {f === 'all' ? `All (${users.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)}s (${users.filter(u => u.role === f).length})`}
            </button>
          ))}
        </div>

        {/* Manual Add Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl border border-[#16a34a]/30 shadow-sm p-6 mb-6"
          >
            <h3 className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
              <MailCheck className="w-4 h-4 text-[#16a34a]" />
              Add Registration from Email
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={newReg.fullName}
                  onChange={(e) => setNewReg({ ...newReg, fullName: e.target.value })}
                  placeholder="Name from email"
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Phone *</label>
                <input
                  type="tel"
                  value={newReg.phone}
                  onChange={(e) => setNewReg({ ...newReg, phone: e.target.value })}
                  placeholder="Phone from email"
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Email</label>
                <input
                  type="email"
                  value={newReg.email}
                  onChange={(e) => setNewReg({ ...newReg, email: e.target.value })}
                  placeholder="Email from email"
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Address *</label>
                <input
                  type="text"
                  value={newReg.address}
                  onChange={(e) => setNewReg({ ...newReg, address: e.target.value })}
                  placeholder="Address from email"
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Role</label>
                <select
                  value={newReg.role}
                  onChange={(e) => setNewReg({ ...newReg, role: e.target.value as 'household' | 'volunteer' | 'sponsor' })}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e7eb] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                >
                  <option value="household">Contributor (Household)</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#6b7280] mb-1 block">Source</label>
                <input
                  type="text"
                  value={newReg.source}
                  onChange={(e) => setNewReg({ ...newReg, source: e
