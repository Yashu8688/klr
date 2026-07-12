import { Quote } from 'lucide-react';
import { testimonials } from '../data/properties';

function Initials({ name }) {
  const i = name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  return (
    <div className="w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-white text-[10px] md:text-sm flex-shrink-0"
         style={{ background: '#0A1628' }}>
      {i}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      className="w-[240px] sm:w-[340px] md:w-[440px] flex-shrink-0 p-3 md:p-6 rounded-2xl border border-gray-100 bg-[#F4F6FA] flex flex-col justify-between transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
    >
      <div>
        <Quote className="w-4 h-4 md:w-7 md:h-7 mb-2 md:mb-4 text-[#E8A020]" />
        <p className="text-gray-600 font-inter text-[11px] md:text-sm leading-relaxed mb-3 md:mb-5">
          "{t.review}"
        </p>
      </div>
      <div className="border-t border-gray-200/50 pt-2.5 md:pt-4 mt-auto">
        <p className="font-poppins font-bold text-[#0A1628] text-[11px] md:text-sm leading-tight">{t.name}</p>
        <p className="text-gray-400 text-[9px] md:text-xs font-inter mt-0.5">{t.location}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  // Duplicate the array to create a seamless infinite scroll loop
  const doubleTestimonials = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="section-py bg-white overflow-hidden">
      <div className="container-xl">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="gold-label mb-3">Testimonials</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden py-4">
          
          {/* Gradient overlays to fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="marquee-track">
            {doubleTestimonials.map((t, index) => (
              <TestimonialCard key={`${t.id}-${index}`} t={t} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
