import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, MapPin, X, ChevronDown, ArrowRight, BadgeCheck
} from 'lucide-react';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

/* ── filter helpers ── */
const ALL_AREAS    = ['All', ...new Set(properties.map(p => p.area))];
const ALL_STATUSES = ['All', ...new Set(properties.map(p => p.status))];
const PRICE_RANGES = [
  { label: 'All Budgets',   min: 0,    max: Infinity },
  { label: 'Under ₹20 L',  min: 0,    max: 20 },
  { label: '₹20 L – ₹35 L',min: 20,   max: 35 },
  { label: '₹35 L – ₹55 L',min: 35,   max: 55 },
  { label: 'Above ₹55 L',  min: 55,   max: Infinity },
];

/* parse "₹18 L – ₹35 L" → midpoint number in Lakhs */
function parseMidPrice(priceStr) {
  const nums = [...priceStr.matchAll(/[\d,]+/g)].map(m => parseFloat(m[0].replace(',', '')));
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export default function PropertiesPage() {
  const [search,      setSearch]      = useState('');
  const [area,        setArea]        = useState('All');
  const [status,      setStatus]      = useState('All');
  const [priceRange,  setPriceRange]  = useState(0);   // index into PRICE_RANGES
  const [sortBy,      setSortBy]      = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const selectedRange = PRICE_RANGES[priceRange];

  const filtered = useMemo(() => {
    let list = [...properties];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    // area
    if (area !== 'All') list = list.filter(p => p.area === area);

    // status
    if (status !== 'All') list = list.filter(p => p.status === status);

    // price
    list = list.filter(p => {
      const mid = parseMidPrice(p.price);
      return mid >= selectedRange.min && mid <= selectedRange.max;
    });

    // sort
    if (sortBy === 'price-asc')  list.sort((a, b) => parseMidPrice(a.price) - parseMidPrice(b.price));
    if (sortBy === 'price-desc') list.sort((a, b) => parseMidPrice(b.price) - parseMidPrice(a.price));
    if (sortBy === 'featured')   list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return list;
  }, [search, area, status, priceRange, sortBy, selectedRange]);

  const clearAll = () => {
    setSearch(''); setArea('All'); setStatus('All');
    setPriceRange(0); setSortBy('default');
  };

  const hasFilters = search || area !== 'All' || status !== 'All' || priceRange !== 0 || sortBy !== 'default';

  return (
    <>
      <Navbar forceScrolled />

      {/* ── Hero Banner ── */}
      <section
        className="relative pt-[64px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 55%, #0F3070 100%)',
          minHeight: '280px',
        }}
      >
        {/* decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #E8A020, transparent)' }} />
          <div className="absolute -bottom-10 -left-20 w-72 h-72 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #0F56A8, transparent)' }} />
        </div>

        <div className="container-xl relative z-10 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="gold-label mb-3">Our Portfolio</p>
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Find Your <span style={{ color: '#E8A020' }}>Perfect Plot</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-xl font-inter mx-auto">
              Explore our curated collection of DTCP &amp; RERA approved plots across Hyderabad's
              most promising growth corridors.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-6 mt-8 justify-center"
          >
            {[
              { label: 'Total Properties', value: properties.length },
              { label: 'Locations', value: ALL_AREAS.length - 1 },
              { label: 'DTCP / RERA Approved', value: '100%' },
            ].map(s => (
              <div key={s.label} className="text-white/80">
                <span className="font-poppins font-bold text-xl text-[#E8A020]">{s.value}</span>
                <span className="text-sm ml-1.5">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <section className="section-py" style={{ background: '#F4F6FA' }}>
        <div className="container-xl">

          {/* Results header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="font-poppins font-bold text-[#0A1628] text-xl">
                {filtered.length === 0
                  ? 'No properties found'
                  : `${filtered.length} Propert${filtered.length === 1 ? 'y' : 'ies'} Found`}
              </h2>
              {hasFilters && (
                <p className="text-sm text-gray-500 mt-0.5 font-inter">
                  Filtered results · <button onClick={clearAll} className="text-[#E8A020] hover:underline">clear filters</button>
                </p>
              )}
            </div>

            {/* Active filter chips */}
            <div className="flex flex-wrap gap-2">
              {area !== 'All' && <Chip label={area} onRemove={() => setArea('All')} />}
              {status !== 'All' && <Chip label={status} onRemove={() => setStatus('All')} />}
              {priceRange !== 0 && <Chip label={selectedRange.label} onRemove={() => setPriceRange(0)} />}
            </div>
          </div>

          {/* Cards grid */}
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                {filtered.map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                     style={{ background: 'rgba(232,160,32,0.1)' }}>
                  <Search size={32} className="text-[#E8A020]" />
                </div>
                <h3 className="font-poppins font-bold text-[#0A1628] text-xl mb-2">No Properties Found</h3>
                <p className="text-gray-500 text-sm max-w-xs font-inter mb-5">
                  We couldn't find any properties matching your criteria. Try adjusting your filters.
                </p>
                <button onClick={clearAll} className="btn-gold">Clear All Filters</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-10"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F56A8 100%)' }}
      >
        <div className="container-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BadgeCheck size={36} className="mx-auto mb-4 text-[#E8A020]" />
            <h2 className="font-poppins font-bold text-white text-3xl md:text-4xl mb-3">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-white/70 text-base max-w-lg mx-auto mb-8 font-inter">
              Our advisors can help you find the perfect plot based on your budget, location,
              and investment goals. Get a free consultation today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:9059613895" className="btn-gold">
                Call Us Now <ArrowRight size={15} />
              </a>
              <a href="/#contact" className="btn-outline-white">
                Send Enquiry <ArrowRight size={15} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}

/* ── tiny reusable select-pill ── */
function SelectFilter({ label, value, onChange, options, labelMap = {}, fullWidth = false }) {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5 font-inter">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`appearance-none pr-7 pl-3 py-2 text-sm border rounded-lg font-inter text-gray-700
                      focus:outline-none focus:ring-2 focus:ring-[#E8A020]/40 focus:border-[#E8A020]
                      bg-white cursor-pointer transition ${fullWidth ? 'w-full' : ''}
                      ${value !== options[0] ? 'border-[#E8A020] text-[#E8A020] font-semibold' : 'border-gray-200'}`}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{labelMap[opt] ?? opt}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

/* ── active filter chip ── */
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                     bg-[#E8A020]/10 text-[#E8A020] border border-[#E8A020]/30">
      {label}
      <button onClick={onRemove} className="hover:text-[#c9880f]"><X size={11} /></button>
    </span>
  );
}
