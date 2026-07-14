import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn, X, ChevronLeft, ChevronRight, Images, ArrowRight, FolderOpen, Users, Folder
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function GalleryPage() {
  const [eventsGallery, setEventsGallery] = useState([]);
  const [clientsGallery, setClientsGallery] = useState([]);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const [eventsSnap, clientsSnap] = await Promise.all([
          getDocs(collection(db, "gallery_events")),
          getDocs(collection(db, "gallery_clients"))
        ]);

        const events = [];
        eventsSnap.forEach(doc => {
          const data = doc.data();
          const images = (data.images || []).filter(img => !img.hidden);
          events.push({
            ...data,
            id: doc.id,
            images,
            thumbnail: data.thumbnail || (images[0] ? images[0].src : '')
          });
        });

        const clients = [];
        clientsSnap.forEach(doc => {
          const data = doc.data();
          if (!data.hidden) {
            clients.push({
              ...data,
              id: doc.id
            });
          }
        });

        setEventsGallery(events);
        setClientsGallery(clients);
      } catch (err) {
        console.error("Error loading gallery from Firestore: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  /* keyboard navigation for lightbox */
  const handleKey = useCallback((e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % lightboxImages.length);
    if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length);
    if (e.key === 'Escape')     setLightboxIndex(null);
  }, [lightboxIndex, lightboxImages]);

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

      {/* ── Main Side-by-Side Grid Section ── */}
      <section className="section-py" style={{ background: '#F4F6FA', minHeight: '60vh' }}>
        <div className="container-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#E8A020] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 text-sm font-inter">Loading gallery...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
              
              {/* LEFT SIDE: Events & Albums */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200/60">
                  <div className="w-10 h-10 bg-[#E8A020]/10 rounded-xl flex items-center justify-center text-[#E8A020]">
                    <FolderOpen size={20} />
                  </div>
                  <div>
                    <h2 className="font-poppins font-bold text-xl md:text-2xl text-[#0A1628]">Events & Albums</h2>
                    <p className="text-xs text-gray-400 font-inter">Click album to view event photos</p>
                  </div>
                </div>

                {eventsGallery.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {eventsGallery.map((album, index) => (
                      <motion.div
                        key={album.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        whileHover={{ y: -4 }}
                        onClick={() => {
                          if (album.images && album.images.length > 0) {
                            setLightboxImages(album.images);
                            setLightboxIndex(0);
                          }
                        }}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md cursor-pointer group transition-all duration-300"
                      >
                        <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                          {album.thumbnail ? (
                            <img
                              src={album.thumbnail}
                              alt={album.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex w-full h-full items-center justify-center text-gray-300 bg-gray-50">
                              <Folder size={36} className="stroke-[1.5]" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-90 group-hover:scale-100 transition-all">
                              <ZoomIn size={16} className="text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-3 text-center bg-white border-t border-gray-50">
                          <h3 className="font-poppins font-bold text-xs md:text-sm text-[#0A1628] group-hover:text-[#E8A020] transition-colors line-clamp-1">
                            {album.name}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <FolderOpen size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 font-inter text-xs">No event albums found.</p>
                  </div>
                )}
              </div>

              {/* MIDDLE DIVIDER LINE (Visible only on lg screens) */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200/80 -translate-x-1/2" />

              {/* RIGHT SIDE: Happy Clients */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-200/60">
                  <div className="w-10 h-10 bg-[#E8A020]/10 rounded-xl flex items-center justify-center text-[#E8A020]">
                    <Users size={20} />
                  </div>
                  <div>
                    <h2 className="font-poppins font-bold text-xl md:text-2xl text-[#0A1628]">Happy Clients</h2>
                    <p className="text-xs text-gray-400 font-inter">Recent project handover & client photos</p>
                  </div>
                </div>

                {clientsGallery.length > 0 ? (
                  <div className="columns-2 sm:columns-3 lg:columns-2 xl:columns-3 gap-4 [column-fill:_balance] box-border">
                    {clientsGallery.map((img, index) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        whileHover={{ y: -4 }}
                        onClick={() => {
                          setLightboxImages(clientsGallery);
                          setLightboxIndex(index);
                        }}
                        className="break-inside-avoid mb-4 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 cursor-pointer transition-all duration-300 group bg-gray-50 block"
                      >
                        <img
                          src={img.src}
                          alt={img.name || 'Client Photo'}
                          className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-90 group-hover:scale-100 transition-all">
                            <ZoomIn size={16} className="text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Users size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 font-inter text-xs">No client photos uploaded yet.</p>
                  </div>
                )}
              </div>

            </div>
          )}
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
        {lightboxIndex !== null && lightboxImages[lightboxIndex] && (
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
                {lightboxIndex + 1} / {lightboxImages.length}
              </span>
            </div>

            {/* Prev */}
            <button
              className="absolute left-4 md:left-8 z-10 w-11 h-11 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length); }}
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
                src={lightboxImages[lightboxIndex].src}
                alt={lightboxImages[lightboxIndex].name || 'Gallery Image'}
                className="max-w-4xl w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="mt-4 text-center">
                <p className="text-white font-poppins font-semibold text-lg">
                  {lightboxImages[lightboxIndex].name || 'Gallery Image'}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-4 md:right-8 z-10 w-11 h-11 bg-white/10 hover:bg-white/20
                         rounded-xl flex items-center justify-center text-white transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % lightboxImages.length); }}
            >
              <ChevronRight size={22} />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] px-4 scrollbar-none">
              {lightboxImages.map((img, i) => (
                <button
                  key={img.id || i}
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
