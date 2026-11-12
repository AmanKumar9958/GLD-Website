import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Award,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Info,
  ChevronRight,
  BookOpen,
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
      openAuthModal('login')
      return
    }
    if (!hasAgreed) {
      alert('Please read and agree to the exam instructions by checking the declaration box below.')
      return
    }
    navigate(`/tests/exam/${id}`)
  }

  if (isLoading) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-600">Loading exam guidelines...</p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center max-w-md shadow-sm">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900">Exam Not Found</h2>
          <p className="text-xs text-gray-500 mt-1 mb-4">This mock test is either unpublished or does not exist.</p>
          <Link to="/tests" className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold">
            Back to Mock Tests
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-grow min-h-screen bg-gray-50 pb-20">
      {/* Top Banner Header */}
      <section className="bg-gradient-to-b from-primary-dark via-primary to-[#0f1e5c] text-white pt-36 pb-12 px-6 mb-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate('/tests')}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 backdrop-blur-sm"
              title="Back to Tests"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-amber bg-accent-amber/20 px-2.5 py-0.5 rounded border border-accent-amber/30">
                {test.category} Examination
              </span>
              <h1 className="text-2xl md:text-3xl font-bold font-heading text-white mt-1">
                {test.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6">
        {/* 4 HIGHLIGHT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Duration</p>
              <p className="text-sm md:text-base font-bold text-gray-900">{test.duration_minutes} Mins</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-50 text-primary">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Marks</p>
              <p className="text-sm md:text-base font-bold text-gray-900">{test.total_marks}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Correct Answer</p>
              <p className="text-sm md:text-base font-bold text-emerald-700">+{test.positive_marks} Marks</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Negative Marking</p>
              <p className="text-sm md:text-base font-bold text-red-600">-{test.negative_marks} Deduction</p>
            </div>
          </div>
        </div>

        {/* SECTION BREAKDOWN TABLE */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-gray-900 font-heading mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Test Sectional Pattern ({sectionBreakdown.length} Sections)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <th className="py-2.5 px-3">Section Name</th>
                  <th className="py-2.5 px-3 text-center">No. of Questions</th>
                  <th className="py-2.5 px-3 text-right">Max Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sectionBreakdown.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80">
                    <td className="py-2.5 px-3 font-semibold text-gray-800">{sec.name}</td>
                    <td className="py-2.5 px-3 text-center text-gray-600">{sec.count}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-primary">{sec.marks}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50/70 font-bold border-t border-gray-200">
                  <td className="py-2.5 px-3 text-gray-900">Total</td>
                  <td className="py-2.5 px-3 text-center text-gray-900">{questions.length}</td>
                  <td className="py-2.5 px-3 text-right text-primary">{test.total_marks}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* GENERAL INSTRUCTIONS CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6 space-y-4 text-xs text-gray-700 leading-relaxed">
          <h3 className="text-sm font-bold text-gray-900 font-heading flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span>General Examination Instructions</span>
          </h3>

          <ul className="list-disc pl-5 space-y-1.5">
            <li>The total duration of the test is exactly <strong>{test.duration_minutes} minutes</strong>.</li>
            <li>The test will automatically submit when the countdown timer reaches 00:00:00.</li>
            <li>Every question has four multiple-choice options. Exactly one option is correct.</li>
            <li>You can navigate between sections and jump directly to any question from the question palette on the right.</li>
            <li>You can change your selected answer anytime before final submission by clicking <em>Clear Response</em>.</li>
          </ul>

          {/* PALETTE LEGEND */}
          <div className="pt-2">
            <p className="font-semibold text-gray-900 mb-2">Question Palette Color Codes:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px]">1</span>
                <span className="text-[11px] font-medium text-emerald-900">Answered</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <span className="w-6 h-6 rounded-md bg-red-DEFAULT text-white font-bold flex items-center justify-center text-[11px]">2</span>
                <span className="text-[11px] font-medium text-red-900">Not Answered</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-200">
                <span className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[11px]">3</span>
                <span className="text-[11px] font-medium text-purple-900">Marked for Review</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                <span className="w-6 h-6 rounded-md bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-[11px]">4</span>
                <span className="text-[11px] font-medium text-gray-700">Not Visited</span>
              </div>
            </div>
          </div>
        </div>

        {/* DECLARATION & PROCEED BUTTON */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
            />
            <span className="text-xs text-gray-700 leading-normal select-none">
              I have read and understood all the instructions given above. I declare that I will strictly follow all examination rules and take this exam sincerely.
            </span>
          </label>

          <button
            onClick={handleStartExam}
            disabled={!hasAgreed}
            className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
          >
            <span>Proceed to Examination Room</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
