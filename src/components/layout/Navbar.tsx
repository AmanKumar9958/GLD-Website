import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LogIn,
  ChevronDown,
  BookOpen,
  Sparkles,
  Phone,
  Home as HomeIcon,
  HelpCircle,
  FileText
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar: React.FC = () => {
  const location = useLocation()
  const { user, profile, logout, openAuthModal } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const { scrollY } = useScroll()

  // Do not render navbar on CBT exam screen
  if (location.pathname.startsWith('/tests/exam/')) {
    return null
  }

  useMotionValueEvent(scrollY, "change", (current) => {
    if (current > 20) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/tests', label: 'Mock Tests', badge: 'CBT' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const studentName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Student'
  const studentPhoto =
    profile?.photo_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null
  const studentInitial = studentName.charAt(0).toUpperCase()

  return (
    <>
      {/* Top Main Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-subtle py-2.5'
            : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/icon.png"
                alt="GLD Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain ring-1 ring-slate-900/10 group-hover:ring-accent-amber transition-all duration-300"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-primary-dark group-hover:text-primary transition-colors">
                  GLD SHIKSHALAYA
                </span>
                <span className="hidden lg:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                  EST. 2014
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide uppercase">
                Foundation &bull; Skills &bull; CBT Prep
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60">
            {navItems.map(({ path, label, badge }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-primary-dark shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {label}
                  {badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white tracking-wider">
                      {badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Action / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all shadow-2xs"
                >
                  {studentPhoto ? (
                    <img
                      src={studentPhoto}
                      alt={studentName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                      {studentInitial}
                    </div>
                  )}
                  <span className="max-w-[110px] truncate">{studentName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-premium border border-slate-200/90 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 truncate">{studentName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/tests"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent-gold" />
                      <span>My Tests & History</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Student Login</span>
              </button>
            )}

            <Link
              to="/contact"
              className="px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 bg-primary-dark text-white hover:bg-primary shadow-subtle hover:shadow-md active:scale-95"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile Right Controls: Auth Icon + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!user ? (
              <button
                onClick={() => openAuthModal()}
                className="p-2 rounded-full text-slate-700 hover:bg-slate-100"
                aria-label="Student Sign In"
              >
                <UserIcon size={20} />
              </button>
            ) : (
              <Link
                to="/tests"
                className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-1 ring-slate-200"
              >
                {studentPhoto ? (
                  <img
                    src={studentPhoto}
                    alt={studentName}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  studentInitial
                )}
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[84%] max-w-sm bg-white shadow-2xl z-50 flex flex-col md:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img src="/icon.png" alt="GLD Logo" className="w-8 h-8 rounded-lg object-contain" />
                  <span className="font-heading font-extrabold text-base text-slate-900">
                    GLD SHIKSHALAYA
                  </span>
                </div>
                <button
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Student status in mobile drawer */}
              {user ? (
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {studentPhoto ? (
                      <img
                        src={studentPhoto}
                        alt={studentName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                        {studentInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{studentName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg text-xs"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 mx-6 my-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <p className="text-xs font-semibold text-amber-900 mb-2">
                    Access Online CBT Mock Tests
                  </p>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      openAuthModal()
                    }}
                    className="w-full py-2.5 rounded-lg bg-primary-dark text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In with Google</span>
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col px-6 py-4 space-y-2 flex-grow">
                {navItems.map(({ path, label, badge }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-heading font-semibold text-base transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{label}</span>
                      {badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                          {badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100 space-y-2.5 bg-slate-50/50">
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl bg-accent-gold text-white font-bold text-sm shadow-md active:scale-98 transition-transform"
                >
                  Enroll / Book Free Counseling
                </Link>
                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-400">
                    GLD Shikshalaya &bull; Excellence in Education
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Thumb Bar (Phase 3 Requirement: Thumb-Zone Navigation) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-around shadow-lg">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            location.pathname === '/' ? 'text-primary font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span>Home</span>
        </Link>

        <Link
          to="/courses"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            location.pathname === '/courses' ? 'text-primary font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses</span>
        </Link>

        {/* Central Prominent Mock Test Action Button */}
        <Link
          to="/tests"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-bold transition-all relative ${
            location.pathname.startsWith('/tests')
              ? 'text-white bg-primary-dark shadow-sm'
              : 'text-amber-900 bg-amber-100/90 border border-amber-300/80'
          }`}
        >
          <Sparkles className="w-4 h-4 text-accent-gold" />
          <span>CBT Tests</span>
        </Link>

        <Link
          to="/contact"
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            location.pathname === '/contact' ? 'text-primary font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact</span>
        </Link>

        {user ? (
          <Link
            to="/tests"
            className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium text-slate-600"
          >
            <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">
              {studentInitial}
            </div>
            <span>Profile</span>
          </Link>
        ) : (
          <button
            onClick={() => openAuthModal()}
            className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium text-slate-500 hover:text-slate-800"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </>
  )
}

export default Navbar