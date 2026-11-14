import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  Send,
  HelpCircle,
  CheckCircle2,
  X,
  User as UserIcon,
  LayoutGrid
} from 'lucide-react'
import { fetchTestWithQuestions, submitTestAttempt } from '../../services/testService'
import { MockTest, TestQuestion, StudentAnswerItem, QuestionStatus } from '../../types/test'
import { useAuth } from '../../context/AuthContext'

export const ExamRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [test, setTest] = useState<MockTest | null>(null)
  const [questions, setQuestions] = useState<TestQuestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Exam State
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeSection, setActiveSection] = useState<string>('')
  const [answers, setAnswers] = useState<Record<string, { optionIndex: number | null; isMarked: boolean; timeSpent: number }>>({})
  const [visitedQuestions, setVisitedQuestions] = useState<Record<string, boolean>>({})

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mobile Palette Drawer Toggle
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false)

  // Dialogs
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showSectionSwitchModal, setShowSectionSwitchModal] = useState(false)
  const [pendingSectionSwitch, setPendingSectionSwitch] = useState<string | null>(null)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load Test Data
  useEffect(() => {
    async function init() {
      if (!id) return
      try {
        setIsLoading(true)
        const data = await fetchTestWithQuestions(id)
        if (!data.test) {
          throw new Error('Test not found or deleted')
        }
        setTest(data.test)
        setQuestions(data.questions)

        if (data.questions.length > 0) {
          const firstSec = data.questions[0].section_name || 'General'
          setActiveSection(firstSec)
          setVisitedQuestions({ [data.questions[0].id]: true })
        }

        setTimeLeft(data.test.duration_minutes * 60)
      } catch (err) {
        console.error('Error loading exam:', err)
        alert('Failed to load test questions. Redirecting to tests catalog.')
        navigate('/tests')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [id, navigate])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || isLoading || isSubmitting) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })

      // Increment time spent on current question
      if (questions[currentIndex]) {
        const qId = questions[currentIndex].id
        setAnswers((prev) => ({
          ...prev,
          [qId]: {
            optionIndex: prev[qId]?.optionIndex ?? null,
            isMarked: prev[qId]?.isMarked ?? false,
            timeSpent: (prev[qId]?.timeSpent ?? 0) + 1,
          },
        }))
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft, isLoading, isSubmitting, currentIndex, questions])

  // Unique sections
  const sections = useMemo(() => {
    const set = new Set<string>()
    questions.forEach((q) => set.add(q.section_name || 'General'))
    return Array.from(set)
  }, [questions])

  // Questions in current section
  const sectionQuestions = useMemo(() => {
    return questions.filter((q) => (q.section_name || 'General') === activeSection)
  }, [questions, activeSection])

  const currentQuestion = questions[currentIndex]

  // Calculate palette status for a question
  const getQuestionStatus = (qId: string): QuestionStatus => {
    const ans = answers[qId]
    const isVisited = visitedQuestions[qId]

    if (ans?.isMarked && ans.optionIndex !== null) return 'marked_and_answered'
    if (ans?.isMarked) return 'marked'
    if (ans?.optionIndex !== null && ans?.optionIndex !== undefined) return 'answered'
    if (isVisited) return 'not_answered'
    return 'not_visited'
  }

  // Summary counts
  const summary = useMemo(() => {
    let answered = 0
    let notAnswered = 0
    let marked = 0
    let notVisited = 0

    questions.forEach((q) => {
      const status = getQuestionStatus(q.id)
      if (status === 'answered' || status === 'marked_and_answered') answered++
      else if (status === 'marked') marked++
      else if (status === 'not_answered') notAnswered++
      else notVisited++
    })

    return { answered, notAnswered, marked, notVisited }
  }, [questions, answers, visitedQuestions])

  // Navigation
  const navigateToQuestion = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= questions.length) return
    const targetQ = questions[targetIdx]
    setCurrentIndex(targetIdx)
    setActiveSection(targetQ.section_name || 'General')
    setVisitedQuestions((prev) => ({ ...prev, [targetQ.id]: true }))
    setMobilePaletteOpen(false)
  }

  const handleSelectOption = (optIdx: number) => {
    if (!currentQuestion) return
    const qId = currentQuestion.id
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        optionIndex: optIdx,
        isMarked: prev[qId]?.isMarked ?? false,
        timeSpent: prev[qId]?.timeSpent ?? 0,
      },
    }))
  }

  const handleClearResponse = () => {
    if (!currentQuestion) return
    const qId = currentQuestion.id
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        optionIndex: null,
        isMarked: false,
        timeSpent: prev[qId]?.timeSpent ?? 0,
      },
    }))
  }

  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return
    const qId = currentQuestion.id
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        optionIndex: prev[qId]?.optionIndex ?? null,
        isMarked: true,
        timeSpent: prev[qId]?.timeSpent ?? 0,
      },
    }))
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1)
    } else {
      setShowSubmitModal(true)
    }
  }

  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1)
    } else {
      setShowSubmitModal(true)
    }
  }

  const handleSectionTabClick = (secName: string) => {
    if (secName === activeSection) return
    setPendingSectionSwitch(secName)
    setShowSectionSwitchModal(true)
  }

  const confirmSectionSwitch = () => {
    if (pendingSectionSwitch) {
      const firstQIdx = questions.findIndex((q) => (q.section_name || 'General') === pendingSectionSwitch)
      if (firstQIdx !== -1) {
        navigateToQuestion(firstQIdx)
      }
    }
    setShowSectionSwitchModal(false)
    setPendingSectionSwitch(null)
  }

  // Submit test
  const handleFinalSubmit = async () => {
    if (!test || !user) return
    setIsSubmitting(true)
    setShowSubmitModal(false)

    try {
      const payloadAnswers: StudentAnswerItem[] = questions.map((q) => ({
        question_id: q.id,
        selected_option_index: answers[q.id]?.optionIndex ?? null,
        is_marked_for_review: answers[q.id]?.isMarked ?? false,
        time_spent_seconds: answers[q.id]?.timeSpent ?? 0,
      }))

      const totalTimeSeconds = test.duration_minutes * 60 - timeLeft

      const result = await submitTestAttempt({
        testId: test.id,
        userId: user.id,
        studentName: user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
        studentEmail: user.email || '',
        answers: payloadAnswers,
        timeTakenSeconds: Math.max(1, totalTimeSeconds),
      })

      navigate(`/tests/result/${result.attemptId}`, { replace: true })
    } catch (err: any) {
      alert('Failed to submit exam: ' + err.message)
      setIsSubmitting(false)
    }
  }

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your test automatically.')
    handleFinalSubmit()
  }

  // Format Timer HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const pad = (n: number) => String(n).padStart(2, '0')
    if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    return `${pad(minutes)}:${pad(seconds)}`
  }

  if (isLoading || !test) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Initializing Examination Engine...
          </p>
        </div>
      </div>
    )
  }

  const isLowTime = timeLeft <= 300 // 5 mins left

  return (
    <div className="min-h-screen bg-paper-light flex flex-col select-none text-slate-900 font-sans">
      {/* ── TOP CBT EXAM HEADER ── */}
      <header className="bg-slate-950 text-white px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/icon.png" alt="GLD" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold font-heading text-white truncate max-w-xs sm:max-w-md">
              {test.title}
            </h1>
            <p className="text-[10px] text-slate-400 truncate">
              Active Section: <span className="font-semibold text-accent-gold">{activeSection}</span>
            </p>
          </div>
        </div>

        {/* Center Timer */}
        <div
          className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full font-mono text-xs sm:text-sm font-bold tracking-wider transition-colors ${
            isLowTime
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-slate-800 text-slate-100 border border-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-accent-gold" />
          <span>{formatTimer(timeLeft)}</span>
        </div>

        {/* Right Action: Submit & Mobile Palette Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobilePaletteOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
            title="Open Question Palette"
          >
            <LayoutGrid className="w-4 h-4 text-accent-gold" />
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            disabled={isSubmitting}
            className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Test</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </header>

      {/* ── SECTION TABS ROW ── */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-2xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
          Sections:
        </span>
        {sections.map((sec) => {
          const isActive = sec === activeSection
          const count = questions.filter((q) => (q.section_name || 'General') === sec).length
          return (
            <button
              key={sec}
              onClick={() => handleSectionTabClick(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary-dark text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {sec} ({count})
            </button>
          )
        })}
      </div>

      {/* ── MAIN WORKSPACE: QUESTION (LEFT) + PALETTE (RIGHT) ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Active Question Workspace */}
        <div className="lg:col-span-8 academic-card flex flex-col min-h-[580px] bg-white">
          {currentQuestion ? (
            <>
              {/* Question Subheader */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
                <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                  Question {currentIndex + 1} of {questions.length}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    +{currentQuestion.positive_marks ?? test.positive_marks} Marks
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold border border-red-200">
                    -{currentQuestion.negative_marks ?? test.negative_marks}
                  </span>
                </div>
              </div>

              {/* Question Content */}
              <div className="p-5 sm:p-7 flex-1 space-y-4">
                <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed whitespace-pre-line">
                  {currentQuestion.question_text}
                </div>

                {currentQuestion.question_image_url && (
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 inline-block">
                    <img
                      src={currentQuestion.question_image_url}
                      alt="Question diagram"
                      className="max-h-60 object-contain rounded"
                    />
                  </div>
                )}

                {/* 4 Options (Brilliant.org Touch-friendly Buttons) */}
                <div className="space-y-2.5 pt-3">
                  {(currentQuestion.options || []).map((opt, optIdx) => {
                    const letters = ['A', 'B', 'C', 'D']
                    const isSelected = answers[currentQuestion.id]?.optionIndex === optIdx

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3.5 min-h-[48px] ${
                          isSelected
                            ? 'bg-amber-50/80 border-accent-gold shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-accent-gold text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {letters[optIdx]}
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-slate-900 leading-normal flex-1">
                          {opt}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Bottom Bar (Mobile Ergonomics) */}
              <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-slate-50/80 rounded-b-2xl flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkForReviewAndNext}
                    className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Review & Next</span>
                  </button>

                  <button
                    onClick={handleClearResponse}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => navigateToQuestion(currentIndex - 1)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 disabled:opacity-40 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {currentIndex === questions.length - 1 ? (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-98"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Test</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveAndNext}
                      className="px-5 py-2 rounded-xl bg-primary-dark hover:bg-primary text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-98"
                    >
                      <span>Save & Next</span>
                      <ChevronRight className="w-4 h-4 text-accent-gold" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">No question selected.</div>
          )}
        </div>

        {/* Right Column: Candidate Info + Question Palette (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          {/* Candidate Card */}
          <div className="academic-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <UserIcon className="w-5 h-5 text-accent-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Candidate'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>

          {/* Question Palette Card */}
          <div className="academic-card p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
              Question Palette &bull; {activeSection}
            </h4>

            {/* Legend Counters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {summary.answered}
                </span>
                <span className="text-[11px] text-emerald-950 font-semibold">Answered</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-red-50 border border-red-200">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {summary.notAnswered}
                </span>
                <span className="text-[11px] text-red-950 font-semibold">Unanswered</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-50 border border-purple-200">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {summary.marked}
                </span>
                <span className="text-[11px] text-purple-950 font-semibold">Marked</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 border border-slate-200">
                <span className="w-5 h-5 rounded-md bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                  {summary.notVisited}
                </span>
                <span className="text-[11px] text-slate-700 font-semibold">Not Visited</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="pt-2">
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {sectionQuestions.map((q) => {
                  const globalIdx = questions.findIndex((item) => item.id === q.id)
                  const isCurrent = globalIdx === currentIndex
                  const status = getQuestionStatus(q.id)

                  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  if (status === 'answered' || status === 'marked_and_answered') {
                    bgClass = 'bg-emerald-600 text-white border-emerald-600 font-bold'
                  } else if (status === 'marked') {
                    bgClass = 'bg-purple-600 text-white border-purple-600 font-bold'
                  } else if (status === 'not_answered') {
                    bgClass = 'bg-red-600 text-white border-red-600 font-bold'
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => navigateToQuestion(globalIdx)}
                      className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${bgClass} ${
                        isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      {globalIdx + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Submit from Palette */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PALETTE DRAWER */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs lg:hidden">
          <div className="bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Question Palette &bull; {activeSection}
              </h4>
              <button
                onClick={() => setMobilePaletteOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {sectionQuestions.map((q) => {
                const globalIdx = questions.findIndex((item) => item.id === q.id)
                const isCurrent = globalIdx === currentIndex
                const status = getQuestionStatus(q.id)

                let bgClass = 'bg-slate-100 text-slate-700'
                if (status === 'answered' || status === 'marked_and_answered') {
                  bgClass = 'bg-emerald-600 text-white font-bold'
                } else if (status === 'marked') {
                  bgClass = 'bg-purple-600 text-white font-bold'
                } else if (status === 'not_answered') {
                  bgClass = 'bg-red-600 text-white font-bold'
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => navigateToQuestion(globalIdx)}
                    className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${bgClass} ${
                      isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                  >
                    {globalIdx + 1}
                  </button>
                )
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobilePaletteOpen(false)
                  setShowSubmitModal(true)
                }}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CONFIRM SECTION SWITCH */}
      {showSectionSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="academic-card p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-accent-gold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">Switch Section?</h3>
                <p className="text-xs text-slate-500">You are switching to section: {pendingSectionSwitch}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to navigate to another section? Your answers in the current section are securely saved.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSectionSwitchModal(false)
                  setPendingSectionSwitch(null)
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Stay Here
              </button>
              <button
                onClick={confirmSectionSwitch}
                className="px-4 py-2 rounded-xl bg-primary-dark text-white text-xs font-bold hover:bg-primary"
              >
                Yes, Switch Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM SUBMIT TEST */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="academic-card p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">Final Test Submission</h3>
                <p className="text-xs text-slate-500">Review your question summary before submitting.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Total Questions:</span>
                <p className="font-mono font-bold text-slate-900 text-sm">{questions.length}</p>
              </div>
              <div>
                <span className="text-slate-400">Answered:</span>
                <p className="font-mono font-bold text-emerald-700 text-sm">{summary.answered}</p>
              </div>
              <div>
                <span className="text-slate-400">Marked for Review:</span>
                <p className="font-mono font-bold text-purple-700 text-sm">{summary.marked}</p>
              </div>
              <div>
                <span className="text-slate-400">Unanswered:</span>
                <p className="font-mono font-bold text-red-600 text-sm">{summary.notAnswered + summary.notVisited}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              Once submitted, your examination attempt will be closed and your performance analytics generated immediately.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Return to Exam
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-98"
              >
                {isSubmitting ? 'Evaluating Score...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}