import { useAuth } from '@/contexts/AuthContext'
import { Building2, Shield } from 'lucide-react'
import PreLaunchBanner from '@/components/PreLaunchBanner'

export default function SponsorDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-[100dvh] bg-[#f9fafb] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-[#d97706]" />
          <h1 className="text-[30px] font-semibold text-[#111827]">Sponsor Dashboard</h1>
        </div>

        <PreLaunchBanner />

        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6 mb-6">
          <p className="text-lg text-[#374151]">
            Welcome, <span className="font-semibold text-[#111827]">{user?.fullName}</span>
          </p>
          <p className="text-sm text-[#6b7280] mt-1">
            Reference Number: <span className="font-mono font-medium text-[#111827]">{user?.refNumber}</span>
          </p>
          {user?.sponsorType && (
            <p className="text-sm text-[#6b7280] mt-1">
              Sponsor Type: <span className="text-[#374151]">{user.sponsorType}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-8 text-center">
          <Shield className="w-12 h-12 text-[#d97706] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#111827] mb-2">Coming Soon</h2>
          <p className="text-sm text-[#6b7280] max-w-md mx-auto">
            Your sponsor dashboard will be available once collections begin. You&apos;ll be able to view impact reports, recognition status, and contribution tracking.
          </p>
        </div>
      </div>
    </div>
  )
}
