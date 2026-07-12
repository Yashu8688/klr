import { motion } from 'framer-motion';
import { Search, ShieldCheck, Car, CreditCard, Headphones, FileText, Stamp, TrendingUp } from 'lucide-react';

const services = [
  {
    icon: Search,
    title: 'Plot Selection Assistance',
    desc: 'Helping you find the right plot matching your goals, location preference, and budget.',
  },
  {
    icon: ShieldCheck,
    title: 'Legal Verification & Documentation',
    desc: 'Thorough title deed checks, DTCP/RERA verification, and encumbrance certificates.',
  },
  {
    icon: Car,
    title: 'Site Visits & Guidance',
    desc: 'Personally accompanied visits to every property. See exactly what you invest in.',
  },
  {
    icon: CreditCard,
    title: 'Loan & Finance Assistance',
    desc: 'Easy home loan assistance from leading banks like SBI, HDFC, ICICI & more.',
  },
  {
    icon: Headphones,
    title: 'After-Sales Support',
    desc: 'We stay with you post-purchase for construction approvals and utility connections.',
  },
];

export default function Services() {
  return (
    <section id="services" className="section-py bg-white">
      <div className="container-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="gold-label mb-3">Our Services</p>
          <h2 className="section-title">End-to-End Support</h2>
          <p className="text-gray-500 font-inter text-base mt-3 max-w-lg mx-auto">
            From finding your plot to completing registration, we handle every step with care and transparency.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col p-6 rounded-2xl border border-gray-100 bg-white
                         hover:shadow-xl hover:border-[#E8A020]/20 transition-all duration-300 cursor-default overflow-hidden"
              style={{ boxShadow: '0 2px 16px rgba(10,22,40,0.06)' }}
            >
              {/* Top gold accent strip */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0
                            group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, #E8A020, #F5B730)' }}
              />

              {/* Step number */}
              <span
                className="absolute top-4 right-4 font-poppins text-5xl font-black leading-none select-none"
                style={{ color: 'rgba(232,160,32,0.07)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5
                            group-hover:scale-110 transition-transform duration-300"
                style={{ background: 'rgba(232,160,32,0.1)' }}
              >
                <Icon size={22} style={{ color: '#E8A020' }} />
              </div>

              <h3 className="font-poppins font-bold text-[#0A1628] text-sm leading-snug mb-2.5">{title}</h3>
              <p className="text-gray-500 text-xs font-inter leading-relaxed mt-auto">{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
