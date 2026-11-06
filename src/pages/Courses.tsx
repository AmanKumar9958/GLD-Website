import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Computer,
  Briefcase,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Users,
  ChevronRight,
  MapPin,
  Check,
  LucideIcon
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface CourseItem {
  name: string
  duration: string
  mode: string
  batch: string
  description: string
  curriculum: string[]
  recommendedFor: string
}

interface Category {
  id: string
  title: string
  icon: LucideIcon
  badge: string
  summary: string
  courses: CourseItem[]
}

const courseCategories: Category[] = [
  {
    id: 'academics',
    title: 'School & Foundation',
    icon: BookOpen,
    badge: 'Classes 8th to 12th',
    summary: 'Building unshakeable subject fundamentals with structured classroom guidance, daily problem sets, and board exam simulation.',
    courses: [
      {
        name: 'Class 8th, 9th & 10th (All Subjects Foundation)',
        duration: '1 Academic Year',
        mode: 'Classroom Offline',
        batch: 'Morning & Evening Batches',
        description: 'Comprehensive coverage of Mathematics, Science, Social Sciences, Hindi, and English as per State & CBSE board syllabus.',
        curriculum: [
          'Conceptual Science (Physics, Chemistry, Biology)',
          'High-rigor Mathematics & Algebra foundations',
          'Social Sciences & Map work',
          'Regular weekly chapter tests & parent progress reports'
        ],
        recommendedFor: 'Students seeking 90%+ board results & early competitive foundation'
      },
      {
        name: 'Class 11th & 12th — Science PCB (Physics, Chemistry, Biology)',
        duration: '2 Academic Years',
        mode: 'Classroom Offline',
        batch: 'Special Focus Batches',
        description: 'Targeted coaching for higher secondary board exams alongside early preparation for medical & allied science exams.',
        curriculum: [
          'Detailed Theory + Numerical Problem Solving',
          'NCERT line-by-line concept breakdown',
          'Previous 10 Years solved board questions',
          'Special Sunday revision & doubt-clearing sessions'
        ],
        recommendedFor: 'Medical aspirants and 12th Science board students'
      },
      {
        name: 'Class 11th & 12th — Arts & Humanities Stream',
        duration: '1 to 2 Years',
        mode: 'Classroom Offline',
        batch: 'Enrolling Now',
        description: 'In-depth analytical coaching in History, Political Science, Geography, Economics, and Hindi for academic excellence.',
        curriculum: [
          'Structured answer-writing practice for high board scores',
          'Constitutional & historical timeline mastery',
          'Map point plotting & case studies',
          'Personality & presentation development'
        ],
        recommendedFor: 'Arts stream students & civil services foundation builders'
      }
    ]
  },
  {
    id: 'competitive',
    title: 'Competitive Exams & CBT',
    icon: Briefcase,
    badge: 'Government & Judicial',
    summary: 'Intensive preparation with exam-focused short tricks, comprehensive GS notes, English comprehension, and daily computer-based mock tests.',
    courses: [
      {
        name: 'Supreme Court & High Court Recruitment (JCA & Clerk)',
        duration: '6 to 9 Months',
        mode: 'Classroom + CBT Portal',
        batch: 'Dedicated Court Batch',
        description: 'Comprehensive syllabus targeting General English, Legal Aptitude, General Awareness, and Typing/Computer tests.',
        curriculum: [
          'High Court & Supreme Court PYQ analysis',
          'Legal terminology & constitutional GK',
          'Full-length computer based mock tests with rank analysis',
          'Typing speed evaluation & guidance'
        ],
        recommendedFor: 'Court assistant, clerk, and judicial service aspirants'
      },
      {
        name: 'SSC Target Series (CGL, CHSL, MTS & GD)',
        duration: '8 to 12 Months',
        mode: 'Classroom + CBT Portal',
        batch: 'Morning / Afternoon',
        description: 'Systematic modular coverage of Quantitative Aptitude, Logical Reasoning, General Awareness, and English.',
        curriculum: [
          'Arithmetic & Advanced Maths speed methods',
          'Reasoning tricks for fast execution',
          'Static GK & monthly current affairs compilations',
          'Sectional and full CBT Tier-1 & Tier-2 mock drills'
        ],
        recommendedFor: 'SSC government job aspirants aiming for top percentiles'
      },
      {
        name: 'Banking & Railway Examinations (PO, Clerk & NTPC)',
        duration: '6 Months',
        mode: 'Classroom + CBT Portal',
        batch: 'Fast-Track',
        description: 'High-speed problem solving, Data Interpretation, Banking Awareness, and General Science for Railways.',
        curriculum: [
          'Data Interpretation & Calculation shortcuts',
          'Financial & Banking terms masterclass',
          'Railway General Science (Physics & Chemistry modules)',
          'Speed accuracy drills'
        ],
        recommendedFor: 'IBPS, SBI, and RRB aspirants'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Practical Skills & Tech',
    icon: Computer,
    badge: 'Job Skills',
    summary: 'Industry-standard computer software education, hands-on lab practice, government-recognized diploma certifications, and professional fluency.',
    courses: [
      {
        name: 'Computer Applications & Office Suite (DCA / ADCA)',
        duration: '6 to 12 Months',
        mode: 'Lab Hands-on + Hybrid',
        batch: 'Multiple Batches Daily',
        description: 'Master fundamentals of computers, Microsoft Office (Word, Excel, PowerPoint), Internet operations, and basic accounting/typing.',
        curriculum: [
          'Operating Systems, Hardware fundamentals & Windows OS',
          'Advanced MS Excel (Formulas, Pivot Tables & Data Entry)',
          'Hindi & English touch typing certification',
          'Basic DTP, Canva & Web fundamentals'
        ],
        recommendedFor: 'Job seekers, students, and office administration candidates'
      },
      {
        name: 'Spoken English & Professional Communication',
        duration: '3 Months',
        mode: 'Interactive Classroom',
        batch: 'Evening Special',
        description: 'Overcome stage fear, build fluent speaking habits, expand practical vocabulary, and master interview etiquette.',
        curriculum: [
          'Daily speaking drills & group discussions',
          'Grammar clarity without memorization confusion',
          'Accent softening & clear pronunciation',
          'Mock interview simulations & resume preparation'
        ],
        recommendedFor: 'College students, job interviewees, and young professionals'
      }
    ]
  }
]

const features = [
  {
    icon: ShieldCheck,
    title: 'Strict Quality Standards',
    desc: 'Every lecture is structured with clear learning objectives and verified topic checklists.'
  },
  {
    icon: Users,
    title: 'Mentors Who Know You',
    desc: 'Small batch sizes so teachers can personally track your progress and solve your doubts.'
  },
  {
    icon: Sparkles,
    title: 'Integrated CBT Test Series',
    desc: 'Competitive students get full access to our online mock testing portal and analytics engine.'
  },
  {
    icon: MapPin,
    title: 'Central Offline Campus',
    desc: 'Well-equipped air-conditioned classrooms, dedicated computer lab, and peaceful study atmosphere.'
  }
]

const Courses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('academics')

  const currentCategory = courseCategories.find((c) => c.id === activeTab) || courseCategories[0]
  const CategoryIcon = currentCategory.icon

  return (
    <div className="min-h-screen bg-paper-light text-slate-900 pt-20 sm:pt-24 pb-16 md:pb-0">
      {/* ── HEADER SECTION ── */}
      <section className="relative py-12 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="badge-navy mb-4">
              <GraduationCap className="w-3.5 h-3.5 text-accent-gold" />
              <span>ACADEMIC CATALOG 2026</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-slate-950 tracking-tight leading-tight">
              Curriculum Built for True Competence
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
              Explore our structured coaching programs across school education, competitive government examinations, and practical vocational technologies.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTER TABS (Mobile Kinetic Touch Scroll) ── */}
      <section className="sticky top-[58px] sm:top-[68px] z-30 bg-paper-light/95 backdrop-blur-md py-3.5 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {courseCategories.map((cat) => {
              const isActive = activeTab === cat.id
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-dark text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-accent-gold' : 'text-slate-500'} />
                  <span>{cat.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cat.courses.length}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── COURSE LISTINGS (Maven Architecture) ── */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-subtle mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <CategoryIcon size={24} className="text-accent-gold" />
                </div>
                <div>
                  <span className="text-xs font-bold text-accent-gold uppercase tracking-wider">
                    {currentCategory.badge}
                  </span>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-950 mt-0.5">
                    {currentCategory.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    {currentCategory.summary}
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-gold text-white font-bold text-xs tracking-wide hover:bg-amber-600 transition-colors shadow-sm self-start md:self-auto"
              >
                <span>Book Batch Inquiry</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Detailed Course Cards */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {currentCategory.courses.map((course, idx) => (
                <motion.div
                  key={course.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="academic-card p-6 sm:p-8 flex flex-col lg:flex-row gap-6 justify-between items-start"
                >
                  {/* Left: Course Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-md font-bold bg-slate-100 text-slate-800">
                        {course.duration}
                      </span>
                      <span className="px-2.5 py-1 rounded-md font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {course.mode}
                      </span>
                      <span className="px-2.5 py-1 rounded-md font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                        {course.batch}
                      </span>
                    </div>

                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 leading-snug">
                      {course.name}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
                      {course.description}
                    </p>

                    {/* Key Modules */}
                    <div className="pt-2">
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Core Syllabus & Features:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        {course.curriculum.map((c, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-slate-500">
                      <strong className="text-slate-700">Recommended for: </strong>
                      {course.recommendedFor}
                    </div>
                  </div>

                  {/* Right: Quick Action Widget */}
                  <div className="w-full lg:w-64 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between self-stretch">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        Offline Classroom
                      </p>
                      <h4 className="font-heading font-bold text-base text-slate-900 mt-1">
                        Limited Seats Per Batch
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Enrollment is subject to interview & seat availability.
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link
                        to="/contact"
                        className="w-full py-2.5 rounded-xl bg-primary-dark text-white font-bold text-xs text-center block hover:bg-primary transition-colors shadow-2xs"
                      >
                        Enroll in this Course
                      </Link>
                      <Link
                        to="/tests"
                        className="w-full py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs text-center block hover:bg-slate-100 transition-colors"
                      >
                        Practice CBT Mock
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── INSTITUTION QUALITY PILLARS ── */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-950 tracking-tight">
              Our Academic Commitments
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Every course at GLD Shikshalaya is anchored in disciplined instruction and measurable student progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div key={idx} className="p-6 rounded-2xl bg-paper-light border border-slate-200/80">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-accent-gold flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-slate-900 mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION ── */}
      <section className="py-16 bg-paper-warm text-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-slate-950 tracking-tight">
            Need Guidance Choosing the Right Batch?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Our experienced counselors are available for in-person campus visits and telephonic consultations.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary-dark text-white font-bold text-xs tracking-wide shadow-md hover:bg-primary transition-all"
            >
              <span>Schedule Free Counseling</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Courses