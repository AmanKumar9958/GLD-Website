import React from 'react'
import { Link } from 'react-router-dom'
import { Youtube, Instagram, Facebook, Sparkles, MapPin, Phone, Mail } from 'lucide-react'

const Footer: React.FC = () => {
  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Academic Courses' },
    { path: '/tests', label: 'Online CBT Tests' },
    { path: '/about', label: 'About GLD' },
    { path: '/contact', label: 'Admissions & Campus' }
  ]

  const testLinks = [
    { path: '/tests', label: 'Supreme Court JCA Series' },
    { path: '/tests', label: 'SSC CGL Full Mocks' },
    { path: '/tests', label: 'Patna High Court Clerk' },
    { path: '/tests', label: 'General Knowledge & Current Affairs' }
  ]

  const socialLinks = [
    { icon: Youtube, url: 'https://www.youtube.com/@GLDinstitution', label: 'YouTube' },
    { icon: Instagram, url: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, url: 'https://facebook.com', label: 'Facebook' }
  ]

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden pt-16 sm:pt-20 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 mb-14">

          {/* Col 1: Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <img src="/icon.png" alt="GLD Logo" className="w-10 h-10 rounded-xl object-contain ring-1 ring-white/20" />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-accent-gold transition-colors">
                  GLD SHIKSHALAYA
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Institute of Academic Excellence &bull; Est. 2014
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empowering students through rigorous conceptual foundation in School Boards (8th-12th), cutting-edge CBT mock tests for competitive examinations, and practical digital software skills.
            </p>

            {/* Google Play Badge */}
            <div className="pt-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.solostackdev.gldshikshalaya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/15 transition-all group"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.6 1.48L14.37 12 3.6 22.52c-.38-.34-.6-.83-.6-1.37V2.85c0-.54.22-1.03.6-1.37z" />
                  <path fill="#FBBC04" d="M17.7 8.78L14.37 12l3.33 3.22 3.75-2.15c.67-.38.67-1.76 0-2.14l-3.75-2.15z" />
                  <path fill="#34A853" d="M14.37 12L3.6 22.52c.45.41 1.13.46 1.69.14l12.41-7.14L14.37 12z" />
                  <path fill="#EA4335" d="M17.7 8.78L5.29 1.64C4.73 1.32 4.05 1.37 3.6 1.78L14.37 12l3.33-3.22z" />
                </svg>
                <div className="text-left">
                  <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">GET IT ON</span>
                  <span className="text-xs font-extrabold text-white">Google Play Store</span>
                </div>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider text-slate-300">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link to={path} className="text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Mock Test Streams */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider text-slate-300">
              CBT Test Series
            </h4>
            <ul className="space-y-2 text-xs">
              {testLinks.map(({ path, label }) => (
                <li key={label}>
                  <Link to={path} className="text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Campus Contact & Social */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider text-slate-300">
              Campus & Support
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                <span>Gali 18 Hari Nagar Extn, Badarpur, New Delhi, Delhi 110044</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+91 9999302537</span>
              </p>
              {/* <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>info@gldinstitutions.com</span>
              </p> */}
            </div>

            <div className="flex gap-2.5 pt-2">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Bottom Line */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GLD Shikshalaya. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer