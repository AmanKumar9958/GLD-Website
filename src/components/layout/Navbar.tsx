import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar: React.FC = () => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  
  const { scrollY } = useScroll()

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
    { path: '/contact', label: 'Contact' }
  ]

  // Determine width based on scroll direction and position
  const isSmallWidth = scrolled && scrollDirection === 'up'

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
              ? 'w-[90%] md:w-[70%] max-w-4xl bg-white shadow-xl rounded-full border border-gray-100' 
              : `w-full max-w-7xl mx-auto ${scrolled ? 'bg-white shadow-md rounded-2xl' : 'bg-transparent'}`
          }`}
        >
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="overflow-hidden rounded-full border-2 border-transparent group-hover:border-accent-amber transition-colors duration-300">
              <img src="/icon.png" alt="GLD Logo" className='w-10 h-10 md:w-12 md:h-12 object-cover' />
            </div>
            <span className={`font-heading font-bold text-xl tracking-wide hidden sm:block ${
              scrolled ? 'text-primary-dark' : 'text-white'
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
                      ? scrolled ? 'text-primary' : 'text-white'
                      : scrolled ? 'text-gray-600 hover:text-primary' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        scrolled ? 'bg-primary/10' : 'bg-white/20 backdrop-blur-sm'
                      }`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link to="/contact" className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-transform duration-300 hover:scale-105 shadow-md ${
              scrolled ? 'bg-primary text-white hover:shadow-primary/30' : 'bg-white text-primary hover:shadow-white/20'
            }`}>
              Enroll Now
            </Link>
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            className={`md:hidden p-2 rounded-full focus:outline-none transition-colors ${
              scrolled ? 'text-primary hover:bg-primary/10' : 'text-white hover:bg-white/20'
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

              <div className="flex flex-col px-6 py-8 space-y-6 flex-grow">
                {navItems.map(({ path, label }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMenuOpen(false)}
                      className={`text-2xl font-heading font-semibold transition-colors ${
                        isActive ? 'text-primary' : 'text-gray-400 hover:text-primary-light'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>

              <div className="p-6 border-t border-gray-100">
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-4 rounded-full bg-primary text-white font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
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