import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
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

/* ── Exactly 10 Premium Project Gallery Images ── */
const GALLERY_IMAGES = [
  { id: 1, src: heroImg, name: 'Overview & Aerial View' },
  { id: 2, src: galleryDroneImg, name: 'Drone Perspective' },
  { id: 3, src: galleryEntranceImg, name: 'Premium Entrance Gate' },
  { id: 4, src: galleryRoadsImg, name: 'Internal Blacktop Roads' },
  { id: 5, src: galleryGreeneryImg, name: 'Lush Green Landscaping' },
  { id: 6, src: propShadnagarImg, name: 'Shadnagar Layout Development' },
  { id: 7, src: propMaheshwaramImg, name: 'Maheshwaram Premium Plots' },
  { id: 8, src: propAdibatlaImg, name: 'Adibatla Township' },
  { id: 9, src: propYacharamImg, name: 'Yacharam Site Progress' },
  { id: 10, src: propKandukurImg, name: 'Kandukur Plot Layout' }
];

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  /* keyboard navigation for lightbox */
  const handleKey = useCallback((e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % GALLERY_IMAGES.length);
    if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    if (e.key === 'Escape')     setLightboxIndex(null);
  }, [lightboxIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #E8A020, transparent)' }} />
          <div className="absolute -bottom-10 -left-20 w-72 h-72 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #0F56A8, transparent)' }} />
          <div className="absolute inset-0 opacity-[0.04]"
               style={{
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                 backgroundSize: '40px 40px'
               }} />
        </div>

        <div className="container-xl relative z-10 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="gold-label mb-3 font-semibold uppercase tracking-wider">Visual Tour</p>
            <h1 className="font-poppins text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Our Project <span style={{ color: '#E8A020' }}>Gallery</span>
            </h1>
            <p className="text-white/65 text-base md:text-lg max-w-xl font-inter mx-auto">
              A curated visual showcase of our premium plots, world-class infrastructure, and layout developments across Hyderabad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Clean 10 Images Grid Section ── */}
      <section className="section-py" style={{ background: '#F4F6FA', minHeight: '50vh' }}>
        <div className="container-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GALLERY_IMAGES.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setLightboxIndex(index)}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 group bg-gray-50"
              >
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-90 group-hover:scale-100 transition-all">
                    <ZoomIn size={22} className="text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-10"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F56A8 100%)' }}
      >
        <div className="container-xl text-center">
          <Images size={36} className="mx-auto mb-4 text-[#E8A020]" />
          <h2 className="font-poppins font-bold text-white text-2xl md:text-4xl mb-3">
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
            <Link to="/contact" className="btn-outline-white">
              Send Enquiry <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && GALLERY_IMAGES[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(5,10,20,0.96)', backdropFilter: 'blur(10px)' }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
              <span className="text-sm text-white/60 font-inter bg-white/10 px-4 py-1.5 rounded-full">
                {lightboxIndex + 1} / {GALLERY_IMAGES.length}
              </span>
            </div>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 z-10 w-11 h-11 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length); }}
            >
              <ChevronLeft size={22} />
            </button>

            {/* Image Container */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center px-10 md:px-24"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_IMAGES[lightboxIndex].src}
                alt={GALLERY_IMAGES[lightboxIndex].name}
                className="max-w-4xl w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-poppins font-semibold text-lg">
                  {GALLERY_IMAGES[lightboxIndex].name}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 z-10 w-11 h-11 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length); }}
            >
              <ChevronRight size={22} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4 scrollbar-none">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition
                               ${i === lightboxIndex ? 'border-[#E8A020] scale-110' : 'border-white/20 hover:border-white/50'}`}
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
