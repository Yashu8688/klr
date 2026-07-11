import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, IndianRupee, Handshake, Phone, TrendingUp } from 'lucide-react';

const items = [
  { icon: ShieldCheck, title: 'Legal & Clear Titles', desc: 'All plots are DTCP & RERA approved with fully verified titles.' },
  { icon: MapPin,       title: 'Premium Locations',    desc: 'Best plots in high-growth areas with appreciation potential.' },
  { icon: IndianRupee,  title: 'Affordable Pricing',   desc: 'Best places to grow with our quality plots.' },
  { icon: Handshake,    title: 'Transparent Deals',    desc: 'No hidden charges. Full transparency at every step.' },
  { icon: Phone,        title: 'Customer Support',     desc: 'We are with you at every step in your journey.' },
  { icon: TrendingUp,   title: 'High ROI',             desc: 'Best investment today, better returns tomorrow.' },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="section-py"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 100%)' }}
    >
      <div className="container-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#E8A020] text-xs font-semibold tracking-widest uppercase mb-3">
            Why Choose K.L.R. Infra Developers
          </p>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white">
            Your Trusted Partner in Real Estate
          </h2>
        </motion.div>

        {/* 6-card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group text-center p-5 rounded-xl border border-white/10
                         hover:border-[#E8A020]/40 hover:bg-white/5 transition-all duration-300 cursor-default"
            >
              {/* Icon circle */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-white/20
                              group-hover:border-[#E8A020]/60 flex items-center justify-center
                              transition-colors duration-300">
                <Icon size={22} className="text-white/70 group-hover:text-[#E8A020] transition-colors duration-300" />
              </div>
              <h3 className="font-poppins font-bold text-white text-sm leading-snug mb-2">{title}</h3>
              <p className="text-white/50 text-xs font-inter leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
