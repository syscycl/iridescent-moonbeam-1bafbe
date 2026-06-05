import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Home, HeartHandshake, Building2,
  MapPin, MessageSquare, Mail, FolderOpen, UserCheck, Search,
} from 'lucide-react'
import { getAllUsers } from '@/lib/auth'

export default function AdminPanel() {
  const navigate = useNavigate()
  const users = useMemo(() => getAllUsers(), [])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'household' | 'volunteer' | 'sponsor'>('all')

  const stats = {
    total: users.length,
    households: users.filter((u) => u.role === 'household').length,
    volunteers: users.filter((u) => u.role === 'volunteer').length,
    sponsors: users.filter((u) => u.role === 'sponsor').length,
  }

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    const q = search.toLowerCase()
    const matchSearch = !q || u.fullName.toLowerCase().includes(q) || u.phone.includes(q) || u.refNumber.toLowerCase().includes(q)
    return matchRole && matchSearch
  }).reverse()

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

        {/* All Registrations */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#111827]">All Registrations</h2>
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

        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-[#9ca3af]">
              <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No registrations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f9fafb]">
                  <tr>
                    <th className="text-left px-4 py-3 text-[#6b7280] font-medium">Ref ID</th>
                    <th className="text-left px-4 py-3 text-[#6b7280] font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-[#6b7280] font-medium">Role</th>
                    <th className="text-left px-4 py-3 text-[#6b7280] font-medium">Phone</th>
                    <th className="text-left px-4 py-3 text-[#6b7280] font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-[#6b7280] font-medium">Address</th>
                    <th className="text-left px-4 py-3 text-[#6b7280] font-medium">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f9fafb]">
                      <td className="px-4 py-3 font-mono text-xs text-[#16a34a] font-semibold">{u.refNumber}</td>
                      <td className="px-4 py-3 font-medium">{u.fullName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          u.role === 'household' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                          u.role === 'volunteer' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-[#374151]">{u.phone || '—'}</td>
                      <td className="px-4 py-3 text-[#6b7280]">{u.email || '—'}</td>
                      <td className="px-4 py-3 text-[#374151] max-w-[150px] truncate">{u.address}</td>
                      <td className="px-4 py-3 text-[#6b7280]">{u.source || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
