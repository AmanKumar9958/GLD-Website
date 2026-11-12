import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  Award,
  HelpCircle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  History,
  Lock,
  ChevronRight,
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

  // Categories
  const categories = useMemo(() => {
    const set = new Set(['All'])
    tests.forEach((t) => {
      if (t.category) set.add(t.category)
    })
    return Array.from(set)
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

  const handleStartTest = (test: MockTest) => {
    if (!user) {
      openAuthModal('login')
      return
    }
    navigate(`/tests/${test.id}`)
  }

  return (
    <div className="flex-grow overflow-x-hidden bg-gray-50 pb-20">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-primary-dark via-primary to-[#0f1e5c] text-white pt-36 pb-20 px-6 md:px-12 mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Glow accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-amber/10 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-DEFAULT/10 rounded-full blur-[80px] transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-accent-gold"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            <span>Real Exam Simulation • CBT Interface</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight text-white"
          >
            GLD All-India Mock Test Series
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto"
          >
            Practice standard computer-based tests with exact exam timers, negative marking, sectional breakdown, and detailed question-by-question solutions.
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* FILTERS & SEARCH BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-primary/20 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests by title..."
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* LOADING SKELETON */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-16 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && filteredTests.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No Mock Tests Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              {searchQuery
                ? `No tests match your search "${searchQuery}". Try a different keyword.`
                : 'There are no active mock tests in this category right now. Check back soon!'}
            </p>
          </div>
        )}

        {/* TEST CARDS GRID */}
        {!isLoading && filteredTests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => {
              const previousAttempt = attemptMap[test.id]

              return (
                <motion.div
                  key={test.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Top Row: Category + Free badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-primary uppercase tracking-wider border border-blue-100">
                        {test.category || 'General'}
                      </span>
                      {test.is_free ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Free Test
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          ₹{test.price}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-gray-900 font-heading line-clamp-1 mb-1.5">
                      {test.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
                      {test.description || 'Comprehensive exam pattern practice test with detailed analytical report and solution explanations.'}
                    </p>

                    {/* Meta Specs: Duration, Marks, Questions */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-gray-50 rounded-xl text-center border border-gray-100">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Time</span>
                        </div>
                        <div className="font-bold text-xs text-gray-900 mt-0.5">
                          {test.duration_minutes} Mins
                        </div>
                      </div>

                      <div className="border-x border-gray-200">
                        <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px]">
                          <Award className="w-3 h-3 text-primary" />
                          <span>Marks</span>
                        </div>
                        <div className="font-bold text-xs text-gray-900 mt-0.5">
                          {test.total_marks}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-center gap-1 text-gray-400 text-[10px]">
                          <HelpCircle className="w-3 h-3 text-emerald-600" />
                          <span>Questions</span>
                        </div>
                        <div className="font-bold text-xs text-gray-900 mt-0.5">
                          {test.questions_count ?? 0} Qs
                        </div>
                      </div>
                    </div>

                    {/* Previous Attempt Summary if any */}
                    {previousAttempt && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Last Score:</span>
                          <span className="font-bold">{previousAttempt.score}/{test.total_marks}</span>
                        </div>
                        <Link
                          to={`/tests/result/${previousAttempt.id}`}
                          className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center"
                        >
                          View Solutions <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-6 pb-6 pt-2">
                    <button
                      onClick={() => handleStartTest(test)}
                      className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-primary/20 active:scale-95"
                    >
                      <span>{previousAttempt ? 'Retake Test' : 'Start Test Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* RECENT ATTEMPTS SECTION (IF LOGGED IN) */}
        {user && attempts.length > 0 && (
          <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold font-heading text-gray-900">Your Recent Test Results</h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">{attempts.length} Attempt(s) recorded</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <th className="py-3 px-4">Test Name</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Correct / Incorrect</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attempts.slice(0, 5).map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900 max-w-xs truncate">
                        {tests.find((t) => t.id === att.test_id)?.title || 'Mock Test'}
                      </td>
                      <td className="py-3 px-4 font-bold text-primary">
                        {att.score} <span className="text-gray-400 font-normal">/{att.total_marks}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        <span className="text-emerald-600 font-bold">+{att.correct_count}</span>
                        {' / '}
                        <span className="text-red-DEFAULT font-bold">-{att.incorrect_count}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                          {att.accuracy_percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(att.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/tests/result/${att.id}`}
                          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-primary hover:text-white font-semibold transition-colors text-[11px]"
                        >
                          View Analysis
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
