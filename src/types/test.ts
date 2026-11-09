export interface DatabaseUser {
  id: string
  name: string
  email: string
  photo_url: string | null
  phone: string | null
  role: 'student' | 'admin'
  created_at: string
}

export interface MockTest {
  id: string
  title: string
  description: string | null
  category: string
  duration_minutes: number
  total_marks: number
  positive_marks: number
  negative_marks: number
  is_free: boolean
  price: number
  is_published: boolean
  created_at: string
  questions_count?: number
}

export interface TestQuestion {
  id: string
  test_id: string
  section_name: string
  question_text: string
  question_image_url: string | null
  options: string[]
  correct_option_index: number
  explanation: string | null
  positive_marks: number | null
  negative_marks: number | null
  order_index: number
}

export interface StudentAnswerItem {
  question_id: string
  selected_option_index: number | null // null means unattempted
  is_marked_for_review: boolean
  time_spent_seconds: number
  is_correct?: boolean
  marks_awarded?: number
}

export interface TestAttempt {
  id: string
  test_id: string
  user_id: string
  student_name: string
  student_email: string
  score: number
  total_marks: number
  total_questions: number
  correct_count: number
  incorrect_count: number
  unattempted_count: number
  accuracy_percentage: number
  time_taken_seconds: number
  answers: StudentAnswerItem[]
  submitted_at: string
}

export type QuestionStatus = 'answered' | 'not_answered' | 'marked' | 'marked_and_answered' | 'not_visited'
