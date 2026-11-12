import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  Send,
  HelpCircle,
  CheckCircle2,
  X,
  User as UserIcon,
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
        alert('Failed to load test questions. Redirecting to tests list.')
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
    }
  }

  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      navigateToQuestion(currentIndex + 1)
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wide">Initializing Examination Room...</p>
        </div>
      </div>
    )
  }

  const isLowTime = timeLeft <= 300 // 5 mins left

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col select-none font-sans">
      {/* TOP CBT EXAM HEADER */}
      <header className="bg-primary text-white px-4 md:px-8 py-3 flex items-center justify-between border-b border-white/10 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/icon.png" alt="GLD" className="w-8 h-8 rounded-full border border-white/20" />
          <div>
            <h1 className="text-xs md:text-sm font-bold font-heading tracking-wide line-clamp-1">
              {test.title}
            </h1>
            <p className="text-[10px] text-gray-300">
              Section: <span className="font-semibold text-white">{activeSection}</span>
            </p>
          </div>
        </div>

        {/* Center Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs md:text-sm font-bold tracking-wider transition-colors shadow-inner ${
            isLowTime ? 'bg-red-DEFAULT text-white animate-pulse' : 'bg-white/15 text-white border border-white/20'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTimer(timeLeft)}</span>
        </div>

        {/* Submit Exam Button */}
        <button
          onClick={() => setShowSubmitModal(true)}
          disabled={isSubmitting}
          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm flex items-center gap-1.5 shadow transition-transform active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Submit Test</span>
        </button>
      </header>

      {/* SECTION TABS ROW */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-2 flex items-center gap-2 overflow-x-auto shadow-sm">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap mr-2">
          Sections:
        </span>
        {sections.map((sec) => {
          const isActive = sec === activeSection
          const count = questions.filter((q) => (q.section_name || 'General') === sec).length
          return (
            <button
              key={sec}
              onClick={() => handleSectionTabClick(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sec} ({count})
            </button>
          )
        })}
      </div>

      {/* MAIN WORKSPACE: QUESTION (LEFT 8) + PALETTE (RIGHT 4) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8: ACTIVE QUESTION CONTAINER */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-[580px]">
          {currentQuestion ? (
            <>
              {/* Question Subheader: Number + Marks */}
              <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                <span className="font-bold text-sm text-gray-900 font-heading">
                  Question #{currentIndex + 1} of {questions.length}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    +{currentQuestion.positive_marks ?? test.positive_marks}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-red-50 text-red-600 font-bold border border-red-200">
                    -{currentQuestion.negative_marks ?? test.negative_marks}
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <div className="p-5 md:p-6 flex-1 space-y-4">
                <div className="text-sm md:text-base font-medium text-gray-900 leading-relaxed whitespace-pre-line">
                  {currentQuestion.question_text}
                </div>

                {/* Optional Image */}
                {currentQuestion.question_image_url && (
                  <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 inline-block">
                    <img
                      src={currentQuestion.question_image_url}
                      alt="Question diagram"
                      className="max-h-56 object-contain rounded"
                    />
                  </div>
                )}

                {/* 4 Options List */}
                <div className="space-y-2.5 pt-2">
                  {(currentQuestion.options || []).map((opt, optIdx) => {
                    const letters = ['A', 'B', 'C', 'D']
                    const isSelected = answers[currentQuestion.id]?.optionIndex === optIdx

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`group p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                          }`}
                        >
                          {letters[optIdx]}
                        </div>
                        <div className="text-xs md:text-sm text-gray-800 leading-normal flex-1">
                          {opt}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Bottom Bar */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkForReviewAndNext}
                    className="px-3.5 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Mark for Review & Next</span>
                  </button>

                  <button
                    onClick={handleClearResponse}
                    className="px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Response</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => navigateToQuestion(currentIndex - 1)}
                    className="px-3.5 py-2 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleSaveAndNext}
                    className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-xs font-semibold flex items-center gap-1 shadow transition-colors"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400">No question selected.</div>
          )}
        </div>

        {/* RIGHT 4: CANDIDATE INFO + QUESTION PALETTE */}
        <div className="lg:col-span-4 space-y-4">
          {/* Candidate Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Candidate'}
              </div>
              <div className="text-[11px] text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>

          {/* Question Palette Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-2">
              Question Palette
            </h4>

            {/* Legend Counters */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="w-5 h-5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {summary.answered}
                </span>
                <span className="text-[11px] text-emerald-900 font-medium">Answered</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
                <span className="w-5 h-5 rounded bg-red-DEFAULT text-white font-bold text-[10px] flex items-center justify-center">
                  {summary.notAnswered}
                </span>
                <span className="text-[11px] text-red-900 font-medium">Not Answered</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100">
                <span className="w-5 h-5 rounded bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {summary.marked}
                </span>
                <span className="text-[11px] text-purple-900 font-medium">Marked</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
                <span className="w-5 h-5 rounded bg-gray-200 text-gray-700 font-bold text-[10px] flex items-center justify-center">
                  {summary.notVisited}
                </span>
                <span className="text-[11px] text-gray-600 font-medium">Not Visited</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-gray-500 mb-2">
                Questions for {activeSection}:
              </p>

              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {sectionQuestions.map((q) => {
                  const globalIdx = questions.findIndex((item) => item.id === q.id)
                  const isCurrent = globalIdx === currentIndex
                  const status = getQuestionStatus(q.id)

                  let bgClass = 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  if (status === 'answered' || status === 'marked_and_answered') {
                    bgClass = 'bg-emerald-600 text-white border-emerald-600'
                  } else if (status === 'marked') {
                    bgClass = 'bg-purple-600 text-white border-purple-600'
                  } else if (status === 'not_answered') {
                    bgClass = 'bg-red-DEFAULT text-white border-red-DEFAULT'
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => navigateToQuestion(globalIdx)}
                      className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center border transition-all ${bgClass} ${
                        isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      {globalIdx + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: CONFIRM SECTION SWITCH (SCREEN 7) */}
      {showSectionSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-50 text-primary">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 font-heading">Switch Section?</h3>
                <p className="text-xs text-gray-500">You are switching to section: {pendingSectionSwitch}</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to navigate to another section? Any changes you made in the current question have been automatically saved.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSectionSwitchModal(false)
                  setPendingSectionSwitch(null)
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100"
              >
                Stay in Current Section
              </button>
              <button
                onClick={confirmSectionSwitch}
                className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-light"
              >
                Yes, Switch Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM SUBMIT TEST */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 font-heading">Submit Examination?</h3>
                <p className="text-xs text-gray-500">Please review your submission summary before completing.</p>
              </div>
            </div>

            {/* Breakdown box */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400">Total Questions:</span>
                <p className="font-bold text-gray-900 text-sm">{questions.length}</p>
              </div>
              <div>
                <span className="text-gray-400">Answered:</span>
                <p className="font-bold text-emerald-600 text-sm">{summary.answered}</p>
              </div>
              <div>
                <span className="text-gray-400">Marked for Review:</span>
                <p className="font-bold text-purple-600 text-sm">{summary.marked}</p>
              </div>
              <div>
                <span className="text-gray-400">Unattempted:</span>
                <p className="font-bold text-red-600 text-sm">{summary.notAnswered + summary.notVisited}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-normal">
              Once submitted, you cannot change your answers. Your performance analysis will be generated immediately.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-100"
              >
                Return to Exam
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all active:scale-95"
              >
                {isSubmitting ? 'Evaluating...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
