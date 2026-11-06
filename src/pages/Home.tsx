import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Computer,
  Briefcase,
  GraduationCap,
  Users,
  Award,
  Clock,
  CheckCircle2,
  ChevronRight,
  Play,
  Smartphone,
  Star,
  Zap,
  Bell,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  FileText
} from 'lucide-react'
import { fetchPublishedTests } from '../services/testService'
import { MockTest } from '../types/test'

const courseCategories = [
  {
    id: 'academics',
    index: '01',
    icon: BookOpen,
    title: 'Academic Foundation',
    badge: 'Classes 8th to 12th',
    desc: 'Uncompromising conceptual grounding in School Boards, Science (PCB), and Arts with structured daily problem-solving.',
    highlights: ['Class 8th–10th All Subjects', 'Class 11th & 12th PCB (Medical/Board)', 'Class 11th & 12th Arts Stream'],
    accent: '#2563EB',
    bgBadge: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    id: 'competitive',
    index: '02',
    icon: Briefcase,
    title: 'Competitive Exams & CBT',
    badge: 'Job & Court Aspirants',
    desc: 'Targeted preparation for High Court, Supreme Court, SSC, Banking, and State PSCs with authentic CBT mock series.',
    highlights: ['Supreme Court & High Court Exams', 'SSC CGL, CHSL, MTS & GD', 'Banking, Railways & State PSCs'],
    accent: '#D97706',
    bgBadge: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  {
    id: 'technical',
    index: '03',
    icon: Computer,
    title: 'Practical & Tech Skills',
    badge: 'Career Readiness',
    desc: 'Empowering students with hands-on digital literacy, DCA/ADCA certifications, and spoken English confidence.',
    highlights: ['Computer Applications (DCA / ADCA)', 'Spoken English & Communication', 'Professional Personality Building'],
    accent: '#059669',
    bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
]

const stats = [
  { value: '500+', label: 'Students Mentored', desc: 'Across School & Competitive streams' },
  { value: '10+', label: 'Years of Legacy', desc: 'Consistent guidance in academic excellence' },
  { value: '100%', label: 'Real CBT Accuracy', desc: 'Identical UI to official government test portals' },
  { value: '4.9/5', label: 'Student Rating', desc: 'Trusted by parents and exam aspirants' },
]

const bentoFeatures = [
  {
    tag: '01 / METHODOLOGY',
    title: 'Concept-First Pedagogy',
    desc: 'We strictly reject rote memorization. Every concept is broken down from foundational first principles to advanced application.',
    icon: Award,
    span: 'lg:col-span-6'
  },
  {
    tag: '02 / TECHNOLOGY',
    title: 'Authentic CBT Examination Engine',
    desc: 'Train under realistic exam pressure. Real-time countdown timer, negative marking calculation, sectional switching, and comprehensive solution keys.',
    icon: Zap,
    span: 'lg:col-span-6'
  },
  {
    tag: '03 / MENTORSHIP',
    title: 'Small Batches & Individual Care',
    desc: 'Limited batch capacity ensures our educators know every student by name, monitoring individual weak areas and pace.',
    icon: Users,
    span: 'lg:col-span-4'
  },
  {
    tag: '04 / RESOURCES',
    title: 'Curated Study Modules',
    desc: 'Concise, high-yield study material, formula sheets, previous year solved papers, and regular weekend revision modules.',
    icon: BookOpen,
    span: 'lg:col-span-4'
  },
  {
    tag: '05 / ACCESSIBILITY',
    title: 'Offline Campus + Android App',
    desc: 'Attend interactive in-person lectures at our campus or practice mock tests anywhere on our native Android mobile application.',
    icon: Smartphone,
    span: 'lg:col-span-4'
  }
]

const testimonials = [
  {
    quote: 'The CBT mock test interface on GLD is exactly like the actual Supreme Court and SSC exams. It helped me eliminate my exam anxiety and improve my speed significantly.',
    author: 'Priya Kumari',
    target: 'Supreme Court JCA Aspirant',
    rating: 5
  },
  {
    quote: 'GLD teachers make complex Physics and Biology concepts so easy to understand for Class 12th. The personal attention in small batches is something you never get in giant coaching factories.',
    author: 'Rahul Sharma',
    target: 'Class 12th (PCB Board Topper)',
    rating: 5
  },
  {
    quote: 'Joined the Computer Applications and English Speaking course. The practical computer sessions gave me the confidence I needed for my office job interviews.',
    author: 'Ankit Kumar',
    target: 'DCA & Spoken English Graduate',
    rating: 5
  }
]

const Home: React.FC = () => {
  const [featuredTests, setFeaturedTests] = useState<MockTest[]>([])
  const [loadingTests, setLoadingTests] = useState(true)

  useEffect(() => {
    async function getTests() {
      try {
        const tests = await fetchPublishedTests()
        setFeaturedTests(tests.slice(0, 3))
      } catch (err) {
        console.error('Error fetching tests for homepage:', err)
      } finally {
        setLoadingTests(false)
      }
    }
    getTests()
  }, [])

  return (
    <div className="min-h-screen bg-paper-light text-slate-900 pt-20 sm:pt-24 pb-16 md:pb-0">
      {/* ── 1. HERO SECTION (Editorial Power & Institutional Prestige) ── */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-slate-200/80">
        {/* Subtle Architectural Grid Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-100 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" />
              <span>GLD Shikshalaya &bull; Premier Academy & CBT Testing Center</span>
            </motion.div>

            {/* Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl text-slate-950 tracking-tight leading-[1.08] mb-6"
            >
              Where Academic Foundation Meets{' '}
              <span className="underline decoration-accent-amber decoration-wavy decoration-from-font underline-offset-6">
                Competitive Mastery
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            >
              Proven academic coaching for 8th–12th boards, high-stakes government exam CBT mock tests, and practical tech certifications built to elevate student careers.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
            >
              <Link
                to="/tests"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary-dark text-white font-bold text-sm tracking-wide shadow-premium hover:bg-primary transition-all duration-200 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-accent-gold" />
                <span>Explore Mock Test Series</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  CBT LIVE
                </span>
              </Link>

              <Link
                to="/courses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-800 font-bold text-sm tracking-wide border border-slate-300/80 shadow-subtle hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                <span>Browse All Courses</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </Link>
            </motion.div>
          </div>

          {/* Proof Bar (BZI Swiss Minimal Grid) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 sm:mt-20 pt-8 border-t border-slate-200/90 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col text-center sm:text-left">
                <span className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {stat.label}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                  {stat.desc}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. REFORGE-STYLE CBT MOCK TEST SPOTLIGHT ── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="badge-gold mb-3">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>ONLINE EXAMINATION PORTAL</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
                All-India CBT Mock Test Series
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                Experience the identical interface used in official government recruitment exams with timed question palettes, sectional cutoffs, and in-depth performance analytics.
              </p>
            </div>

            <Link
              to="/tests"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:text-accent-gold transition-colors"
            >
              <span>View All Available Mock Tests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingTests ? (
              // Loading Skeleton
              [1, 2, 3].map((i) => (
                <div key={i} className="academic-card p-6 animate-pulse space-y-4">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-10 bg-slate-200 rounded-xl" />
                </div>
              ))
            ) : featuredTests.length > 0 ? (
              featuredTests.map((test) => (
                <div
                  key={test.id}
                  className="academic-card p-6 sm:p-7 flex flex-col justify-between group hover:border-slate-300"
                >
                  <div>
                    {/* Header: Category & Difficulty */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {test.category || 'General'}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {test.is_free ? 'Free Mock' : `₹${test.price}`}
                      </span>
                    </div>

                    {/* Test Title */}
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-primary transition-colors leading-snug mb-2">
                      {test.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">
                      {test.description || 'Full-length computer based examination simulating the actual exam syllabus and time limit.'}
                    </p>

                    {/* Meta Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-6 text-center">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Time</span>
                        <span className="text-xs font-bold text-slate-800">{test.duration_minutes} Mins</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Marks</span>
                        <span className="text-xs font-bold text-slate-800">{test.total_marks}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Negative</span>
                        <span className="text-xs font-bold text-slate-800">{test.negative_marks > 0 ? `-${test.negative_marks}` : 'None'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/tests/${test.id}`}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white hover:bg-primary font-bold text-xs tracking-wider uppercase text-center transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <span>Attempt Mock Test</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent-gold" />
                  </Link>
                </div>
              ))
            ) : (
              // Fallback Default Mock Cards if no DB tests yet
              [
                { title: 'Supreme Court JCA Mock Test #01', cat: 'Court Exams', time: '120 Mins', marks: '100' },
                { title: 'SSC CGL Tier-1 Full Length Mock', cat: 'SSC', time: '60 Mins', marks: '200' },
                { title: 'Patna High Court Clerk Practice Test', cat: 'High Court', time: '90 Mins', marks: '100' },
              ].map((item, idx) => (
                <div key={idx} className="academic-card p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                        {item.cat}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Full Syllabus
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Comprehensive test series with detailed bilingual solutions, rank analysis, and accuracy tracking.
                    </p>
                  </div>
                  <Link
                    to="/tests"
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs text-center uppercase"
                  >
                    Start Free Mock
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 3. MAVEN-STYLE COURSE PATHWAYS (The 3 Educational Pillars) ── */}
      <section className="py-16 sm:py-24 bg-paper-light border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="badge-navy mb-3">
              <BookOpen className="w-3.5 h-3.5 text-accent-amber" />
              <span>STRUCTURED ACADEMIC STREAMS</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
              Educational Programs Tailored for Ambition
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              From school foundation batches to competitive exam accelerators and digital computer skills, our programs provide rigorous curriculum coverage with verified offline mentoring.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {courseCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <div
                  key={cat.id}
                  className="academic-card p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Subtle Number Watermark */}
                  <div className="absolute top-4 right-6 font-heading font-black text-6xl text-slate-100 select-none pointer-events-none">
                    {cat.index}
                  </div>

                  <div>
                    {/* Category Icon & Pill */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                        <Icon size={24} className="text-accent-gold" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cat.bgBadge}`}>
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-2xl text-slate-900 mb-3">
                      {cat.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {cat.desc}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-2.5 mb-8">
                      {cat.highlights.map((item) => (
                        <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <Link
                    to="/courses"
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 text-xs sm:text-sm font-bold text-slate-900 hover:text-primary transition-colors group"
                  >
                    <span>View Full Syllabus & Timings</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 4. SECTION-STYLE BENTO GRID: THE GLD PEDAGOGY DIFFERENCE ── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">
              INSTITUTIONAL RIGOR
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-950 tracking-tight mt-2">
              Why Serious Students Choose GLD
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              We combine deep subject mastery with high-technology exam tools, giving students an unshakeable competitive edge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {bentoFeatures.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  className={`academic-card p-7 sm:p-8 flex flex-col justify-between ${feat.span} bg-slate-50/50 hover:bg-white`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold font-mono text-slate-400 tracking-wider">
                        {feat.tag}
                      </span>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-primary-dark shadow-2xs">
                        <Icon className="w-5 h-5 text-accent-gold" />
                      </div>
                    </div>
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 mb-2">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-3">
                    {feat.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 5. ANDROID APP SPOTLIGHT (Preserved & Enhanced Mockup) ── */}
      <section className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>OFFICIAL ANDROID APP &bull; GOOGLE PLAY</span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Practice Real CBT Tests On The Move
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Download the official GLD Shikshalaya app to take full-length mock tests, review sectional question solutions, watch lecture recordings, and track your All-India rank anytime.
              </p>

              {/* 4 Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-left">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-accent-gold" />
                    <span>Real-Time Exam Engine</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">Official timer, negative marking & question palette</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant Score Breakdown</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">Detailed answer key with step-by-step reasoning</p>
                </div>
              </div>

              {/* Google Play CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.solostackdev.gldshikshalaya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3.5 bg-white hover:bg-slate-100 text-slate-950 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                >
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.6 1.48L14.37 12 3.6 22.52c-.38-.34-.6-.83-.6-1.37V2.85c0-.54.22-1.03.6-1.37z" />
                    <path fill="#FBBC04" d="M17.7 8.78L14.37 12l3.33 3.22 3.75-2.15c.67-.38.67-1.76 0-2.14l-3.75-2.15z" />
                    <path fill="#34A853" d="M14.37 12L3.6 22.52c.45.41 1.13.46 1.69.14l12.41-7.14L14.37 12z" />
                    <path fill="#EA4335" d="M17.7 8.78L5.29 1.64C4.73 1.32 4.05 1.37 3.6 1.78L14.37 12l3.33-3.22z" />
                  </svg>
                  <div className="text-left">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">GET IT ON</span>
                    <span className="text-base font-extrabold text-slate-900 leading-tight">Google Play</span>
                  </div>
                </a>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-slate-300">
                  <div className="flex text-amber-400">
                    {'★★★★★'}
                  </div>
                  <span className="font-bold">4.9 / 5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[270px] sm:w-[290px] bg-slate-900 rounded-[44px] p-2.5 border-[5px] border-slate-700 shadow-2xl relative">
                {/* Punch Hole */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full border border-slate-700 z-30" />

                <div className="rounded-[34px] overflow-hidden bg-slate-950 text-white select-none text-left p-3.5 space-y-3">
                  <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400">
                    <span>10:30 AM</span>
                    <span className="text-emerald-400 font-bold">5G &bull; 98%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-red-400 font-bold">● LIVE CBT</span>
                      <span className="font-mono text-amber-300">⏱ 45:12</span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1">Supreme Court JCA Mock #01</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
                    <span className="text-[10px] text-slate-400">Question 14 of 100</span>
                    <p className="text-slate-200 text-[11px] leading-snug">
                      Which article of the Constitution provides for the independence of the Judiciary?
                    </p>
                    <div className="space-y-1.5 pt-1">
                      <div className="p-2 rounded-lg bg-slate-800/80 text-[10px] text-slate-300">Article 50</div>
                      <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/60 text-[10px] text-emerald-300 font-bold flex justify-between">
                        <span>Article 214</span>
                        <span>✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 text-center">
                    <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. DESIGNLAB-STYLE AUTHENTIC TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">
              REAL EXPERIENCES
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight mt-2">
              Words From Our Achievers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="academic-card p-7 sm:p-8 flex flex-col justify-between bg-paper-light hover:bg-white"
              >
                <div>
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60">
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    {t.author}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500">
                    {t.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. BZI-STYLE INSTITUTIONAL CLOSING CTA ── */}
      <section className="py-16 sm:py-20 bg-paper-warm text-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Build Your Academic & Career Trajectory
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Visit our physical campus for personalized academic counseling, or register online to begin your CBT mock test practice right now.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-dark text-white font-bold text-sm shadow-md hover:bg-primary transition-all"
            >
              Book Free Counseling / Visit Us
            </Link>
            <Link
              to="/tests"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs hover:bg-slate-50 transition-all"
            >
              Start Free Mock Test
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home