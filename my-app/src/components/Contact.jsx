import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { getContactInfo, getWhatsAppLink, getPhoneLink } from '../data/contactData';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';

export default function Contact() {
  const [ci, setContactInfo] = useState(getContactInfo());
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchContact() {
      try {
        const snap = await getDoc(doc(db, "settings", "contact"));
        if (snap.exists()) {
          setContactInfo(snap.data());
        }
      } catch (err) {
        console.error("Error loading contact info: ", err);
      }
    }
    fetchContact();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'leads'), {
        id: Date.now(),
        name: form.fullName,
        phone: form.mobile,
        email: form.email || '',
        property: 'General Enquiry',
        message: form.message || '',
        status: 'New',
        date: new Date().toLocaleDateString('en-IN', { month: 'long', day: '2-digit', year: 'numeric' }),
        source: 'home'
      });
      setSent(true);
    } catch (err) {
      console.error("Error submitting lead: ", err);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-py" style={{ background: '#F4F6FA' }}>
      <div className="container-xl">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="gold-label mb-3">Contact Us</p>
          <h2 className="section-title">Let's Start a Conversation</h2>
          <p className="text-gray-500 font-inter text-base mt-3 max-w-xl mx-auto">
            Have questions about a property? We're here to help you make the best investment decision.
          </p>
        </motion.div>

        {/* Main Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-5"
             style={{ boxShadow: '0 32px 80px rgba(10,22,40,0.18)' }}>

          {/* ── LEFT: Get In Touch Info (2 cols) ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 p-5 md:p-12 flex flex-col justify-center bg-white"
          >
            <p className="text-[#E8A020] text-xs font-bold tracking-widest uppercase mb-1.5 md:mb-3 font-inter">Contact</p>
            <h3 className="font-poppins font-bold text-[#0A1628] text-2xl md:text-3xl mb-5 md:mb-10 leading-tight">
              Get In Touch
            </h3>

            <div className="flex flex-col sm:flex-row lg:flex-col sm:flex-wrap lg:space-y-6 gap-3.5 sm:gap-6 lg:gap-0">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(232,160,32,0.1)' }}>
                  <Phone size={18} className="md:w-5 md:h-5" style={{ color: '#E8A020' }} />
                </div>
                <a href={getPhoneLink(ci.primaryPhone)} className="text-gray-700 font-inter text-sm md:text-base font-medium hover:text-[#E8A020] transition-colors">
                  {ci.primaryPhone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(232,160,32,0.1)' }}>
                  <Mail size={18} className="md:w-5 md:h-5" style={{ color: '#E8A020' }} />
                </div>
                <a href={`mailto:${ci.email}`} className="text-gray-700 font-inter text-sm md:text-base font-medium hover:text-[#E8A020] transition-colors">
                  {ci.email}
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(232,160,32,0.1)' }}>
                  <MapPin size={18} className="md:w-5 md:h-5" style={{ color: '#E8A020' }} />
                </div>
                <span className="text-gray-700 font-inter text-sm md:text-base font-medium">
                  {ci.city}, {ci.state}, India
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Form Panel (3 cols) ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-3 bg-white p-5 md:p-12 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-center"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                     style={{ background: 'rgba(232,160,32,0.1)' }}>
                  <CheckCircle2 size={40} style={{ color: '#E8A020' }} />
                </div>
                <h3 className="font-poppins font-bold text-[#0A1628] text-2xl">Message Sent!</h3>
                <p className="text-gray-500 font-inter text-sm max-w-xs">
                  Thank you for reaching out. Our team will contact you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 flex items-center gap-2 text-sm text-[#E8A020] hover:underline font-semibold"
                >
                  Send Another Message <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-poppins font-bold text-[#0A1628] text-lg md:text-xl mb-1">Send Us a Message</h3>
                  <p className="text-gray-400 font-inter text-xs md:text-sm">Fill out the form and we'll get back to you shortly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Row 1: Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-inter">Full Name *</label>
                      <input
                        type="text" required placeholder="e.g. Ramesh Kumar"
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border text-sm font-inter text-gray-800
                                   bg-[#F8F9FC] placeholder:text-gray-300 outline-none transition-all duration-200"
                        style={{ borderColor: '#E5E7EB' }}
                        onFocus={(e) => { e.target.style.borderColor = '#E8A020'; e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.12)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-inter">Mobile Number *</label>
                      <input
                        type="tel" required placeholder="+91 98765 43210"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border text-sm font-inter text-gray-800
                                   bg-[#F8F9FC] placeholder:text-gray-300 outline-none transition-all duration-200"
                        style={{ borderColor: '#E5E7EB' }}
                        onFocus={(e) => { e.target.style.borderColor = '#E8A020'; e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.12)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-inter">Email Address</label>
                    <input
                      type="email" placeholder="ramesh@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm font-inter text-gray-800
                                 bg-[#F8F9FC] placeholder:text-gray-300 outline-none transition-all duration-200"
                      style={{ borderColor: '#E5E7EB' }}
                      onFocus={(e) => { e.target.style.borderColor = '#E8A020'; e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.12)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-inter">Your Message</label>
                    <textarea
                      rows={4} placeholder="Tell us about your requirements, budget, or any questions..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-sm font-inter text-gray-800
                                 bg-[#F8F9FC] placeholder:text-gray-300 resize-none outline-none transition-all duration-200"
                      style={{ borderColor: '#E5E7EB' }}
                      onFocus={(e) => { e.target.style.borderColor = '#E8A020'; e.target.style.boxShadow = '0 0 0 3px rgba(232,160,32,0.12)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 text-sm font-semibold rounded-xl
                               text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60
                               hover:-translate-y-0.5 active:translate-y-0"
                    style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 100%)' }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
