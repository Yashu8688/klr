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
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: About Text ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <p className="gold-label mb-3">About Company</p>
              <h2 className="section-title">
                Building Trust.
                <br />Delivering Value.
              </h2>
            </div>

            <p className="text-gray-600 font-inter text-base leading-relaxed">
              K.L.R. Infra Developers is a Hyderabad-based real estate company committed to delivering
              premium open plots in prime locations at pocket-friendly prices. We focus on transparency,
              quality and customer satisfaction, ensuring the best value for your investment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {points.map((p) => (
                <div key={p} className="flex items-start gap-2">
                  <CheckCircle size={15} className="text-[#E8A020] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm font-inter">{p}</span>
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
            className="grid grid-cols-2 gap-4"
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
                  className="bg-[#F4F6FA] rounded-xl p-6 text-center hover:shadow-md
                             transition-shadow duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                       style={{ background: 'rgba(232,160,32,0.12)' }}>
                    <Icon size={22} style={{ color: '#E8A020' }} />
                  </div>
                  <p className="font-poppins text-3xl font-bold" style={{ color: '#0A1628' }}>
                    <Counter target={value} isYear={isYear} />
                    <span style={{ color: '#E8A020' }}>{suffix}</span>
                  </p>
                  <p className="text-gray-500 text-sm font-inter mt-1">{label}</p>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
