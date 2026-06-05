import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Home, HeartHandshake, Building2,
  BarChart3, ClipboardList, Settings,
} from 'lucide-react'
import { getUsers, getRegistrationStats } from '@/lib/auth'

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'household' | 'volunteer' | 'sponsor'>('all')

  const users = getUsers().filter((u) => u.role !== 'admin')
  const stats = getRegistrationStats()

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesSearch = !searchTerm ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.refNumber.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRole && matchesSearch
  })

  const statCards = [
    { label: 'Total', value: stats.total, icon: Users, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Contributors', value: stats.households, icon: Home, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Volunteers', value: stats.volunteers, icon: HeartHandshake, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Sponsors', value: stats.sponsors, icon: Building2, color: '#d97706', bg: '#fffbeb' },
  ]

  const quickLinks = [
    { label: 'View Reports', icon: BarChart3, href: '#' },
    { label: 'Manage Pickups', icon: ClipboardList, href: '#' },
    { label: 'Settings', icon: Settings, href: '#' },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f9fafb] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">Admin Dashboard</h1>
            <p className="text-sm text-[#6b7280]">Manage Syscycl registrations and operations</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const I = card.icon
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: card.bg }}
                  >
                    <I className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-[#111827]">{card.value}</p>
                    <p className="text-xs text-[#6b7280]">{card.label}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((link) => {
            const I = link.icon
            return (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-[#f9fafb] transition-colors"
              >
                <I className="w-4 h-4 text-[#6b7280]" />
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Registration Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">All Registrations</h2>
              <p className="text-sm text-[#6b7280]">View and track all registered stakeholders</p>
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, or ref ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#e5e7eb] text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20 focus:border-[#16a34a]"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {(['all', 'household', 'volunteer', 'sponsor'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  roleFilter === f
                    ? 'bg-[#16a34a] text-white'
                    : 'bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}s
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Ref ID</th>
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Role</th>
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Phone</th>
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Email</th>
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Address</th>
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Source</th>
                  <th className="text-left py-3 px-2 font-medium text-[#6b7280]">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#9ca3af]">
                      No registrations yet
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="py-3 px-2 font-mono text-[#16a34a] font-medium">{user.refNumber}</td>
                      <td className="py-3 px-2 text-[#111827]">{user.fullName}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'household' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                          user.role === 'volunteer' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#374151]">{user.phone}</td>
                      <td className="py-3 px-2 text-[#374151]">{user.email || '-'}</td>
                      <td className="py-3 px-2 text-[#374151] max-w-[150px] truncate">{user.address}</td>
                      <td className="py-3 px-2 text-[#6b7280]">{user.source || '-'}</td>
                      <td className="py-3 px-2 text-[#6b7280] text-xs">{new Date().toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
