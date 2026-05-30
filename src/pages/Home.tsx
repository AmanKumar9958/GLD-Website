import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Computer, Briefcase, GraduationCap, Users, Award, Clock, CheckCircle, ChevronRight, Play } from 'lucide-react'
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

    </div>
  )
}

export default Home
