import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PropertyCard({ property, index }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onClick={() => navigate(`/property/${property.id}`)}
      className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-xl
                 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image || (property.gallery && property.gallery[0])}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-poppins font-bold text-[#0A1628] text-lg group-hover:text-[#E8A020]
                       transition-colors duration-200 leading-snug">
          {property.name}
        </h3>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <MapPin size={13} className="text-[#E8A020]" />
          <span>{property.location}</span>
        </div>



        <p className="text-gray-500 text-sm font-inter leading-relaxed line-clamp-1">
          {property.description}
        </p>

        {/* CTA */}
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
                     rounded-lg border border-[#0A1628] text-[#0A1628] hover:bg-[#0A1628] hover:text-white
                     transition-all duration-200 mt-2 group/btn"
        >
          View Details
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </motion.div>
  );
}
