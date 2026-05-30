import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageSquare, Clock, Sparkles } from 'lucide-react'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for form submission logic
    console.log(formData)
  }

  const contactInfo = [
    { icon: Mail, title: "Email", value: "info@gldinstitutions.com" },
    { icon: Phone, title: "Phone", value: "+91 9999302537" },
    { icon: MapPin, title: "Address", value: "Milk Shop 12003 Shop 4 Prop No I 1258G I Block, Gali 18 Hari Nagar Extn, Badarpur, New Delhi, Delhi 110044" }
  ]

  const supportPoints = [
    { icon: MessageSquare, label: 'Personalized Counselling' },
    { icon: Clock, label: 'Responses within 24 hours' },
    { icon: Sparkles, label: 'Guidance for all streams' },
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
        <div className="absolute top-8 right-12 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #DC2626 0%, transparent 70%)' }} />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mt-6 leading-tight"
          >
            We are here to listen, guide and support your journey.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 mt-4 text-lg max-w-3xl leading-relaxed"
          >
            Reach out for admissions, counselling or partnership opportunities. Our team will respond promptly.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-gray-50">
                <h2 className="text-2xl font-heading font-bold text-primary mb-4">Speak with us</h2>
                <p className="text-gray-600 mb-6">Share your queries and we will connect you with the right mentor or counsellor.</p>
                <div className="space-y-5">
                  {contactInfo.map(({ icon: Icon, title, value }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1E3A8A, #2563EB)' }}>
                        <Icon className="text-white" size={22} />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-primary">{title}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {supportPoints.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <Icon size={18} className="text-red-DEFAULT" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>

              {/* Map Iframe */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 bg-gray-100 relative">
                <iframe 
                  src="https://maps.google.com/maps?q=GLD%20Institutions%2C%20Badarpur%2C%20New%20Delhi&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #172D6E 50%, #0f1e5c 100%)' }}
                />
                <div className="relative p-8 md:p-10 text-white">
                  <h2 className="text-2xl font-heading font-bold mb-2">Send us a message</h2>
                  <p className="text-white/80 mb-6">Fill out the form and we will get back to you shortly.</p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm text-white/80 mb-2">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-DEFAULT"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm text-white/80 mb-2">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-DEFAULT"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm text-white/80 mb-2">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-DEFAULT"
                        rows={4}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-5 py-3 rounded-full font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
