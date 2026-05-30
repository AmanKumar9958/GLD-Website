import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Computer, Briefcase, CheckCircle, Clock, GraduationCap, Compass, ChevronRight, Play, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const courseCategories = [
  {
    id: 'academics',
    icon: BookOpen,
    title: "Academic Courses",
    accent: 'bg-primary',
    textColor: 'text-primary',
    gradient: 'from-blue-600 to-indigo-900',
    description: "Strong foundation classes with disciplined guidance and regular assessments.",
    courses: [
      { name: "8th-10th All subjects", duration: "1 Year", mode: "Offline" },
      { name: "11th & 12th PCB", duration: "1-2 Years", mode: "Offline" },
      { name: "11th & 12th Arts", duration: "1-2 Years", mode: "Offline" }
    ]
  },
  {
    id: 'technical',
    icon: Computer,
    title: "Technical Courses",
    accent: 'bg-accent-cyan',
    textColor: 'text-accent-cyan',
    gradient: 'from-emerald-500 to-teal-800',
    description: "Future-ready skills with hands-on sessions and project based learning.",
    courses: [
      { name: "Computer Applications", duration: "6 Months", mode: "Hybrid" },
      { name: "Spoken English & Personality", duration: "3 Months", mode: "Hybrid" }
    ]
  },
  {
    id: 'competitive',
    icon: Briefcase,
    title: "Competitive Courses",
    accent: 'bg-accent-amber',
    textColor: 'text-accent-amber',
    gradient: 'from-amber-500 to-red-700',
    description: "Mentorship-driven preparation for banking, SSC, railways and state services.",
    courses: [
      { name: "Banking (PO/Clerk)", duration: "6-12 Months", mode: "Offline" },
      { name: "SSC (CGL/CHSL)", duration: "8-12 Months", mode: "Offline" },
      { name: "Railway (NTPC/Group D)", duration: "6 Months", mode: "Offline" },
      { name: "UPSC / State PSCs", duration: "1-2 Years", mode: "Offline" },
      { name: "Delhi Police / UP Police", duration: "6 Months", mode: "Offline" },
      { name: "DSSSB", duration: "6 Months", mode: "Offline" }
    ]
  }
]

const highlights = [
  { icon: CheckCircle, title: 'Structured Roadmaps', desc: 'Topic-wise plans, revision loops and doubt clearance built into every batch.' },
  { icon: Clock, title: 'Flexible Timings', desc: 'Morning, afternoon and evening options to balance school, college or work.' },
  { icon: GraduationCap, title: 'Result Focused', desc: 'Progress tracking, mock tests and personalized feedback from mentors.' },
  { icon: Compass, title: 'Guided Counselling', desc: 'Course and career guidance to help you choose the right path with confidence.' },
]

const Courses: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(courseCategories[0].id)

  const activeData = courseCategories.find(c => c.id === activeCategory)!
  const ActiveIcon = activeData.icon

  return (
    <div className="flex-grow overflow-x-hidden bg-gray-50">
      
      {/* ── HERO ── */}
      <section className="relative bg-primary-dark pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-amber/10 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-[80px] transform -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-accent-amber px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6"
            >
              Our Programs
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-black text-white leading-tight mb-6"
            >
              Learning paths to turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-red-light">ambition</span> into achievement.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-10"
            >
              Choose from academics, technical or competitive tracks, each crafted with expert mentoring, robust assessments and hands-on learning.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/contact"
                className="inline-flex items-center gap-3 bg-white text-primary-dark px-8 py-4 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
              >
                Book Free Counselling
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COURSES NAV & DETAILS ── */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-primary-dark mb-4">Explore Streams</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Select a category to view detailed course offerings and syllabi.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 flex flex-col gap-3">
                {courseCategories.map((cat) => {
                  const isActive = activeCategory === cat.id
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 ${
                        isActive 
                          ? 'bg-white shadow-xl border border-gray-100 scale-105 z-10' 
                          : 'bg-transparent border border-transparent hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isActive ? cat.accent : 'bg-gray-100'
                      }`}>
                        <Icon size={24} className={isActive ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <div>
                        <h3 className={`font-heading font-bold text-lg ${isActive ? 'text-primary-dark' : 'text-gray-600'}`}>
                          {cat.title}
                        </h3>
                        <p className="text-sm text-gray-500">{cat.courses.length} Courses</p>
                      </div>
                      {isActive && (
                        <ChevronRight size={20} className="ml-auto text-gray-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${activeData.gradient}`}>
                    <ActiveIcon size={32} className="text-white" />
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-heading font-black text-primary-dark mb-4">
                    {activeData.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                    {activeData.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {activeData.courses.map((course, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={course.name} 
                        className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
                      >
                        <h4 className="font-bold text-gray-900 text-xl mb-4 group-hover:text-primary transition-colors">{course.name}</h4>
                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-gray-200">
                            <Clock size={16} /> {course.duration}
                          </span>
                          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md border border-gray-200">
                            <CheckCircle size={16} /> {course.mode}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── HOW WE TEACH ── */}
      <section className="bg-primary-dark py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block text-sm font-bold tracking-widest uppercase mb-3 text-accent-cyan">
              Methodology
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">Designed for Outcomes</h2>
            <p className="text-lg text-gray-300">We mix classroom energy with modern learning tools to make every session count.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-cyan to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-[3rem] p-10 md:p-16 border border-gray-200 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-amber/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-heading font-black text-primary-dark mb-6">Ready to start your journey?</h3>
              <p className="text-lg text-gray-600 mb-10">
                Speak with our counsellors to create a learning plan tailored to your timeline and goals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-full font-bold text-white bg-primary hover:bg-primary-dark shadow-lg transition-transform hover:scale-105"
                >
                  Book a Call
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 rounded-full font-bold text-primary-dark border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Learn about GLD
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Courses
