import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Target,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Filter,
  Check,
  X,
  Lightbulb,
  Share2,
} from 'lucide-react'
import { fetchAttemptDetails } from '../../services/testService'
import { MockTest, TestQuestion, TestAttempt } from '../../types/test'

export const TestResult: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()

  const [attempt, setAttempt] = useState<TestAttempt | null>(null)
  const [test, setTest] = useState<MockTest | null>(null)
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'analysis' | 'solutions'>('analysis')
  const [solutionFilter, setSolutionFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all')
  const [solutionSectionFilter, setSolutionSectionFilter] = useState('All')

  useEffect(() => {
    async function load() {
      if (!attemptId) return
      try {
        setIsLoading(true)
        const data = await fetchAttemptDetails(attemptId)
        setAttempt(data.attempt)
        setTest(data.test)
        setQuestions(data.questions)

        // If score is >= 50%, trigger celebratory confetti
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
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [attemptId])

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

      // Filter by section
      if (solutionSectionFilter !== 'All' && (q.section_name || 'General') !== solutionSectionFilter) {
        return false
      }

      // Filter by status
      if (solutionFilter === 'correct') return Boolean(ans?.is_correct)
      if (solutionFilter === 'incorrect') return isAttempted && !ans?.is_correct
      if (solutionFilter === 'unattempted') return !isAttempted
      return true
    })
  }, [questions, attempt, solutionFilter, solutionSectionFilter])

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}m ${s}s`
  }

  if (isLoading || !attempt || !test) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Generating Performance Report...</p>
        </div>
      </div>
    )
  }

  const attemptedCount = attempt.correct_count + attempt.incorrect_count
  const scorePct = ((attempt.score / attempt.total_marks) * 100).toFixed(1)

  return (
    <div className="flex-grow min-h-screen bg-gray-50 pb-20">
      {/* Top Banner Header */}
      <section className="bg-gradient-to-b from-primary-dark via-primary to-[#0f1e5c] text-white pt-36 pb-12 px-6 mb-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => navigate('/tests')}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 backdrop-blur-sm"
                title="Back to Tests"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-green bg-accent-green/20 px-2.5 py-0.5 rounded border border-accent-green/30">
                  Performance Report
                </span>
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-white mt-1">
                  {test.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/tests/${test.id}`}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors backdrop-blur-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* 3 DEDICATED PRIMARY SCORE CARDS (Marks, Correct, Incorrect) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* 1. TOTAL MARKS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-primary shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Marks</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-gray-900 font-heading">{attempt.score}</span>
                <span className="text-xs text-gray-400 font-medium">/ {attempt.total_marks}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Score Percentage: {scorePct}%</p>
            </div>
          </div>

          {/* 2. CORRECT QUESTIONS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Correct Questions</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-emerald-600 font-heading">
                  {attempt.correct_count}
                </span>
                <span className="text-xs text-gray-400 font-medium">/ {attempt.total_questions} Qs</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                +{(attempt.correct_count * (test.positive_marks || 1)).toFixed(1)} marks earned
              </p>
            </div>
          </div>

          {/* 3. INCORRECT QUESTIONS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 shrink-0">
              <XCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Incorrect Questions</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-red-600 font-heading">
                  {attempt.incorrect_count}
                </span>
                <span className="text-xs text-gray-400 font-medium">/ {attempt.total_questions} Qs</span>
              </div>
              <p className="text-[11px] text-red-600 font-semibold mt-1">
                -{(attempt.incorrect_count * (test.negative_marks || 0.25)).toFixed(1)} marks deducted
              </p>
            </div>
          </div>
        </div>

        {/* SECONDARY METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-[11px] text-gray-400 font-semibold">Accuracy Rate</p>
            <p className="text-lg font-bold text-primary mt-0.5">{attempt.accuracy_percentage}%</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-[11px] text-gray-400 font-semibold">Time Spent</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{formatTime(attempt.time_taken_seconds)}</p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-[11px] text-gray-400 font-semibold">Attempted</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">
              {attemptedCount} <span className="text-xs text-gray-400 font-normal">/{attempt.total_questions}</span>
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-200 text-center shadow-sm">
            <p className="text-[11px] text-gray-400 font-semibold">Unattempted</p>
            <p className="text-lg font-bold text-gray-500 mt-0.5">{attempt.unattempted_count}</p>
          </div>
        </div>

        {/* TABS: ANALYSIS vs SOLUTIONS */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'analysis'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Section Performance Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('solutions')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'solutions'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Detailed Solutions & Explanations ({questions.length})</span>
          </button>
        </div>

        {/* TAB 1: SECTION-WISE PERFORMANCE */}
        {activeTab === 'analysis' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-12">
            <h3 className="text-sm font-bold text-gray-900 font-heading mb-4">
              Sectional Score & Accuracy
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4 text-center">Total Qs</th>
                    <th className="py-3 px-4 text-center">Attempted</th>
                    <th className="py-3 px-4 text-center">Correct</th>
                    <th className="py-3 px-4 text-center">Incorrect</th>
                    <th className="py-3 px-4 text-right">Net Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sectionAnalytics.map((sec, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/70">
                      <td className="py-3 px-4 font-semibold text-gray-900">{sec.name}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{sec.total}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{sec.attempted}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">+{sec.correct}</td>
                      <td className="py-3 px-4 text-center font-bold text-red-600">-{sec.incorrect}</td>
                      <td className="py-3 px-4 text-right font-bold text-primary">{sec.marks}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold border-t border-gray-200">
                    <td className="py-3 px-4 text-gray-900">Total Overall</td>
                    <td className="py-3 px-4 text-center">{attempt.total_questions}</td>
                    <td className="py-3 px-4 text-center">{attemptedCount}</td>
                    <td className="py-3 px-4 text-center text-emerald-600">+{attempt.correct_count}</td>
                    <td className="py-3 px-4 text-center text-red-600">-{attempt.incorrect_count}</td>
                    <td className="py-3 px-4 text-right text-primary">{attempt.score}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED SOLUTIONS */}
        {activeTab === 'solutions' && (
          <div className="space-y-6 mb-12">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              {/* Status pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'correct', 'incorrect', 'unattempted'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSolutionFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      solutionFilter === filter
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Section selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">Section:</span>
                <select
                  value={solutionSectionFilter}
                  onChange={(e) => setSolutionSectionFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
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
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6">
                <p className="text-xs text-gray-500">No questions match this filter.</p>
              </div>
            ) : (
              filteredSolutionQuestions.map((q) => {
                const globalIdx = questions.findIndex((item) => item.id === q.id)
                const ans = (attempt.answers || []).find((a) => a.question_id === q.id)
                const isAttempted = ans && ans.selected_option_index !== null && ans.selected_option_index !== undefined
                const isCorrect = Boolean(ans?.is_correct)
                const letters = ['A', 'B', 'C', 'D']

                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4"
                  >
                    {/* Top Row: Q #, Section, Status */}
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-800 font-bold text-xs flex items-center justify-center">
                          {globalIdx + 1}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {q.section_name || 'General'}
                        </span>
                      </div>

                      <div>
                        {!isAttempted ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
                            Unattempted
                          </span>
                        ) : isCorrect ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
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
                    <div className="text-sm font-medium text-gray-900 leading-relaxed whitespace-pre-line">
                      {q.question_text}
                    </div>

                    {/* Optional Image */}
                    {q.question_image_url && (
                      <div className="p-2 border border-gray-200 rounded-xl bg-gray-50 inline-block">
                        <img src={q.question_image_url} alt="Question" className="max-h-48 rounded object-contain" />
                      </div>
                    )}

                    {/* 4 Options with indicators */}
                    <div className="space-y-2 pt-1">
                      {(q.options || []).map((opt, optIdx) => {
                        const isChosen = ans?.selected_option_index === optIdx
                        const isOfficialCorrect = q.correct_option_index === optIdx

                        let borderClass = 'border-gray-200 bg-white'
                        let badgeClass = 'bg-gray-100 text-gray-600'
                        let statusTag = null

                        if (isOfficialCorrect) {
                          borderClass = 'border-emerald-500 bg-emerald-50/70'
                          badgeClass = 'bg-emerald-600 text-white'
                          statusTag = (
                            <span className="text-[11px] font-bold text-emerald-700 ml-auto flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )
                        } else if (isChosen && !isCorrect) {
                          borderClass = 'border-red-300 bg-red-50/70'
                          badgeClass = 'bg-red-600 text-white'
                          statusTag = (
                            <span className="text-[11px] font-bold text-red-600 ml-auto flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> Your Choice
                            </span>
                          )
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border flex items-center gap-3 text-xs md:text-sm ${borderClass}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}
                            >
                              {letters[optIdx]}
                            </span>
                            <span className="text-gray-800 leading-normal">{opt}</span>
                            {statusTag}
                          </div>
                        )
                      })}
                    </div>

                    {/* Detailed Explanation */}
                    {q.explanation && (
                      <div className="mt-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-primary">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <span>Detailed Explanation:</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line pl-5">
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
