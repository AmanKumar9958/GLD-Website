import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, Loader2, Sparkles, Smartphone, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isAuthModalOpen) return null

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrorMsg('')

    try {
      const res = await signInWithGoogle()
      if (!res.success) {
        setErrorMsg(res.error || 'Unable to connect to Google. Please try again.')
        setIsLoading(false)
      }
      // Note: If successful, browser will redirect to Google OAuth consent
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign-in.')
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-primary-dark/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-primary via-primary-dark to-[#050B1B] text-white p-7 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-accent-amber/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-red-DEFAULT/20 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={closeAuthModal}
              className="absolute right-4 top-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3.5 relative z-10">
              <img
                src="/icon.png"
                alt="GLD Logo"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20 shadow-md"
              />
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-accent-amber/20 text-accent-amber border border-accent-amber/30">
                  Student Portal
                </span>
                <h3 className="text-xl font-heading font-bold text-white mt-1">
                  Sign in to GLD
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-300 mt-3 leading-relaxed relative z-10">
              Access online mock tests, real-time performance analytics, and detailed question solutions.
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-7 space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Sign-In Primary Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-semibold text-sm border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  {/* Google 4-color 'G' Logo */}
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-gray-700 group-hover:text-gray-900">Continue with Google</span>
                </>
              )}
            </button>

            {/* Feature Highlights */}
            <div className="pt-2 border-t border-gray-100 space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Why Sign In with Google?
              </p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span>Instant 1-click access — no password to create or remember</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-3 h-3" />
                  </div>
                  <span>Syncs seamlessly with your GLD Android App account</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <span>Live test evaluations, previous attempts, and answer keys</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-gray-400 text-center leading-normal pt-1">
              By continuing, you agree to GLD Shikshalaya&apos;s Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default AuthModal
