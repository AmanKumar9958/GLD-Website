import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Award, HeartHandshake, Sparkles, Shield, Compass, Lightbulb } from 'lucide-react'

const About: React.FC = () => {
  const pillars = [
    { 
      icon: Users, 
      title: "Student-Centric Care", 
      description: "Every learner is paired with mentors who monitor progress, wellbeing and confidence." 
    },
    { 
      icon: Target, 
      title: "Excellence with Purpose", 
      description: "We combine rigorous academics with clear milestones so students know what success looks like." 
    },
    { 
      icon: Award, 
      title: "Holistic Growth", 
      description: "Communication, discipline and leadership are woven into everyday classroom experiences." 
    }
  ]

  const journey = [
    { icon: HeartHandshake, title: 'Founded on Care', desc: 'Started with the belief that education should feel personal, supportive and inspiring.' },
    { icon: Sparkles, title: 'Innovative Classrooms', desc: 'Adopted smart content, assessments and digital practice to keep learning engaging.' },
    { icon: Shield, title: 'Trusted by Families', desc: 'Hundreds of students and parents trust GLD for consistent results and mentorship.' },
  ]

  const commitments = [
    { icon: Compass, title: 'Clarity of Direction', desc: 'Clear roadmaps and counselling so you always know your next step.' },
    { icon: Lightbulb, title: 'Problem-Solving Mindset', desc: 'We encourage curiosity, discussions and real-world application of concepts.' },
  ]

  return (
    <div className="flex-grow overflow-hidden">
      {/* Hero */}
      <section
        className="relative py-20"
        style={{ background: 'linear-gradient(135deg, #0f1e5c 0%, #1E3A8A 45%, #172D6E 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }} />
        <div className="absolute top-8 left-10 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #DC2626 0%, transparent 70%)' }} />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mt-6 leading-tight"
          >
            A community where discipline, care and ambition
            <span className="text-red-200"> grow together.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 mt-4 text-lg max-w-3xl leading-relaxed"
          >
            GLD is not just an institution; it is the emotion beating in the heart of thousands of Gldians. We guide students with structured learning, unwavering mentorship and a culture that celebrates effort as much as outcomes.
          </motion.p>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase mb-3 px-4 py-1 rounded-full"
              style={{ color: '#DC2626', backgroundColor: '#FEE2E2' }}>
              Our Pillars
            </span>
            <h2 className="text-4xl font-heading font-bold text-primary mb-3">Built on trust & excellence</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every GLD experience is crafted to balance academics, discipline and care.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)' }}>
                  <Icon className="text-white" size={26} />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-3 text-primary">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold tracking-widest uppercase mb-3 px-4 py-1 rounded-full"
              style={{ color: '#1E3A8A', backgroundColor: '#DBEAFE' }}>
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-3">How GLD keeps growing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Continuous improvements, modern tools and a student-first mindset keep us evolving.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {journey.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="h-full bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}>
                  <Icon className="text-white" size={22} />
                </div>
                <h3 className="font-heading font-semibold text-primary mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #172D6E 50%, #0f1e5c 100%)' }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #DC2626 0%, transparent 70%)' }} />
            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">Our promise to every Gldian</h3>
                <p className="text-white/80 max-w-3xl">
                  We stand by our students with discipline, mentorship and compassion. From the first counselling session to the final exam, GLD is your partner in growth.
                </p>
              </div>
              <div className="grid gap-4">
                {commitments.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 bg-white/10 border border-white/15 rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold">{title}</h4>
                      <p className="text-white/80 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
