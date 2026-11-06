import React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Target,
  Award,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Compass,
  Lightbulb,
  GraduationCap,
  Building,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const About: React.FC = () => {
  const pillars = [
    {
      icon: Users,
      title: 'Individual Student Mentorship',
      description: 'We reject one-size-fits-all coaching. Mentors track individual student problem-solving patterns, clearing conceptual doubts in small batches.'
    },
    {
      icon: Target,
      title: 'Concept-First Pedagogy',
      description: 'Formula sheets without understanding lead to failure. We drill the fundamental core of physics, maths, and reasoning before advancing to speed tricks.'
    },
    {
      icon: Sparkles,
      title: 'Integrated CBT Technology',
      description: 'Students practice in an exact replica of official government test portals, eliminating real exam-day nervousness.'
    },
    {
      icon: Award,
      title: 'Holistic Career Confidence',
      description: 'Beyond textbook syllabus, we groom students in spoken communication, interview composure, and professional ethics.'
    }
  ]

  const milestones = [
    {
      year: '2014',
      title: 'Foundation of GLD Shikshalaya',
      description: 'Established with a simple mission: bringing disciplined, high-quality board and competitive education to students.'
    },
    {
      year: '2018',
      title: 'Computer Lab & Skills Wing',
      description: 'Expanded campus facilities to include hands-on computer workstations for DCA/ADCA certifications and digital literacy.'
    },
    {
      year: '2022',
      title: 'CBT Examination Portal',
      description: 'Pioneered custom online mock testing engines simulating official SSC, High Court, and Banking recruiting patterns.'
    },
    {
      year: '2026',
      title: 'Official Android Mobile App',
      description: 'Launched our Google Play app, bringing CBT testing, video lectures, and instant solutions to thousands of mobile learners.'
    }
  ]

  return (
    <div className="min-h-screen bg-paper-light text-slate-900 pt-20 sm:pt-24 pb-20 md:pb-12">
      {/* ── HERO BANNER ── */}
      <section className="relative py-14 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="badge-navy mb-4">
              <Building className="w-3.5 h-3.5 text-accent-gold" />
              <span>THE GLD SHIKSHALAYA STORY</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-slate-950 tracking-tight leading-tight">
              An Educational Legacy Built on Care & Discipline
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
              GLD is not a corporate factory. It is an institution rooted in mentorship, where student potential is nurtured with structured learning, personal accountability, and state-of-the-art testing tools.
            </p>
          </div>
        </div>
      </section>

      {/* ── CORE PILLARS ── */}
      <section className="py-16 sm:py-20 bg-paper-light border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">
              OUR FOUNDATION
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight mt-1">
              Guiding Principles of Our Academy
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon
              return (
                <div key={idx} className="academic-card p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-accent-gold" />
                    </div>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-2">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    {p.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── JOURNEY ROADMAP ── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">
              OVER A DECADE OF IMPACT
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight mt-1">
              The Journey of GLD Shikshalaya
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="academic-card p-6 sm:p-7 flex flex-col justify-between bg-paper-light hover:bg-white">
                <div>
                  <span className="font-heading font-black text-3xl text-accent-gold block mb-3">
                    {m.year}
                  </span>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2">
                    {m.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACULTY COMMITMENT ── */}
      <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-accent-gold text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>THE GLDIAN PLEDGE</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Our Promise to Every Student & Parent
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We promise transparent guidance, rigorous academic standards, and honest progress appraisals. From your initial counseling session to the day you crack your target exam or board marksheet, GLD stands right behind you.
            </p>
            <div className="pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs tracking-wider uppercase hover:bg-slate-100 transition-all shadow-md active:scale-98"
              >
                <span>Visit Campus & Meet Faculty</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About