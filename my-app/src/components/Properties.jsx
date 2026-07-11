import { motion } from 'framer-motion';
import { properties } from '../data/properties';
import PropertyCard from './PropertyCard';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const featured = properties.slice(0, 3); // Show 3 featured

export default function Properties() {
  const navigate = useNavigate();
  return (
    <section id="properties" className="section-py" style={{ background: '#F4F6FA' }}>
      <div className="container-xl">

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10 flex-wrap gap-4"
        >
          <div>
            <p className="gold-label mb-2">Featured Properties</p>
            <h2 className="section-title">Our Premium Plots</h2>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#0A1628]
                       hover:text-[#E8A020] transition-colors duration-200"
          >
            View All Properties <ArrowRight size={15} />
          </button>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {featured.map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
