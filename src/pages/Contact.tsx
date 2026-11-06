import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  PhoneCall
} from 'lucide-react'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    courseInterest: 'Academics (8th-12th)',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Open WhatsApp directly with inquiry message
    const msg = `Hello GLD Shikshalaya, My name is ${formData.name}. I am interested in ${formData.courseInterest}. ${formData.message}`
    window.open(`https://wa.me/919999302537?text=${encodeURIComponent(msg)}`, '_blank')
    setSubmitted(true)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telephone & WhatsApp',
      value: '+91 9999302537',
      sub: 'Monday to Saturday • 8:00 AM - 8:00 PM'
    },
    {
      icon: Mail,
      title: 'Official Email',
      value: 'info@gldinstitutions.com',
      sub: 'For admissions and student support'
    },
    {
      icon: MapPin,
      title: 'Campus Address',
      value: 'Milk Shop 12003 Shop 4 Prop No I 1258G I Block, Gali 18 Hari Nagar Extn, Badarpur, New Delhi, Delhi 110044',
      sub: 'Near Gali 18, Hari Nagar Extension'
    }
  ]

  return (
    <div className="min-h-screen bg-paper-light text-slate-900 pt-20 sm:pt-24 pb-20 md:pb-12">
      {/* ── HEADER ── */}
      <section className="relative py-12 sm:py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="badge-gold mb-3.5">
              <PhoneCall className="w-3.5 h-3.5 text-accent-gold" />
              <span>ACADEMIC COUNSELING & ADMISSIONS</span>
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-950 tracking-tight leading-tight">
              Connect With Our Faculty & Mentors
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              Have questions regarding course batches, CBT test series enrollment, or campus timings? Visit our center or reach out directly via WhatsApp and telephone.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Cards + Map */}
          <div className="lg:col-span-6 space-y-6">
            <div className="academic-card p-6 sm:p-7 space-y-6">
              <h2 className="font-heading font-bold text-xl text-slate-900">
                Official Campus Details
              </h2>

              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, title, value, sub }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Icon className="w-5 h-5 text-accent-gold" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-slate-900">{title}</h4>
                      <p className="text-slate-800 text-xs sm:text-sm font-medium mt-0.5">{value}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Support Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="academic-card p-3.5 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Consultation</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Free Batch Advice</p>
              </div>
              <div className="academic-card p-3.5 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Response</p>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">&lt; 2 Hours</p>
              </div>
              <div className="academic-card p-3.5 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Mode</p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">Campus + Online</p>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-subtle border border-slate-200/90 h-64 bg-slate-100 relative">
              <iframe
                src="https://maps.google.com/maps?q=GLD%20Institutions%2C%20Badarpur%2C%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Campus Location"
                className="absolute inset-0"
              />
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-6">
            <div className="academic-card p-6 sm:p-8 bg-white space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-gold">
                  DIRECT ADMISSIONS INQUIRY
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 mt-1">
                  Schedule Free Counseling
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  Fill in your details and our admission mentors will contact you via WhatsApp and phone call.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-heading font-bold text-lg text-emerald-900">Inquiry Sent Successfully!</h3>
                  <p className="text-xs text-emerald-800">
                    We have forwarded your details to our campus team. You can also chat directly with us on WhatsApp at +91 9999302537.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                  >
                    Submit Another Query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student / Parent Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Aman Kumar"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="courseInterest" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Program Interested In *
                    </label>
                    <select
                      id="courseInterest"
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50"
                    >
                      <option value="Academics (8th-10th All Subjects)">Class 8th to 10th (All Subjects)</option>
                      <option value="Academics (11th-12th PCB)">Class 11th & 12th (Science PCB)</option>
                      <option value="Academics (11th-12th Arts)">Class 11th & 12th (Arts Stream)</option>
                      <option value="CBT Mock Test Series (Court & SSC)">Competitive CBT Mock Test Series</option>
                      <option value="Computer Applications (DCA / ADCA)">Computer Applications (DCA / ADCA)</option>
                      <option value="Spoken English & Communication">Spoken English & Personality</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Query or Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ask about batch timings, fee concessions, or hostel recommendations..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-slate-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-primary-dark hover:bg-primary shadow-subtle hover:shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-accent-gold" />
                    <span>Send Inquiry on WhatsApp</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact