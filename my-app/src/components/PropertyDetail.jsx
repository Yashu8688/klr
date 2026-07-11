import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { properties } from '../data/properties';
import {
  ArrowLeft, MapPin, BadgeCheck, Phone, MessageCircle, Download,
  CheckCircle2, Star, Building2, Home, Landmark, CreditCard,
  ChevronLeft, ChevronRight, ZoomIn, X
} from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container-xl py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/properties')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#E8A020] font-inter text-sm
                       transition-colors duration-200 font-semibold"
          >
            <ArrowLeft size={18} /> Back to Properties
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-[55vh] overflow-hidden group/hero">
        <img
          src={property.gallery[activeImg] || property.image}
          alt={property.name}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/40 to-transparent" />

        {/* Prev/Next arrows for banner */}
        {property.gallery.length > 1 && (
          <>
            <button
              onClick={() => setActiveImg((prev) => (prev === 0 ? property.gallery.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all md:opacity-0 group-hover/hero:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setActiveImg((prev) => (prev === property.gallery.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all md:opacity-0 group-hover/hero:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 container-xl pb-8">
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            {property.approval.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8A020] text-white text-xs font-semibold rounded-full shadow-sm">
                <BadgeCheck size={13} /> {a}
              </span>
            ))}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              property.status === 'Limited Units' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {property.status}
            </span>
          </div>
          <h1 className="font-poppins text-3xl md:text-5xl font-extrabold text-white">{property.name}</h1>
          <p className="text-white/75 flex items-center gap-2 mt-2 font-inter text-sm">
            <MapPin size={14} className="text-[#E8A020]" /> {property.location}
          </p>
        </div>
      </div>

      {/* Gallery thumbnails */}
      <div className="bg-[#0A1628] py-4">
        <div className="container-xl">
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {property.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  i === activeImg ? 'border-[#E8A020] ring-2 ring-[#E8A020]/30' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <button
              onClick={() => setLightbox(activeImg)}
              className="flex-shrink-0 w-20 h-14 rounded-xl border-2 border-dashed border-white/20
                         flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <ZoomIn size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-xl py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price & size row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Price Range', value: property.price, icon: CreditCard },
                { label: 'Per Sq.Yd', value: property.pricePerSqYd, icon: Home },
                { label: 'Plot Sizes', value: property.plotSizes, icon: Building2 },
                { label: 'Total Plots', value: property.totalPlots + ' Plots', icon: Landmark },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200">
                  <Icon size={20} className="text-[#E8A020] mx-auto mb-2" />
                  <p className="font-poppins font-bold text-[#0A1628] text-base">{value}</p>
                  <p className="text-gray-400 text-xs font-inter mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-poppins font-bold text-[#0A1628] text-xl mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
                Overview
              </h2>
              <p className="text-gray-600 font-inter text-base leading-relaxed">{property.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-poppins font-bold text-[#0A1628] text-xl mb-5 flex items-center gap-3">
                <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
                Key Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2.5 p-3 bg-[#E8A020]/5 rounded-xl border border-[#E8A020]/10">
                    <CheckCircle2 size={15} className="text-[#E8A020] mt-0.5 flex-shrink-0" />
                    <span className="text-[#0A1628] text-sm font-inter font-medium">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-poppins font-bold text-[#0A1628] text-xl mb-5 flex items-center gap-3">
                <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map(({ label }) => (
                  <div key={label} className="flex items-center gap-3 p-4 bg-[#F4F6FA] rounded-2xl border border-gray-100">
                    <div className="w-9 h-9 bg-[#0F56A8]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star size={16} className="text-[#0F56A8]" />
                    </div>
                    <span className="text-[#0A1628] font-inter text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Landmarks */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-poppins font-bold text-[#0A1628] text-xl mb-5 flex items-center gap-3">
                <span className="w-1 h-6 bg-[#E8A020] rounded-full" />
                Nearby Landmarks
              </h2>
              <div className="space-y-3">
                {property.nearbyLandmarks.map((l) => (
                  <div key={l} className="flex items-center gap-3">
                    <MapPin size={16} className="text-[#E8A020] flex-shrink-0" />
                    <span className="text-gray-700 font-inter text-sm">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Enquiry Form */}
          <div className="space-y-6">
            {/* Price card */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100 sticky top-24">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-gray-400 text-xs font-inter">Starting from</p>
                  <p className="font-poppins text-3xl font-extrabold text-[#0A1628]">{property.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">{property.pricePerSqYd}</p>
                  <p className="text-[#0A1628] font-semibold text-sm">{property.plotSizes}</p>
                </div>
              </div>
              <div className="w-full h-px bg-gray-100 mb-6" />

              <h3 className="font-poppins font-bold text-[#0A1628] text-base mb-4">Quick Enquiry</h3>

              {submitted ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto" />
                  <p className="font-poppins font-bold text-[#0A1628]">Enquiry Sent!</p>
                  <p className="text-gray-400 text-sm">We'll call you back within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8A020]
                               focus:ring-2 focus:ring-[#E8A020]/10 outline-none text-sm font-inter
                               bg-white placeholder:text-gray-400"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8A020]
                               focus:ring-2 focus:ring-[#E8A020]/10 outline-none text-sm font-inter
                               bg-white placeholder:text-gray-400"
                  />
                  <textarea
                    rows={3}
                    placeholder="Message (optional)"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E8A020]
                               focus:ring-2 focus:ring-[#E8A020]/10 outline-none text-sm font-inter
                               bg-white resize-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0A1628] text-white font-semibold rounded-2xl
                               hover:bg-[#0C2040] transition-colors duration-300 text-sm"
                  >
                    Send Enquiry
                  </button>
                </form>
              )}

              {/* Call / WhatsApp */}
              <div className="flex gap-3 mt-4">
                <a
                  href="tel:9059613895"
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#0A1628]
                             text-[#0A1628] rounded-2xl font-semibold text-sm hover:bg-[#0A1628] hover:text-white
                             transition-all duration-300"
                >
                  <Phone size={15} /> Call
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
