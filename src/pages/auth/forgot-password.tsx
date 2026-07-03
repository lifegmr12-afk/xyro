import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const { error } = await resetPassword(email)
      if (error) {
        toast.error(error.message || 'Failed to send reset email')
      } else {
        setIsEmailSent(true)
        toast.success('Password reset email sent')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Reset Password | PromptVerse AI</title>
        <meta name="description" content="Reset your PromptVerse AI password" />
      </Head>

      <main className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="max-w-md w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-neon-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">PromptVerse AI</span>
            </Link>
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-slate-400 mt-2">
              We'll send you an email with a link to reset your password
            </p>
          </motion.div>

          {isEmailSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 rounded-2xl bg-white/5 border border-white/10"
            >
              <CheckCircle className="w-12 h-12 mx-auto text-green-400 mb-4" />
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-slate-400 mb-6">
                We've sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <Link
                href="/auth/signin"
                className="text-primary-light hover:text-accent"
              >
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <p className="text-center text-sm text-slate-400">
                Remember your password?{' '}
                <Link href="/auth/signin" className="text-primary-light hover:text-accent">
                  Sign in
                </Link>
              </p>
            </motion.form>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  )
}
