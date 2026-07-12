import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';
import propMaheshwaramImg from '../assets/prop-maheshwaram.png';

const badges = [
  { icon: ShieldCheck,  label: 'DTCP/RERA\nReady' },
  { icon: MapPin,       label: 'Premium\nLocations' },
  { icon: IndianRupee,  label: 'Affordable\nPricing' },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-[75vh] md:min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Full-screen background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-[position:45%_50%] md:bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      />

      {/* ── Dark blue overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(110deg, rgba(8,18,38,0.92) 0%, rgba(8,18,38,0.80) 40%, rgba(8,18,38,0.60) 65%, rgba(8,18,38,0.35) 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 container-xl w-full pt-24 pb-16">
        <div className="flex items-center gap-8 lg:gap-14">

          {/* ── LEFT: Text ── */}
          <div className="flex-1 min-w-0 space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-poppins font-extrabold text-white leading-[1.08] text-5xl sm:text-6xl md:text-7xl lg:text-[76px]"
            >
              Premium Plots
              <br />in Hyderabad
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="text-white/80 text-lg md:text-xl font-inter leading-relaxed max-w-xl"
            >
              Pocket-Friendly Prices. Premium Locations.
              <br />Trusted Investment.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="flex flex-wrap gap-4"
            >
              {/* Gold filled button */}
              <button
                onClick={() => navigate('/properties')}
                className="flex items-center gap-2 px-8 py-4 font-semibold rounded-full
                           text-white text-base transition-all duration-200 hover:brightness-110
                           hover:-translate-y-0.5 shadow-lg"
                style={{ background: '#E8A020' }}
              >
                View Properties <ArrowRight size={17} />
              </button>

              {/* White outline button */}
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 px-8 py-4 font-semibold rounded-full
                           text-white text-base border border-white/60
                           hover:bg-white/10 transition-all duration-200 hover:-translate-y-0.5"
              >
                Contact Us <ArrowRight size={17} />
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT: Image card + Badges grouped together ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block flex-shrink-0"
            style={{ marginRight: '160px' }}
          >
            {/* Outer wrapper — positions image and overlapping badges */}
            <div style={{ position: 'relative', display: 'inline-block' }}>

              {/* Property Image Card — portrait */}
              <div
                className="rounded-[24px] overflow-hidden shadow-2xl border-2 border-white/20"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(4px)',
                  width: '460px',
                }}
              >
                <img
                  src={propMaheshwaramImg}
                  alt="Premium Plot Layout"
                  style={{
                    width: '100%',
                    height: '440px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Badges — absolutely positioned, overlapping the right side */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-148px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {badges.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 + i * 0.12 }}
                    className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4"
                    style={{
                      minWidth: '160px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
                    }}
                  >
                    {/* Gold icon circle */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                      style={{ borderColor: '#E8A020' }}
                    >
                      <Icon size={18} style={{ color: '#E8A020' }} />
                    </div>
                    <span
                      className="font-poppins font-bold text-[#0A1628] text-sm leading-tight whitespace-pre-line"
                    >
                      {label}
                    </span>
                  </motion.div>
                ))}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
