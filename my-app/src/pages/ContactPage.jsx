import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, Send, CheckCircle2, Clock,
  MessageCircle, ChevronDown, ArrowRight, Building2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

/* ── Data ── */
const propertyOptions = [
  'Shadnagar Premium Plots',
  'Maheshwaram Open Plots',
  'Adibatla Premium Layout',
  'Yacharam Investment Plots',
  'Kandukur Investment Plots',
  'General Enquiry',
  'Other',
];

const contactDetails = [
  {
    icon: Phone,
    label: 'Call Us',
    value: '+91 90596 13895',
    sub: 'Mon – Sat, 10:00 AM – 6:00 PM',
    href: 'tel:9059613895',
    color: '#0A1628',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+91 90596 13895',
    sub: 'Chat with us instantly',
    href: 'https://wa.me/919059613895',
    color: '#25D366',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'info@klrinfra.com',
    sub: 'We reply within 24 hours',
    href: 'mailto:info@klrinfra.com',
    color: '#E8A020',
  },
  {
    icon: MapPin,
    label: 'Visit Us',
    value: 'Hyderabad, Telangana',
    sub: 'India – 500 001',
    href: null,
    color: '#0F56A8',
  },
];

const faqs = [
  {
    q: 'Are the plots DTCP / RERA approved?',
    a: 'Yes. Every plot we offer is either DTCP or RERA approved. We provide complete legal documentation including LP numbers and encumbrance certificates before purchase.',
  },
  {
    q: 'Do you assist with bank loans?',
    a: 'Absolutely. We have tie-ups with SBI, HDFC, ICICI, Axis Bank and more. Our team will guide you through the entire loan application process at no extra cost.',
  },
  {
    q: 'Can I visit the site before purchasing?',
    a: 'Yes, we highly encourage site visits. Our team will arrange personal accompanied visits to any of our properties at your convenience — free of charge.',
  },
  {
    q: 'What is the registration process?',
    a: 'We handle all paperwork end-to-end — from the Agreement of Sale to the final Registration at the Sub-Registrar Office. Our clients typically complete registration in 1–2 weeks.',
  },
  {
    q: 'Are there any hidden charges?',
    a: 'Absolutely not. We believe in 100% transparent dealings. The price you see is the price you pay. All charges including registration fees are disclosed upfront.',
  },
];

/* ── Input field helper ── */
const inputCls = `w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm font-inter
  text-gray-800 bg-[#F4F6FA] placeholder:text-gray-400
  focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/15 outline-none transition`;

