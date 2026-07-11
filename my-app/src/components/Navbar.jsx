import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import yallamaLogoImg from '../assets/yallama-logo.png';

const navLinks = [
  { label: 'Home',         href: '#home',          page: '/',             isPage: false },
  { label: 'Properties',   href: '/properties',    page: '/properties',   isPage: true  },
  { label: 'Gallery',      href: '/gallery',        page: '/gallery',       isPage: true  },
  { label: 'Testimonials', href: '/testimonials',   page: '/testimonials',  isPage: true  },
  { label: 'Contact Us',   href: '/contact',        page: '/contact',       isPage: true  },
];

export default function Navbar({ forceScrolled = false }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (link) => {
    setActiveLink(link.href);
    setMobileOpen(false);
    if (link.isPage) {
      navigate(link.href);
    } else if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    } else {
      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentPath = location.pathname;
  const isSubPage   = location.pathname !== '/';

  // Floating = scrolled more than 80px on ANY page
  const isFloating = scrolled;

  // At the very top of sub-pages, show a semi-transparent glass (hero is dark, same palette)
  // At the very top of home page, fully transparent
  const atTopStyle = isSubPage
    ? {
        background: 'rgba(10, 22, 40, 0.92)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
      }
    : {
        background: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        border: 'none',
        borderRadius: '0',
        boxShadow: 'none',
      };

  const navStyle = {
    background: 'rgba(10, 22, 40, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
  };

  return (
    /* Outer wrapper: controls position + margins */
    <div
      className="fixed z-50 left-0 right-0"
      style={{
        top: '16px',
        padding: '0 18px',
      }}
    >
      <nav
        className="transition-all duration-500"
        style={navStyle}
      >
        <div className="container-xl">
          <div className="flex items-center justify-between h-[64px]">

            {/* ── Logo ── */}
            <button
              onClick={() => handleNav({ href: '#home', page: '/', isPage: false })}
              className="flex items-center gap-3.5"
            >
              <img src={logoImg} alt="K.L.R. Infra Developers" className="h-11 w-auto object-contain" />
              <div className="w-px h-6 bg-white/25 self-center" />
              <img src={yallamaLogoImg} alt="Yallama Logo" className="h-14 w-auto object-contain" />
            </button>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = link.isPage
                  ? currentPath === link.href
                  : (currentPath === '/' && activeLink === link.href);
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link)}
                    className={`px-4 py-1.5 text-sm font-medium font-inter rounded transition-colors duration-200
                      ${isActive
                        ? 'text-[#E8A020] underline underline-offset-4 decoration-[#E8A020]'
                        : 'text-white/85 hover:text-white'
                      }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* ── Phone CTA ── */}
            <div className="hidden md:flex">
              <a
                href="tel:9059613895"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-inter font-semibold
                           border border-white/50 text-white
                           hover:border-[#E8A020] hover:text-[#E8A020] transition-all duration-200"
              >
                <Phone size={13} />
                +91 90596 13895
              </a>
            </div>

            {/* ── Mobile Toggle ── */}
            <button
              className="lg:hidden text-white p-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t border-white/10"
            style={{
              background: 'rgba(10,22,40,0.98)',
              backdropFilter: 'blur(22px)',
              borderRadius: '0 0 16px 16px',
            }}
          >
            <div className="container-xl py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = link.isPage
                  ? currentPath === link.href
                  : (currentPath === '/' && activeLink === link.href);
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link)}
                    className={`text-left px-3 py-3 text-sm rounded font-inter
                      ${isActive ? 'text-[#E8A020] font-semibold' : 'text-white/80 hover:text-white'}`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <a
                href="tel:9059613895"
                className="flex items-center gap-2 px-3 py-3 text-sm text-[#E8A020] font-semibold
                           border-t border-white/10 mt-1"
              >
                <Phone size={14} /> +91 90596 13895
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
