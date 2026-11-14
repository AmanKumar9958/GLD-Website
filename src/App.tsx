import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import Contact from './pages/Contact'
import Footer from './components/layout/Footer'
import { AuthProvider } from './context/AuthContext'
import { AuthModal } from './components/auth/AuthModal'
import { TestList } from './pages/tests/TestList'
import { TestInstructions } from './pages/tests/TestInstructions'
import { ExamRoom } from './pages/tests/ExamRoom'
import { TestResult } from './pages/tests/TestResult'

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const AppContent: React.FC = () => {
  const location = useLocation()
  const isExam = location.pathname.startsWith('/tests/exam/')

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tests" element={<TestList />} />
          <Route path="/tests/:id" element={<TestInstructions />} />
          <Route path="/tests/exam/:id" element={<ExamRoom />} />
          <Route path="/tests/result/:attemptId" element={<TestResult />} />
          <Route path="/tests/result" element={<Navigate to="/tests" replace />} />
        </Routes>
      </main>
      {!isExam && <Footer />}
      <AuthModal />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
