import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Computer,
  Briefcase,
  GraduationCap,
  Users,
  Award,
  Clock,
  CheckCircle,
  ChevronRight,
  Play,
  Smartphone,
  Star,
  Zap,
  CheckCircle2,
  Bell,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const courseCategories = [
  {
    id: 'academics',
    icon: BookOpen,
    title: 'Academics Courses',
    desc: 'Strong foundation for school exams with disciplined guidance.',
    courses: ['8th-10th All subjects', '11th & 12th PCB', '11th & 12th Arts'],
    color: 'from-blue-600 to-indigo-900',
    accent: '#2563EB',
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'technical',
    icon: Computer,
    title: 'Technical Courses',
    desc: 'Future-ready skills with hands-on sessions.',
    courses: ['Computer Applications', 'Spoken English & Personality'],
    color: 'from-emerald-500 to-teal-800',
    accent: '#10B981',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'competitive',
    icon: Briefcase,
    title: 'Competitive Exams',
    desc: 'Mentorship-driven preparation for government jobs.',
    courses: ['Banking', 'SSC', 'Railway', 'UPSC', 'State PSCs', 'Police', 'DSSSB'],
    color: 'from-amber-500 to-red-700',
    accent: '#F59E0B',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
  },
]

const stats = [
  { icon: Users, value: '500+', label: 'Students Enrolled' },
  { icon: BookOpen, value: '3', label: 'Course Categories' },
  { icon: Award, value: '10+', label: 'Years of Excellence' },
  { icon: GraduationCap, value: '100%', label: 'Dedication & Care' },
]

