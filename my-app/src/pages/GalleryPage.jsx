import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn, X, ChevronLeft, ChevronRight, Images, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

/* ── Image imports ── */
import heroImg           from '../assets/hero.png';
import galleryRoadsImg   from '../assets/gallery-roads.png';
import galleryGreeneryImg from '../assets/gallery-greenery.png';
import galleryEntranceImg from '../assets/gallery-entrance.png';
import galleryDroneImg   from '../assets/gallery-drone.png';
import propShadnagarImg  from '../assets/prop-shadnagar.png';
import propMaheshwaramImg from '../assets/prop-maheshwaram.png';
import propAdibatlaImg   from '../assets/prop-adibatla.png';
import propYacharamImg   from '../assets/prop-yacharam.png';
import propKandukurImg   from '../assets/prop-kandukur.png';
import aboutImg          from '../assets/about.png';

/* ── Gallery data ── */
const ALL_IMAGES = [
  { src: heroImg,            title: 'Aerial View',           category: 'Overview',   span: 'large' },
  { src: galleryDroneImg,    title: 'Drone View',            category: 'Overview',   span: 'large' },
  { src: galleryRoadsImg,    title: 'Internal Roads',        category: 'Infrastructure', span: 'normal' },
  { src: galleryEntranceImg, title: 'Entrance Gate',         category: 'Infrastructure', span: 'normal' },
  { src: galleryGreeneryImg, title: 'Greenery & Landscaping',category: 'Infrastructure', span: 'normal' },
  { src: aboutImg,           title: 'KLR Team',              category: 'About',      span: 'normal' },
  { src: propShadnagarImg,   title: 'Shadnagar Plots',       category: 'Properties', span: 'normal' },
  { src: propMaheshwaramImg, title: 'Maheshwaram Layout',    category: 'Properties', span: 'normal' },
  { src: propAdibatlaImg,    title: 'Adibatla Township',     category: 'Properties', span: 'large'  },
  { src: propYacharamImg,    title: 'Yacharam Plots',        category: 'Properties', span: 'normal' },
  { src: propKandukurImg,    title: 'Kandukur Layout',       category: 'Properties', span: 'normal' },
];

const CATEGORIES = ['All', ...new Set(ALL_IMAGES.map(i => i.category))];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null); // index into filtered list

  const filtered = activeCategory === 'All'
    ? ALL_IMAGES
    : ALL_IMAGES.filter(img => img.category === activeCategory);

  /* keyboard navigation for lightbox */
  const handleKey = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % filtered.length);
    if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + filtered.length) % filtered.length);
    if (e.key === 'Escape')     setLightbox(null);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  /* when category changes, close lightbox */
  const changeCategory = (cat) => {
    setActiveCategory(cat);
    setLightbox(null);
  };

  return (
    <>
      <Navbar forceScrolled />

      {/* ── Hero Banner ── */}
      <section
        className="relative pt-[64px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #0C2040 55%, #0F3070 100%)',
          minHeight: '260px',
        }}
      >
        {/* decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #E8A020, transparent)' }} />
          <div className="absolute -bottom-10 -left-20 w-72 h-72 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #0F56A8, transparent)' }} />
          {/* grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }} />
        </div>

        <div className="container-xl relative z-10 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="gold-label mb-3">Visual Tour</p>
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Our Project <span style={{ color: '#E8A020' }}>Gallery</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-xl font-inter mx-auto">
              A visual showcase of our premium plots, infrastructure, and landscapes across
              Hyderabad's fastest-growing corridors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section className="section-py" style={{ background: '#F4F6FA' }}>
        <div className="container-xl">

          {/* Masonry-style grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.src + i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  onClick={() => setLightbox(i)}
                  className={`relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm
                               hover:shadow-xl transition-all duration-300 hover:-translate-y-1
                               ${img.span === 'large' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Zoom icon */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                  opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center
                                    border border-white/30">
                      <ZoomIn size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-4
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E8A020] block mb-0.5">
                      {img.category}
                    </span>
                    <p className="text-white text-sm font-poppins font-semibold leading-tight">
                      {img.title}
                    </p>
                  </div>

                  {/* Index badge */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                      {i + 1} / {filtered.length}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
            <Images size={36} className="mx-auto mb-4 text-[#E8A020]" />
            <h2 className="font-poppins font-bold text-white text-3xl md:text-4xl mb-3">
              Interested in a Site Visit?
            </h2>
            <p className="text-white/70 text-base max-w-lg mx-auto mb-8 font-inter">
              Pictures only tell half the story. Schedule a personal site visit and experience
              our premium plots in person with our expert team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:9059613895" className="btn-gold">
                Book a Site Visit <ArrowRight size={15} />
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

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(5,10,20,0.95)', backdropFilter: 'blur(12px)' }}
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
              <span className="text-sm text-white/60 font-inter bg-white/10 px-4 py-1.5 rounded-full">
                {lightbox + 1} / {filtered.length}
              </span>
            </div>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 z-10 w-11 h-11 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + filtered.length) % filtered.length); }}
            >
              <ChevronLeft size={22} />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center px-16 md:px-24"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="max-w-4xl w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <span className="text-[#E8A020] text-xs font-semibold uppercase tracking-wider">
                  {filtered[lightbox].category}
                </span>
                <p className="text-white font-poppins font-semibold text-lg mt-1">
                  {filtered[lightbox].title}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 z-10 w-11 h-11 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % filtered.length); }}
            >
              <ChevronRight size={22} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4">
              {filtered.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition
                               ${i === lightbox ? 'border-[#E8A020] scale-110' : 'border-white/20 hover:border-white/50'}`}
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
