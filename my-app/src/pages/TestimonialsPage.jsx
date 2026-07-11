import { useState, useMemo } from 'react';
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
      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md"
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
      className="bg-white rounded-2xl p-7 flex flex-col gap-4 card-shadow
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <Quote size={30} className="text-[#E8A020] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
        <StarRating rating={t.rating} />
      </div>

      {/* Review */}
      <p className="text-gray-600 font-inter text-sm leading-relaxed flex-1">
        "{t.review}"
      </p>

      {/* Property tag */}
      <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold"
           style={{ background: 'rgba(232,160,32,0.1)', color: '#c9880f' }}>
        <HomeIcon size={11} />
        {t.property}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <Initials name={t.name} />
        <div className="min-w-0">
          <p className="font-poppins font-bold text-[#0A1628] text-sm leading-tight">{t.name}</p>
          <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-xs font-inter">
            <MapPin size={11} className="text-[#E8A020] flex-shrink-0" />
            <span className="truncate">{t.location}</span>
          </div>
          <p className="text-gray-400 text-[11px] font-inter mt-0.5">{t.date}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Featured / Hero card (large) ── */
function FeaturedCard({ t }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden p-8 md:p-12 flex flex-col gap-6"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 60%, #0F3070 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, #E8A020, transparent)' }} />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, #0F56A8, transparent)' }} />

      <Quote size={48} className="text-[#E8A020] relative z-10" />

      <p className="text-white text-lg md:text-2xl font-poppins font-medium leading-relaxed relative z-10 max-w-3xl">
        "{t.review}"
      </p>

      <div className="flex flex-wrap items-center gap-4 relative z-10">
        <Initials name={t.name} />
        <div>
          <p className="font-poppins font-bold text-white text-base">{t.name}</p>
          <div className="flex items-center gap-1.5 text-white/60 text-sm font-inter">
            <MapPin size={12} className="text-[#E8A020]" />
            {t.location}
          </div>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1.5">
          <StarRating rating={t.rating} />
          <span className="text-xs text-white/40 font-inter">{t.date}</span>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full text-xs font-semibold relative z-10"
           style={{ background: 'rgba(232,160,32,0.15)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)' }}>
        <HomeIcon size={11} />
        {t.property}
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

  const totalReviews = testimonials.length;
  const avgRating    = (testimonials.reduce((a, t) => a + t.rating, 0) / totalReviews).toFixed(1);
  const fiveStars    = testimonials.filter(t => t.rating === 5).length;

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

          {/* Rating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-6 mt-10 justify-center"
          >
            {[
              { label: 'Happy Customers',   value: '500+' },
              { label: 'Average Rating',    value: `${avgRating} ★` },
              { label: '5-Star Reviews',    value: `${fiveStars}/${totalReviews}` },
            ].map(s => (
              <div key={s.label} className="text-white/80">
                <span className="font-poppins font-bold text-xl text-[#E8A020]">{s.value}</span>
                <span className="text-sm ml-1.5">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Review ── */}
      <section className="py-8" style={{ background: '#F4F6FA' }}>
        <div className="container-xl">
          <FeaturedCard t={testimonials[0]} />
        </div>
      </section>

      {/* ── All Reviews Grid ── */}
      <section className="pb-20" style={{ background: '#F4F6FA' }}>
        <div className="container-xl">
          {/* Result count */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProperty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <h2 className="font-poppins font-bold text-[#0A1628] text-xl">
                {filtered.length} Review{filtered.length !== 1 ? 's' : ''}
                {activeProperty !== 'All' && (
                  <span className="text-[#E8A020]"> · {activeProperty}</span>
                )}
              </h2>
            </motion.div>
          </AnimatePresence>

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
            <h2 className="font-poppins font-bold text-white text-3xl md:text-4xl mb-3">
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
              <a href="/#contact" className="btn-outline-white">
                Send Enquiry <ArrowRight size={15} />
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
