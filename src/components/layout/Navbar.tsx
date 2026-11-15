import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, User as UserIcon, LogOut, LogIn, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar: React.FC = () => {
  const location = useLocation()
  const { user, profile, logout, openAuthModal } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const { scrollY } = useScroll()

  // Do not render navbar on CBT exam screen
  if (location.pathname.startsWith('/tests/exam/')) {
    return null
  }

  useMotionValueEvent(scrollY, "change", (current) => {
    if (current > 50) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }

    const previous = scrollY.getPrevious() || 0
    if (current > previous && current > 50) {
      setScrollDirection('down')
    } else if (current < previous) {
      setScrollDirection('up')
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
    { path: '/about', label: 'About' },
    { path: '/courses', label: 'Courses' },
    { path: '/tests', label: 'Mock Tests' },
    { path: '/contact', label: 'Contact' },
  ]

  // Determine whether page has a dark hero at top
  const isDarkHeroPage =
    location.pathname === '/' ||
    location.pathname === '/about' ||
    location.pathname === '/courses' ||
    location.pathname === '/contact' ||
    location.pathname === '/tests' ||
    location.pathname.startsWith('/tests/')

  const isSolid = scrolled || !isDarkHeroPage

  // Determine width based on scroll direction and position
  const isSmallWidth = scrolled && scrollDirection === 'up'

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
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-5'
        }`}
      >
        <div 
          className={`transition-all duration-500 flex justify-between items-center px-6 py-3 ${
            isSmallWidth 
              ? 'w-[92%] md:w-[75%] max-w-5xl bg-white shadow-xl rounded-full border border-gray-100' 
              : `w-full max-w-7xl mx-auto ${isSolid ? 'bg-white shadow-md rounded-2xl' : 'bg-transparent'}`
          }`}
        >
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="overflow-hidden rounded-full border-2 border-transparent group-hover:border-accent-amber transition-colors duration-300">
              <img src="/icon.png" alt="GLD Logo" className='w-10 h-10 md:w-12 md:h-12 object-cover' />
            </div>
            <span className={`font-heading font-bold text-xl tracking-wide hidden sm:block ${
              isSolid ? 'text-primary-dark' : 'text-white'
            }`}>
              GLD SHIKSHALAYA
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ path, label }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 ${
                    isActive 
                      ? isSolid ? 'text-primary font-bold' : 'text-white font-bold'
                      : isSolid ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isSolid ? 'bg-primary/10' : 'bg-white/20 backdrop-blur-sm'
                      }`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* User Auth or Sign In Button (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-semibold ${
                    isSolid
                      ? 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {studentPhoto ? (
                    <img
                      src={studentPhoto}
                      alt={studentName}
                      className="w-7 h-7 rounded-full object-cover border border-white/30"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                      {studentInitial}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{studentName}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">{studentName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/tests"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3.5 py-2 text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      My Tests & Submissions
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        logout()
                      }}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 font-medium flex items-center gap-1.5"
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
                className={`px-4 py-2 rounded-full font-semibold text-xs transition-all duration-300 flex items-center gap-1.5 shadow ${
                  isSolid
                    ? 'bg-primary text-white hover:bg-primary-light'
                    : 'bg-white text-primary hover:bg-white/90'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <Link
              to="/contact"
              className="px-4 py-2 rounded-full font-semibold text-xs transition-transform duration-300 hover:scale-105 shadow-md bg-red-DEFAULT text-white hover:shadow-red-DEFAULT/40"
            >
              Enroll Now
            </Link>
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            className={`md:hidden p-2 rounded-full focus:outline-none transition-colors ${
              isSolid ? 'text-primary hover:bg-primary/10' : 'text-white hover:bg-white/20'
            }`}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile slide-in drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col md:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
                <span className="font-heading font-bold text-primary text-lg">Menu</span>
                <button
                  className="p-2 rounded-full text-gray-500 hover:text-red-DEFAULT hover:bg-red-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Student status in mobile drawer */}
              {user && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {studentPhoto ? (
                      <img
                        src={studentPhoto}
                        alt={studentName}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                        {studentInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{studentName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-col px-6 py-6 space-y-5 flex-grow">
                {navItems.map(({ path, label }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className={`text-xl font-heading font-semibold transition-colors ${
                        isActive ? 'text-primary' : 'text-gray-500 hover:text-primary-light'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>

              <div className="p-6 border-t border-gray-100 space-y-2">
                {!user && (
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      openAuthModal()
                    }}
                    className="block w-full text-center py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
                  >
                    Sign In with Google
                  </button>
                )}
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-3.5 rounded-full bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                >
                  Enroll Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
