import { Link } from 'react-router-dom'
import { Leaf, Instagram, Facebook, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-[#16a34a]" />
              <span className="text-lg font-bold">Syscycl</span>
            </div>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              An Assumption College School (Student BIS) Initiative
            </p>
            <p className="text-sm text-[#9ca3af] mt-2">
              Door-to-door PET bottle collection in Brantford, ON
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://instagram.com/syscycl" target="_blank" rel="noopener noreferrer" className="text-[#9ca3af] hover:text-[#16a34a] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/syscycl" target="_blank" rel="noopener noreferrer" className="text-[#9ca3af] hover:text-[#16a34a] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:manager@syscycl.com" className="text-[#9ca3af] hover:text-[#16a34a] transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-[#9ca3af] hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/impact" className="text-sm text-[#9ca3af] hover:text-white transition-colors">Impact</Link></li>
              <li><Link to="/gallery" className="text-sm text-[#9ca3af] hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/register" className="text-sm text-[#9ca3af] hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/login" className="text-sm text-[#9ca3af] hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://instagram.com/syscycl" target="_blank" rel="noopener noreferrer" className="text-sm text-[#9ca3af] hover:text-white transition-colors flex items-center gap-2">
                  <Instagram className="w-4 h-4" /> @syscycl
                </a>
              </li>
              <li>
                <a href="https://facebook.com/syscycl" target="_blank" rel="noopener noreferrer" className="text-sm text-[#9ca3af] hover:text-white transition-colors flex items-center gap-2">
                  <Facebook className="w-4 h-4" /> @syscycl
                </a>
              </li>
              <li>
                <a href="mailto:manager@syscycl.com" className="text-sm text-[#9ca3af] hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> manager@syscycl.com
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[#9ca3af]">
                <Mail className="w-4 h-4" /> manager@syscycl.com
              </li>
              <li className="flex items-center gap-2 text-sm text-[#9ca3af]">
                <MapPin className="w-4 h-4" /> Brantford, Ontario, Canada
              </li>
            </ul>
            <p className="text-xs text-[#6b7280] mt-6">
              Copyright: 2026 Syscycl. An Assumption College School (Student BIS) Initiative.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#6b7280]">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>|</span>
            <Link to="/consent" className="hover:text-white transition-colors">Consent Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
