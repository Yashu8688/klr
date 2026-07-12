import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, IndianRupee, Handshake, Phone, TrendingUp } from 'lucide-react';

const items = [
  { icon: ShieldCheck, title: 'Legal & Clear Titles',  desc: 'All plots are DTCP & RERA approved with fully verified title deeds and encumbrance certificates.' },
  { icon: MapPin,       title: 'Premium Locations',    desc: 'Handpicked high-growth corridors in Hyderabad with strong appreciation potential.' },
  { icon: IndianRupee,  title: 'Affordable Pricing',   desc: 'Premium plots at middle-class-friendly prices. No compromise on quality or location.' },
  { icon: Handshake,    title: 'Transparent Deals',    desc: 'Zero hidden charges. What you see is what you pay. Full transparency every step.' },
  { icon: Phone,        title: 'Dedicated Support',    desc: 'Mon–Sat 10AM–6PM support. Our team is always available to answer your questions.' },
  { icon: TrendingUp,   title: 'High ROI Investment',  desc: 'Proven track record of high appreciation in rapidly developing zones around Hyderabad.' },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="section-py relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 60%, #0F2850 100%)' }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(232,160,32,0.6) 1px, transparent 0)',
             backgroundSize: '50px 50px',
           }} />

      <div className="relative z-10 container-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[#E8A020] text-xs font-semibold tracking-widest uppercase mb-3">
            Why Choose K.L.R. Infra Developers
          </p>
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Your Trusted Partner in Real Estate
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-px w-16 bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-[#E8A020]" />
            <div className="h-px w-16 bg-white/20" />
          </div>
        </motion.div>

        {/* 3×2 grid — bigger, richer cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              whileHover={{ y: -6, borderColor: 'rgba(232,160,32,0.5)' }}
              className="group flex items-start gap-5 p-6 rounded-2xl cursor-default transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Icon circle */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
                            group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: 'rgba(232,160,32,0.15)',
                  border: '1px solid rgba(232,160,32,0.25)',
                }}
              >
                <Icon size={22} style={{ color: '#E8A020' }} />
              </div>

              <div>
                <h3 className="font-poppins font-bold text-white text-base leading-snug mb-2">{title}</h3>
                <p className="text-white/50 text-sm font-inter leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
