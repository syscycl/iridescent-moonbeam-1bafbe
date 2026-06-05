import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    const loggedInUser = login(email, password)
    if (!loggedInUser) {
      setError('Invalid email or password')
      return
    }
    // Redirect based on role
    switch (loggedInUser.role) {
      case 'admin': navigate('/admin'); break
      case 'household': navigate('/dashboard/household'); break
      case 'volunteer': navigate('/dashboard/volunteer'); break
      case 'sponsor': navigate('/dashboard/sponsor'); break
      default: navigate('/')
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-[#111827]">Welcome Back</h1>
            <p className="text-sm text-[#6b7280] mt-1">Log in to your Syscycl account</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-xs text-amber-700 font-medium">Management login only</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#ef4444]">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                <Mail className="w-4 h-4" /> Email <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                <Lock className="w-4 h-4" /> Password <span className="text-[#ef4444]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#374151]"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-[#16a34a] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
            >
              Log In
            </button>

            <p className="text-center text-sm text-[#6b7280]">
              Don&apos;t have an account? <Link to="/register" className="text-[#16a34a] font-medium hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
