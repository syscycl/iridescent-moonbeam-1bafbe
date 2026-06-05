import { Rocket } from 'lucide-react'

export default function PreLaunchBanner() {
  return (
    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg p-4 flex items-center gap-3 mb-6">
      <Rocket className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
      <div>
        <p className="text-[#15803d] font-semibold text-sm">Launching Soon — Registration Open</p>
        <p className="text-[#6b7280] text-xs">
          We are preparing for our first collection runs. Register now to be among the first households served.
        </p>
      </div>
    </div>
  )
}