/* ── FAQ Accordion ── */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`border rounded-xl overflow-hidden transition-all duration-300
                  ${open ? 'border-[#E8A020]/50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-white"
      >
        <span className="font-poppins font-semibold text-[#0A1628] text-sm leading-snug">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className={open ? 'text-[#E8A020]' : 'text-gray-400'} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-6 pb-5 pt-0 text-sm text-gray-600 font-inter leading-relaxed bg-white border-t border-gray-50">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', interested: '', budget: '', message: '',
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <>
      <Navbar forceScrolled />

      {/* ── Hero Banner ── */}
      <section
        className="relative pt-[64px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 55%, #0F3070 100%)',
          minHeight: '260px',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #E8A020, transparent)' }} />
          <div className="absolute -bottom-10 -left-20 w-72 h-72 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #0F56A8, transparent)' }} />
          <div className="absolute inset-0 opacity-[0.04]"
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
               }} />
        </div>

        <div className="container-xl relative z-10 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="gold-label mb-3">We're Here to Help</p>
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Get In <span style={{ color: '#E8A020' }}>Touch With Us</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-xl font-inter mx-auto">
              Have a question about a property? Want to schedule a site visit? Our expert
              team is just a call or message away.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-6 mt-8 justify-center"
          >
            {[
              { icon: Clock, label: 'Mon – Sat, 10 AM – 6 PM' },
              { icon: Phone, label: '+91 90596 13895' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/70 text-sm font-inter">
                <Icon size={14} className="text-[#E8A020]" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-8" style={{ background: '#F4F6FA' }}>
        <div className="container-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactDetails.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex flex-col gap-3 p-6 bg-white rounded-2xl card-shadow
                               hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full"
                  >
                    <ContactCardInner c={c} />
                  </a>
                ) : (
                  <div className="flex flex-col gap-3 p-6 bg-white rounded-2xl card-shadow h-full">
                    <ContactCardInner c={c} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="pb-20" style={{ background: '#F4F6FA' }}>
        <div className="container-xl">
          <div className="grid lg:grid-cols-5 gap-8 items-start">

            {/* ── Form ── */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-white rounded-3xl p-8 md:p-10 card-shadow"
            >
              <div className="mb-7">
                <p className="gold-label mb-2">Send a Message</p>
                <h2 className="font-poppins font-bold text-[#0A1628] text-2xl">
                  Request a Callback
                </h2>
                <p className="text-gray-500 text-sm font-inter mt-1">
                  Fill in your details and we'll get back to you within 24 hours.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-16 flex flex-col items-center text-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                         style={{ background: 'rgba(232,160,32,0.12)' }}>
                      <CheckCircle2 size={40} className="text-[#E8A020]" />
                    </div>
                    <h3 className="font-poppins font-bold text-[#0A1628] text-xl">Message Sent!</h3>
                    <p className="text-gray-500 text-sm max-w-xs font-inter">
                      Thank you! Our team will reach out to you within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ firstName: '', lastName: '', phone: '', email: '', interested: '', budget: '', message: '' }); }}
                      className="mt-2 text-sm text-[#E8A020] font-semibold hover:underline"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-inter uppercase tracking-wide">
                          First Name <span className="text-[#E8A020]">*</span>
                        </label>
                        <input type="text" required placeholder="Ramesh" className={inputCls} {...field('firstName')} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-inter uppercase tracking-wide">
                          Last Name
                        </label>
                        <input type="text" placeholder="Reddy" className={inputCls} {...field('lastName')} />
                      </div>
                    </div>

                    {/* Phone + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-inter uppercase tracking-wide">
                          Phone Number <span className="text-[#E8A020]">*</span>
                        </label>
                        <input type="tel" required placeholder="+91 98765 43210" className={inputCls} {...field('phone')} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-inter uppercase tracking-wide">
                          Email Address
                        </label>
                        <input type="email" placeholder="name@email.com" className={inputCls} {...field('email')} />
                      </div>
                    </div>

                    {/* Interested in */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-inter uppercase tracking-wide">
                        Interested In
                      </label>
                      <select className={inputCls + ' cursor-pointer'} {...field('interested')}>
                        <option value="">Select a property…</option>
                        {propertyOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-inter uppercase tracking-wide">
                        Budget Range
                      </label>
                      <select className={inputCls + ' cursor-pointer'} {...field('budget')}>
                        <option value="">Select your budget…</option>
                        {['Under ₹20 Lakhs', '₹20 – ₹35 Lakhs', '₹35 – ₹55 Lakhs', 'Above ₹55 Lakhs', 'Flexible'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 font-inter uppercase tracking-wide">
                        Your Message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tell us what you're looking for or any specific questions…"
                        className={inputCls + ' resize-none'}
                        {...field('message')}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 text-sm font-semibold
                                 rounded-xl text-white transition-all duration-200
                                 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F56A8 100%)' }}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Message
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400 font-inter">
                      We respect your privacy. Your details will not be shared with anyone.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Side Info + Map ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Quick actions */}
              <div className="bg-white rounded-3xl p-7 card-shadow">
                <h3 className="font-poppins font-bold text-[#0A1628] text-lg mb-5">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <a
                    href="tel:9059613895"
                    className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm
                               text-white transition-all duration-200 hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #0A1628, #0F56A8)' }}
                  >
                    <Phone size={16} />
                    Call +91 90596 13895
                    <ArrowRight size={14} className="ml-auto" />
                  </a>
                  <a
                    href="https://wa.me/919059613895"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm
                               text-white transition-all duration-200 hover:opacity-90"
                    style={{ background: '#25D366' }}
                  >
                    <MessageCircle size={16} />
                    Chat on WhatsApp
                    <ArrowRight size={14} className="ml-auto" />
                  </a>
                  <a
                    href="mailto:info@klrinfra.com"
                    className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-sm
                               border border-gray-200 text-gray-700 hover:border-[#E8A020] hover:text-[#E8A020]
                               transition-all duration-200"
                  >
                    <Mail size={16} />
                    info@klrinfra.com
                    <ArrowRight size={14} className="ml-auto" />
                  </a>
                </div>
              </div>

              {/* Office hours */}
              <div className="bg-white rounded-3xl p-7 card-shadow">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                       style={{ background: 'rgba(232,160,32,0.1)' }}>
                    <Building2 size={17} className="text-[#E8A020]" />
                  </div>
                  <h3 className="font-poppins font-bold text-[#0A1628] text-lg">Office Hours</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { day: 'Monday – Friday', time: '10:00 AM – 6:00 PM', active: true },
                    { day: 'Saturday',         time: '10:00 AM – 4:00 PM', active: true },
                    { day: 'Sunday',            time: 'Closed',             active: false },
                  ].map(({ day, time, active }) => (
                    <div key={day} className="flex items-center justify-between text-sm font-inter">
                      <span className="text-gray-500">{day}</span>
                      <span className={`font-semibold ${active ? 'text-[#0A1628]' : 'text-gray-400'}`}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-3xl overflow-hidden card-shadow">
                <div className="p-5 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#E8A020]" />
                    <span className="font-poppins font-bold text-[#0A1628] text-sm">Our Coverage Area</span>
                  </div>
                  <p className="text-xs text-gray-400 font-inter mt-1">Hyderabad &amp; surrounding districts</p>
                </div>
                <div className="h-48 w-full">
                  <iframe
                    title="KLR Infra Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243646.9049219977!2d78.24323295!3d17.4123487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="section-py bg-white">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="gold-label mb-3">FAQ</p>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mt-3 font-inter">
              Can't find your answer? Call us directly or send a message using the form above.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-10"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F56A8 100%)' }}
      >
        <div className="container-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Phone size={36} className="mx-auto mb-4 text-[#E8A020]" />
            <h2 className="font-poppins font-bold text-white text-3xl md:text-4xl mb-3">
              Let's Find Your Dream Plot Together
            </h2>
            <p className="text-white/70 text-base max-w-lg mx-auto mb-8 font-inter">
              Our property experts are ready to guide you through every step — from
              site selection to registration.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:9059613895" className="btn-gold">
                Call Now <ArrowRight size={15} />
              </a>
              <a
                href="https://wa.me/919059613895"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-white"
              >
                WhatsApp Us <ArrowRight size={15} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}

/* ── Contact card inner content ── */
function ContactCardInner({ c }) {
  return (
    <>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${c.color}18` }}
      >
        <c.icon size={20} style={{ color: c.color }} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-inter mb-0.5">{c.label}</p>
        <p className="font-poppins font-bold text-[#0A1628] text-sm group-hover:text-[#E8A020] transition-colors duration-200">
          {c.value}
        </p>
        <p className="text-gray-400 text-xs font-inter mt-0.5">{c.sub}</p>
      </div>
    </>
  );
}
