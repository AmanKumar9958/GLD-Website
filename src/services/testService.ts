import { supabase } from '../lib/supabase'
import { MockTest, TestQuestion, TestAttempt, StudentAnswerItem } from '../types/test'

/**
 * Fetch all published tests with question counts
 */
export async function fetchPublishedTests(): Promise<MockTest[]> {
  const { data: tests, error } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching mock tests:', error)
    throw error
  }

  if (!tests || tests.length === 0) return []

  // Fetch count of questions per test
  const testIds = tests.map((t) => t.id)
  const { data: questions, error: qErr } = await supabase
    .from('test_questions')
    .select('test_id')
    .in('test_id', testIds)

  const countMap: Record<string, number> = {}
  if (!qErr && questions) {
    questions.forEach((q) => {
      countMap[q.test_id] = (countMap[q.test_id] || 0) + 1
    })
  }

  return tests.map((t) => ({
    ...t,
    questions_count: countMap[t.id] || 0,
  }))
}

/**
 * Fetch a single test metadata
 */
export async function fetchTestById(testId: string): Promise<MockTest | null> {
  const { data, error } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('id', testId)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Fetch a test and all its questions ordered by order_index
 */
export async function fetchTestWithQuestions(
  testId: string,
): Promise<{ test: MockTest | null; questions: TestQuestion[] }> {
  const { data: test, error: tErr } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('id', testId)
    .maybeSingle()

  if (tErr) throw tErr
  if (!test) return { test: null, questions: [] }

  const { data: questions, error: qErr } = await supabase
    .from('test_questions')
    .select('*')
    .eq('test_id', testId)
    .order('order_index', { ascending: true })

  if (qErr) throw qErr

  return { test, questions: questions || [] }
}

/**
 * Submit test attempt & calculate score
 */
export async function submitTestAttempt(payload: {
  testId: string
  userId: string
  studentName: string
  studentEmail: string
  answers: StudentAnswerItem[]
  timeTakenSeconds: number
}): Promise<{ attemptId: string }> {
  const { testId, userId, studentName, studentEmail, answers, timeTakenSeconds } = payload

  // 1. Fetch official questions with correct options
  const { data: questions, error: qErr } = await supabase
    .from('test_questions')
    .select('*')
    .eq('test_id', testId)

  if (qErr) throw qErr
  if (!questions) throw new Error('No questions found for this test')

  // Fetch test for default marks
  const { data: test, error: tErr } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('id', testId)
    .single()

  if (tErr) throw tErr

  const defaultPos = test.positive_marks ?? 1
  const defaultNeg = test.negative_marks ?? 0.25

  let totalScore = 0
  let correctCount = 0
  let incorrectCount = 0
  let unattemptedCount = 0

  const evaluatedAnswers: StudentAnswerItem[] = answers.map((ans) => {
    const q = questions.find((item) => item.id === ans.question_id)
    if (!q) return ans

    const pos = q.positive_marks ?? defaultPos
    const neg = q.negative_marks ?? defaultNeg

    if (ans.selected_option_index === null || ans.selected_option_index === undefined) {
      unattemptedCount++
      return {
        ...ans,
        is_correct: false,
        marks_awarded: 0,
      }
    }

    if (ans.selected_option_index === q.correct_option_index) {
      correctCount++
      totalScore += pos
      return {
        ...ans,
        is_correct: true,
        marks_awarded: pos,
      }
    } else {
      incorrectCount++
      totalScore -= neg
      return {
        ...ans,
        is_correct: false,
        marks_awarded: -neg,
      }
    }
  })

  // Prevent negative score if desired (or keep exact net marks)
  const finalScore = Number(Math.max(0, totalScore).toFixed(2))
  const attemptedCount = correctCount + incorrectCount
  const accuracy = attemptedCount > 0 ? Number(((correctCount / attemptedCount) * 100).toFixed(1)) : 0

  const attemptRecord = {
    test_id: testId,
    user_id: userId,
    score: finalScore,
    total_marks: test.total_marks,
    total_questions: questions.length,
    correct_count: correctCount,
    incorrect_count: incorrectCount,
    unattempted_count: unattemptedCount,
    accuracy_percentage: accuracy,
    time_taken_seconds: timeTakenSeconds,
    answers: evaluatedAnswers,
    status: 'completed',
    submitted_at: new Date().toISOString(),
  }

  const { data: inserted, error: insErr } = await supabase
    .from('test_attempts')
    .insert([attemptRecord])
    .select('id')
    .single()

  if (insErr) {
    console.error('Error inserting test attempt:', insErr)
    throw insErr
  }

  return { attemptId: inserted.id }
}

/**
 * Fetch attempt details by ID for result review
 */
export async function fetchAttemptDetails(
  attemptId: string,
): Promise<{ attempt: TestAttempt; test: MockTest; questions: TestQuestion[] }> {
  const { data: attempt, error: aErr } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('id', attemptId)
    .single()

  if (aErr) throw aErr

  const { test, questions } = await fetchTestWithQuestions(attempt.test_id)
  if (!test) throw new Error('Test not found or deleted')

  return { attempt, test, questions }
}

/**
 * Fetch recent test attempts for a student
 */
export async function fetchStudentAttempts(userId: string): Promise<TestAttempt[]> {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * One-time in-session grant for viewing test solutions
 * Prevents copied URLs from opening in other windows, tabs or unauthorized browsers
 */
export function grantAttemptAccess(attemptId: string) {
  try {
    sessionStorage.setItem('allow_result_view_' + attemptId, 'granted_' + Date.now())
  } catch (e) {}
}

export function isAttemptAccessGranted(attemptId: string): boolean {
  try {
    return !!sessionStorage.getItem('allow_result_view_' + attemptId)
  } catch (e) {
    return false
  }
}

