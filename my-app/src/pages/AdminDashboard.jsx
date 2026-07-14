import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Home, Users, MessageSquare,
  Plus, Edit2, Trash2, Search, Phone, Mail,
  MapPin, TrendingUp, FileText, X, UserCheck,
  Menu, Quote, AlertCircle, ImagePlus, PhoneCall,
  Globe, CheckCircle, UploadCloud, Image, FolderOpen, LogOut, User, Lock
} from 'lucide-react';
import {
  getProperties, saveProperties,
  getLeads, saveLeads,
  getTestimonials, saveTestimonials,
  getEventsGallery, saveEventsGallery,
  getClientsGallery, saveClientsGallery,
  getContactInfo, saveContactInfo,
} from '../data/adminData';
import './AdminDashboard.css';

/* ── Toast ── */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`adm-toast ${type}`}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

/* ── DragList ── */
function DragList({ items, onChange, placeholder }) {
  const [inputVal, setInputVal] = useState('');
  const dragIdx = useRef(null);

  const addItem = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setInputVal('');
  };

  const deleteItem = (idx) => onChange(items.filter((_, i) => i !== idx));
  const onDragStart = (idx) => { dragIdx.current = idx; };
  const onDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIdx.current, 1);
    reordered.splice(idx, 0, moved);
    dragIdx.current = idx;
    onChange(reordered);
  };
  const onDragEnd = () => { dragIdx.current = null; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--adm-smoke)', borderRadius: 8, padding: 8, border: '1.5px solid var(--adm-border)' }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 6, padding: '6px 10px', border: '1.5px solid var(--adm-border)', cursor: 'grab', userSelect: 'none' }}
            >
              <span style={{ color: 'var(--adm-text-4)', fontSize: 13 }}>⠿</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--adm-text-1)' }}>{item}</span>
              <button type="button" onClick={() => deleteItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0 2px', lineHeight: 1, fontSize: 14 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="adm-form-input"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
          placeholder={placeholder}
          style={{ flex: 1, fontSize: 13 }}
        />
        <button type="button" className="adm-btn adm-btn-gold" style={{ padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap' }} onClick={addItem}>+ Add</button>
      </div>
      {items.length > 0 && <div style={{ fontSize: 11, color: 'var(--adm-text-4)' }}>Drag ⠿ to reorder • ✕ to remove</div>}
    </div>
  );
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'klr@2026';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Auth
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('adm_auth') === '1');
  const [loginUser, setLoginUser] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [propertiesList, setPropertiesList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [eventsGallery, setEventsGallery] = useState([]);
  const [clientsGallery, setClientsGallery] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState('events');
  const [clientImageForm, setClientImageForm] = useState({ name: '' });
  const clientFileInputRef = useRef(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Property modal
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propForm, setPropForm] = useState({
    name: '', location: '', pricePerSqYd: '', plotSizes: '',
    totalPlots: '', description: '',
    highlights: [], amenities: [], nearbyLandmarks: [],
    dtcp: false, readyToRegister: false, hidden: false,
    gallery: []
  });

  // Testimonial modal
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [testForm, setTestForm] = useState({ name: '', location: '', property: '', review: '' });

  // Filters
  const [propertySearch, setPropertySearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterStatus, setLeadFilterStatus] = useState('All');

  // Gallery
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({ name: '', date: '' });

  // Contact form
  const [contactForm, setContactForm] = useState(null);
  const [contactSaving, setContactSaving] = useState(false);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    const load = async () => {
      const [props, leads, testimonials, events, clients, ci] = await Promise.all([
        getProperties(),
        getLeads(),
        getTestimonials(),
        getEventsGallery(),
        getClientsGallery(),
        getContactInfo()
      ]);
      setPropertiesList(props);
      setLeadsList(leads);
      setTestimonialsList(testimonials);
      setEventsGallery(events);
      setClientsGallery(clients);
      if (ci) {
        setContactInfo(ci);
        setContactForm({ ...ci });
      }
      setLoading(false);
    };
    load();
  }, [authed]);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUser.trim() === ADMIN_USERNAME && loginPwd === ADMIN_PASSWORD) {
      sessionStorage.setItem('adm_auth', '1');
      setAuthed(true);
      setLoginErr('');
    } else {
      setLoginErr('Incorrect username or password. Try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adm_auth');
    setAuthed(false);
    setLoginUser('');
    setLoginPwd('');
  };

  /* ── Property Actions ── */
  const openAddProperty = () => {
    setEditingProperty(null);
    setPropForm({ name: '', location: '', pricePerSqYd: '', plotSizes: '100 – 300 Sq.Yds', totalPlots: '', description: '', highlights: [], amenities: [], nearbyLandmarks: [], dtcp: false, readyToRegister: false, hidden: false, gallery: [] });
    setPropertyModalOpen(true);
  };
  const openEditProperty = (prop) => {
    setEditingProperty(prop);
    setPropForm({
      ...prop,
      pricePerSqYd: prop.pricePerSqYd || '',
      dtcp: prop.dtcp || false,
      readyToRegister: prop.readyToRegister || false,
      hidden: prop.hidden || false,
      highlights: prop.highlights || [],
      amenities: (prop.amenities || []).map(a => typeof a === 'object' ? a.label : a),
      nearbyLandmarks: prop.nearbyLandmarks || [],
      gallery: prop.gallery || []
    });
    setPropertyModalOpen(true);
  };
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...propForm,
      status: propForm.readyToRegister ? 'Ready to Register' : 'Available',
      price: propForm.pricePerSqYd,
      amenities: propForm.amenities.map(label => ({ icon: 'star', label })),
    };
    let updated;
    if (editingProperty) {
      updated = propertiesList.map(p => p.id === editingProperty.id ? { ...p, ...submissionData } : p);
    } else {
      updated = [...propertiesList, { ...submissionData, id: Date.now().toString() }];
    }
    setPropertiesList(updated);
    saveProperties(updated);
    setPropertyModalOpen(false);
    showToast(editingProperty ? 'Property updated!' : 'Property added!');
  };
  const deleteProperty = (id) => {
    if (window.confirm('Delete this property?')) {
      const updated = propertiesList.filter(p => p.id !== id);
      setPropertiesList(updated);
      saveProperties(updated);
      showToast('Property deleted.', 'error');
    }
  };

  /* ── Lead Actions ── */
  const updateLeadStatus = (id, newStatus) => {
    const updated = leadsList.map(l => l.id === id ? { ...l, status: newStatus } : l);
    setLeadsList(updated);
    saveLeads(updated);
    showToast('Lead status updated!');
  };
  const deleteLead = (id) => {
    if (window.confirm('Delete this lead?')) {
      const updated = leadsList.filter(l => l.id !== id);
      setLeadsList(updated);
      saveLeads(updated);
      showToast('Lead deleted.', 'error');
    }
  };

  /* ── Testimonial Actions ── */
  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    const updated = [...testimonialsList, { ...testForm, id: Date.now() }];
    setTestimonialsList(updated);
    saveTestimonials(updated);
    setTestimonialModalOpen(false);
    setTestForm({ name: '', location: '', property: '', review: '' });
    showToast('Testimonial added!');
  };
  const deleteTestimonial = (id) => {
    if (window.confirm('Delete this testimonial?')) {
      const updated = testimonialsList.filter(t => t.id !== id);
      setTestimonialsList(updated);
      saveTestimonials(updated);
      showToast('Testimonial deleted.', 'error');
    }
  };
  const approveTestimonial = (id) => {
    const updated = testimonialsList.map(t =>
      t.id === id || t.id.toString() === id.toString() ? { ...t, hidden: false } : t
    );
    setTestimonialsList(updated);
    saveTestimonials(updated);
    showToast('Testimonial approved!');
  };

  /* ── Gallery (Events) ── */
  const processFiles = (files) => {
    if (!currentAlbumId) return;
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (allowed.length === 0) { showToast('Only image files allowed!', 'error'); return; }
    allowed.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEventsGallery(prev => {
          const updated = prev.map(album => {
            if (album.id === currentAlbumId) {
              const newImage = { id: Date.now() + Math.random(), src: e.target.result, name: file.name, size: (file.size / 1024).toFixed(0) + ' KB' };
              return { ...album, images: [...(album.images || []), newImage], thumbnail: album.thumbnail || e.target.result };
            }
            return album;
          });
          saveEventsGallery(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    showToast(`${allowed.length} image(s) uploaded!`);
  };
  const handleFileInput = (e) => processFiles(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files); };
  const deleteAlbum = (albumId) => {
    if (window.confirm('Delete this album and all its images?')) {
      const updated = eventsGallery.filter(a => a.id !== albumId);
      setEventsGallery(updated);
      saveEventsGallery(updated);
      showToast('Album deleted.', 'error');
    }
  };
  const deleteAlbumImage = (imgId) => {
    if (window.confirm('Delete this image?')) {
      const updated = eventsGallery.map(album => {
        if (album.id === currentAlbumId) {
          const filteredImages = album.images.filter(img => img.id !== imgId);
          let newThumb = album.thumbnail;
          if (album.thumbnail && album.images.find(img => img.id === imgId)?.src === album.thumbnail) {
            newThumb = filteredImages[0] ? filteredImages[0].src : '';
          }
          return { ...album, images: filteredImages, thumbnail: newThumb };
        }
        return album;
      });
      setEventsGallery(updated);
      saveEventsGallery(updated);
      showToast('Image removed.', 'error');
    }
  };
  const setAlbumCover = (imgSrc) => {
    const updated = eventsGallery.map(album =>
      album.id === currentAlbumId ? { ...album, thumbnail: imgSrc } : album
    );
    setEventsGallery(updated);
    saveEventsGallery(updated);
    showToast('Album cover updated!');
  };
  const handleAddAlbumSubmit = (e) => {
    e.preventDefault();
    if (!albumForm.name.trim()) return;
    const newAlbum = { id: Date.now().toString(), name: albumForm.name, date: albumForm.date || new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), thumbnail: '', images: [] };
    const updated = [...eventsGallery, newAlbum];
    setEventsGallery(updated);
    saveEventsGallery(updated);
    setAlbumModalOpen(false);
    setAlbumForm({ name: '', date: '' });
    showToast('Album created!');
  };

  /* ── Gallery (Clients) ── */
  const handleClientFileInput = async (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) { showToast('Only image files allowed!', 'error'); return; }
    try {
      const readFile = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve({ src: ev.target.result, name: file.name });
        reader.readAsDataURL(file);
      });
      const results = await Promise.all(files.map(readFile));
      const newItems = results.map((res, idx) => ({ id: (Date.now() + idx).toString() + '-' + Math.random().toString(36).substring(2, 9), src: res.src, name: res.name }));
      setClientsGallery(prev => [...prev, ...newItems]);
      const updatedList = [...clientsGallery, ...newItems];
      await saveClientsGallery(updatedList);
      showToast(`${files.length} client photo(s) added!`);
    } catch (err) {
      showToast('Error uploading photos', 'error');
    }
  };
  const deleteClientImage = (imgId) => {
    if (window.confirm('Delete this client photo?')) {
      const updated = clientsGallery.filter(img => img.id !== imgId);
      setClientsGallery(updated);
      saveClientsGallery(updated);
      showToast('Client photo deleted.', 'error');
    }
  };

  /* ── Contact ── */
  const handleContactSave = (e) => {
    e.preventDefault();
    setContactSaving(true);
    setTimeout(() => {
      saveContactInfo(contactForm);
      setContactInfo({ ...contactForm });
      setContactSaving(false);
      showToast('Contact info saved!');
    }, 500);
  };
  const updateContact = (field, value) => setContactForm(prev => ({ ...prev, [field]: value }));

  /* ── Stats ── */
  const totalLeads = leadsList.length;
  const newLeadsCount = leadsList.filter(l => l.status === 'New').length;
  const homeEnquiries = leadsList.filter(l => l.source === 'home').length;
  const contactEnquiries = leadsList.filter(l => l.source === 'contact').length;
  const activeProjects = propertiesList.length;

  const statusBadgeClass = (s) => {
    if (s === 'Ready to Register') return 'adm-badge adm-badge-green';
    if (s === 'Available') return 'adm-badge adm-badge-blue';
    if (s === 'Limited Units') return 'adm-badge adm-badge-amber';
    return 'adm-badge adm-badge-gray';
  };
  const leadStatusClass = (s) => {
    if (s === 'New') return 'adm-status-select s-new';
    if (s === 'Contacted') return 'adm-status-select s-contacted';
    if (s === 'Interested') return 'adm-status-select s-interested';
    return 'adm-status-select s-closed';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'leads', label: 'Leads & Enquiries', icon: Users, badge: newLeadsCount },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: ImagePlus },
    { id: 'contact', label: 'Contact Information', icon: PhoneCall },
  ];

  const filteredLeads = leadsList
    .filter(l => leadFilterStatus === 'All' || l.status === leadFilterStatus)
    .filter(l =>
      l.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone?.includes(leadSearch) ||
      l.property?.toLowerCase().includes(leadSearch.toLowerCase())
    );

  const filteredProperties = propertiesList.filter(p =>
    p.name?.toLowerCase().includes(propertySearch.toLowerCase()) ||
    p.location?.toLowerCase().includes(propertySearch.toLowerCase())
  );

  const tabTitle = {
    dashboard: 'Dashboard', properties: 'Properties',
    leads: 'Leads & Enquiries', testimonials: 'Testimonials',
    gallery: 'Gallery', contact: 'Contact Information'
  };

  /* ── LOGIN PAGE ── */
  if (!authed) {
    return (
      <div className="adm-login-page">
        <div className="adm-login-bg-overlay" />
        <div className="adm-login-card">
          <div className="adm-login-brand">
            <div className="adm-brand-icon adm-login-brand-icon" style={{ background: 'linear-gradient(135deg, #e8a020, #c8860a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22 }}>K</div>
            <div>
              <div className="adm-login-title">K.L.R. Infra Developers</div>
              <div className="adm-login-subtitle">Admin Console</div>
            </div>
          </div>
          <div className="adm-login-heading">Welcome Back</div>
          <div className="adm-login-desc">Sign in to manage your properties & enquiries</div>
          <form onSubmit={handleLogin} className="adm-login-form">
            <div className="adm-login-field">
              <label className="adm-form-label">Username</label>
              <div className="adm-login-input-wrap" style={{ position: 'relative' }}>
                <User size={16} className="adm-login-input-icon" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <input
                  className="adm-form-input adm-login-input"
                  style={{ paddingLeft: 38 }}
                  type="text"
                  placeholder="Enter username"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="adm-login-field">
              <label className="adm-form-label">Password</label>
              <div className="adm-login-input-wrap" style={{ position: 'relative' }}>
                <Lock size={16} className="adm-login-input-icon" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none' }} />
                <input
                  className="adm-form-input adm-login-input"
                  style={{ paddingLeft: 38 }}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={loginPwd}
                  onChange={e => setLoginPwd(e.target.value)}
                  required
                />
                <button type="button" className="adm-login-eye-btn" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {loginErr && (
              <div className="adm-login-error">
                <AlertCircle size={14} /> {loginErr}
              </div>
            )}
            <button type="submit" className="adm-btn adm-btn-gold adm-login-btn">
              Sign In to Admin Panel
            </button>
          </form>
          <div className="adm-login-footer">© 2026 K.L.R. Infra Developers - Secured Admin Access</div>
        </div>
      </div>
    );
  }

  /* ── LOADING ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--adm-smoke)', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #e8a020', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 15, color: '#555', fontWeight: 500 }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  /* ── MAIN DASHBOARD ── */
  return (
    <div className="adm-layout">

      {/* SIDEBAR */}
      <aside className={`adm-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="adm-sidebar-brand">
          <div className="adm-brand-logo">
            <div className="adm-brand-icon">K</div>
            <div className="adm-brand-text">
              <div className="adm-brand-name">K.L.R. Infra</div>
              <div className="adm-brand-sub">Admin Console</div>
            </div>
          </div>
          <button className="adm-sidebar-close" onClick={() => setSidebarOpen(false)}><X size={17} /></button>
        </div>

        <nav className="adm-sidebar-nav">
          <div className="adm-nav-section-label">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`adm-nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            >
              <div className="adm-nav-item-left">
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && <span className="adm-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-bottom">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <LogOut size={14} /> Sign Out
          </button>
          <div className="adm-sidebar-footer">© 2026 K.L.R. Infra Developers</div>
        </div>
      </aside>

      {sidebarOpen && <div className="adm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN */}
      <div className="adm-main-content">

        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button className="adm-hamburger" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <h1 className="adm-topbar-title">{tabTitle[activeTab]}</h1>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-admin-info">
              <div className="adm-admin-name">Administrator</div>
              <div className="adm-admin-role">KLR Infra Admin</div>
            </div>
            <div className="adm-admin-avatar">A</div>
          </div>
        </header>

        <main className="adm-page-content">

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="adm-stats-grid">
                {[
                  { label: 'Total Enquiries', value: totalLeads, sub: 'All submitted queries', cls: 'blue', icon: Users },
                  { label: 'New Enquiries', value: newLeadsCount, sub: 'Awaiting response', cls: 'emerald', icon: UserCheck },
                  { label: 'Total Properties', value: activeProjects, sub: 'Hyderabad regions', cls: 'violet', icon: TrendingUp },
                  { label: 'Home Page Enquiries', value: homeEnquiries, sub: 'Submitted via homepage form', cls: 'amber', icon: Home },
                  { label: 'Contact Page Enquiries', value: contactEnquiries, sub: 'Submitted via contact page', cls: 'emerald', icon: Mail },
                ].map((s, i) => (
                  <div className="adm-stat-card" key={i}>
                    <div className={`adm-stat-icon ${s.cls}`}><s.icon size={21} /></div>
                    <div className="adm-stat-body">
                      <div className="adm-stat-label">{s.label}</div>
                      <div className="adm-stat-value">{s.value}</div>
                      <div className="adm-stat-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="adm-dashboard-grid">
                <div className="adm-card">
                  <div className="adm-card-header">
                    <div className="adm-card-title">Recent Queries</div>
                    <button className="adm-card-link" onClick={() => setActiveTab('leads')}>View All →</button>
                  </div>
                  <div className="adm-card-body">
                    {leadsList.length === 0 ? (
                      <div className="adm-empty-state"><div className="adm-empty-icon"><AlertCircle size={22} /></div>No enquiries yet.</div>
                    ) : (
                      <div className="adm-recent-list">
                        {leadsList.slice(0, 5).map(lead => (
                          <div className="adm-recent-item" key={lead.id}>
                            <div className="adm-recent-avatar">{lead.name?.[0] || '?'}</div>
                            <div className="adm-recent-info">
                              <div className="adm-recent-name">{lead.name}</div>
                              <div className="adm-recent-prop">{lead.property}</div>
                              <div className="adm-recent-date">{lead.date}</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                              <span className={lead.status === 'New' ? 'adm-badge adm-badge-red' : lead.status === 'Contacted' ? 'adm-badge adm-badge-blue' : lead.status === 'Interested' ? 'adm-badge adm-badge-amber' : 'adm-badge adm-badge-green'}>{lead.status}</span>
                              <span className={`adm-source-badge ${lead.source === 'home' ? 'source-home' : 'source-contact'}`}>{lead.source === 'home' ? 'Home' : 'Contact'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROPERTIES ── */}
          {activeTab === 'properties' && (
            <div>
              <div className="adm-section-header">
                <div className="adm-search-bar">
                  <Search size={14} />
                  <input className="adm-search-input" type="text" placeholder="Search properties..." value={propertySearch} onChange={e => setPropertySearch(e.target.value)} />
                </div>
                <button className="adm-btn adm-btn-gold" onClick={openAddProperty}><Plus size={15} /> Add Property</button>
              </div>
              <div className="adm-table-wrapper">
                <table className="adm-data-table">
                  <thead>
                    <tr>
                      <th>Property Name</th><th>Location</th><th>Pricing</th><th>Plots</th><th>Status</th><th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map(prop => (
                      <tr key={prop.id}>
                        <td className="adm-td-name">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={prop.image || (prop.gallery?.[0]) || 'https://via.placeholder.com/60x40?text=No+Image'} style={{ width: 44, height: 30, borderRadius: 4, objectFit: 'cover', background: '#eee', border: '1px solid #ddd', flexShrink: 0 }} />
                            <span>{prop.name}</span>
                          </div>
                        </td>
                        <td className="adm-td-muted"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} style={{ color: '#aaa', flexShrink: 0 }} /> {prop.location}</span></td>
                        <td className="adm-td-price">{prop.price || prop.pricePerSqYd}</td>
                        <td className="adm-td-muted">{prop.totalPlots}</td>
                        <td><span className={statusBadgeClass(prop.status)}>{prop.status}</span></td>
                        <td>
                          <div className="adm-td-actions">
                            <button className="adm-btn-icon adm-btn-icon-edit" onClick={() => openEditProperty(prop)} title="Edit"><Edit2 size={13} /></button>
                            <button className="adm-btn-icon adm-btn-icon-delete" onClick={() => deleteProperty(prop.id)} title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProperties.length === 0 && (
                      <tr><td colSpan="6"><div className="adm-empty-state"><div className="adm-empty-icon"><Home size={22} /></div>No properties found.</div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── LEADS ── */}
          {activeTab === 'leads' && (
            <div>
              <div className="adm-section-header">
                <div className="adm-filters-row">
                  <div className="adm-search-bar">
                    <Search size={14} />
                    <input className="adm-search-input" type="text" placeholder="Search leads..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} />
                  </div>
                  <span className="adm-filter-label">Status:</span>
                  <select className="adm-filter-select" value={leadFilterStatus} onChange={e => setLeadFilterStatus(e.target.value)}>
                    <option value="All">All Leads</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="adm-table-wrapper">
                <table className="adm-data-table">
                  <thead>
                    <tr><th>Date</th><th>Customer</th><th>Property / Message</th><th>Source</th><th>Status</th><th style={{ textAlign: 'center' }}>Delete</th></tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id}>
                        <td className="adm-td-muted" style={{ whiteSpace: 'nowrap' }}>{lead.date}</td>
                        <td>
                          <div className="adm-lead-contact">
                            <div className="adm-lead-name">{lead.name}</div>
                            <div className="adm-lead-phone"><Phone size={10} /> {lead.phone}</div>
                            <div className="adm-lead-email"><Mail size={10} /> {lead.email}</div>
                          </div>
                        </td>
                        <td style={{ maxWidth: 280 }}>
                          <div className="adm-td-name" style={{ marginBottom: 3 }}>{lead.property}</div>
                          <div className="adm-lead-msg">"{lead.message}"</div>
                        </td>
                        <td>
                          <span className={`adm-source-badge-pill ${lead.source === 'home' ? 'source-home' : 'source-contact'}`}>
                            {lead.source === 'home' ? 'Home' : 'Contact'}
                          </span>
                        </td>
                        <td>
                          <select className={leadStatusClass(lead.status)} value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value)}>
                            <option value="New">🔴 New</option>
                            <option value="Contacted">🔵 Contacted</option>
                            <option value="Interested">🟡 Interested</option>
                            <option value="Closed">🟢 Closed</option>
                          </select>
                        </td>
                        <td><div className="adm-td-actions"><button className="adm-btn-icon adm-btn-icon-delete" onClick={() => deleteLead(lead.id)}><Trash2 size={13} /></button></div></td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr><td colSpan="6"><div className="adm-empty-state"><div className="adm-empty-icon"><Users size={22} /></div>No enquiries found.</div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TESTIMONIALS ── */}
          {activeTab === 'testimonials' && (
            <div>
              <div className="adm-section-header">
                <div />
                <button className="adm-btn adm-btn-gold" onClick={() => { setTestForm({ name: '', location: '', property: '', review: '' }); setTestimonialModalOpen(true); }}>
                  <Plus size={15} /> Add Testimonial
                </button>
              </div>
              {testimonialsList.length === 0 ? (
                <div className="adm-card"><div className="adm-card-body"><div className="adm-empty-state"><div className="adm-empty-icon"><MessageSquare size={22} /></div>No reviews yet.</div></div></div>
              ) : (
                <div className="adm-testimonials-grid">
                  {testimonialsList.map(t => (
                    <div className="adm-test-card" key={t.id} style={t.hidden ? { border: '2px solid #E8A020', boxShadow: '0 4px 20px rgba(232,160,32,0.12)' } : {}}>
                      {t.hidden && (
                        <div style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 10 }}>
                          Pending Approval
                        </div>
                      )}
                      <Quote size={30} className="adm-test-quote" />
                      <p className="adm-test-review">"{t.review}"</p>
                      <div className="adm-test-footer">
                        <div className="adm-test-author">
                          <div className="adm-test-name">{t.name}</div>
                          <div className="adm-test-location">{t.location}</div>
                          <span className="adm-test-prop-tag">{t.property}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {t.hidden && (
                            <button className="adm-btn-icon" style={{ background: '#10B981', color: '#fff', width: 28, height: 28, borderRadius: 6 }} onClick={() => approveTestimonial(t.id)} title="Approve">
                              <CheckCircle size={14} />
                            </button>
                          )}
                          <button className="adm-btn-icon adm-btn-icon-delete" style={{ width: 28, height: 28, borderRadius: 6 }} onClick={() => deleteTestimonial(t.id)} title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── GALLERY ── */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                <button className={activeGalleryTab === 'events' ? 'adm-btn adm-btn-gold' : 'adm-btn adm-btn-outline'} onClick={() => { setActiveGalleryTab('events'); setCurrentAlbumId(null); }} style={{ fontSize: 13 }}>
                  <FolderOpen size={14} /> Events (Albums)
                </button>
                <button className={activeGalleryTab === 'clients' ? 'adm-btn adm-btn-gold' : 'adm-btn adm-btn-outline'} onClick={() => { setActiveGalleryTab('clients'); setCurrentAlbumId(null); }} style={{ fontSize: 13 }}>
                  <Users size={14} /> Happy Clients
                </button>
              </div>

              {activeGalleryTab === 'events' && currentAlbumId === null ? (
                <div>
                  <div className="adm-section-header">
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--adm-text-1)' }}>Events Albums</h2>
                    <button className="adm-btn adm-btn-gold" onClick={() => { setAlbumForm({ name: '', date: '' }); setAlbumModalOpen(true); }}>
                      <Plus size={15} /> Create Album
                    </button>
                  </div>
                  {eventsGallery.length === 0 ? (
                    <div className="adm-card"><div className="adm-card-body"><div className="adm-empty-state"><div className="adm-empty-icon"><FolderOpen size={24} /></div>No albums found.</div></div></div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
                      {eventsGallery.map(album => (
                        <div key={album.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #ededed', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: 250 }} onClick={() => setCurrentAlbumId(album.id)}>
                          <div style={{ height: 140, background: '#eef2f6', position: 'relative', overflow: 'hidden' }}>
                            <img src={album.thumbnail || (album.images?.[0]?.src) || 'https://via.placeholder.com/300x150?text=No+Cover'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>{album.date}</span>
                          </div>
                          <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--adm-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.name}</h4>
                              <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--adm-text-4)' }}>{album.images ? album.images.length : 0} image(s)</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }} onClick={e => e.stopPropagation()}>
                              <button className="adm-btn adm-btn-outline" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setCurrentAlbumId(album.id)}>Manage</button>
                              <button className="adm-btn-icon adm-btn-icon-delete" onClick={() => deleteAlbum(album.id)}><Trash2 size={13} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeGalleryTab === 'events' && currentAlbumId !== null ? (
                <div>
                  {(() => {
                    const activeAlbum = eventsGallery.find(a => a.id === currentAlbumId);
                    if (!activeAlbum) return <button className="adm-btn adm-btn-outline" onClick={() => setCurrentAlbumId(null)}>← Back to Albums</button>;
                    return (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                          <button className="adm-btn adm-btn-outline" onClick={() => setCurrentAlbumId(null)}>← Back to Albums</button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: 'var(--adm-text-4)' }}>Album:</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--adm-text-1)' }}>{activeAlbum.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--adm-text-4)', marginLeft: 8 }}>({activeAlbum.date})</span>
                          </div>
                        </div>
                        <div className={`adm-upload-zone${dragOver ? ' drag-over' : ''}`} onClick={() => fileInputRef.current.click()} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileInput} style={{ display: 'none' }} />
                          <div className="adm-upload-icon"><UploadCloud size={26} /></div>
                          <div className="adm-upload-title">Click to Upload or Drag & Drop</div>
                          <div className="adm-upload-sub">Supports <span>JPG, PNG, WEBP</span> – Multiple files</div>
                        </div>
                        {activeAlbum.images && activeAlbum.images.length > 0 ? (
                          <div>
                            <div style={{ fontSize: 12, color: 'var(--adm-text-4)', marginBottom: 10 }}>{activeAlbum.images.length} images in this album</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                              {activeAlbum.images.map(img => {
                                const isCover = activeAlbum.thumbnail === img.src;
                                return (
                                  <div key={img.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #ededed', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: 110, position: 'relative', background: '#eef2f6' }}>
                                      <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      {isCover && <span style={{ position: 'absolute', top: 6, left: 6, background: 'var(--adm-accent)', color: '#fff', fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>Cover</span>}
                                    </div>
                                    <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 6 }}>
                                      <p style={{ margin: 0, fontSize: 11, color: 'var(--adm-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.name}>{img.name}</p>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button className="adm-btn" style={{ padding: '3px 8px', fontSize: 9, background: isCover ? '#eef2f6' : 'transparent', color: isCover ? 'var(--adm-text-4)' : 'var(--adm-accent)', border: isCover ? '1px solid transparent' : '1px solid var(--adm-accent)' }} disabled={isCover} type="button" onClick={() => setAlbumCover(img.src)}>{isCover ? 'Cover' : 'Set Cover'}</button>
                                        <button type="button" className="adm-btn-icon adm-btn-icon-delete" onClick={() => deleteAlbumImage(img.id)}><Trash2 size={12} /></button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="adm-card"><div className="adm-card-body"><div className="adm-empty-state"><div className="adm-empty-icon"><Image size={24} /></div>No images yet. Upload some above!</div></div></div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div>
                  <div className="adm-section-header">
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--adm-text-1)' }}>Happy Clients Photos</h2>
                    <button className="adm-btn adm-btn-gold" onClick={() => clientFileInputRef.current.click()}>
                      <Plus size={15} /> Add Client Photo
                    </button>
                  </div>
                  <input ref={clientFileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleClientFileInput} />
                  {clientsGallery.length === 0 ? (
                    <div className="adm-card"><div className="adm-card-body"><div className="adm-empty-state"><div className="adm-empty-icon"><Users size={24} /></div>No client photos yet.</div></div></div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                      {clientsGallery.map(img => (
                        <div key={img.id} style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #ededed', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ height: 130, background: '#eef2f6' }}>
                            <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                            <p style={{ margin: 0, fontSize: 11, color: 'var(--adm-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={img.name}>{img.name}</p>
                            <button type="button" className="adm-btn-icon adm-btn-icon-delete" onClick={() => deleteClientImage(img.id)}><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── CONTACT ── */}
          {activeTab === 'contact' && contactForm && (
            <form onSubmit={handleContactSave}>
              <div className="adm-contact-info-grid">

                <div className="adm-contact-section">
                  <div className="adm-contact-section-title"><Phone size={15} /> Phone & WhatsApp</div>
                  <div className="adm-contact-fields">
                    <div className="adm-form-field">
                      <label className="adm-form-label">Primary Phone Number *</label>
                      <input className="adm-form-input" required placeholder="+91 90596 13895" value={contactForm.primaryPhone || ''} onChange={e => updateContact('primaryPhone', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">Secondary Phone Number</label>
                      <input className="adm-form-input" placeholder="+91 98765 43210" value={contactForm.secondaryPhone || ''} onChange={e => updateContact('secondaryPhone', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">WhatsApp Number (without +)</label>
                      <input className="adm-form-input" placeholder="919059613895" value={contactForm.whatsapp || ''} onChange={e => updateContact('whatsapp', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="adm-contact-section">
                  <div className="adm-contact-section-title"><Mail size={15} /> Email & Hours</div>
                  <div className="adm-contact-fields">
                    <div className="adm-form-field">
                      <label className="adm-form-label">Email Address *</label>
                      <input className="adm-form-input" required type="email" placeholder="info@klrinfra.com" value={contactForm.email || ''} onChange={e => updateContact('email', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">Office Hours – Days</label>
                      <input className="adm-form-input" placeholder="Mon – Sat" value={contactForm.officeHoursDays || ''} onChange={e => updateContact('officeHoursDays', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">Office Hours – Timings</label>
                      <input className="adm-form-input" placeholder="10:00 AM – 6:00 PM" value={contactForm.officeHoursTime || ''} onChange={e => updateContact('officeHoursTime', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="adm-contact-section">
                  <div className="adm-contact-section-title"><MapPin size={15} /> Office Address</div>
                  <div className="adm-contact-fields">
                    <div className="adm-form-field">
                      <label className="adm-form-label">Address Line 1</label>
                      <input className="adm-form-input" placeholder="Flat No, Building Name" value={contactForm.addressLine1 || ''} onChange={e => updateContact('addressLine1', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">Address Line 2</label>
                      <input className="adm-form-input" placeholder="Area, Road No" value={contactForm.addressLine2 || ''} onChange={e => updateContact('addressLine2', e.target.value)} />
                    </div>
                    <div className="adm-contact-field-row">
                      <div className="adm-form-field">
                        <label className="adm-form-label">City</label>
                        <input className="adm-form-input" placeholder="Hyderabad" value={contactForm.city || ''} onChange={e => updateContact('city', e.target.value)} />
                      </div>
                      <div className="adm-form-field">
                        <label className="adm-form-label">State</label>
                        <input className="adm-form-input" placeholder="Telangana" value={contactForm.state || ''} onChange={e => updateContact('state', e.target.value)} />
                      </div>
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">Pincode</label>
                      <input className="adm-form-input" placeholder="500068" value={contactForm.pincode || ''} onChange={e => updateContact('pincode', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="adm-contact-section">
                  <div className="adm-contact-section-title"><Globe size={15} /> Social Media & Map</div>
                  <div className="adm-contact-fields">
                    <div className="adm-form-field">
                      <label className="adm-form-label">Facebook Page URL</label>
                      <input className="adm-form-input" placeholder="https://facebook.com/klrinfra" value={contactForm.facebook || ''} onChange={e => updateContact('facebook', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">Instagram Page URL</label>
                      <input className="adm-form-input" placeholder="https://instagram.com/klrinfra" value={contactForm.instagram || ''} onChange={e => updateContact('instagram', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">YouTube Channel URL</label>
                      <input className="adm-form-input" placeholder="https://youtube.com/@klrinfra" value={contactForm.youtube || ''} onChange={e => updateContact('youtube', e.target.value)} />
                    </div>
                    <div className="adm-form-field">
                      <label className="adm-form-label">Google Maps Embed URL</label>
                      <input className="adm-form-input" placeholder="https://maps.google.com/embed?..." value={contactForm.mapEmbedUrl || ''} onChange={e => updateContact('mapEmbedUrl', e.target.value)} />
                    </div>
                  </div>
                </div>

              </div>
              <div className="adm-save-bar">
                <span className="adm-save-hint">Changes sync to Firebase</span>
                <button type="submit" className="adm-btn adm-btn-gold" disabled={contactSaving}>
                  {contactSaving ? 'Saving...' : <><CheckCircle size={15} /> Save Contact Info</>}
                </button>
              </div>
            </form>
          )}

        </main>
      </div>

      {/* PROPERTY MODAL */}
      {propertyModalOpen && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setPropertyModalOpen(false)}>
          <div className="adm-modal adm-modal-lg">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', marginRight: 12 }}>
                <div onClick={() => setPropForm({ ...propForm, hidden: !propForm.hidden })} style={{ width: 40, height: 22, borderRadius: 11, background: propForm.hidden ? '#EF4444' : '#d1d5db', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 3, left: propForm.hidden ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: propForm.hidden ? '#EF4444' : 'var(--adm-text-3)' }}>{propForm.hidden ? 'Hidden' : 'Visible'}</span>
              </div>
              <button className="adm-modal-close" onClick={() => setPropertyModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handlePropertySubmit}>
              <div className="adm-modal-body">
                <div className="adm-form-grid">

                  {/* Toggles */}
                  <div className="adm-form-field adm-form-grid-1">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 16px', background: propForm.dtcp ? 'rgba(16,185,129,0.08)' : 'var(--adm-smoke)', borderRadius: 10, border: `1.5px solid ${propForm.dtcp ? '#10B981' : 'var(--adm-border)'}`, transition: 'all 0.2s', userSelect: 'none' }}>
                        <div onClick={() => setPropForm({ ...propForm, dtcp: !propForm.dtcp })} style={{ width: 40, height: 22, borderRadius: 11, background: propForm.dtcp ? '#10B981' : '#d1d5db', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                          <div style={{ position: 'absolute', top: 3, left: propForm.dtcp ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--adm-text-1)' }}>DTCP Approved</div>
                          <div style={{ fontSize: 11, color: 'var(--adm-text-4)' }}>Show DTCP badge on property</div>
                        </div>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 16px', background: propForm.readyToRegister ? 'rgba(59,130,246,0.08)' : 'var(--adm-smoke)', borderRadius: 10, border: `1.5px solid ${propForm.readyToRegister ? '#3B82F6' : 'var(--adm-border)'}`, transition: 'all 0.2s', userSelect: 'none' }}>
                        <div onClick={() => setPropForm({ ...propForm, readyToRegister: !propForm.readyToRegister })} style={{ width: 40, height: 22, borderRadius: 11, background: propForm.readyToRegister ? '#3B82F6' : '#d1d5db', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                          <div style={{ position: 'absolute', top: 3, left: propForm.readyToRegister ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--adm-text-1)' }}>Ready to Register</div>
                          <div style={{ fontSize: 11, color: 'var(--adm-text-4)' }}>Mark this property as ready</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="adm-form-field adm-form-grid-1">
                    <label className="adm-form-label" style={{ fontWeight: 600 }}>Property Images</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input type="file" accept="image/*" multiple onChange={e => {
                        const files = Array.from(e.target.files);
                        files.forEach(file => {
                          const r = new FileReader();
                          r.onload = (ev) => setPropForm(prev => ({ ...prev, gallery: [...prev.gallery, ev.target.result] }));
                          r.readAsDataURL(file);
                        });
                        e.target.value = '';
                      }} style={{ fontSize: 12 }} />
                      {propForm.gallery && propForm.gallery.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', background: 'var(--adm-smoke)', padding: 10, borderRadius: 8, border: '1.5px solid var(--adm-border)' }}>
                          {propForm.gallery.map((imgSrc, idx) => (
                            <div key={idx} style={{ position: 'relative', width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1.5px solid var(--adm-border)' }}>
                              <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={() => setPropForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }))} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="adm-form-field">
                    <label className="adm-form-label">Property Name *</label>
                    <input className="adm-form-input" required placeholder="e.g. Adibatla Premium Layout" value={propForm.name} onChange={e => setPropForm({ ...propForm, name: e.target.value })} />
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Location / District *</label>
                    <input className="adm-form-input" required placeholder="e.g. Adibatla, RR District" value={propForm.location} onChange={e => setPropForm({ ...propForm, location: e.target.value })} />
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Price per Sq. Yd</label>
                    <input className="adm-form-input" placeholder="e.g. ₹4,200/Sq.Yd" value={propForm.pricePerSqYd} onChange={e => setPropForm({ ...propForm, pricePerSqYd: e.target.value })} />
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Plot Sizes</label>
                    <input className="adm-form-input" placeholder="e.g. 150 – 400 Sq.Yds" value={propForm.plotSizes} onChange={e => setPropForm({ ...propForm, plotSizes: e.target.value })} />
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Total Plots</label>
                    <input className="adm-form-input" placeholder="e.g. 120" value={propForm.totalPlots} onChange={e => setPropForm({ ...propForm, totalPlots: e.target.value })} />
                  </div>
                  <div className="adm-form-field adm-form-grid-1">
                    <label className="adm-form-label">Description</label>
                    <textarea className="adm-form-input" style={{ minHeight: 80, resize: 'vertical' }} placeholder="Brief property description..." value={propForm.description} onChange={e => setPropForm({ ...propForm, description: e.target.value })} />
                  </div>
                  <div className="adm-form-field adm-form-grid-1">
                    <label className="adm-form-label" style={{ fontWeight: 600 }}>Key Highlights</label>
                    <DragList items={propForm.highlights} onChange={items => setPropForm({ ...propForm, highlights: items })} placeholder="Add a highlight (e.g. NH-44 Highway Frontage)" />
                  </div>
                  <div className="adm-form-field adm-form-grid-1">
                    <label className="adm-form-label" style={{ fontWeight: 600 }}>Amenities</label>
                    <DragList items={propForm.amenities} onChange={items => setPropForm({ ...propForm, amenities: items })} placeholder="Add an amenity (e.g. Water Supply)" />
                  </div>
                  <div className="adm-form-field adm-form-grid-1">
                    <label className="adm-form-label" style={{ fontWeight: 600 }}>Nearby Landmarks</label>
                    <DragList items={propForm.nearbyLandmarks} onChange={items => setPropForm({ ...propForm, nearbyLandmarks: items })} placeholder="Add a landmark (e.g. 5 km from Shadnagar)" />
                  </div>
                </div>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setPropertyModalOpen(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-gold">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {testimonialModalOpen && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setTestimonialModalOpen(false)}>
          <div className="adm-modal adm-modal-sm">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Add Client Review</h3>
              <button className="adm-modal-close" onClick={() => setTestimonialModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handleTestimonialSubmit}>
              <div className="adm-modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Customer Name *</label>
                    <input className="adm-form-input" required placeholder="e.g. Ramesh Reddy" value={testForm.name} onChange={e => setTestForm({ ...testForm, name: e.target.value })} />
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Location *</label>
                    <input className="adm-form-input" required placeholder="e.g. Kukatpally, Hyderabad" value={testForm.location} onChange={e => setTestForm({ ...testForm, location: e.target.value })} />
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Project Purchased *</label>
                    <select className="adm-form-input" required value={testForm.property} onChange={e => setTestForm({ ...testForm, property: e.target.value })}>
                      <option value="">Select Project</option>
                      {propertiesList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Review Message *</label>
                    <textarea className="adm-form-input" style={{ minHeight: 80, resize: 'vertical' }} required placeholder="What the customer said..." value={testForm.review} onChange={e => setTestForm({ ...testForm, review: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setTestimonialModalOpen(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-gold">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ALBUM MODAL */}
      {albumModalOpen && (
        <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setAlbumModalOpen(false)}>
          <div className="adm-modal adm-modal-sm">
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Create New Gallery Album</h3>
              <button className="adm-modal-close" onClick={() => setAlbumModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handleAddAlbumSubmit}>
              <div className="adm-modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Album / Event Name *</label>
                    <input className="adm-form-input" required placeholder="e.g. Annual Meet 2026" value={albumForm.name} onChange={e => setAlbumForm({ ...albumForm, name: e.target.value })} />
                  </div>
                  <div className="adm-form-field">
                    <label className="adm-form-label">Event Date / Month</label>
                    <input className="adm-form-input" placeholder="e.g. July 2026" value={albumForm.date} onChange={e => setAlbumForm({ ...albumForm, date: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-outline" onClick={() => setAlbumModalOpen(false)}>Cancel</button>
                <button type="submit" className="adm-btn adm-btn-gold">Create Album</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  );
}
