import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  ChevronRight,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react'
import { fetchTestWithQuestions } from '../../services/testService'
import { MockTest, TestQuestion } from '../../types/test'
import { useAuth } from '../../context/AuthContext'

export const TestInstructions: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, openAuthModal } = useAuth()

  const [test, setTest] = useState<MockTest | null>(null)
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasAgreed, setHasAgreed] = useState(false)

  useEffect(() => {
    async function loadTest() {
      if (!id) return
      try {
        setIsLoading(true)
        const data = await fetchTestWithQuestions(id)
        setTest(data.test)
        setQuestions(data.questions)
      } catch (err) {
        console.error('Failed to load test instructions:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadTest()
  }, [id])

  // Group questions by section
  const sectionBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    questions.forEach((q) => {
      const sec = q.section_name || 'General'
      map[sec] = (map[sec] || 0) + 1
    })
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      marks: (count * (test?.positive_marks || 1)).toFixed(1),
    }))
  }, [questions, test])

  const handleStartExam = () => {
    if (!user) {
      openAuthModal()
      return
    }
    if (!hasAgreed) {
      alert('Please read and agree to the examination instructions by checking the declaration box below.')
      return
    }
    navigate(`/tests/exam/${id}`)
  }

  if (isLoading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-paper-light flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading examination guidelines...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-paper-light flex items-center justify-center">
        <div className="academic-card p-8 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="font-heading font-bold text-lg text-slate-900">Exam Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-5">This mock test is either unpublished or does not exist.</p>
          <Link to="/tests" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
            Back to Mock Tests
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper-light text-slate-900 pt-20 sm:pt-24 pb-20">
      {/* Top Breadcrumb & Header */}
      <section className="py-8 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/tests')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Back to Tests"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent-gold bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200/80">
                {test.category} Examination
              </span>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 mt-1">
                {test.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* 4 Highlight Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="academic-card p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Duration</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">{test.duration_minutes} Mins</p>
            </div>
          </div>

          <div className="academic-card p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Marks</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">{test.total_marks}</p>
            </div>
          </div>

          <div className="academic-card p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Correct</p>
              <p className="text-sm sm:text-base font-bold text-emerald-700">+{test.positive_marks} Marks</p>
            </div>
          </div>

          <div className="academic-card p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Negative</p>
              <p className="text-sm sm:text-base font-bold text-red-600">-{test.negative_marks} Deduction</p>
            </div>
          </div>
        </div>

        {/* Section Breakdown Table */}
        <div className="academic-card p-6 mb-6">
          <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 mb-3.5 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-accent-gold" />
            <span>Sectional Question Pattern ({sectionBreakdown.length} Sections)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3.5">Section Name</th>
                  <th className="py-2.5 px-3.5 text-center">Questions</th>
                  <th className="py-2.5 px-3.5 text-right">Maximum Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionBreakdown.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3.5 font-bold text-slate-800">{sec.name}</td>
                    <td className="py-3 px-3.5 text-center text-slate-600 font-mono">{sec.count}</td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">{sec.marks}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-3 px-3.5 text-slate-900">Total</td>
                  <td className="py-3 px-3.5 text-center text-slate-900 font-mono">{questions.length}</td>
                  <td className="py-3 px-3.5 text-right text-slate-900 font-mono">{test.total_marks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* General Instructions & Color Codes */}
        <div className="academic-card p-6 sm:p-7 mb-6 space-y-4 text-xs text-slate-700 leading-relaxed">
          <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent-gold" />
            <span>Standard Examination Instructions</span>
          </h3>

          <ul className="list-disc pl-5 space-y-2">
            <li>The total test duration is exactly <strong>{test.duration_minutes} minutes</strong>.</li>
            <li>The test will automatically submit when the countdown timer reaches 00:00:00.</li>
            <li>Every question has four multiple-choice options. Exactly one option is correct.</li>
            <li>You can navigate between sections and jump directly to any question from the question palette on the right.</li>
            <li>You can change your selected answer anytime before final submission by clicking <em>Clear Response</em>.</li>
          </ul>

          <div className="pt-3 border-t border-slate-100">
            <p className="font-bold text-slate-900 mb-2.5">Question Palette Color Legend:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px]">1</span>
                <span className="text-[11px] font-semibold text-emerald-900">Answered</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200">
                <span className="w-6 h-6 rounded-md bg-red-600 text-white font-bold flex items-center justify-center text-[11px]">2</span>
                <span className="text-[11px] font-semibold text-red-900">Not Answered</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 border border-purple-200">
                <span className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[11px]">3</span>
                <span className="text-[11px] font-semibold text-purple-900">Marked Review</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 border border-slate-200">
                <span className="w-6 h-6 rounded-md bg-slate-300 text-slate-700 font-bold flex items-center justify-center text-[11px]">4</span>
                <span className="text-[11px] font-semibold text-slate-700">Not Visited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Declaration & Proceed CTA */}
        <div className="academic-card p-6 sm:p-7 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-primary rounded focus:ring-primary border-slate-300"
            />
            <span className="text-xs text-slate-700 leading-normal select-none">
              I have read and understood all the instructions given above. I declare that I will strictly follow all examination rules and take this exam sincerely.
            </span>
          </label>

          <button
            onClick={handleStartExam}
            disabled={!hasAgreed}
            className="w-full py-3.5 px-6 rounded-xl bg-primary-dark hover:bg-primary disabled:opacity-50 text-white font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-98"
          >
            <span>Proceed to Examination Room</span>
            <ChevronRight className="w-4 h-4 text-accent-gold" />
          </button>
        </div>
      </div>
    </div>
  )
}