const features = [
  { icon: CheckCircle, title: 'Expert Faculty', desc: 'Learn from experienced educators who are passionate about your success.' },
  { icon: Clock, title: 'Flexible Timings', desc: 'Batches designed to fit your schedule — morning, afternoon and evening.' },
  { icon: Award, title: 'Proven Results', desc: 'Track record of students achieving their academic and career goals.' },
  { icon: GraduationCap, title: 'Holistic Growth', desc: 'Beyond books — we build confidence, skills and character.' },
]

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const coursesWrapperRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  // Mouse Parallax State for Hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 2 // -1 to 1
      const y = (clientY / innerHeight - 0.5) * 2 // -1 to 1
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation for stats
      document.querySelectorAll<HTMLElement>('.stat-number').forEach((el) => {
        const target = el.getAttribute('data-target') || ''
        const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''))
        const suffix = target.replace(/[0-9.]/g, '')
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          innerText: 0,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate() {
            el.innerText = Math.round(numericPart * (this.progress())) + suffix
          },
        })
      })

      // Sticky Scroll Animation for Courses
      const panels = gsap.utils.toArray('.course-panel')
      if (panels.length && coursesWrapperRef.current) {
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: coursesWrapperRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (panels.length - 1),
            start: "top 10%",
            end: () => "+=" + (coursesWrapperRef.current?.offsetWidth || 1000) * 1.5
          }
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex-grow overflow-x-hidden bg-gray-50">

      {/* ── HERO SECTION (PARALLAX + ANIMATIONS) ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark pt-20"
      >
        {/* Dynamic Abstract Background Elements */}
        <motion.div 
          animate={{ x: mousePos.x * -50, y: mousePos.y * -50 }}
          transition={{ type: 'spring', damping: 50, stiffness: 100 }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-amber/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: mousePos.x * 60, y: mousePos.y * 60 }}
          transition={{ type: 'spring', damping: 50, stiffness: 100 }}
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary-light/30 rounded-full blur-[150px]" 
        />
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left mt-10 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-8 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
              <span className="text-accent-amber text-sm font-semibold tracking-wider uppercase">Welcome to GLD Shikshalaya</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-heading font-black text-white leading-[1.1] mb-6"
            >
              Empowering <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-red-light">
                Futures
              </span>,
              <br />
              Inspiring Minds
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-body"
            >
              We don't just teach, we transform. Join thousands of students who have realized their true potential at GLD Shikshalaya.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-5"
            >
              <Link
                to="/courses"
                className="group flex items-center gap-3 bg-white text-primary-dark px-8 py-4 rounded-full font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
              >
                Explore Courses
                <span className="bg-primary-dark text-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={18} />
                </span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
              >
                <Play size={18} className="fill-white" />
                Watch Intro
              </Link>
            </motion.div>
          </div>

          {/* Hero Graphics / Parallax Cards */}
          <div className="hidden lg:block relative h-[600px]" style={{ perspective: '1000px' }}>
            <motion.div 
              animate={{ rotateX: mousePos.y * 10, rotateY: mousePos.x * 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 50 }}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 glass-dark rounded-3xl p-6 shadow-2xl border border-white/20 transform translate-z-10 z-20 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Award size={32} className="text-accent-gold" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-2">Excellence Award</h3>
                <p className="text-gray-300 text-sm">Recognized for outstanding contribution to education.</p>
                
                {/* Floating Elements inside card */}
                <div className="absolute bottom-6 right-6 bg-accent-amber text-primary-dark font-bold px-4 py-2 rounded-full text-sm shadow-lg transform -rotate-6">
                  #1 Institute
                </div>
              </div>

              {/* Back floating card 1 */}
              <div className="absolute top-10 left-10 w-64 h-72 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl p-6 shadow-2xl transform -rotate-12 opacity-80 backdrop-blur-md flex flex-col justify-end" style={{ transform: 'translateZ(-32px) rotate(-12deg)' }}>
                <Users size={28} className="text-white/80 mb-2" />
                <h4 className="font-heading font-bold text-white text-xl">500+ Students</h4>
              </div>

              {/* Back floating card 2 */}
              <div className="absolute bottom-10 right-0 w-72 h-48 glass rounded-3xl p-6 shadow-2xl transform rotate-6 backdrop-blur-xl border border-white/30 z-30 flex items-center gap-4" style={{ transform: 'translateZ(20px) rotate(6deg)' }}>
                <div className="w-14 h-14 bg-gradient-to-r from-accent-cyan to-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-lg leading-tight">100% Success<br/>Rate Focus</h4>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section ref={statsRef} className="bg-gray-50 pt-10 pb-20 relative z-10 -mt-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100 transform -translate-y-12">
            {stats.map(({ icon: Icon, value, label }, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={label}
                className="text-center group"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="text-primary group-hover:text-white transition-colors" size={24} />
                </div>
                <div className="text-3xl lg:text-5xl font-heading font-black text-primary-dark mb-1 stat-number" data-target={value}>
                  {value}
                </div>
                <div className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES (STICKY SCROLL) SECTION ── */}
      <section className="bg-white overflow-hidden py-10" ref={coursesWrapperRef}>
        <div className="container mx-auto px-6 lg:px-12 mb-10">
          <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
              <span className="inline-block text-sm font-bold tracking-widest uppercase mb-3 text-red-DEFAULT">
                What We Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-primary-dark leading-tight">
                Discover Our <span className="text-accent-amber">Programs</span>
              </h2>
            </div>
            <p className="text-gray-500 text-lg md:text-right max-w-sm hidden md:block">
              Scroll horizontally to explore streams designed for every ambition.
            </p>
          </div>
        </div>

        {/* Scroll Container */}
        <div className="flex w-[300vw] h-[60vh] min-h-[500px]">
          {courseCategories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <div key={cat.id} className="course-panel w-screen h-full flex items-center justify-center px-6 lg:px-12">
                <div className="w-full max-w-6xl h-[90%] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row group bg-white border border-gray-100">
                  
                  {/* Image Side */}
                  <div className="lg:w-1/2 h-48 lg:h-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary-dark/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
                    <img 
                      src={cat.img} 
                      alt={cat.title} 
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${cat.color} z-10 opacity-80`} />
                    <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-heading font-black text-white">{cat.title}</h3>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-gray-50 relative">
                    {/* Giant Watermark */}
                    <div className="absolute top-4 right-4 text-[10rem] font-heading font-black text-gray-200/50 leading-none select-none pointer-events-none">
                      0{idx + 1}
                    </div>
                    
                    <p className="text-xl text-gray-600 mb-8 relative z-10">
                      {cat.desc}
                    </p>
                    
                    <div className="space-y-4 mb-10 relative z-10">
                      {cat.courses.map((course) => (
                        <div key={course} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${cat.accent}20` }}>
                            <ChevronRight size={20} style={{ color: cat.accent }} />
                          </div>
                          <span className="font-semibold text-gray-800">{course}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/courses"
                      className="inline-flex w-max items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105"
                      style={{ backgroundColor: cat.accent }}
                    >
                      View All Details
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── WHY CHOOSE GLD ── */}
      <section className="bg-gray-50 py-24 border-t border-gray-100" ref={featuresRef}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-sm font-bold tracking-widest uppercase mb-3 text-primary">
              The GLD Difference
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-primary-dark mb-6">
              Why Students Love Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15 }}
                key={title}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:bg-primary transition-all duration-300">
                  <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-xl text-primary-dark mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP DOWNLOAD SECTION ── */}
      <section className="relative py-20 lg:py-28 bg-[#030712] overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-accent-amber/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="relative rounded-3xl lg:rounded-[40px] bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.01] border border-white/10 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden">
            
            {/* Background subtle diagonal glow */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-light/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Value Prop, Features & CTA */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide uppercase">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Android App • Available on Google Play</span>
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white leading-[1.15] tracking-tight">
                  Crack Your Exams{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber via-yellow-300 to-amber-500">
                    Anywhere, Anytime
                  </span>
                </h2>

                {/* Subtitle */}
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Take your learning journey on the go. Experience real computer-based mock tests, live and recorded lectures, instant question explanations, and smart performance tracking directly on your mobile device.
                </p>

                {/* 4 Feature Points Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-left">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/15 transition-colors">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Full CBT Exam Engine</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Real exam timers, negative marking & palette</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/15 transition-colors">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Instant Solutions & Keys</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Detailed step-by-step reasoning for all Qs</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/15 transition-colors">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 flex-shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Video Classes & Notes</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Curated syllabus lectures & downloadable PDFs</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 hover:border-white/15 transition-colors">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Live Exam Updates</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Timely test release & notification alerts</p>
                    </div>
                  </div>
                </div>

                {/* Call To Action Buttons & Social Proof */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.solostackdev.gldshikshalaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-white hover:bg-gray-100 active:scale-95 text-gray-900 px-6 py-3.5 rounded-2xl font-bold shadow-[0_10px_30px_rgba(255,255,255,0.15)] transition-all group"
                  >
                    {/* Official Multi-colored Google Play Store Triangle Icon */}
                    <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M3.6 1.48L14.37 12 3.6 22.52c-.38-.34-.6-.83-.6-1.37V2.85c0-.54.22-1.03.6-1.37z" />
                      <path fill="#FBBC04" d="M17.7 8.78L14.37 12l3.33 3.22 3.75-2.15c.67-.38.67-1.76 0-2.14l-3.75-2.15z" />
                      <path fill="#34A853" d="M14.37 12L3.6 22.52c.45.41 1.13.46 1.69.14l12.41-7.14L14.37 12z" />
                      <path fill="#EA4335" d="M17.7 8.78L5.29 1.64C4.73 1.32 4.05 1.37 3.6 1.78L14.37 12l3.33-3.22z" />
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold leading-none">GET IT ON</span>
                      <span className="text-lg font-black text-gray-900 leading-tight mt-0.5 group-hover:text-primary transition-colors">Google Play</span>
                    </div>
                  </a>

                  {/* Rating / Social Proof */}
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 text-left">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white mt-1">4.9 / 5.0 Rating</span>
                      <span className="text-[10px] text-gray-400">10,000+ Students Enrolled</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Realistic Android CBT Exam Mockup */}
              <div className="lg:col-span-5 flex justify-center relative">
                
                {/* Ambient Behind-Phone Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-amber-500/20 rounded-full blur-[80px] -z-10 scale-90" />

                {/* Floating Glass Badge 1 (Top Left) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="absolute -top-4 -left-4 sm:-left-8 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gray-900/90 border border-white/20 backdrop-blur-xl shadow-2xl"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">100% CBT Simulation</p>
                    <p className="text-[9px] text-gray-400">Timer & Negative Marking</p>
                  </div>
                </motion.div>

                {/* Floating Glass Badge 2 (Bottom Right) */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute -bottom-4 -right-4 sm:-right-6 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gray-900/90 border border-white/20 backdrop-blur-xl shadow-2xl"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">Instant Analysis</p>
                    <p className="text-[9px] text-gray-400">Sectional Marks & Solution</p>
                  </div>
                </motion.div>

                {/* Device Frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="w-[275px] sm:w-[300px] bg-[#0A1128] rounded-[44px] p-3 border-[6px] border-gray-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative"
                >
                  {/* Punch Hole Camera */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border border-gray-800 z-30" />

                  {/* Inner Screen */}
                  <div className="rounded-[34px] overflow-hidden bg-slate-900 text-white border border-white/5 select-none text-left">
                    
                    {/* Status Bar */}
                    <div className="px-6 pt-3 pb-2 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                      <span>4:30 PM</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-emerald-400">5G</span>
                        <div className="w-4 h-2 border border-gray-400 rounded-sm p-0.5 flex items-center">
                          <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                        </div>
                      </div>
                    </div>

                    {/* App Header Inside Phone */}
                    <div className="px-4 py-2.5 bg-primary border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src="/icon.png" alt="GLD" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-bold font-heading text-white tracking-wide">GLD Shikshalaya</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-amber-400">
                        ⚡
                      </div>
                    </div>

                    {/* App Screen Content: Active Exam Room */}
                    <div className="p-3.5 space-y-3 bg-[#0d1630]">
                      
                      {/* Active Test Card */}
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-400/20">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold tracking-wide">
                            ● LIVE EXAM
                          </span>
                          <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-md">
                            ⏱ 58:42
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white mt-1.5 leading-snug">
                          SSC CGL Tier-I Mock #01
                        </h5>
                      </div>

                      {/* Section Tabs */}
                      <div className="flex gap-1.5 overflow-x-hidden text-[10px]">
                        <span className="px-2.5 py-1 rounded-lg bg-primary text-white font-bold whitespace-nowrap border border-white/20">
                          Reasoning
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 whitespace-nowrap">
                          General Awareness
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 whitespace-nowrap">
                          Quant
                        </span>
                      </div>

                      {/* Question Card */}
                      <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 space-y-2">
                        <div className="flex justify-between text-[9px] text-gray-400">
                          <span className="font-bold text-white">Q.4 of 100</span>
                          <span className="text-emerald-400 font-semibold">+2.0 / -0.5</span>
                        </div>
                        <p className="text-[11px] text-gray-200 leading-snug">
                          Select the option that is related to the third term in the same way as the second term:
                        </p>
                        
                        {/* Options */}
                        <div className="space-y-1.5 pt-1">
                          <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-gray-300 flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[9px]">A</span>
                            <span>Aptitude</span>
                          </div>
                          <div className="p-2 rounded-xl bg-primary/40 border border-primary text-[10px] text-white flex items-center justify-between font-semibold shadow-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[9px]">B</span>
                              <span>General Intelligence</span>
                            </div>
                            <span className="text-accent-amber text-xs">✓</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-gray-300 flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[9px]">C</span>
                            <span>Language Comprehension</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex gap-2 pt-1">
                        <button className="flex-1 py-1.5 rounded-xl bg-white/10 text-gray-300 text-[10px] font-semibold">
                          Review
                        </button>
                        <button className="flex-1 py-1.5 rounded-xl bg-primary text-white text-[10px] font-bold shadow-md">
                          Save & Next →
                        </button>
                      </div>

                    </div>

                    {/* Bottom Navigation Home Bar */}
                    <div className="py-2 flex justify-center bg-slate-900">
                      <div className="w-24 h-1 bg-gray-600 rounded-full" />
                    </div>

                  </div>
                </motion.div>

              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;

