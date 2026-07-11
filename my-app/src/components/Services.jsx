import { motion } from 'framer-motion';
import { Search, ShieldCheck, Car, CreditCard, Headphones } from 'lucide-react';

const services = [
  {
    icon: Search,
    title: 'Plot Selection Assistance',
    desc: 'Helping you find the right plot matching your goals and budget.',
  },
  {
    icon: ShieldCheck,
    title: 'Legal Verification & Documentation',
    desc: 'Trouble-free and transparent process for legal clearances.',
  },
  {
    icon: Car,
    title: 'Site Visits & Guidance',
    desc: 'Visit with our expert guidance through every property.',
  },
  {
    icon: CreditCard,
    title: 'Loan & Finance Assistance',
    desc: 'Assistance in getting easy home loans from leading banks.',
  },
  {
    icon: Headphones,
    title: 'After-Sales Support',
    desc: 'We are there for you even after the purchase is complete.',
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
          className="text-center mb-12"
        >
          <p className="gold-label mb-3">Our Services</p>
          <h2 className="section-title">End-to-End Support</h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group text-center p-6 rounded-xl border border-gray-100 bg-[#F4F6FA]
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center
                              transition-colors duration-300"
                   style={{ background: 'rgba(232,160,32,0.12)' }}>
                <Icon size={22} style={{ color: '#E8A020' }} />
              </div>
              <h3 className="font-poppins font-bold text-[#0A1628] text-sm leading-snug mb-2">{title}</h3>
              <p className="text-gray-500 text-xs font-inter leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
