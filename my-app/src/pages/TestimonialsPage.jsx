import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, MapPin, Home as HomeIcon, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { testimonials, stats } from '../data/properties';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

/* ── Helpers ── */
const ALL_PROPERTIES = ['All', ...new Set(testimonials.map(t => t.property))];

function Initials({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = [
    ['#0A1628', '#E8A020'],
    ['#0F56A8', '#ffffff'],
    ['#1a3a5c', '#E8A020'],
    ['#0C2040', '#F5B730'],
  ];
  const [bg, text] = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-lg flex-shrink-0 shadow-md"
      style={{ background: bg, color: text }}
    >
      {initials}
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? 'text-[#E8A020]' : 'text-gray-300'}
          fill={s <= rating ? '#E8A020' : 'none'}
        />
      ))}
    </div>
  );
}

/* ── Testimonial Card ── */
function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-white rounded-2xl p-4 md:p-7 flex flex-col gap-3.5 md:gap-4 card-shadow
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <Quote className="w-6 h-6 md:w-[30px] md:h-[30px] text-[#E8A020] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Review */}
      <p className="text-gray-600 font-inter text-xs md:text-sm leading-relaxed flex-1">
        "{t.review}"
      </p>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Author */}
      <div className="min-w-0">
        <p className="font-poppins font-bold text-[#0A1628] text-xs md:text-sm leading-tight">{t.name}</p>
        <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-[10px] md:text-xs font-inter">
          <MapPin size={11} className="text-[#E8A020] flex-shrink-0" />
          <span className="truncate">{t.location}</span>
        </div>
      </div>
    </motion.div>
  );
}



/* ── Main Page ── */
export default function TestimonialsPage() {
  const [activeProperty, setActiveProperty] = useState('All');

  const filtered = useMemo(() =>
    activeProperty === 'All'
      ? testimonials
      : testimonials.filter(t => t.property === activeProperty),
    [activeProperty]
  );



  return (
    <>
      <Navbar forceScrolled />

      {/* ── Hero Banner ── */}
      <section
        className="relative pt-[64px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 55%, #0F3070 100%)',
          minHeight: '280px',
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
            <p className="gold-label mb-3">Customer Stories</p>
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              What Our <span style={{ color: '#E8A020' }}>Customers Say</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-xl font-inter mx-auto">
              Real experiences from real investors. See why 500+ happy families trust
              K.L.R. Infra Developers for their plot investments.
            </p>
          </motion.div>


        </div>
      </section>
      {/* ── All Reviews Grid ── */}
      <section className="py-20" style={{ background: '#F4F6FA' }}>
        <div className="container-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProperty}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((t, i) => (
                <TestimonialCard key={t.id} t={t} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="py-14 bg-white border-t border-gray-100">
        <div className="container-xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="gold-label mb-3">Why They Trust Us</p>
            <h2 className="section-title">Built on Transparency &amp; Trust</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: 'Zero Hidden Charges',   desc: 'What you see is what you pay — no surprises at any stage.' },
              { icon: CheckCircle, title: 'Clear Legal Titles',     desc: 'Every property is verified with DTCP/RERA approvals.' },
              { icon: CheckCircle, title: 'Personal Site Visits',   desc: 'We accompany you on every site visit, always.' },
              { icon: CheckCircle, title: 'After-Sales Support',    desc: 'Our relationship doesn\'t end at registration.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#F4F6FA]
                           hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                     style={{ background: 'rgba(232,160,32,0.12)' }}>
                  <item.icon size={22} className="text-[#E8A020]" />
                </div>
                <h3 className="font-poppins font-bold text-[#0A1628] text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm font-inter leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
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
            <MessageSquare size={36} className="mx-auto mb-4 text-[#E8A020]" />
            <h2 className="font-poppins font-bold text-white text-2xl md:text-4xl mb-3">
              Ready to Be Our Next Happy Customer?
            </h2>
            <p className="text-white/70 text-base max-w-lg mx-auto mb-8 font-inter">
              Join 500+ satisfied investors who found their perfect plot with K.L.R. Infra Developers.
              Let us guide your journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:9059613895" className="btn-gold">
                Talk to an Expert <ArrowRight size={15} />
              </a>
              <Link to="/contact" className="btn-outline-white">
                Send Enquiry <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
