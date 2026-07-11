import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '../data/properties';
import { Calendar, Users, Building2, MapPin } from 'lucide-react';

const icons = [Calendar, Users, Building2, MapPin];

function Counter({ target, suffix, isYear }) {
  const [count, setCount] = useState(isYear ? target - 3 : 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const start = isYear ? target - 3 : 0;
    const end = target;
    const duration = 1800;
    const step = (end - start) / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, isYear]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  return (
    <section className="relative z-10 -mt-16 section-container pb-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = icons[i];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(15,86,168,0.2)' }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-premium border border-gray-100
                         text-center flex flex-col items-center gap-3 cursor-default"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-poppins text-3xl sm:text-4xl font-extrabold text-primary">
                  <Counter target={stat.value} suffix={stat.suffix} isYear={stat.isYear} />
                  <span className="text-gold">{stat.suffix}</span>
                </p>
                <p className="font-inter text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
