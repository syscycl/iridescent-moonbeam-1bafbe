import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Leaf, Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToHowItWorks = () => {
    if (location.pathname === '/') {
      const el = document.getElementById('how-it-works')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById('how-it-works')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
    setMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-[#e5e7eb] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-[#16a34a]" />
            <div className="text-left">
              <span className="text-lg font-bold text-[#111827]">Syscycl</span>
              <span className="hidden sm:inline text-xs text-[#6b7280] ml-2">Brantford, ON</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <button onClick={() => navigate('/')} className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors">Home</button>
                <button onClick={scrollToHowItWorks} className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors">How It Works</button>
                <Link to="/impact" className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors">Impact</Link>
                <Link to="/gallery" className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors">Gallery</Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors">Register</Link>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors">Login</Link>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" /> Management
                  </Link>
                ) : (
                  <Link to={`/dashboard/${user?.role}`} className="px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-colors flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" /> My Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm text-[#ef4444] hover:bg-red-50 transition-colors flex items-center gap-1.5">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="ml-2 px-4 py-2 rounded-md bg-[#16a34a] text-white text-sm hover:bg-[#15803d] transition-colors flex items-center gap-1.5">
                <LogIn className="w-4 h-4" /> Management Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#374151] hover:bg-[#f0fdf4]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#e5e7eb] px-4 py-3 space-y-1 shadow-lg">
          {!isAuthenticated ? (
            <>
              <button onClick={() => { navigate('/'); setMobileOpen(false) }} className="block w-full text-left px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">Home</button>
              <button onClick={scrollToHowItWorks} className="block w-full text-left px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">How It Works</button>
              <Link to="/impact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">Impact</Link>
              <Link to="/gallery" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">Gallery</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">Register</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">Login</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm bg-[#16a34a] text-white text-center mt-2">Management Login</Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">Management</Link>
              ) : (
                <Link to={`/dashboard/${user?.role}`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm text-[#374151] hover:bg-[#f0fdf4]">My Dashboard</Link>
              )}
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-sm text-[#ef4444] hover:bg-red-50">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
