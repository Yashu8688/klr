import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Users, Layers, MapPin, CheckCircle } from 'lucide-react';

const statIcons = [Calendar, Users, Layers, MapPin];

const stats = [
  { value: 2022, suffix: '', label: 'Year Established', isYear: true },
  { value: 500,  suffix: '+', label: 'Happy Customers' },
  { value: 25,   suffix: '+', label: 'Projects' },
  { value: 10,   suffix: '+', label: 'Prime Locations' },
];

const points = [
  'DTCP & RERA approved properties only',
  'End-to-end legal verification',
  'Loan assistance with leading banks',
  'Transparent pricing — no hidden charges',
  'Dedicated post-sale support',
  'Personally accompanied site visits',
];

function Counter({ target, isYear }) {
  const [count, setCount] = useState(isYear ? target - 3 : 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    const start = isYear ? target - 3 : 0;
    const dur = 1600;
    const step = (target - start) / (dur / 16);
    let cur = start;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, isYear]);

  return <span ref={ref}>{count}</span>;
}

export default function About() {
  return (
    <section id="about" className="section-py bg-white">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: About Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="space-y-7"
          >
            <div>
              <p className="gold-label mb-3">About Company</p>
              <h2 className="section-title">
                Building Trust.
                <br />Delivering Value.
              </h2>
              {/* Gold accent line */}
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-12 rounded-full" style={{ background: '#E8A020' }} />
                <div className="h-1 w-3 rounded-full" style={{ background: '#E8A020', opacity: 0.4 }} />
              </div>
            </div>

            <p className="text-gray-600 font-inter text-base leading-relaxed">
              K.L.R. Infra Developers is a Hyderabad-based real estate company committed to delivering
              premium open plots in prime locations at pocket-friendly prices. We focus on transparency,
              quality and customer satisfaction, ensuring the best value for your investment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {points.map((p) => (
                <div key={p} className="flex items-start gap-2.5 p-3 rounded-xl hover:bg-[#F4F6FA] transition-colors duration-200">
                  <CheckCircle size={16} className="text-[#E8A020] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm font-inter">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Stats 2×2 Grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-5"
          >
            {stats.map(({ value, suffix, label, isYear }, i) => {
              const Icon = statIcons[i];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(10,22,40,0.12)' }}
                  className="relative group bg-white rounded-2xl p-6 text-center cursor-default
                             border border-gray-100 transition-all duration-300"
                  style={{ boxShadow: '0 4px 24px rgba(10,22,40,0.07)' }}
                >
                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-10 rounded-full
                               group-hover:w-16 transition-all duration-300"
                    style={{ background: '#E8A020' }}
                  />
                  <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, rgba(232,160,32,0.15) 0%, rgba(232,160,32,0.05) 100%)' }}>
                    <Icon size={22} style={{ color: '#E8A020' }} />
                  </div>
                  <p className="font-poppins text-3xl font-extrabold" style={{ color: '#0A1628' }}>
                    <Counter target={value} isYear={isYear} />
                    <span style={{ color: '#E8A020' }}>{suffix}</span>
                  </p>
                  <p className="text-gray-500 text-sm font-inter mt-1 leading-tight">{label}</p>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
