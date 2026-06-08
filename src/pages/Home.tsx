import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LiveAnalyticsTicker from '../components/LiveAnalyticsTicker'
import { trackInstagramView } from '@/lib/ticker'
import {
  Leaf, ClipboardList, Calendar, DoorOpen, TrendingUp,
  Home as HomeIcon, HeartHandshake, Building2, CheckCircle2,
  Mail, MapPin, Instagram, ArrowRight,
  Heart, GraduationCap, BookOpen, BarChart3,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)
  const instagramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.location.hash === '#how-it-works') {
      const el = document.getElementById('how-it-works')
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  // Track when Instagram section is viewed (for live ticker)
  useEffect(() => {
    if (!instagramRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackInstagramView()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(instagramRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <LiveAnalyticsTicker />
      {/* Section 1: Hero */}
      <section ref={heroRef} className="min-h-[80vh] bg-gradient-to-b from-white to-[#f0fdf4] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-4 py-1.5 mb-6">
              <Leaf className="w-4 h-4 text-[#16a34a]" />
              <span className="text-sm text-[#15803d] font-medium">Student-Powered Recycling in Brantford</span>
            </div>
            <h1 className="text-[40px] md:text-[48px] leading-tight mb-6">
              <span className="text-[#16a34a] italic font-serif">Recycle Smarter.</span>
              <br />
              <span className="text-[#111827] font-bold">We&apos;ll Pick Up Your</span>
              <br />
              <span className="text-[#111827] font-bold">Plastic Bottles —</span>
              <br />
              <span className="text-[#16a34a] font-bold">For Free.</span>
            </h1>
            <p className="text-[#374151] text-base leading-relaxed mb-8 max-w-lg">
              Syscycl is a door-to-door PET plastic bottle collection service for Brantford homes. We pick up, sort, and deliver your recyclables — so you don&apos;t have to lift a finger. Every bottle helps our planet.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors shadow-md"
              >
                Sign Up for Free Pickup
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-6 py-3 bg-white text-[#374151] border border-[#e5e7eb] rounded-lg font-medium hover:bg-[#f9fafb] transition-colors"
              >
                See How It Works
              </button>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold text-[#111827] font-mono">--</p>
                <p className="text-sm text-[#6b7280]">Launching Soon</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#111827] font-mono">--</p>
                <p className="text-sm text-[#6b7280]">Bottles Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#111827] font-mono">--</p>
                <p className="text-sm text-[#6b7280]">CO2 Pending</p>
              </div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            <img
              src="/syscycl-empathy-hero.png"
              alt="Syscycl student volunteers collecting PET bottles"
              className="rounded-xl shadow-lg w-full object-cover"
            />
            <button
              onClick={() => navigate('/register?role=volunteer')}
              className="absolute bottom-4 right-4 bg-[#16a34a] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-[#15803d] transition-colors flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              We&apos;re hiring student volunteers!
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-[30px] font-semibold text-[#111827] mb-2">How Syscycl Works</h2>
            <p className="text-[#6b7280]">Four simple steps to hassle-free recycling</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', icon: ClipboardList, title: 'Sign Up Online', desc: "Fill out our quick registration form with your address and preferred pickup day. No calls, no hassle." },
              { num: '2', icon: Calendar, title: 'Choose Your Day', desc: "Pick Tuesday, Wednesday, or Thursday for weekly collection. We'll send you a reminder the day before." },
              { num: '3', icon: DoorOpen, title: 'Leave Bags at Your Door', desc: "On pickup day, leave your clean PET bottles in the provided Syscycl bag by your front door. We'll do the rest." },
              { num: '4', icon: TrendingUp, title: 'Track Your Impact', desc: "Log in to your customer portal to see how many bottles you've recycled and the CO2 you've helped save." },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <step.icon className="w-8 h-8 text-[#16a34a] mx-auto mb-3" />
                <h3 className="text-[18px] font-semibold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[#6b7280] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Environmental Impact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#16a34a] text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-[30px] font-semibold mb-2">Your Recycling Makes a Real Difference</h2>
            <p className="text-white/80">Every bottle collected is one less in a landfill. Here&apos;s the impact our Brantford community can make together.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { val: '--', label: 'Bottles Collected' },
              { val: '--', label: 'kg CO2 Avoided' },
              { val: '--', label: 'Plastic Diverted' },
              { val: '--', label: 'Water Saved' },
            ].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center">
                <p className="text-4xl font-bold font-mono mb-1">{stat.val}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-8">
            <p className="text-xs text-white/60">1 kg of recycled PET = 3 kg of CO2e avoided. Source: EPA WARM Model.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold mb-2 text-center">Live Community Impact</h3>
            <p className="text-sm text-white/70 text-center mb-4">These numbers will update in real-time as collections begin.</p>
            <div className="flex justify-around mb-4">
              <div className="text-center">
                <p className="text-xl font-bold font-mono">--</p>
                <p className="text-xs text-white/70">Bottles</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold font-mono">--</p>
                <p className="text-xs text-white/70">kg CO2</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold font-mono">--</p>
                <p className="text-xs text-white/70">Households</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2.5 bg-white text-[#16a34a] rounded-lg font-medium hover:bg-white/90 transition-colors text-sm"
            >
              Be among the first to join
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 3.5: Our Story + YouTube */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Story Text */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-4 py-1.5 mb-6">
                <Heart className="w-4 h-4 text-[#16a34a]" />
                <span className="text-sm text-[#15803d] font-medium">Our Story</span>
              </div>
              <h2 className="text-[30px] font-semibold text-[#111827] mb-4 leading-tight">Built by a Student, For the Community</h2>
              <p className="text-[#374151] leading-relaxed mb-4">
                Hi, I&apos;m Tanisha — a student at Assumption College Brantford. Syscycl started as my co-op entrepreneurship project, but it&apos;s grown into something I truly believe can help our city.
              </p>
              <p className="text-[#374151] leading-relaxed mb-4">
                I noticed that while Brantford has recycling programs, many people — especially in apartments and townhomes — find it inconvenient to sort and transport their plastic bottles. That&apos;s where Syscycl comes in.
              </p>
              <p className="text-[#374151] leading-relaxed mb-6">
                We pick up your PET bottles door-to-door, sort and process them, and deliver them to local recyclers right here in Brantford. Every bottle we collect is one less in a landfill.
              </p>
              <blockquote className="border-l-4 border-[#16a34a] pl-4 italic text-[#374151] bg-[#f0fdf4] p-4 rounded-r-lg">
                &ldquo;Our mission is to make recycling effortless for Brantford residents while building a sustainable, community-driven business that proves student entrepreneurs can make a real difference.&rdquo;
              </blockquote>
              <p className="text-sm text-[#6b7280] mt-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Assumption College Brantford Co-op 2026
              </p>
            </motion.div>

            {/* Right: YouTube Video */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
                <div className="bg-[#f9fafb] px-4 py-3 border-b border-[#e5e7eb]">
                  <p className="text-sm font-medium text-[#111827]">&ldquo;The Nature&rdquo; — by Tasleem Khan</p>
                  <p className="text-xs text-[#6b7280]">An award-winning short film on humanity&apos;s impact on the environment</p>
                </div>
                <div className="aspect-video bg-[#111827]">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/a5g4UoW9uzI?rel=0"
                    title="The Nature by Tasleem Khan"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <p className="text-xs text-[#9ca3af] mt-2 text-center">
                Tanisha&apos;s father Tasleem Khan is an acclaimed filmmaker and environmental advocate.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: 3-Role CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f0fdf4]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-[30px] font-semibold text-[#111827] mb-2">Join the Syscycl Movement</h2>
            <p className="text-[#6b7280]">Whether you want pickups, want to help, or want to support — there&apos;s a place for you.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: HomeIcon,
                title: 'Get Free Pickups',
                desc: "Register your household for free weekly PET bottle collection. We'll pick up right from your doorstep.",
                color: '#16a34a',
                features: ['Free weekly collection', 'Track your CO2 impact', 'Earn reward tiers', 'No sorting required'],
                btn: 'Sign Up for Pickup',
                link: '/register?role=household',
              },
              {
                icon: HeartHandshake,
                title: 'Volunteer With Us',
                desc: "Join our team of student collectors. Gain community service hours and be part of something meaningful.",
                color: '#3b82f6',
                features: ['Community service hours', 'Syscycl volunteer t-shirt', 'Flexible scheduling', 'Make real impact'],
                btn: 'Become a Volunteer',
                link: '/register?role=volunteer',
              },
              {
                icon: Building2,
                title: 'Sponsor Our Mission',
                desc: "Support student entrepreneurship and environmental action. Your sponsorship helps us grow and serve more communities.",
                color: '#d97706',
                features: ['Brand visibility', 'Impact reports', 'Community recognition', 'Tax-deductible support'],
                btn: 'Become a Sponsor',
                link: '/register?role=sponsor',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6"
              >
                <card.icon className="w-10 h-10 mb-4" style={{ color: card.color }} />
                <h3 className="text-[18px] font-semibold text-[#111827] mb-2">{card.title}</h3>
                <p className="text-[14px] text-[#6b7280] mb-4 leading-relaxed">{card.desc}</p>
                <ul className="space-y-2 mb-6">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                      <CheckCircle2 className="w-4 h-4 text-[#16a34a] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(card.link)}
                  className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-colors hover:opacity-90"
                  style={{ backgroundColor: card.color }}
                >
                  {card.btn}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Gallery Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-[30px] font-semibold text-[#111827] mb-2">Inspiring a Greener Future</h2>
            <p className="text-[#6b7280]">From our story to global innovations — see what drives us</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { src: '/tanisha-inspiration-1.png', title: 'Our Inspiration' },
              { src: '/innovation-post-1-enzyme.png', title: 'PET-Eating Enzymes' },
              { src: '/social-post-1-launch.png', title: 'Launch Day' },
              { src: '/innovation-post-2-ocean-cleanup.png', title: 'Ocean Cleanup' },
            ].map((img) => (
              <motion.div
                key={img.src}
                whileHover={{ scale: 1.03 }}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              >
                <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{img.title}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/gallery" className="inline-flex items-center gap-2 text-[#16a34a] font-medium hover:text-[#15803d] transition-colors">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f9fafb]">
        <div className="max-w-lg mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }}>
            <h2 className="text-[30px] font-semibold text-[#111827] mb-2">Get In Touch</h2>
            <p className="text-[#6b7280] mb-
