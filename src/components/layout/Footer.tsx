import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Youtube, Instagram, Facebook, Play } from 'lucide-react'

const Footer: React.FC = () => {
  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/courses', label: 'Courses' },
    { path: '/contact', label: 'Contact' }
  ]

  const socialLinks = [
    { icon: Youtube, url: 'https://www.youtube.com/@GLDinstitution', label: 'YouTube', hoverColor: 'hover:text-red-500 hover:bg-white' },
    { icon: Instagram, url: '#', label: 'Instagram', hoverColor: 'hover:text-pink-500 hover:bg-white' },
    { icon: Facebook, url: '#', label: 'Facebook', hoverColor: 'hover:text-blue-600 hover:bg-white' }
  ]

  return (
    <footer className="relative bg-primary-dark overflow-hidden pt-20 pb-10">
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-amber via-red-DEFAULT to-accent-cyan" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center space-x-3 mb-6 group inline-flex">
              <div className="rounded-xl group-hover:bg-accent-amber transition-colors">
                <img src="/icon.png" alt="logo" className='w-10 h-10' />
              </div>
              <span className="font-heading text-3xl font-bold text-white tracking-tight">GLD <span className="text-red-light">Shikshalaya</span></span>
            </Link>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-6">
              More than just an institution, we are the emotion that beats in the hearts of thousands of Gldians. Empowering futures through quality education.
            </p>

            <a 
              href="https://play.google.com/store/apps/details?id=com.solostackdev.gldshikshalaya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl transition-all w-fit border border-white/10 hover:border-white/20 group"
            >
              <Play size={20} className="fill-accent-amber text-accent-amber group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5 leading-none">Get it on</span>
                <span className="text-sm font-bold leading-none">Google Play</span>
              </div>
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-heading font-semibold text-white text-xl mb-6">Explore</h4>
            <div className="flex flex-col space-y-3">
              {quickLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="text-gray-400 hover:text-accent-amber transition-colors w-fit font-medium"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-heading font-semibold text-white text-xl mb-6">Connect</h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map(({ icon: Icon, url, label, hoverColor }) => (
                <a 
                  key={label} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 ${hoverColor}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              info@gldshikshalaya.com<br />
              +91 98765 43210
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} GLD Shikshalaya. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Giant Background Text */}
      <div className="absolute bottom-[-4rem] left-0 right-0 pointer-events-none select-none overflow-hidden flex justify-center opacity-5">
        <span className="font-heading font-black text-[12vw] leading-none text-white whitespace-nowrap">
          GLD SHIKSHALAYA
        </span>
      </div>
    </footer>
  )
}

export default Footer