import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Check,
  X,
  Lightbulb,
  Sparkles,
  ShieldAlert
} from 'lucide-react'
import { fetchAttemptDetails, isAttemptAccessGranted } from '../../services/testService'
import { MockTest, TestQuestion, TestAttempt } from '../../types/test'
import { useAuth } from '../../context/AuthContext'

export const TestResult: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [attempt, setAttempt] = useState<TestAttempt | null>(null)
  const [test, setTest] = useState<MockTest | null>(null)
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [accessDeniedReason, setAccessDeniedReason] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'analysis' | 'solutions'>('analysis')
  const [solutionFilter, setSolutionFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all')
  const [solutionSectionFilter, setSolutionSectionFilter] = useState('All')

  // Anti-Copy and Content Protection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C / Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault()
      }
      // Prevent Ctrl+U / Cmd+U (View source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault()
      }
      // Prevent Ctrl+P / Cmd+P (Print to PDF)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
      }
      // Prevent Ctrl+S / Cmd+S (Save webpage)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
      }
      // Prevent F12 / DevTools
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i')) {
        e.preventDefault()
      }
    }

    const preventContext = (e: MouseEvent) => {
      e.preventDefault()
    }

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('contextmenu', preventContext)
    window.addEventListener('copy', preventCopy)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('contextmenu', preventContext)
      window.removeEventListener('copy', preventCopy)
    }
  }, [])

  useEffect(() => {
    if (!attemptId) {
      navigate('/tests', { replace: true })
      return
    }

    // 1. Block opening via copied URL in a new window / tab / incognito
    if (!isAttemptAccessGranted(attemptId)) {
      setAccessDeniedReason(
        'Direct URL access is blocked to protect test integrity and prevent question sharing. Opening test solutions by copying the URL into another window or tab is restricted. Please view your results directly from your "My Attempts" section.'
      )
      setIsLoading(false)
      return
    }

    // 2. Wait for auth initialization
    if (authLoading) return

    if (!user) {
      setAccessDeniedReason('Authentication Required. Please sign in to your account to view this examination attempt.')
      setIsLoading(false)
      return
    }

    async function load() {
      try {
        setIsLoading(true)
        const data = await fetchAttemptDetails(attemptId!)

        // 4. Verify that this attempt belongs to the logged-in student
        if (!user || data.attempt.user_id !== user.id) {
          setAccessDeniedReason('Access Denied. You do not have permission to view another student\'s examination attempt.')
          return
        }

        setAttempt(data.attempt)
        setTest(data.test)
        setQuestions(data.questions)

        // If score is >= 40%, trigger celebratory confetti
        const pct = (data.attempt.score / data.attempt.total_marks) * 100
        if (pct >= 40) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      } catch (err) {
        console.error('Failed to load attempt details:', err)
        setAccessDeniedReason('Unable to load attempt details. You may not be authorized to view this record.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [attemptId, user, authLoading, navigate])

  // Unique sections
  const sections = useMemo(() => {
    const set = new Set(['All'])
    questions.forEach((q) => set.add(q.section_name || 'General'))
    return Array.from(set)
  }, [questions])

  // Section-wise breakdown calculation
  const sectionAnalytics = useMemo(() => {
    if (!attempt || !questions.length) return []

    const map: Record<string, { total: number; attempted: number; correct: number; incorrect: number; marks: number }> = {}

    questions.forEach((q) => {
      const sec = q.section_name || 'General'
      if (!map[sec]) {
        map[sec] = { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0 }
      }
      map[sec].total++

      const ans = (attempt.answers || []).find((a) => a.question_id === q.id)
      if (ans && ans.selected_option_index !== null && ans.selected_option_index !== undefined) {
        map[sec].attempted++
        if (ans.is_correct) {
          map[sec].correct++
          map[sec].marks += ans.marks_awarded ?? (test?.positive_marks || 1)
        } else {
          map[sec].incorrect++
          map[sec].marks += ans.marks_awarded ?? -(test?.negative_marks || 0.25)
        }
      }
    })

    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
      marks: Number(data.marks.toFixed(2)),
    }))
  }, [attempt, questions, test])

  // Filtered questions for solutions tab
  const filteredSolutionQuestions = useMemo(() => {
    if (!attempt) return []

    return questions.filter((q) => {
      const ans = (attempt.answers || []).find((a) => a.question_id === q.id)
      const isAttempted = ans && ans.selected_option_index !== null && ans.selected_option_index !== undefined

      if (solutionSectionFilter !== 'All' && (q.section_name || 'General') !== solutionSectionFilter) {
        return false
      }

      if (solutionFilter === 'correct') return Boolean(ans?.is_correct)
      if (solutionFilter === 'incorrect') return isAttempted && !ans?.is_correct
      if (solutionFilter === 'unattempted') return !isAttempted
      return true
    })
  }, [questions, attempt, solutionFilter, solutionSectionFilter])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  if (accessDeniedReason) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-paper-light flex items-center justify-center p-4">
        <div className="academic-card max-w-md w-full p-8 text-center space-y-5 shadow-xl border border-slate-200">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-heading font-black text-xl text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{accessDeniedReason}</p>
          </div>
          <button
            onClick={() => navigate('/tests')}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Go to Tests & My Attempts
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !attempt || !test) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-paper-light flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Generating Comprehensive Scorecard...</p>
        </div>
      </div>
    )
  }

  const attemptedCount = attempt.correct_count + attempt.incorrect_count
  const scorePct = ((attempt.score / attempt.total_marks) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-paper-light text-slate-900 pt-20 sm:pt-24 pb-20 select-none">
      {/* Top Banner Header */}
      <section className="py-8 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/tests')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Back to Tests"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Performance Scorecard
                </span>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 mt-1">
                  {test.title}
                </h1>
              </div>
            </div>

            <Link
              to={`/tests/${test.id}`}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-accent-gold" />
              <span>Retake Examination</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* 3 Primary Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Total Marks */}
          <div className="academic-card p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-900 text-white shrink-0">
              <Award className="w-7 h-7 text-accent-gold" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Final Score</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-heading font-black text-slate-950">{attempt.score}</span>
                <span className="text-xs text-slate-400 font-medium">/ {attempt.total_marks}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Overall: {scorePct}%</p>
            </div>
          </div>

          {/* Correct Count */}
          <div className="academic-card p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Correct Answers</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-heading font-black text-emerald-700">
                  {attempt.correct_count}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ {attempt.total_questions} Qs</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                +{(attempt.correct_count * (test.positive_marks || 1)).toFixed(1)} marks earned
              </p>
            </div>
          </div>

          {/* Incorrect Count */}
          <div className="academic-card p-5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-50 text-red-600 shrink-0 border border-red-200">
              <XCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Incorrect Answers</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-heading font-black text-red-600">
                  {attempt.incorrect_count}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ {attempt.total_questions} Qs</span>
              </div>
              <p className="text-[11px] text-red-600 font-bold mt-0.5">
                -{(attempt.incorrect_count * (test.negative_marks || 0.25)).toFixed(1)} marks deducted
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="academic-card p-3.5 text-center">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Accuracy Rate</p>
            <p className="text-lg font-heading font-bold text-slate-900 mt-0.5">{attempt.accuracy_percentage}%</p>
          </div>

          <div className="academic-card p-3.5 text-center">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Time Taken</p>
            <p className="text-lg font-heading font-bold text-slate-900 mt-0.5">{formatTime(attempt.time_taken_seconds)}</p>
          </div>

          <div className="academic-card p-3.5 text-center">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Attempted</p>
            <p className="text-lg font-heading font-bold text-emerald-700 mt-0.5">
              {attemptedCount} <span className="text-xs text-slate-400 font-normal">/{attempt.total_questions}</span>
            </p>
          </div>

          <div className="academic-card p-3.5 text-center">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Unattempted</p>
            <p className="text-lg font-heading font-bold text-slate-500 mt-0.5">{attempt.unattempted_count}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Target className="w-4 h-4 text-accent-gold" />
            <span>Sectional Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('solutions')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'solutions'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-accent-gold" />
            <span>Question Solutions & Keys ({questions.length})</span>
          </button>
        </div>

        {/* Tab 1: Section Performance Breakdown */}
        {activeTab === 'analysis' && (
          <div className="academic-card p-6 sm:p-7 mb-12">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-4">
              Section-Wise Accuracy & Marks Distribution
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Section Name</th>
                    <th className="py-3 px-4 text-center">Questions</th>
                    <th className="py-3 px-4 text-center">Attempted</th>
                    <th className="py-3 px-4 text-center">Correct</th>
                    <th className="py-3 px-4 text-center">Incorrect</th>
                    <th className="py-3 px-4 text-right">Net Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sectionAnalytics.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{sec.name}</td>
                      <td className="py-3 px-4 text-center text-slate-600 font-mono">{sec.total}</td>
                      <td className="py-3 px-4 text-center text-slate-600 font-mono">{sec.attempted}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700 font-mono">+{sec.correct}</td>
                      <td className="py-3 px-4 text-center font-bold text-red-600 font-mono">-{sec.incorrect}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">{sec.marks}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200">
                    <td className="py-3 px-4 text-slate-900">Total Overall</td>
                    <td className="py-3 px-4 text-center font-mono">{attempt.total_questions}</td>
                    <td className="py-3 px-4 text-center font-mono">{attemptedCount}</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-mono">+{attempt.correct_count}</td>
                    <td className="py-3 px-4 text-center text-red-600 font-mono">-{attempt.incorrect_count}</td>
                    <td className="py-3 px-4 text-right text-slate-900 font-mono">{attempt.score}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Solutions */}
        {activeTab === 'solutions' && (
          <div className="space-y-6 mb-12">
            {/* Filter Controls */}
            <div className="academic-card p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'correct', 'incorrect', 'unattempted'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSolutionFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      solutionFilter === filter
                        ? 'bg-primary-dark text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Section:</span>
                <select
                  value={solutionSectionFilter}
                  onChange={(e) => setSolutionSectionFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions List */}
            {filteredSolutionQuestions.length === 0 ? (
              <div className="text-center py-12 academic-card p-6">
                <p className="text-xs text-slate-500">No questions match this filter criteria.</p>
              </div>
            ) : (
              filteredSolutionQuestions.map((q) => {
                const globalIdx = questions.findIndex((item) => item.id === q.id)
                const ans = (attempt.answers || []).find((a) => a.question_id === q.id)
                const isAttempted = ans && ans.selected_option_index !== null && ans.selected_option_index !== undefined
                const isCorrect = Boolean(ans?.is_correct)
                const letters = ['A', 'B', 'C', 'D']

                return (
                  <div key={q.id} className="academic-card p-6 sm:p-7 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {globalIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {q.section_name || 'General'}
                        </span>
                      </div>

                      <div>
                        {!isAttempted ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                            Unattempted
                          </span>
                        ) : isCorrect ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Correct (+{ans?.marks_awarded ?? (test.positive_marks || 1)})</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-red-600 text-xs font-bold border border-red-200 flex items-center gap-1">
                            <X className="w-3.5 h-3.5" />
                            <span>Incorrect ({ans?.marks_awarded ?? -(test.negative_marks || 0.25)})</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                      {q.question_text}
                    </div>

                    {q.question_image_url && (
                      <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 inline-block">
                        <img src={q.question_image_url} alt="Question" className="max-h-52 rounded object-contain" />
                      </div>
                    )}

                    {/* Options */}
                    <div className="space-y-2 pt-1">
                      {(q.options || []).map((opt, optIdx) => {
                        const isChosen = ans?.selected_option_index === optIdx
                        const isOfficialCorrect = q.correct_option_index === optIdx

                        let borderClass = 'border-slate-200 bg-white'
                        let badgeClass = 'bg-slate-100 text-slate-600'
                        let statusTag = null

                        if (isOfficialCorrect) {
                          borderClass = 'border-emerald-500 bg-emerald-50/70 font-semibold'
                          badgeClass = 'bg-emerald-600 text-white'
                          statusTag = (
                            <span className="text-xs font-bold text-emerald-800 ml-auto flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )
                        } else if (isChosen && !isCorrect) {
                          borderClass = 'border-red-300 bg-red-50/70 font-semibold'
                          badgeClass = 'bg-red-600 text-white'
                          statusTag = (
                            <span className="text-xs font-bold text-red-600 ml-auto flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> Your Response
                            </span>
                          )
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs sm:text-sm ${borderClass}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}
                            >
                              {letters[optIdx]}
                            </span>
                            <span className="text-slate-900 leading-normal">{opt}</span>
                            {statusTag}
                          </div>
                        )
                      })}
                    </div>

                    {/* Detailed Explanation */}
                    {q.explanation && (
                      <div className="mt-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900">
                          <Lightbulb className="w-4 h-4 text-accent-gold" />
                          <span>Detailed Explanation:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line pl-5">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}