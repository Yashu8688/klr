import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

const propertyOptions = [
  'Shadnagar Premium Plots',
  'Maheshwaram Open Plots',
  'Adibatla Premium Layout',
  'Yacharam Investment Plots',
  'Kandukur Investment Plots',
  'Other',
];

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', phone: '', email: '', interested: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <section id="contact" className="section-py bg-white">
      <div className="container-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="gold-label mb-3">Contact</p>
          <h2 className="section-title">Get In Touch</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">

          {/* ── Left: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            {[
              { icon: Phone, label: '+91 90596 13895', href: 'tel:9059613895' },
              { icon: Mail,  label: 'info@klrinfra.com', href: 'mailto:info@klrinfra.com' },
              { icon: MapPin, label: 'Hyderabad, Telangana, India', href: null },
            ].map(({ icon: Icon, label, href }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                     style={{ background: 'rgba(232,160,32,0.12)' }}>
                  <Icon size={16} style={{ color: '#E8A020' }} />
                </div>
                {href ? (
                  <a href={href} className="text-gray-700 font-inter text-sm hover:text-[#E8A020] transition-colors pt-2">
                    {label}
                  </a>
                ) : (
                  <p className="text-gray-700 font-inter text-sm pt-2">{label}</p>
                )}
              </div>
            ))}
          </motion.div>

          {/* ── Right: Form (spans 2 cols) ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {sent ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 size={44} className="mx-auto" style={{ color: '#E8A020' }} />
                <p className="font-poppins font-bold text-[#0A1628] text-lg">Message Sent!</p>
                <p className="text-gray-500 text-sm">We'll reach out within 24 hours.</p>
                <button onClick={() => setSent(false)}
                        className="text-sm text-[#E8A020] hover:underline font-semibold">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name | Phone | Email */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text" required placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm font-inter
                               text-gray-800 bg-[#F4F6FA] placeholder:text-gray-400
                               focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/15 outline-none transition"
                  />
                  <input
                    type="tel" required placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm font-inter
                               text-gray-800 bg-[#F4F6FA] placeholder:text-gray-400
                               focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/15 outline-none transition"
                  />
                  <input
                    type="email" placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm font-inter
                               text-gray-800 bg-[#F4F6FA] placeholder:text-gray-400
                               focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/15 outline-none transition"
                  />
                </div>

                {/* Row 2: Interested in */}
                <select
                  value={form.interested}
                  onChange={(e) => setForm({ ...form, interested: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm font-inter
                             text-gray-700 bg-[#F4F6FA]
                             focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/15 outline-none transition"
                >
                  <option value="">Interested In</option>
                  {propertyOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>

                {/* Row 3: Message */}
                <textarea
                  rows={4} placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm font-inter
                             text-gray-800 bg-[#F4F6FA] placeholder:text-gray-400 resize-none
                             focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/15 outline-none transition"
                />

                {/* Submit — right aligned */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-lg text-white
                               transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                    style={{ background: '#0A1628' }}
                  >
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={15} /> Send Message</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
