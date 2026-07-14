import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Home, Users, MessageSquare,
  Plus, Edit2, Trash2, Search, Phone, Mail,
  MapPin, TrendingUp, FileText, X, UserCheck,
  Menu, Quote, AlertCircle, ImagePlus, PhoneCall,
  Globe,
  CheckCircle, UploadCloud, Image, FolderOpen,
  User, Lock, Eye, EyeOff, LogOut
} from 'lucide-react';
import {
  getProperties, saveProperties,
  getLeads, saveLeads,
  getTestimonials, saveTestimonials,
  getEventsGallery, saveEventsGallery,
  getClientsGallery, saveClientsGallery,
  getContactInfo, saveContactInfo,
} from './data/mockData';
import './index.css';
import logoImg from './assets/logo.png';

/* â”€â”€ Toast helper â”€â”€ */
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={`toast ${type}`}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

/* ── DragList: drag-to-reorder list with add/delete ── */
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'var(--smoke)', borderRadius: 8, padding: 8, border: '1.5px solid var(--border)' }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={onDragEnd}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', borderRadius: 6, padding: '6px 10px', border: '1.5px solid var(--border)', cursor: 'grab', userSelect: 'none' }}
            >
              <span style={{ color: 'var(--text-4)', fontSize: 13, cursor: 'grab' }}>⠿</span>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-1)' }}>{item}</span>
              <button type="button" onClick={() => deleteItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '0 2px', lineHeight: 1, fontSize: 14 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="form-input"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
          placeholder={placeholder}
          style={{ flex: 1, fontSize: 13 }}
        />
        <button type="button" className="btn btn-gold" style={{ padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap' }} onClick={addItem}>+ Add</button>
      </div>
      {items.length > 0 && <div style={{ fontSize: 11, color: 'var(--text-4)' }}>Drag ⠿ to reorder • ✕ to remove</div>}
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('klr_admin_authed') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [customHighlight, setCustomHighlight] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');
  const [customLandmark, setCustomLandmark] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'klr@2026') {
      localStorage.setItem('klr_admin_authed', 'true');
      setAuthed(true);
      setLoginErr('');
    } else {
      setLoginErr('Incorrect username or password. Try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('klr_admin_authed');
    setAuthed(false);
    setUsername('');
    setPassword('');
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [propertiesList, setPropertiesList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [eventsGallery, setEventsGallery] = useState([]);
  const [clientsGallery, setClientsGallery] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  /* â”€â”€ Gallery sub-tab â”€â”€ */
  const [activeGalleryTab, setActiveGalleryTab] = useState('events');
  const [clientImageForm, setClientImageForm] = useState({ name: '' });
  const clientFileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

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
  const [leadFilterSource, setLeadFilterSource] = useState('All');
  const [activeLeadDropdown, setActiveLeadDropdown] = useState(null);

  // Gallery drag-over
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [albumForm, setAlbumForm] = useState({ name: '', date: '' });

  // Contact info form
  const [contactForm, setContactForm] = useState(null);
  const [contactSaving, setContactSaving] = useState(false);

  useEffect(() => {
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
      setContactInfo(ci);
      setContactForm({ ...ci });
    };
    load();
  }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  /* ── Property Actions ── */
  const openAddProperty = () => {
    setEditingProperty(null);
    setPropForm({
      name: '',
      location: '',
      pricePerSqYd: '',
      plotSizes: '100 – 300 Sq.Yds',
      totalPlots: '',
      description: '',
      highlights: [],
      amenities: [],
      nearbyLandmarks: [],
      dtcp: false,
      readyToRegister: false,
      hidden: false,
      gallery: [],
      price: '',
      rera: '',
      status: 'Available'
    });
    setCustomHighlight('');
    setCustomAmenity('');
    setCustomLandmark('');
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
      gallery: prop.gallery || [],
      price: prop.price || '',
      rera: prop.rera || '',
      status: prop.status || 'Available'
    });
    setCustomHighlight('');
    setCustomAmenity('');
    setCustomLandmark('');
    setPropertyModalOpen(true);
  };
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...propForm,
      status: propForm.status || (propForm.readyToRegister ? 'Ready to Register' : 'Available'),
      price: propForm.price || '',
      pricePerSqYd: propForm.pricePerSqYd || '',
      rera: propForm.rera || '',
      dtcp: propForm.dtcp || false,
      hidden: propForm.hidden || false,
      readyToRegister: propForm.readyToRegister || false,
      highlights: propForm.highlights || [],
      amenities: (propForm.amenities || []).map(label => ({ icon: 'star', label })),
      nearbyLandmarks: propForm.nearbyLandmarks || []
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

  const togglePropertyVisibility = (id) => {
    const updated = propertiesList.map(p => {
      if (p.id === id) {
        const newHidden = !p.hidden;
        showToast(newHidden ? 'Property hidden from public website.' : 'Property visible on public website.');
        return { ...p, hidden: newHidden };
      }
      return p;
    });
    setPropertiesList(updated);
    saveProperties(updated);
  };

  /* â”€â”€ Lead Actions â”€â”€ */
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

  /* â”€â”€ Testimonial Actions â”€â”€ */
  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    const updated = [...testimonialsList, { ...testForm, id: Date.now(), hidden: false }];
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
    const updated = testimonialsList.map(t => {
      if (t.id === id || t.id.toString() === id.toString()) {
        return { ...t, hidden: false };
      }
      return t;
    });
    setTestimonialsList(updated);
    saveTestimonials(updated);
    showToast('Testimonial approved and published!');
  };

  /* â”€â”€ Gallery Actions (Events) â”€â”€ */
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
              const newImage = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                name: file.name,
                size: (file.size / 1024).toFixed(0) + ' KB'
              };
              return {
                ...album,
                images: [...(album.images || []), newImage],
                thumbnail: album.thumbnail || e.target.result
              };
            }
            return album;
          });
          saveEventsGallery(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    showToast(`${allowed.length} image(s) uploaded to album!`);
  };

  const handleFileInput = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const deleteAlbum = (albumId) => {
    if (window.confirm('Delete this entire album and all its images?')) {
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
    const updated = eventsGallery.map(album => {
      if (album.id === currentAlbumId) return { ...album, thumbnail: imgSrc };
      return album;
    });
    setEventsGallery(updated);
    saveEventsGallery(updated);
    showToast('Album cover updated!');
  };

  const handleAddAlbumSubmit = (e) => {
    e.preventDefault();
    if (!albumForm.name.trim()) return;
    const newAlbum = {
      id: Date.now().toString(),
      name: albumForm.name,
      date: albumForm.date || new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      thumbnail: '',
      images: []
    };
    const updated = [...eventsGallery, newAlbum];
    setEventsGallery(updated);
    saveEventsGallery(updated);
    setAlbumModalOpen(false);
    setAlbumForm({ name: '', date: '' });
    showToast('Album created!');
  };

  /* â”€â”€ Gallery Actions (Happy Clients) â”€â”€ */
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
      const newItems = results.map((res, idx) => ({
        id: (Date.now() + idx).toString() + '-' + Math.random().toString(36).substring(2, 9),
        src: res.src,
        name: res.name
      }));
      setClientsGallery(prev => [...prev, ...newItems]);
      const updatedList = [...clientsGallery, ...newItems];
      await saveClientsGallery(updatedList);
      showToast(`${files.length} client photo(s) added!`);
    } catch (err) {
      console.error("Error adding client photos: ", err);
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

  /* â”€â”€ Contact Info Actions â”€â”€ */
  const handleContactSave = (e) => {
    e.preventDefault();
    setContactSaving(true);
    setTimeout(() => {
      saveContactInfo(contactForm);
      setContactInfo({ ...contactForm });
      setContactSaving(false);
      showToast('Contact info saved successfully!');
    }, 500);
  };
  const updateContact = (field, value) => setContactForm(prev => ({ ...prev, [field]: value }));

  /* ── Stats ── */
  const totalLeads = leadsList.length;
  const newLeadsCount = leadsList.filter(l => l.status === 'New').length;
  const totalProperties = propertiesList.length;
  const homeEnquiries = leadsList.filter(l => l.source === 'home').length;
  const contactEnquiries = leadsList.filter(l => l.source === 'contact').length;

  /* â”€â”€ Helpers â”€â”€ */
  const statusBadgeClass = (s) => {
    if (s === 'Ready to Register') return 'badge badge-green';
    if (s === 'Available') return 'badge badge-blue';
    if (s === 'Limited Units') return 'badge badge-amber';
    return 'badge badge-gray';
  };
  const leadStatusClass = (s) => {
    if (s === 'New') return 'status-select s-new';
    if (s === 'Contacted') return 'status-select s-contacted';
    if (s === 'Interested') return 'status-select s-interested';
    return 'status-select s-closed';
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
    .filter(l => leadFilterSource === 'All' || l.source === leadFilterSource)
    .filter(l =>
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      l.property.toLowerCase().includes(leadSearch.toLowerCase())
    );

  const filteredProperties = propertiesList.filter(p =>
    p.name.toLowerCase().includes(propertySearch.toLowerCase()) ||
    p.location.toLowerCase().includes(propertySearch.toLowerCase())
  );

  const tabTitle = {
    dashboard: 'Dashboard', properties: 'Properties',
    leads: 'Leads & Enquiries', testimonials: 'Testimonials',
    gallery: 'Gallery', contact: 'Contact Information'
  };

  const defaultHighlights = [
    'DTCP Approved Layout',
    'RERA Registered Layout',
    '100% Vasthu Compliant',
    '40ft & 33ft BT Roads',
    'Underground Drainage',
    'Electricity with Streetlights',
    'Overhead Water Tank',
    'Children Play Area',
    'Avenue Plantation',
    '24/7 Security & Gated Community',
    'Clear Title & Spot Registration',
    'Compound Wall Around Layout'
  ];

  const defaultAmenities = [
    'Water Supply',
    'Electricity',
    '24/7 Security',
    "Children's Park",
    'Blacktop Roads',
    'Underground Drainage',
    'Street Lights',
    'Avenue Plantation',
    'Gated Community',
    'Overhead Water Tank',
    'Jogging Track',
    'Compound Wall'
  ];

  const defaultLandmarks = [
    'Near Shadnagar Town',
    '10 min from ORR Exit',
    'Near Highway NH-44',
    'Close to Regional Ring Road (RRR)',
    'Near International Airport',
    'Near Symbiosis University',
    'Near Amazon Data Center',
    'Near Hardware Park',
    'Near Pharma City',
    'Near TCS Adibatla'
  ];

  const highlightsList = propForm?.highlights || [];
  const highlightOptions = Array.from(new Set([...defaultHighlights, ...highlightsList]));

  const amenitiesList = propForm?.amenities || [];
  const amenityOptions = Array.from(new Set([...defaultAmenities, ...amenitiesList]));

  const landmarksList = propForm?.nearbyLandmarks || [];
  const landmarkOptions = Array.from(new Set([...defaultLandmarks, ...landmarksList]));

  const handleHighlightToggle = (val) => {
    if (highlightsList.includes(val)) {
      setPropForm(prev => ({ ...prev, highlights: prev.highlights.filter(x => x !== val) }));
    } else {
      setPropForm(prev => ({ ...prev, highlights: [...prev.highlights, val] }));
    }
  };

  const handleAmenityToggle = (val) => {
    if (amenitiesList.includes(val)) {
      setPropForm(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== val) }));
    } else {
      setPropForm(prev => ({ ...prev, amenities: [...prev.amenities, val] }));
    }
  };

  const handleLandmarkToggle = (val) => {
    if (landmarksList.includes(val)) {
      setPropForm(prev => ({ ...prev, nearbyLandmarks: prev.nearbyLandmarks.filter(x => x !== val) }));
    } else {
      setPropForm(prev => ({ ...prev, nearbyLandmarks: [...prev.nearbyLandmarks, val] }));
    }
  };

  const addCustomHighlight = () => {
    const val = customHighlight.trim();
    if (val && !highlightsList.includes(val)) {
      setPropForm(prev => ({ ...prev, highlights: [...prev.highlights, val] }));
    }
    setCustomHighlight('');
  };

  const addCustomAmenity = () => {
    const val = customAmenity.trim();
    if (val && !amenitiesList.includes(val)) {
      setPropForm(prev => ({ ...prev, amenities: [...prev.amenities, val] }));
    }
    setCustomAmenity('');
  };

  const addCustomLandmark = () => {
    const val = customLandmark.trim();
    if (val && !landmarksList.includes(val)) {
      setPropForm(prev => ({ ...prev, nearbyLandmarks: [...prev.nearbyLandmarks, val] }));
    }
    setCustomLandmark('');
  };

  if (!authed) {
    return (
      <div className="login-page">
        <div className="login-bg-overlay" />
        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-icon" style={{ background: 'linear-gradient(135deg, #e8a020, #c8860a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>K</div>
            <div>
              <div className="login-title">K.L.R. Infra Developers</div>
              <div className="login-subtitle">Admin Console</div>
            </div>
          </div>
          <div className="login-heading">Welcome Back</div>
          <div className="login-desc">Sign in to manage your properties & enquiries</div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="login-field">
              <label className="form-label">Username</label>
              <div className="login-input-wrap">
                <User size={16} className="login-input-icon" />
                <input
                  type="text"
                  className="form-input login-input"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="login-field">
              <label className="form-label">Password</label>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input login-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {loginErr && (
              <div className="login-error">
                <AlertCircle size={14} /> {loginErr}
              </div>
            )}
            <button type="submit" className="btn btn-gold login-btn">
              Sign In to Admin Panel
            </button>
          </form>
          <div className="login-footer">© 2026 K.L.R. Infra Developers - Secured Admin Access</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* â”€â”€ SIDEBAR â”€â”€ */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1.5px solid var(--border-light)' }}>
          <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logoImg} alt="K.L.R. Infra Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-1)' }}>K.L.R. Infra</span>
              <span style={{ fontSize: '9px', fontWeight: 'bold', background: 'var(--smoke-2)', color: 'var(--text-3)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Admin</span>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={17} /></button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
            >
              <div className="nav-item-left">
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && <span className="nav-badge" style={{ background: '#EF4444', color: '#fff', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1.5px solid var(--border-light)', background: 'transparent' }}>
          <button 
            className="btn btn-outline" 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px', 
              width: '100%',
              padding: '10px',
              color: '#dc3545',
              borderColor: '#fecaca',
              background: '#fff5f5',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
          <div style={{ fontSize: '11px', color: 'var(--text-4)', textAlign: 'center' }}>© 2026 K.L.R. Infra Developers</div>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* â”€â”€ MAIN â”€â”€ */}
      <div className="main-content">

        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <h1 className="topbar-title">{tabTitle[activeTab]}</h1>
          </div>
          <div className="topbar-right">
            <div className="admin-info">
              <div className="admin-name">Administrator</div>
              <div className="admin-role">KLR Infra Admin</div>
            </div>
            <div className="admin-avatar" style={{ color: '#fff', fontWeight: 700, justifyContent: 'center' }}>A</div>
          </div>
        </header>

        <main className="page-content">

          {/* ──────────── DASHBOARD ──────────── */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Row 1 Stats (3 columns on desktop) */}
              <div className="stats-grid-row-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div className="stat-card">
                  <div className="stat-icon blue"><Users size={21} /></div>
                  <div className="stat-body">
                    <div className="stat-label">Total Enquiries</div>
                    <div className="stat-value">{totalLeads}</div>
                    <div className="stat-sub">All submitted queries</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon emerald"><UserCheck size={21} /></div>
                  <div className="stat-body">
                    <div className="stat-label">New Enquiries</div>
                    <div className="stat-value">{newLeadsCount}</div>
                    <div className="stat-sub">Awaiting response</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon violet"><TrendingUp size={21} /></div>
                  <div className="stat-body">
                    <div className="stat-label">Total Properties</div>
                    <div className="stat-value">{totalProperties}</div>
                    <div className="stat-sub">Hyderabad regions</div>
                  </div>
                </div>
              </div>

              {/* Row 2 Stats (2 columns on desktop) */}
              <div className="stats-grid-row-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="stat-card">
                  <div className="stat-icon blue"><Home size={21} /></div>
                  <div className="stat-body">
                    <div className="stat-label">Home Page Enquiries</div>
                    <div className="stat-value">{homeEnquiries}</div>
                    <div className="stat-sub">Submitted via homepage form</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon emerald"><Mail size={21} /></div>
                  <div className="stat-body">
                    <div className="stat-label">Contact Page Enquiries</div>
                    <div className="stat-value">{contactEnquiries}</div>
                    <div className="stat-sub">Submitted via contact page</div>
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Recent Queries</div>
                    <button className="card-link" onClick={() => setActiveTab('leads')}>View All ─→</button>
                  </div>
                  <div className="card-body" style={{ padding: '0' }}>
                    {leadsList.length === 0 ? (
                      <div className="empty-state" style={{ padding: '24px' }}><div className="empty-icon"><AlertCircle size={22} /></div>No enquiries yet.</div>
                    ) : (
                      <div className="recent-list">
                        {[...leadsList].slice(0, 4).reverse().map(lead => (
                          <div className="recent-item" key={lead.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1.5px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className="recent-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-3)', border: '1.5px solid var(--border-light)' }}>
                                {lead.name[0]}
                              </div>
                              <div className="recent-info">
                                <div className="recent-name" style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-1)' }}>{lead.name}</div>
                                <div className="recent-prop" style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{lead.property}</div>
                                <div className="recent-date" style={{ fontSize: '11px', color: 'var(--text-4)', marginTop: '2px' }}>{lead.date}</div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                              <span className={lead.status === 'New' ? 'badge badge-red' : lead.status === 'Contacted' ? 'badge badge-blue' : lead.status === 'Interested' ? 'badge badge-amber' : 'badge badge-green'} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', fontWeight: '600' }}>
                                {lead.status}
                              </span>
                              <span className="badge badge-gray" style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', fontWeight: '500', textTransform: 'capitalize' }}>
                                {lead.source === 'home' ? 'Home' : 'Contact'}
                              </span>
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

          {/* ──── PROPERTIES ──── */}
          {activeTab === 'properties' && (
            <div>
              <div className="section-header">
                <div className="search-bar">
                  <Search size={14} />
                  <input className="search-input" type="text" placeholder="Search properties..." value={propertySearch} onChange={e => setPropertySearch(e.target.value)} />
                </div>
                <button className="btn btn-gold" onClick={openAddProperty}><Plus size={15} /> Add Property</button>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th>Location</th>
                      <th>Pricing</th>
                      <th>Status</th>
                      <th>Visible</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map(prop => (
                      <tr key={prop.id}>
                        <td className="td-name">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {prop.gallery && prop.gallery[0] ? (
                              <img 
                                src={prop.gallery[0]} 
                                style={{ width: 44, height: 30, borderRadius: 4, objectFit: 'cover', background: '#eee', border: '1px solid #ddd', flexShrink: 0 }} 
                              />
                            ) : prop.image ? (
                              <img 
                                src={prop.image} 
                                style={{ width: 44, height: 30, borderRadius: 4, objectFit: 'cover', background: '#eee', border: '1px solid #ddd', flexShrink: 0 }} 
                              />
                            ) : (
                              <div style={{ width: '44px', height: '30px', borderRadius: '4px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#9ca3af', border: '1.5px solid #e5e7eb', flexShrink: 0 }}>No Img</div>
                            )}
                            <span>{prop.name}</span>
                          </div>
                        </td>
                        <td className="td-muted">
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={12} style={{ color: '#aaa', flexShrink: 0 }} /> 
                            {prop.location}
                          </span>
                        </td>
                        <td className="td-price">{prop.price}</td>
                        <td>
                          <span className={statusBadgeClass(prop.status)}>
                            {prop.status}
                          </span>
                        </td>
                        <td>
                          <div 
                            className="toggle-switch-wrap toggle-gold" 
                            onClick={() => togglePropertyVisibility(prop.id)}
                            style={{ display: 'inline-block', cursor: 'pointer' }}
                          >
                            <div className={`toggle-track${!prop.hidden ? ' toggle-on' : ''}`}>
                              <div className="toggle-thumb" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="td-actions">
                            <button className="btn-icon btn-icon-edit" onClick={() => openEditProperty(prop)} title="Edit"><Edit2 size={13} /></button>
                            <button className="btn-icon btn-icon-delete" onClick={() => deleteProperty(prop.id)} title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProperties.length === 0 && (
                      <tr>
                        <td colSpan="6">
                          <div className="empty-state">
                            <div className="empty-icon"><Home size={22} /></div>
                            No properties found.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ──────────── LEADS ──────────── */}
          {activeTab === 'leads' && (
            <div>
              <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                <div className="filters-row" style={{ width: '100%' }}>
                  <div className="search-bar">
                    <Search size={14} />
                    <input className="search-input" type="text" placeholder="Search leads..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} />
                  </div>
                  
                  <span className="filter-label" style={{ marginLeft: '12px' }}>Status:</span>
                  <select className="filter-select" value={leadFilterStatus} onChange={e => setLeadFilterStatus(e.target.value)}>
                    <option value="All">All Leads</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <span className="filter-label" style={{ marginLeft: '12px' }}>Source:</span>
                  <select className="filter-select" value={leadFilterSource} onChange={e => setLeadFilterSource(e.target.value)}>
                    <option value="All">All Sources</option>
                    <option value="home">Home Page</option>
                    <option value="contact">Contact Page</option>
                  </select>
                </div>

                <div className="lead-stats-row" style={{ display: 'flex', gap: '10px', margin: '4px 0 8px 0' }}>
                  <span className="badge badge-gray" style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '12px', fontWeight: '600', background: '#e5e7eb', color: '#4b5563' }}>
                    Total: {leadsList.length}
                  </span>
                  <span className="badge badge-blue" style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '12px', fontWeight: '600', color: '#1E40AF', background: '#DBEAFE' }}>
                    Home Page: {leadsList.filter(l => l.source === 'home').length}
                  </span>
                  <span className="badge badge-green" style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '12px', fontWeight: '600', color: '#065F46', background: '#D1FAE5' }}>
                    Contact Page: {leadsList.filter(l => l.source === 'contact').length}
                  </span>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Customer</th>
                      <th>Property / Message</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'center' }}>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => {
                      const statuses = [
                        { value: 'New', label: 'New', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
                        { value: 'Contacted', label: 'Contacted', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
                        { value: 'Interested', label: 'Interested', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
                        { value: 'Closed', label: 'Closed', color: '#10B981', bg: 'rgba(16,185,129,0.08)' }
                      ];
                      const currentStatus = statuses.find(s => s.value === lead.status) || statuses[0];

                      return (
                        <tr key={lead.id}>
                          <td className="td-muted" style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>{lead.date}</td>
                          <td>
                            <span 
                              style={{ 
                                fontSize: '11px', 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                fontWeight: '600', 
                                textTransform: 'capitalize',
                                background: lead.source === 'home' ? '#DBEAFE' : '#D1FAE5',
                                color: lead.source === 'home' ? '#1E40AF' : '#065F46'
                              }}
                            >
                              {lead.source === 'home' ? 'Home' : 'Contact'}
                            </span>
                          </td>
                          <td>
                            <div className="lead-contact" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div className="lead-name" style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-1)' }}>{lead.name}</div>
                              <div className="lead-phone" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)' }}>
                                <Phone size={12} style={{ color: '#aaa', flexShrink: 0 }} /> {lead.phone}
                              </div>
                              <div className="lead-email" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-3)' }}>
                                <Mail size={12} style={{ color: '#aaa', flexShrink: 0 }} /> {lead.email}
                              </div>
                            </div>
                          </td>
                          <td style={{ maxWidth: 280 }}>
                            <div className="lead-prop-name" style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>{lead.property}</div>
                            <div className="lead-msg" style={{ fontSize: '12px', color: 'var(--text-3)', fontStyle: 'italic' }}>"{lead.message}"</div>
                          </td>
                          <td>
                            <div style={{ position: 'relative' }}>
                              <button 
                                type="button"
                                onClick={() => setActiveLeadDropdown(activeLeadDropdown === lead.id ? null : lead.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  borderRadius: '16px',
                                  border: `1.5px solid ${currentStatus.color}22`,
                                  background: currentStatus.bg,
                                  color: currentStatus.color,
                                  fontSize: '12.5px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentStatus.color }} />
                                {currentStatus.label}
                              </button>
                              {activeLeadDropdown === lead.id && (
                                <>
                                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} onClick={() => setActiveLeadDropdown(null)} />
                                  <div style={{ 
                                    position: 'absolute', 
                                    top: '100%', 
                                    left: 0, 
                                    marginTop: '4px',
                                    background: '#fff', 
                                    borderRadius: '8px', 
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)', 
                                    border: '1.5px solid var(--border-light)',
                                    zIndex: 100,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    padding: '4px',
                                    minWidth: '120px'
                                  }}>
                                    {statuses.map(s => (
                                      <button
                                        key={s.value}
                                        type="button"
                                        onClick={() => {
                                          updateLeadStatus(lead.id, s.value);
                                          setActiveLeadDropdown(null);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          padding: '8px 10px',
                                          borderRadius: '6px',
                                          border: 'none',
                                          background: 'transparent',
                                          color: s.color,
                                          fontSize: '12px',
                                          fontWeight: '600',
                                          cursor: 'pointer',
                                          textAlign: 'left',
                                          width: '100%'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = s.bg; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                      >
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
                                        {s.label}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="td-actions" style={{ display: 'flex', justifyContent: 'center' }}>
                              <button 
                                className="btn-icon btn-icon-delete" 
                                onClick={() => deleteLead(lead.id)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', border: '1.5px solid rgba(220,53,69,0.15)', background: 'rgba(220,53,69,0.05)', color: '#dc3545' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan="6">
                          <div className="empty-state">
                            <div className="empty-icon"><Users size={22} /></div>
                            No enquiries found.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {activeTab === 'testimonials' && (
            <div>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-1)' }}>Testimonials</h2>
                <button className="btn btn-gold" onClick={() => { setTestForm({ name: '', location: '', property: '', review: '' }); setTestimonialModalOpen(true); }}>
                  <Plus size={15} /> Add Testimonial
                </button>
              </div>

              {testimonialsList.length === 0 ? (
                <div className="card"><div className="card-body"><div className="empty-state"><div className="empty-icon"><MessageSquare size={22} /></div>No reviews yet.</div></div></div>
              ) : (
                <div>
                  {/* Pending Testimonials */}
                  <h3 style={{ fontSize: '14.5px', fontWeight: '700', color: '#c8860a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#E8A020' }} />
                    Pending Approval ({testimonialsList.filter(t => t.hidden).length})
                  </h3>
                  {testimonialsList.filter(t => t.hidden).length === 0 ? (
                    <div style={{ background: 'rgba(232,160,32,0.03)', border: '1.5px dashed rgba(232,160,32,0.15)', borderRadius: '12px', padding: '20px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px', marginBottom: '24px' }}>
                      No reviews pending approval.
                    </div>
                  ) : (
                    <div className="testimonials-grid" style={{ marginBottom: '28px' }}>
                      {testimonialsList.filter(t => t.hidden).map(t => (
                        <div 
                          className="test-card" 
                          key={t.id}
                          style={{ border: '2px solid #E8A020', boxShadow: '0 4px 20px rgba(232,160,32,0.12)' }}
                        >
                          <div 
                            className="text-xs font-semibold px-2.5 py-1 rounded-md mb-3 inline-block"
                            style={{ background: 'rgba(232,160,32,0.12)', color: '#E8A020', width: 'fit-content' }}
                          >
                            Pending Approval
                          </div>
                          <Quote size={30} className="test-quote" />
                          <p className="test-review">"{t.review}"</p>
                          <div className="test-footer flex justify-between items-end mt-4">
                            <div className="test-author">
                              <div className="test-name">{t.name}</div>
                              <div className="test-location">{t.location}</div>
                              <span className="test-prop-tag">{t.property || 'General'}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <button 
                                className="btn-icon"
                                style={{ background: '#10B981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px' }}
                                onClick={() => approveTestimonial(t.id)}
                                title="Approve Review"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button 
                                className="btn-icon btn-icon-delete" 
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px' }}
                                onClick={() => deleteTestimonial(t.id)}
                                title="Delete / Reject"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Testimonials */}
                  <h3 style={{ fontSize: '14.5px', fontWeight: '700', color: '#10B981', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                    Live on Website ({testimonialsList.filter(t => !t.hidden).length})
                  </h3>
                  {testimonialsList.filter(t => !t.hidden).length === 0 ? (
                    <div style={{ background: '#fcfcfc', border: '1.5px dashed var(--border-light)', borderRadius: '12px', padding: '20px', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>
                      No active testimonials on the website.
                    </div>
                  ) : (
                    <div className="testimonials-grid">
                      {testimonialsList.filter(t => !t.hidden).map(t => (
                        <div 
                          className="test-card" 
                          key={t.id}
                        >
                          <Quote size={30} className="test-quote" />
                          <p className="test-review">"{t.review}"</p>
                          <div className="test-footer flex justify-between items-end mt-4">
                            <div className="test-author">
                              <div className="test-name">{t.name}</div>
                              <div className="test-location">{t.location}</div>
                              <span className="test-prop-tag">{t.property || 'General'}</span>
                            </div>
                            <div className="flex gap-2 items-center">
                              <button 
                                className="btn-icon btn-icon-delete" 
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px' }}
                                onClick={() => deleteTestimonial(t.id)}
                                title="Delete testimonial"
                              >
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
            </div>
          )}

          {/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {activeTab === 'gallery' && (
            <div>
              {/* Sub-tab switcher */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                <button
                  className={activeGalleryTab === 'events' ? 'btn btn-gold' : 'btn btn-outline'}
                  onClick={() => { setActiveGalleryTab('events'); setCurrentAlbumId(null); }}
                  style={{ fontSize: 13 }}
                >
                  <FolderOpen size={14} /> Events (Albums)
                </button>
                <button
                  className={activeGalleryTab === 'clients' ? 'btn btn-gold' : 'btn btn-outline'}
                  onClick={() => { setActiveGalleryTab('clients'); setCurrentAlbumId(null); }}
                  style={{ fontSize: 13 }}
                >
                  <Users size={14} /> Happy Clients
                </button>
              </div>

              {activeGalleryTab === 'events' && currentAlbumId === null ? (
                // â”€â”€ ALBUMS (EVENTS) GRID VIEW â”€â”€
                <div>
                  <div className="section-header">
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Events Albums</h2>
                    <button className="btn btn-gold" onClick={() => { setAlbumForm({ name: '', date: '' }); setAlbumModalOpen(true); }}>
                      <Plus size={15} /> Create Album
                    </button>
                  </div>
                  {eventsGallery.length === 0 ? (
                    <div className="card">
                      <div className="card-body">
                        <div className="empty-state">
                          <div className="empty-icon"><FolderOpen size={24} /></div>
                          No albums found. Click the button above to create one.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
                      {eventsGallery.map(album => (
                        <div
                          key={album.id}
                          style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: 250 }}
                          onClick={() => setCurrentAlbumId(album.id)}
                        >
                          <div style={{ height: 140, background: '#eef2f6', position: 'relative', overflow: 'hidden' }}>
                            <img src={album.thumbnail || (album.images && album.images[0] ? album.images[0].src : '') || 'https://via.placeholder.com/300x150?text=No+Cover'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>{album.date}</span>
                          </div>
                          <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{album.name}</h4>
                              <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-4)' }}>{album.images ? album.images.length : 0} image(s)</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }} onClick={e => e.stopPropagation()}>
                              <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setCurrentAlbumId(album.id)}>Manage</button>
                              <button className="btn-icon btn-icon-delete" onClick={() => deleteAlbum(album.id)}><Trash2 size={13} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeGalleryTab === 'events' && currentAlbumId !== null ? (
                // â”€â”€ IMAGES WITHIN SPECIFIC ALBUM VIEW â”€â”€
                <div>
                  {(() => {
                    const activeAlbum = eventsGallery.find(a => a.id === currentAlbumId);
                    if (!activeAlbum) return <button className="btn btn-outline" onClick={() => setCurrentAlbumId(null)}>â† Back to Albums</button>;
                    return (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                          <button className="btn btn-outline" onClick={() => setCurrentAlbumId(null)}>â† Back to Albums</button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Album:</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{activeAlbum.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-4)', marginLeft: 8 }}>({activeAlbum.date})</span>
                          </div>
                        </div>
                        <div className={`upload-zone${dragOver ? ' drag-over' : ''}`} onClick={() => fileInputRef.current.click()} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} style={{ marginBottom: 20 }}>
                          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileInput} />
                          <div className="upload-icon"><UploadCloud size={26} /></div>
                          <div className="upload-title">Click to Upload to Album or Drag & Drop</div>
                          <div className="upload-sub">Supports <span>JPG, PNG, WEBP, GIF</span> â€” Multiple files allowed</div>
                        </div>
                        {activeAlbum.images && activeAlbum.images.length > 0 ? (
                          <div>
                            <div style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 10 }}>{activeAlbum.images.length} images inside this album</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                              {activeAlbum.images.map(img => {
                                const isCover = activeAlbum.thumbnail === img.src;
                                return (
                                  <div key={img.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-light)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: 110, position: 'relative', background: '#eef2f6' }}>
                                      <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      {isCover && <span style={{ position: 'absolute', top: 6, left: 6, background: 'var(--accent)', color: '#fff', fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>Cover Image</span>}
                                    </div>
                                    <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 6 }}>
                                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.name}>{img.name}</p>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button className="btn" style={{ padding: '3px 8px', fontSize: 9, background: isCover ? '#eef2f6' : 'transparent', color: isCover ? 'var(--text-4)' : 'var(--accent)', border: isCover ? '1px solid transparent' : '1px solid var(--accent)' }} disabled={isCover} type="button" onClick={() => setAlbumCover(img.src)}>{isCover ? 'Cover' : 'Set Cover'}</button>
                                        <button type="button" className="btn-icon btn-icon-delete" onClick={() => deleteAlbumImage(img.id)}><Trash2 size={12} /></button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="card"><div className="card-body"><div className="empty-state"><div className="empty-icon"><Image size={24} /></div>No images inside this album yet. Upload some images above!</div></div></div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                // â”€â”€ HAPPY CLIENTS PANEL â”€â”€
                <div>
                  <div className="section-header">
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Happy Clients Photos</h2>
                    <button className="btn btn-gold" onClick={() => clientFileInputRef.current.click()}>
                      <Plus size={15} /> Add Client Photo
                    </button>
                  </div>
                  <input ref={clientFileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleClientFileInput} />
                  {clientsGallery.length === 0 ? (
                    <div className="card"><div className="card-body"><div className="empty-state"><div className="empty-icon"><Users size={24} /></div>No client photos yet. Click 'Add Client Photo' to upload.</div></div></div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                      {clientsGallery.map(img => (
                        <div key={img.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-light)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ height: 130, background: '#eef2f6' }}>
                            <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }} title={img.name}>{img.name}</p>
                            <button type="button" className="btn-icon btn-icon-delete" onClick={() => deleteClientImage(img.id)}><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ————————————————— CONTACT INFORMATION ————————————————— */}
          {activeTab === 'contact' && contactForm && (
            <form onSubmit={handleContactSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', alignItems: 'start', marginBottom: '24px' }}>

                {/* Phone & WhatsApp */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#c8860a', borderBottom: '1.5px solid var(--border-light)', paddingBottom: '12px' }}>
                    <Phone size={16} />
                    <span>Phone & WhatsApp</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Primary Phone Number *</label>
                      <input className="form-input" required placeholder="+91 90596 13895" value={contactForm.primaryPhone || ''} onChange={e => updateContact('primaryPhone', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Secondary Phone Number</label>
                      <input className="form-input" placeholder="+91 98765 43210" value={contactForm.secondaryPhone || ''} onChange={e => updateContact('secondaryPhone', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>WhatsApp Number (without +)</label>
                      <input className="form-input" placeholder="919059613895" value={contactForm.whatsapp || ''} onChange={e => updateContact('whatsapp', e.target.value)} />
                      <span style={{ fontSize: '11px', color: 'var(--text-4)' }}>Country code + number (e.g. 919059613895)</span>
                    </div>
                  </div>
                </div>

                {/* Email & Office Hours */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#c8860a', borderBottom: '1.5px solid var(--border-light)', paddingBottom: '12px' }}>
                    <Mail size={16} />
                    <span>Email & Office Hours</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Email Address *</label>
                      <input className="form-input" required type="email" placeholder="info@klrinfra.com" value={contactForm.email || ''} onChange={e => updateContact('email', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Office Hours — Days</label>
                      <input className="form-input" placeholder="Mon – Sat" value={contactForm.officeHoursDays || ''} onChange={e => updateContact('officeHoursDays', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Office Hours — Timings</label>
                      <input className="form-input" placeholder="10:00 AM – 6:00 PM" value={contactForm.officeHoursTime || ''} onChange={e => updateContact('officeHoursTime', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Office Address */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#c8860a', borderBottom: '1.5px solid var(--border-light)', paddingBottom: '12px' }}>
                    <MapPin size={16} />
                    <span>Office Address</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Address Line 1</label>
                      <input className="form-input" placeholder="Flat No, Building Name" value={contactForm.addressLine1 || ''} onChange={e => updateContact('addressLine1', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Address Line 2</label>
                      <input className="form-input" placeholder="Area, Road No" value={contactForm.addressLine2 || ''} onChange={e => updateContact('addressLine2', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-field">
                        <label className="form-label" style={{ fontWeight: '600' }}>City</label>
                        <input className="form-input" placeholder="Hyderabad" value={contactForm.city || ''} onChange={e => updateContact('city', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label className="form-label" style={{ fontWeight: '600' }}>State</label>
                        <input className="form-input" placeholder="Telangana" value={contactForm.state || ''} onChange={e => updateContact('state', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Pincode</label>
                      <input className="form-input" placeholder="500068" value={contactForm.pincode || ''} onChange={e => updateContact('pincode', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Instagram & Map */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#c8860a', borderBottom: '1.5px solid var(--border-light)', paddingBottom: '12px' }}>
                    <Globe size={16} />
                    <span>Instagram & Map</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>@ Instagram Page URL</label>
                      <input className="form-input" placeholder="https://instagram.com/klrinfra" value={contactForm.instagram || ''} onChange={e => updateContact('instagram', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Google Maps Embed URL</label>
                      <input className="form-input" placeholder="https://maps.google.com/embed?..." value={contactForm.mapEmbedUrl || ''} onChange={e => updateContact('mapEmbedUrl', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Company Stats */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#c8860a', borderBottom: '1.5px solid var(--border-light)', paddingBottom: '12px' }}>
                    <TrendingUp size={16} />
                    <span>Company Stats</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Year Established *</label>
                      <input className="form-input" type="number" required placeholder="2026" value={contactForm.statYear || ''} onChange={e => updateContact('statYear', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Happy Customers count *</label>
                      <input className="form-input" type="number" required placeholder="10" value={contactForm.statCustomers || ''} onChange={e => updateContact('statCustomers', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Projects count *</label>
                      <input className="form-input" type="number" required placeholder="84" value={contactForm.statProjects || ''} onChange={e => updateContact('statProjects', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Prime Locations count *</label>
                      <input className="form-input" type="number" required placeholder="50" value={contactForm.statLocations || ''} onChange={e => updateContact('statLocations', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Founder Details */}
                <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '700', color: '#c8860a', borderBottom: '1.5px solid var(--border-light)', paddingBottom: '12px' }}>
                    <User size={16} />
                    <span>Founder Details</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Founder Photo</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', border: '1.5px solid var(--border-light)', overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                          <img src={contactForm.founderPhoto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                updateContact('founderPhoto', ev.target.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Founder Name</label>
                      <input className="form-input" placeholder="K. Laxmi Reddy" value={contactForm.founderName || ''} onChange={e => updateContact('founderName', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Designation / Title</label>
                      <input className="form-input" placeholder="Founder & Managing Director" value={contactForm.founderTitle || ''} onChange={e => updateContact('founderTitle', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Subtitle / Company Name</label>
                      <input className="form-input" placeholder="K.L.R. Infra Developers" value={contactForm.founderSubtitle || ''} onChange={e => updateContact('founderSubtitle', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Experience Badge Text</label>
                      <input className="form-input" placeholder="10+ Years Experience" value={contactForm.founderExperience || ''} onChange={e => updateContact('founderExperience', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>About Section Heading</label>
                      <input className="form-input" placeholder="A Decade of Trust & Transparent Dealings" value={contactForm.founderHeading || ''} onChange={e => updateContact('founderHeading', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Biography Paragraph 1</label>
                      <textarea className="form-input" rows={3} style={{ resize: 'vertical', height: 'auto', minHeight: '80px' }} placeholder="With over 10 years of..." value={contactForm.founderText1 || ''} onChange={e => updateContact('founderText1', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ fontWeight: '600' }}>Biography Paragraph 2</label>
                      <textarea className="form-input" rows={3} style={{ resize: 'vertical', height: 'auto', minHeight: '80px' }} placeholder="From humble beginnings..." value={contactForm.founderText2 || ''} onChange={e => updateContact('founderText2', e.target.value)} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Save Bar */}
              <div className="save-bar">
                <span className="save-hint">Changes are saved to local storage</span>
                <button type="submit" className="btn btn-gold" disabled={contactSaving}>
                  {contactSaving ? 'Saving...' : <><CheckCircle size={15} /> Save Contact Info</>}
                </button>
              </div>
            </form>
          )}

        </main>
      </div>

      {/* ——— PROPERTY MODAL ——— */}
      {propertyModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPropertyModalOpen(false)}>
          <div className="modal modal-lg">
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <h3 className="modal-title">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button className="modal-close" style={{ marginLeft: 'auto' }} onClick={() => setPropertyModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handlePropertySubmit}>
              <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '20px 24px' }}>
                
                {/* Toggles at TOP */}
                <div className="toggle-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '0 0 20px 0', background: 'transparent', border: 'none', padding: '0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#fff', border: '1.5px solid var(--border-light)', borderRadius: '12px', cursor: 'pointer', userSelect: 'none' }}>
                    <div 
                      onClick={() => setPropForm({ ...propForm, dtcp: !propForm.dtcp })}
                      className="toggle-switch-wrap toggle-gold"
                      style={{ display: 'inline-block' }}
                    >
                      <div className={`toggle-track${propForm.dtcp ? ' toggle-on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>DTCP Approved</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>Show DTCP badge on property</div>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#fff', border: '1.5px solid var(--border-light)', borderRadius: '12px', cursor: 'pointer', userSelect: 'none' }}>
                    <div 
                      onClick={() => setPropForm({ ...propForm, readyToRegister: !propForm.readyToRegister })}
                      className="toggle-switch-wrap toggle-gold"
                      style={{ display: 'inline-block' }}
                    >
                      <div className={`toggle-track${propForm.readyToRegister ? ' toggle-on' : ''}`}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>Ready to Register</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>Show registration-ready badge</div>
                    </div>
                  </label>
                </div>

                {/* Property Gallery Images (unlimited) */}
                <div className="form-field form-grid-1" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-1)' }}>
                    Property Gallery Images <span style={{ fontWeight: '500', color: 'var(--text-4)', fontSize: '12px' }}>(unlimited)</span>
                  </label>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    style={{ 
                      border: '2px dashed var(--border)', 
                      borderRadius: '12px', 
                      padding: '30px 20px', 
                      textAlign: 'center', 
                      cursor: 'pointer',
                      background: 'var(--smoke)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,134,10,0.5)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    <UploadCloud size={24} style={{ color: 'var(--text-3)' }} />
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-1)' }}>Upload gallery images</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-4)' }}>Upload multiple project site photos</div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      multiple 
                      style={{ display: 'none' }} 
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        files.forEach(file => {
                          const r = new FileReader();
                          r.onload = (ev) => {
                            setPropForm(prev => ({
                              ...prev,
                              gallery: [...prev.gallery, ev.target.result]
                            }));
                          };
                          r.readAsDataURL(file);
                        });
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {propForm.gallery && propForm.gallery.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px', marginTop: '12px', background: 'var(--smoke)', padding: '12px', borderRadius: '12px', border: '1.5px solid var(--border-light)' }}>
                      {propForm.gallery.map((imgSrc, idx) => (
                        <div key={idx} style={{ position: 'relative', height: '65px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border-light)' }}>
                          <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPropForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
                            }}
                            style={{ 
                              position: 'absolute', 
                              top: '3px', 
                              right: '3px', 
                              background: 'rgba(0,0,0,0.6)', 
                              color: '#fff', 
                              border: 'none', 
                              borderRadius: '50%', 
                              width: '18px', 
                              height: '18px', 
                              fontSize: '10px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              cursor: 'pointer' 
                            }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontWeight: '700' }}>Property Title *</label>
                    <input 
                      className="form-input" 
                      required 
                      placeholder="e.g. Adibatla Premium Layout" 
                      value={propForm.name} 
                      onChange={e => setPropForm({ ...propForm, name: e.target.value })} 
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" style={{ fontWeight: '700' }}>Full Address / Location *</label>
                    <input 
                      className="form-input" 
                      required 
                      placeholder="e.g. Adibatla, RR District" 
                      value={propForm.location} 
                      onChange={e => setPropForm({ ...propForm, location: e.target.value })} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontWeight: '700' }}>Price per Sq. Yd</label>
                    <input 
                      className="form-input" 
                      placeholder="e.g. ₹4,200/Sq.Yd" 
                      value={propForm.pricePerSqYd} 
                      onChange={e => setPropForm({ ...propForm, pricePerSqYd: e.target.value })} 
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" style={{ fontWeight: '700' }}>Plot Sizes</label>
                    <input 
                      className="form-input" 
                      placeholder="e.g. 100 – 300 Sq.Yds" 
                      value={propForm.plotSizes} 
                      onChange={e => setPropForm({ ...propForm, plotSizes: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="form-field form-grid-1" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '700' }}>Description</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="Brief property description..." 
                    value={propForm.description} 
                    onChange={e => setPropForm({ ...propForm, description: e.target.value })} 
                  />
                </div>

                {/* Checklist: Highlights */}
                <div className="form-field form-grid-1" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ fontWeight: '700', margin: 0 }}>Key Highlights</label>
                    <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: '600' }}>{highlightsList.length} selected</span>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                    gap: '12px', 
                    padding: '16px 18px', 
                    background: '#fff', 
                    borderRadius: '12px', 
                    border: '1.5px solid var(--border-light)',
                    maxHeight: '180px',
                    overflowY: 'auto'
                  }}>
                    {highlightOptions.map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-2)', userSelect: 'none' }}>
                        <input 
                          type="checkbox" 
                          checked={highlightsList.includes(opt)}
                          onChange={() => handleHighlightToggle(opt)}
                          style={{ width: '15px', height: '15px', accentColor: 'var(--accent)' }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input 
                      className="form-input" 
                      style={{ fontSize: '13px' }}
                      placeholder="Add custom key highlights..." 
                      value={customHighlight}
                      onChange={e => setCustomHighlight(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomHighlight(); } }}
                    />
                    <button type="button" className="btn btn-outline" style={{ fontSize: '13px', padding: '0 16px' }} onClick={addCustomHighlight}>Add</button>
                  </div>
                </div>

                {/* Checklist: Amenities */}
                <div className="form-field form-grid-1" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ fontWeight: '700', margin: 0 }}>Amenities</label>
                    <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: '600' }}>{amenitiesList.length} selected</span>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                    gap: '12px', 
                    padding: '16px 18px', 
                    background: '#fff', 
                    borderRadius: '12px', 
                    border: '1.5px solid var(--border-light)',
                    maxHeight: '180px',
                    overflowY: 'auto'
                  }}>
                    {amenityOptions.map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-2)', userSelect: 'none' }}>
                        <input 
                          type="checkbox" 
                          checked={amenitiesList.includes(opt)}
                          onChange={() => handleAmenityToggle(opt)}
                          style={{ width: '15px', height: '15px', accentColor: 'var(--accent)' }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input 
                      className="form-input" 
                      style={{ fontSize: '13px' }}
                      placeholder="Add custom amenities..." 
                      value={customAmenity}
                      onChange={e => setCustomAmenity(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }}
                    />
                    <button type="button" className="btn btn-outline" style={{ fontSize: '13px', padding: '0 16px' }} onClick={addCustomAmenity}>Add</button>
                  </div>
                </div>

                {/* Checklist: Landmarks */}
                <div className="form-field form-grid-1" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ fontWeight: '700', margin: 0 }}>Nearby Landmarks</label>
                    <span style={{ fontSize: '11px', color: 'var(--text-4)', fontWeight: '600' }}>{landmarksList.length} selected</span>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                    gap: '12px', 
                    padding: '16px 18px', 
                    background: '#fff', 
                    borderRadius: '12px', 
                    border: '1.5px solid var(--border-light)',
                    maxHeight: '180px',
                    overflowY: 'auto'
                  }}>
                    {landmarkOptions.map(opt => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-2)', userSelect: 'none' }}>
                        <input 
                          type="checkbox" 
                          checked={landmarksList.includes(opt)}
                          onChange={() => handleLandmarkToggle(opt)}
                          style={{ width: '15px', height: '15px', accentColor: 'var(--accent)' }}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <input 
                      className="form-input" 
                      style={{ fontSize: '13px' }}
                      placeholder="Add custom nearby landmarks..." 
                      value={customLandmark}
                      onChange={e => setCustomLandmark(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomLandmark(); } }}
                    />
                    <button type="button" className="btn btn-outline" style={{ fontSize: '13px', padding: '0 16px' }} onClick={addCustomLandmark}>Add</button>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setPropertyModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* â”€â”€ TESTIMONIAL MODAL â”€â”€ */}
      {/* â”€â”€ TESTIMONIAL MODAL â”€â”€ */}
      {testimonialModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setTestimonialModalOpen(false)}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Add Client Review</h3>
              <button className="modal-close" onClick={() => setTestimonialModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handleTestimonialSubmit}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Customer Name *</label>
                    <input className="form-input" required placeholder="e.g. Ramesh Reddy" value={testForm.name} onChange={e => setTestForm({ ...testForm, name: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Location *</label>
                    <input className="form-input" required placeholder="e.g. Kukatpally, Hyderabad" value={testForm.location} onChange={e => setTestForm({ ...testForm, location: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Project Purchased *</label>
                    <select className="form-select" required value={testForm.property} onChange={e => setTestForm({ ...testForm, property: e.target.value })}>
                      <option value="">Select Project</option>
                      {propertiesList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Review Message *</label>
                    <textarea className="form-textarea" required placeholder="What the customer said..." value={testForm.review} onChange={e => setTestForm({ ...testForm, review: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setTestimonialModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* â”€â”€ CREATE ALBUM MODAL â”€â”€ */}
      {albumModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setAlbumModalOpen(false)}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Create New Gallery Album</h3>
              <button className="modal-close" onClick={() => setAlbumModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handleAddAlbumSubmit}>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="form-field">
                    <label className="form-label">Album / Event Name *</label>
                    <input className="form-input" required placeholder="e.g. Annual Meet 2026" value={albumForm.name} onChange={e => setAlbumForm({ ...albumForm, name: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Event Date / Month</label>
                    <input className="form-input" placeholder="e.g. July 2026" value={albumForm.date} onChange={e => setAlbumForm({ ...albumForm, date: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setAlbumModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-gold">Create Album</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* â”€â”€ TOAST â”€â”€ */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  );
}
