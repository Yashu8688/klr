import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

import heroImg from '../assets/hero.png';
import galleryRoadsImg from '../assets/gallery-roads.png';
import galleryGreeneryImg from '../assets/gallery-greenery.png';
import galleryEntranceImg from '../assets/gallery-entrance.png';
import galleryDroneImg from '../assets/gallery-drone.png';

const fallbackImages = [
  { src: heroImg,           title: 'Aerial View' },
  { src: galleryRoadsImg,   title: 'Internal Roads' },
  { src: galleryGreeneryImg, title: 'Greenery' },
  { src: galleryEntranceImg, title: 'Entrance Gate' },
  { src: galleryDroneImg,   title: 'Drone View' },
];

export default function Gallery() {
  const [images, setImages] = useState(fallbackImages);
  const [lightbox, setLightbox] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);

  // 1. Fetch images dynamically from Firestore
  useEffect(() => {
    async function fetchAllImages() {
      try {
        const [eventsSnap, clientsSnap] = await Promise.all([
          getDocs(collection(db, "gallery_events")),
          getDocs(collection(db, "gallery_clients"))
        ]);

        const list = [];

        // Flatten photos from events albums
        eventsSnap.forEach(doc => {
          const data = doc.data();
          const imgs = (data.images || []).filter(img => !img.hidden);
          imgs.forEach(img => {
            list.push({
              src: img.src,
              title: data.name || 'Event Photo'
            });
          });
        });

        // Flatten photos from happy clients
        clientsSnap.forEach(doc => {
          const data = doc.data();
          if (!data.hidden) {
            list.push({
              src: data.src,
              title: data.name || 'Happy Client'
            });
          }
        });

        if (list.length > 0) {
          setImages(list);
        }
      } catch (err) {
        console.error("Error loading home gallery images: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllImages();
  }, []);

  // 2. Setup responsive visible item counts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust current slide index if list or viewport changes
  useEffect(() => {
    const maxIndex = Math.max(0, images.length - visibleCount);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCount, images.length, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = images.length - visibleCount;
      if (maxIndex <= 0) return 0;
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = images.length - visibleCount;
      if (maxIndex <= 0) return 0;
      return prevIndex <= 0 ? maxIndex : prevIndex - 1;
    });
  };

  // 3. Auto-sliding timer
  useEffect(() => {
    if (isHovered || images.length <= visibleCount) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered, images, visibleCount]);

  return (
    <section id="gallery" className="section-py overflow-hidden" style={{ background: '#F4F6FA' }}>
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

        {/* Sliding Carousel Container */}
        <div 
          className="relative px-2 sm:px-6"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Inner slider viewport */}
          <div className="overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-500 ease-out gap-4 py-2"
              style={{ 
                transform: `translateX(calc(-${currentIndex} * (100% + 16px) / ${visibleCount}))`,
              }}
            >
              {images.map((img, i) => {
                const itemWidth = `calc((100% - ${(visibleCount - 1) * 16}px) / ${visibleCount})`;
                return (
                  <motion.div
                    key={i}
                    style={{ minWidth: itemWidth, width: itemWidth }}
                    onClick={() => setLightbox(i)}
                    className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm
                               hover:shadow-lg transition-all duration-300 bg-white border border-gray-100 flex-shrink-0"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300
                                    flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                      w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                        <ZoomIn size={18} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-xs font-inter font-semibold tracking-wide line-clamp-1">{img.title}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          {images.length > visibleCount && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-gray-50 text-[#0A1628] rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-10 border border-gray-100 -translate-x-2 sm:-translate-x-4"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-gray-50 text-[#0A1628] rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 z-10 border border-gray-100 translate-x-2 sm:translate-x-4"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
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
              className="max-w-4xl max-h-[80vh] object-contain rounded-2xl p-4"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
