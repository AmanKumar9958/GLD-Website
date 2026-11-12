import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  Award,
  HelpCircle,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  History,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  ShieldCheck
} from 'lucide-react'
import { fetchPublishedTests, fetchStudentAttempts } from '../../services/testService'
import { MockTest, TestAttempt } from '../../types/test'
import { useAuth } from '../../context/AuthContext'

export const TestList: React.FC = () => {
  const navigate = useNavigate()
  const { user, openAuthModal } = useAuth()

  const [tests, setTests] = useState<MockTest[]>([])
  const [attempts, setAttempts] = useState<TestAttempt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const testsData = await fetchPublishedTests()
        setTests(testsData)

        if (user) {
          const attemptsData = await fetchStudentAttempts(user.id)
          setAttempts(attemptsData)
        }
      } catch (err) {
        console.error('Failed to load tests:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [user])

  // Categories with counts
  const categories = useMemo(() => {
    const map = new Map<string, number>()
    map.set('All', tests.length)
    tests.forEach((t) => {
      const cat = t.category || 'General'
      map.set(cat, (map.get(cat) || 0) + 1)
    })
    return Array.from(map.entries())
  }, [tests])

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory
      const matchSearch =
        !searchQuery.trim() ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [tests, selectedCategory, searchQuery])

  // Quick map of testId -> best attempt
  const attemptMap = useMemo(() => {
    const map: Record<string, TestAttempt> = {}
    attempts.forEach((a) => {
      if (!map[a.test_id] || a.score > map[a.test_id].score) {
        map[a.test_id] = a
      }
    })
    return map
  }, [attempts])

  // Chronological attempt order per test_id to identify reattempts
  const attemptOrderMap = useMemo(() => {
    const map: Record<string, { attemptNumber: number; totalAttempts: number; isReattempt: boolean }> = {}
    const grouped: Record<string, TestAttempt[]> = {}

    attempts.forEach((a) => {
      if (!grouped[a.test_id]) grouped[a.test_id] = []
      grouped[a.test_id].push(a)
    })

    Object.values(grouped).forEach((group) => {
      const sorted = [...group].sort(
        (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      )
      const total = sorted.length
      sorted.forEach((att, index) => {
        map[att.id] = {
          attemptNumber: index + 1,
          totalAttempts: total,
          isReattempt: index > 0,
        }
      })
    })

    return map
  }, [attempts])

  const handleStartTest = (test: MockTest) => {
    if (!user) {
      openAuthModal()
      return
    }
    navigate(`/tests/${test.id}`)
  }

  return (
    <div className="min-h-screen bg-paper-light text-slate-900 pt-20 sm:pt-24 pb-20 md:pb-12">
      {/* ── HEADER / BANNER ── */}
      <section className="relative py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="badge-gold mb-3.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
              <span>OFFICIAL CBT SIMULATION ENGINE</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
              All-India Mock Test Series
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Timed computer-based examinations adhering strictly to current government recruiting patterns. Features negative marking, real-time question palette, and bilingual solution explanations.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTROLS & TEST CATALOG ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Horizontal Category Scroll (Mobile Thumb-Zone) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map(([cat, count]) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-dark text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests by keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs"
            />
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="academic-card p-6 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-16 bg-slate-100 rounded-xl" />
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && filteredTests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-subtle max-w-xl mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-slate-900">No Tests Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery
                ? `No tests match your search "${searchQuery}". Please try another keyword.`
                : 'There are currently no published tests in this category. New tests are uploaded weekly!'}
            </p>
          </div>
        )}

        {/* TEST CARDS GRID (Reforge Data-Density) */}
        {!isLoading && filteredTests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => {
              const previousAttempt = attemptMap[test.id]

              return (
                <div
                  key={test.id}
                  className="academic-card p-6 sm:p-7 flex flex-col justify-between group"
                >
                  <div>
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {test.category || 'General'}
                      </span>
                      {test.is_free ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Free Mock
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          ₹{test.price}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-primary transition-colors leading-snug mb-2">
                      {test.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-5 min-h-[32px]">
                      {test.description || 'Full-length computer based examination simulating the actual exam syllabus and time limit.'}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-xl border border-slate-100 text-center mb-4">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Time</span>
                        <span className="text-xs font-bold text-slate-800">{test.duration_minutes} Mins</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Marks</span>
                        <span className="text-xs font-bold text-slate-800">{test.total_marks}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Questions</span>
                        <span className="text-xs font-bold text-slate-800">{test.questions_count ?? 'Full'}</span>
                      </div>
                    </div>

                    {/* Previous Attempt Summary if Available */}
                    {previousAttempt && (
                      <div className="mb-4 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Last Score:</span>
                          <span className="font-bold">{previousAttempt.score}/{test.total_marks}</span>
                        </div>
                        <Link
                          to={`/tests/result/${previousAttempt.id}`}
                          className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center"
                        >
                          Review <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full py-3 px-4 rounded-xl bg-primary-dark hover:bg-primary text-white font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-2xs hover:shadow-md active:scale-98"
                  >
                    <span>{previousAttempt ? 'Retake Examination' : 'Start Mock Test'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-accent-gold" />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* RECENT ATTEMPTS TABLE (If user logged in & has attempts) */}
        {user && attempts.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-50 text-accent-gold">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-slate-900">
                    Your Examination History
                  </h3>
                  <p className="text-xs text-slate-500">
                    {attempts.length} Attempt(s) recorded in your student account
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Test Title</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Correct / Incorrect</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Solutions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.slice(0, 10).map((att) => {
                    const testObj = tests.find((t) => t.id === att.test_id)
                    const isAvailable = Boolean(testObj && testObj.is_published)
                    const attemptInfo = attemptOrderMap[att.id]
                    const isReattempt = attemptInfo?.isReattempt ?? false

                    return (
                      <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="truncate">{testObj?.title || 'Archived / Deleted Test'}</span>
                            {isReattempt && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider shrink-0">
                                Reattempt
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {att.score} <span className="text-slate-400 font-normal">/{att.total_marks}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <span className="text-emerald-700 font-bold">+{att.correct_count}</span>
                          {' / '}
                          <span className="text-red-600 font-bold">-{att.incorrect_count}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                            {att.accuracy_percentage}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(att.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isAvailable ? (
                            <Link
                              to={`/tests/result/${att.id}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white font-semibold transition-colors text-[11px]"
                            >
                              View Analysis
                            </Link>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-400 text-[11px] font-medium select-none">
                              Expired
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}