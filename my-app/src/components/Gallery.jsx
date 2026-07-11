import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import heroImg from '../assets/hero.png';
import galleryRoadsImg from '../assets/gallery-roads.png';
import galleryGreeneryImg from '../assets/gallery-greenery.png';
import galleryEntranceImg from '../assets/gallery-entrance.png';
import galleryDroneImg from '../assets/gallery-drone.png';

const images = [
  { src: heroImg,           title: 'Aerial View' },
  { src: galleryRoadsImg,   title: 'Internal Roads' },
  { src: galleryGreeneryImg, title: 'Greenery' },
  { src: galleryEntranceImg, title: 'Entrance Gate' },
  { src: galleryDroneImg,   title: 'Drone View' },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="section-py" style={{ background: '#F4F6FA' }}>
      <div className="container-xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="gold-label mb-3">Gallery</p>
          <h2 className="section-title">Our Project Highlights</h2>
        </motion.div>

        {/* Horizontal image strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => setLightbox(i)}
              className="relative group rounded-xl overflow-hidden cursor-pointer shadow-sm
                         hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-44 object-cover gallery-img"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300
                              flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ZoomIn size={18} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-semibold">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 rounded-xl flex items-center
                         justify-center text-white hover:bg-white/20"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[lightbox].src}
              alt=""
              className="max-w-4xl max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
