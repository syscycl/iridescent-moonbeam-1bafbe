import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Shield, Lock, CheckCircle2, ArrowRight } from 'lucide-react'
import { getAllUsers } from '@/lib/auth'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [answer, setAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userQuestion, setUserQuestion] = useState('')
  const [foundUser, setFoundUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleFindUser = () => {
    setError('')
    const user = getAllUsers().find((u) => u.email === email)
    if (!user) {
      setError('No account found with that email')
      return
    }
    if (!user.securityQuestion) {
      setError('This account has no security question set')
      return
    }
    setFoundUser(user)
    setUserQuestion(user.securityQuestion)
    setStep(2)
  }

  const handleVerifyAnswer = () => {
    setError('')
    if (!answer.trim()) {
      setError('Please enter your answer')
      return
    }
    if (answer.trim().toLowerCase() !== foundUser.securityAnswer.toLowerCase()) {
      setError('Incorrect answer')
      return
    }
    setStep(3)
  }

  const handleReset = () => {
    setError('')
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    // Update password
    const users = getAllUsers()
    const idx = users.findIndex((u) => u.id === foundUser.id)
    if (idx !== -1) {
      users[idx].password = newPassword
      localStorage.setItem('syscycl_users', JSON.stringify(users))
    }
    setSuccess(true)
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
            <h1 className="text-2xl font-semibold text-[#111827]">
              {success ? 'Password Reset' : 'Forgot Password'}
            </h1>
            <p className="text-sm text-[#6b7280] mt-1">
              {success ? 'Your password has been updated' : 'Reset your Syscycl password'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-[#ef4444]">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {success ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto mb-4" />
                <p className="text-sm text-[#374151] mb-6">Your password has been reset successfully.</p>
                <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors">
                  Go to Login <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                        <Mail className="w-4 h-4" /> Enter your email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                      />
                    </div>
                    <button
                      onClick={handleFindUser}
                      className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-center text-sm text-[#6b7280]">
                      <Link to="/login" className="text-[#16a34a] hover:underline">Back to Login</Link>
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                        <Shield className="w-4 h-4" /> Security Question
                      </label>
                      <div className="p-3 bg-[#f9fafb] rounded-lg text-sm text-[#374151] mb-3">
                        {userQuestion}
                      </div>
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Your answer"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                      />
                    </div>
                    <button
                      onClick={handleVerifyAnswer}
                      className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
                    >
                      Verify
                    </button>
                    <button onClick={() => setStep(1)} className="w-full text-center text-sm text-[#6b7280] hover:text-[#374151]">
                      Back
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                        <Lock className="w-4 h-4" /> New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-[#374151] mb-1">
                        <Lock className="w-4 h-4" /> Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2.5 rounded-lg border border-[#e5e7eb] text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a]/20"
                      />
                    </div>
                    <button
                      onClick={handleReset}
                      className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
                    >
                      Reset Password
                    </button>
                    <button onClick={() => setStep(2)} className="w-full text-center text-sm text-[#6b7280] hover:text-[#374151]">
                      Back
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
