import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import {
  ArrowLeft, MapPin, BadgeCheck, Phone, MessageCircle,
  CheckCircle2, Star, Building2, Home, Landmark, CreditCard,
  ChevronLeft, ChevronRight, ZoomIn, X
} from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function loadProperty() {
      try {
        const docSnap = await getDoc(doc(db, "properties", id));
        if (docSnap.exists()) {
          setProperty({ ...docSnap.data(), id: docSnap.id });
        }
      } catch (err) {
        console.error("Error loading property: ", err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  useEffect(() => {
    if (!property || !property.gallery || property.gallery.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % property.gallery.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [property]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F4F6FA]">
        <h2 className="font-poppins text-lg font-semibold text-[#0A1628]">Loading property details...</h2>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F4F6FA]">
        <h1 className="font-poppins text-2xl font-bold text-[#0A1628]">Property Not Found</h1>
        <button onClick={() => navigate('/properties')} className="btn-navy">
          <ArrowLeft size={18} /> Back to Properties
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'leads'), {
        id: Date.now(),
        name: form.name,
        phone: form.phone,
        email: '',
        property: property.name,
        message: form.message,
        status: 'New',
        date: new Date().toLocaleDateString('en-IN', { month: 'long', day: '2-digit', year: 'numeric' }),
        source: 'property-detail'
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting lead: ", err);
      alert("Failed to submit inquiry. Please try again.");
    }
  };

  const approvals = [];
  if (property.approval && Array.isArray(property.approval)) {
    approvals.push(...property.approval);
  } else {
    if (property.dtcpApproved) approvals.push('DTCP Approved');
    if (property.readyToRegister) approvals.push('Ready to Register');
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      {/* Back Button */}
      <div className="container-xl pt-6">
        <button
          onClick={() => navigate('/properties')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-gray-700 font-medium text-sm transition-all duration-200 shadow-sm"
        >
          <ArrowLeft size={16} className="text-gray-500" /> Back to Properties
        </button>
      </div>

      {/* Gallery Section (Bigger width: max-w-6xl / height: 500px) */}
      <div className="container-xl pt-4">
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Main Large Image Slider */}
          <div
            className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-md relative group cursor-pointer bg-[#0A1628]"
            onClick={() => setLightbox(activeSlide)}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={activeSlide}
                src={(property.gallery || [])[activeSlide] || property.image}
                alt={property.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/10 hover:bg-black/25 transition-colors z-10" />
            <span className="absolute bottom-4 left-4 bg-[#0A1628]/80 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 z-20">
              <ZoomIn size={12} /> View Photos (Autoplay)
            </span>
          </div>

          {/* Gallery thumbnails */}
          <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none">
            {(property.gallery || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border border-gray-200 hover:border-[#E8A020] transition-colors"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <button
              onClick={() => setLightbox(0)}
              className="flex-shrink-0 w-20 h-14 rounded-xl border border-dashed border-gray-300
                         flex items-center justify-center text-gray-400 hover:text-[#E8A020] hover:border-[#E8A020] transition-colors"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="container-xl pt-6 pb-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {approvals
              .filter((a) => typeof a === 'string' && !a.toLowerCase().includes('lp no'))
              .map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8A020]/10 text-[#E8A020] border border-[#E8A020]/30 text-xs font-semibold rounded-full shadow-sm">
                  <BadgeCheck size={13} /> {a}
                </span>
              ))}
            {(property.status || property.readyToRegister) && (
              <span className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-sm">
                {property.status || 'Ready to Register'}
              </span>
            )}
          </div>
          <h1 className="font-poppins text-3xl md:text-5xl font-extrabold text-[#0A1628]">{property.name}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-2.5 font-inter text-sm">
            <MapPin size={14} className="text-[#E8A020]" /> {property.location}
          </p>
        </div>
      </div>

      {/* Main content layout (Single column max-width 6xl) */}
      <div className="container-xl pb-16 pt-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Per Sq.Yd', value: property.pricePerSqYd, icon: Home },
              { label: 'Plot Sizes', value: property.plotSizes, icon: Building2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200">
                <Icon size={20} className="text-[#E8A020] mx-auto mb-2" />
                <p className="font-poppins font-bold text-[#0A1628] text-sm md:text-base leading-tight">
                  {value}
                </p>
                <p className="text-gray-400 text-[11px] md:text-xs font-inter mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Overview */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-poppins font-bold text-[#0A1628] text-lg md:text-xl mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
              Overview
            </h2>
            <p className="text-gray-600 font-inter text-sm md:text-base leading-relaxed">{property.description}</p>
          </div>

          {/* Key Highlights */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-poppins font-bold text-[#0A1628] text-lg md:text-xl mb-5 flex items-center gap-3">
              <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
              Key Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(property.highlights || []).map((h) => (
                <div key={h} className="flex items-start gap-2.5 p-3 bg-[#E8A020]/5 rounded-xl border border-[#E8A020]/10">
                  <CheckCircle2 size={15} className="text-[#E8A020] mt-0.5 flex-shrink-0" />
                  <span className="text-[#0A1628] text-xs md:text-sm font-inter font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-poppins font-bold text-[#0A1628] text-lg md:text-xl mb-5 flex items-center gap-3">
              <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {(property.amenities || []).map((item) => {
                const label = item?.label || (typeof item === 'string' ? item : 'Amenity');
                return (
                  <div key={label} className="flex items-center gap-3 p-3 md:p-4 bg-[#F4F6FA] rounded-2xl border border-gray-100">
                    <div className="w-8 h-8 md:w-9 h-9 bg-[#0F56A8]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star size={15} className="text-[#0F56A8]" />
                    </div>
                    <span className="text-[#0A1628] font-inter text-xs md:text-sm font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nearby Landmarks */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="font-poppins font-bold text-[#0A1628] text-lg md:text-xl mb-5 flex items-center gap-3">
              <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
              Nearby Landmarks
            </h2>
            <div className="space-y-3.5">
              {(property.nearbyLandmarks || []).map((l) => (
                <div key={l} className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#E8A020] flex-shrink-0" />
                  <span className="text-gray-700 font-inter text-xs md:text-sm">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Enquiry Form (placed down, centered and max-w-2xl) */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto w-full">
            <h3 className="font-poppins font-bold text-[#0A1628] text-lg mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#E8A020] rounded-full" />
              Quick Enquiry
            </h3>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                <p className="font-poppins font-bold text-[#0A1628]">Enquiry Sent!</p>
                <p className="text-gray-400 text-sm">We'll call you back within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-inter mb-1.5 block">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8A020]
                               focus:ring-2 focus:ring-[#E8A020]/10 outline-none text-sm font-inter
                               bg-white placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-inter mb-1.5 block">Contact No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contact No"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8A020]
                               focus:ring-2 focus:ring-[#E8A020]/10 outline-none text-sm font-inter
                               bg-white placeholder:text-gray-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-inter mb-1.5 block">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your requirements..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8A020]
                               focus:ring-2 focus:ring-[#E8A020]/10 outline-none text-sm font-inter
                               bg-white resize-none placeholder:text-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0A1628] text-white font-semibold rounded-2xl
                             hover:bg-[#0C2040] transition-colors duration-300 text-sm flex items-center justify-center gap-2"
                >
                  Send Enquiry
                </button>
              </form>
            )}

            {/* Call / WhatsApp */}
            <div className="flex gap-3 mt-5">
              <a
                href="tel:9059613895"
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#0A1628]
                           text-[#0A1628] rounded-2xl font-semibold text-sm hover:bg-[#0A1628] hover:text-white
                           transition-all duration-300"
              >
                <Phone size={15} /> Contact Us
              </a>
              <a
                href={`https://wa.me/919059613895?text=Interested in ${property.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50
                           text-emerald-600 border-2 border-emerald-200 rounded-2xl font-semibold text-sm
                           hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={22} />
          </button>

          {property.gallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => (prev === 0 ? property.gallery.length - 1 : prev - 1));
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((prev) => (prev === property.gallery.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <img
            src={property.gallery[lightbox] || property.image}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
