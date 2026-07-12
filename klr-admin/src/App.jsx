import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Home, Users, MessageSquare,
  Plus, Edit2, Trash2, Search, Phone, Mail,
  MapPin, TrendingUp, FileText, X, UserCheck,
  Menu, Quote, AlertCircle, ImagePlus, PhoneCall,
  Clock, Globe,
  CheckCircle, UploadCloud, Image, FolderOpen
} from 'lucide-react';
import {
  getProperties, saveProperties,
  getLeads, saveLeads,
  getTestimonials, saveTestimonials,
  getGallery, saveGallery,
  getContactInfo, saveContactInfo,
} from './data/mockData';
import './index.css';

/* ── Toast helper ── */
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [propertiesList, setPropertiesList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Property modal
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propForm, setPropForm] = useState({
    name: '', location: '', price: '', pricePerSqYd: '', plotSizes: '',
    status: 'Available', totalPlots: '', rera: '', description: '',
    highlightsText: '', amenitiesText: '', nearbyLandmarksText: '',
    image: '', gallery: []
  });

  // Testimonial modal
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [testForm, setTestForm] = useState({ name: '', location: '', property: '', review: '' });

  // Filters
  const [propertySearch, setPropertySearch] = useState('');
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterStatus, setLeadFilterStatus] = useState('All');

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
    setPropertiesList(getProperties());
    setLeadsList(getLeads());
    setTestimonialsList(getTestimonials());
    setGalleryList(getGallery());
    const ci = getContactInfo();
    setContactInfo(ci);
    setContactForm({ ...ci });
  }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  /* ── Property Actions ── */
  const openAddProperty = () => {
    setEditingProperty(null);
    setPropForm({
      name: '',
      location: '',
      price: '',
      pricePerSqYd: '',
      plotSizes: '100 – 300 Sq.Yds',
      status: 'Available',
      totalPlots: '',
      rera: '',
      description: '',
      highlightsText: '',
      amenitiesText: '',
      nearbyLandmarksText: '',
      image: '',
      gallery: []
    });
    setPropertyModalOpen(true);
  };
  const openEditProperty = (prop) => {
    setEditingProperty(prop);
    setPropForm({
      ...prop,
      pricePerSqYd: prop.pricePerSqYd || '',
      highlightsText: (prop.highlights || []).join('\n'),
      amenitiesText: (prop.amenities || []).map(a => typeof a === 'object' ? a.label : a).join('\n'),
      nearbyLandmarksText: (prop.nearbyLandmarks || []).join('\n'),
      image: prop.image || '',
      gallery: prop.gallery || []
    });
    setPropertyModalOpen(true);
  };
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    const highlights = propForm.highlightsText.split('\n').map(s => s.trim()).filter(Boolean);
    const amenities = propForm.amenitiesText.split('\n').map(s => s.trim()).filter(Boolean).map(label => ({ icon: 'star', label }));
    const nearbyLandmarks = propForm.nearbyLandmarksText.split('\n').map(s => s.trim()).filter(Boolean);

    const submissionData = {
      ...propForm,
      highlights,
      amenities,
      nearbyLandmarks
    };
    delete submissionData.highlightsText;
    delete submissionData.amenitiesText;
    delete submissionData.nearbyLandmarksText;

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

  /* ── Gallery Actions ── */
  const processFiles = (files) => {
    if (!currentAlbumId) return;
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (allowed.length === 0) { showToast('Only image files allowed!', 'error'); return; }

    allowed.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryList(prev => {
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
          saveGallery(updated);
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
      const updated = galleryList.filter(a => a.id !== albumId);
      setGalleryList(updated);
      saveGallery(updated);
      showToast('Album deleted.', 'error');
    }
  };

  const deleteAlbumImage = (imgId) => {
    if (window.confirm('Delete this image?')) {
      const updated = galleryList.map(album => {
        if (album.id === currentAlbumId) {
          const filteredImages = album.images.filter(img => img.id !== imgId);
          let newThumb = album.thumbnail;
          if (album.thumbnail && album.images.find(img => img.id === imgId)?.src === album.thumbnail) {
            newThumb = filteredImages[0] ? filteredImages[0].src : '';
          }
          return {
            ...album,
            images: filteredImages,
            thumbnail: newThumb
          };
        }
        return album;
      });
      setGalleryList(updated);
      saveGallery(updated);
      showToast('Image removed.', 'error');
    }
  };

  const setAlbumCover = (imgSrc) => {
    const updated = galleryList.map(album => {
      if (album.id === currentAlbumId) {
        return {
          ...album,
          thumbnail: imgSrc
        };
      }
      return album;
    });
    setGalleryList(updated);
    saveGallery(updated);
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
    const updated = [...galleryList, newAlbum];
    setGalleryList(updated);
    saveGallery(updated);
    setAlbumModalOpen(false);
    setAlbumForm({ name: '', date: '' });
    showToast('Album created!');
  };

  /* ── Contact Info Actions ── */
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
  const totalPlots = propertiesList.reduce((a, c) => a + parseInt(c.totalPlots || 0), 0);
  const activeProjects = propertiesList.length;

  /* ── Helpers ── */
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

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon">K</div>
            <div className="brand-text">
              <div className="brand-name">K.L.R. Infra</div>
              <div className="brand-sub">Admin Console</div>
            </div>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={17} /></button>
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
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">© 2026 K.L.R. Infra Developers</div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN ── */}
      <div className="main-content">

        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <h1 className="topbar-title">{tabTitle[activeTab]}</h1>
          </div>
        </header>

        <main className="page-content">

          {/* ────────── DASHBOARD ────────── */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-grid">
                {[
                  { label: 'Total Enquiries', value: totalLeads, sub: 'All submitted queries', cls: 'blue', icon: Users },
                  { label: 'New Enquiries', value: newLeadsCount, sub: 'Awaiting response', cls: 'emerald', icon: UserCheck },
                  { label: 'Total Plots Listed', value: totalPlots, sub: 'Across all corridors', cls: 'amber', icon: FileText },
                  { label: 'Active Projects', value: activeProjects, sub: 'Hyderabad regions', cls: 'violet', icon: TrendingUp },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className={`stat-icon ${s.cls}`}><s.icon size={21} /></div>
                    <div className="stat-body">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dashboard-grid">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Recent Queries</div>
                    <button className="card-link" onClick={() => setActiveTab('leads')}>View All →</button>
                  </div>
                  <div className="card-body">
                    {leadsList.length === 0 ? (
                      <div className="empty-state"><div className="empty-icon"><AlertCircle size={22} /></div>No enquiries yet.</div>
                    ) : (
                      <div className="recent-list">
                        {leadsList.slice(0, 4).map(lead => (
                          <div className="recent-item" key={lead.id}>
                            <div className="recent-avatar">{lead.name[0]}</div>
                            <div className="recent-info">
                              <div className="recent-name">{lead.name}</div>
                              <div className="recent-prop">{lead.property}</div>
                              <div className="recent-date">{lead.date}</div>
                            </div>
                            <span className={lead.status === 'New' ? 'badge badge-red' : lead.status === 'Contacted' ? 'badge badge-blue' : lead.status === 'Interested' ? 'badge badge-amber' : 'badge badge-green'}>{lead.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────── PROPERTIES ────────── */}
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
                      <th>Property Name</th><th>Location</th><th>Pricing</th><th>Plots</th><th>Status</th><th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map(prop => (
                      <tr key={prop.id}>
                        <td className="td-name">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img 
                              src={prop.image || 'https://via.placeholder.com/60x40?text=No+Image'} 
                              style={{ width: 44, height: 30, borderRadius: 4, objectFit: 'cover', background: '#eee', border: '1px solid #ddd', flexShrink: 0 }} 
                            />
                            <span>{prop.name}</span>
                          </div>
                        </td>
                        <td className="td-muted"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} style={{ color: '#aaa', flexShrink: 0 }} /> {prop.location}</span></td>
                        <td className="td-price">{prop.price}</td>
                        <td className="td-muted">{prop.totalPlots}</td>
                        <td><span className={statusBadgeClass(prop.status)}>{prop.status}</span></td>

                        <td>
                          <div className="td-actions">
                            <button className="btn-icon btn-icon-edit" onClick={() => openEditProperty(prop)} title="Edit"><Edit2 size={13} /></button>
                            <button className="btn-icon btn-icon-delete" onClick={() => deleteProperty(prop.id)} title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProperties.length === 0 && (
                      <tr><td colSpan="7"><div className="empty-state"><div className="empty-icon"><Home size={22} /></div>No properties found.</div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ────────── LEADS ────────── */}
          {activeTab === 'leads' && (
            <div>
              <div className="section-header">
                <div className="filters-row">
                  <div className="search-bar">
                    <Search size={14} />
                    <input className="search-input" type="text" placeholder="Search leads..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} />
                  </div>
                  <span className="filter-label">Status:</span>
                  <select className="filter-select" value={leadFilterStatus} onChange={e => setLeadFilterStatus(e.target.value)}>
                    <option value="All">All Leads</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr><th>Date</th><th>Customer</th><th>Property / Message</th><th>Status</th><th style={{ textAlign: 'center' }}>Delete</th></tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id}>
                        <td className="td-muted" style={{ whiteSpace: 'nowrap' }}>{lead.date}</td>
                        <td>
                          <div className="lead-contact">
                            <div className="lead-name">{lead.name}</div>
                            <div className="lead-phone"><Phone size={10} /> {lead.phone}</div>
                            <div className="lead-email"><Mail size={10} /> {lead.email}</div>
                          </div>
                        </td>
                        <td style={{ maxWidth: 280 }}>
                          <div className="td-name" style={{ marginBottom: 3 }}>{lead.property}</div>
                          <div className="lead-msg">"{lead.message}"</div>
                        </td>
                        <td>
                          <select className={leadStatusClass(lead.status)} value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value)}>
                            <option value="New">🔴 New</option>
                            <option value="Contacted">🔵 Contacted</option>
                            <option value="Interested">🟡 Interested</option>
                            <option value="Closed">🟢 Closed</option>
                          </select>
                        </td>
                        <td><div className="td-actions"><button className="btn-icon btn-icon-delete" onClick={() => deleteLead(lead.id)}><Trash2 size={13} /></button></div></td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && (
                      <tr><td colSpan="5"><div className="empty-state"><div className="empty-icon"><Users size={22} /></div>No enquiries found.</div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ────────── TESTIMONIALS ────────── */}
          {activeTab === 'testimonials' && (
            <div>
              <div className="section-header">
                <div />
                <button className="btn btn-gold" onClick={() => { setTestForm({ name: '', location: '', property: '', review: '' }); setTestimonialModalOpen(true); }}>
                  <Plus size={15} /> Add Testimonial
                </button>
              </div>
              {testimonialsList.length === 0 ? (
                <div className="card"><div className="card-body"><div className="empty-state"><div className="empty-icon"><MessageSquare size={22} /></div>No reviews yet.</div></div></div>
              ) : (
                <div className="testimonials-grid">
                  {testimonialsList.map(t => (
                    <div className="test-card" key={t.id}>
                      <Quote size={30} className="test-quote" />
                      <p className="test-review">"{t.review}"</p>
                      <div className="test-footer">
                        <div className="test-author">
                          <div className="test-name">{t.name}</div>
                          <div className="test-location">{t.location}</div>
                          <span className="test-prop-tag">{t.property}</span>
                        </div>
                        <button className="btn-icon btn-icon-delete" onClick={() => deleteTestimonial(t.id)}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ────────── GALLERY ────────── */}
          {activeTab === 'gallery' && (
            <div>
              {currentAlbumId === null ? (
                // ── ALBUMS (EVENTS) GRID VIEW ──
                <div>
                  <div className="section-header">
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)' }}>Gallery Albums & Events</h2>
                    <button className="btn btn-gold" onClick={() => { setAlbumForm({ name: '', date: '' }); setAlbumModalOpen(true); }}>
                      <Plus size={15} /> Create Album
                    </button>
                  </div>
                  {galleryList.length === 0 ? (
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
                      {galleryList.map(album => (
                        <div 
                          key={album.id} 
                          style={{ 
                            background: 'var(--white)', 
                            borderRadius: 'var(--radius-lg)', 
                            border: '1.5px solid var(--border-light)', 
                            overflow: 'hidden', 
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            height: 250
                          }}
                          onClick={() => setCurrentAlbumId(album.id)}
                        >
                          <div style={{ height: 140, background: '#eef2f6', position: 'relative', overflow: 'hidden' }}>
                            <img 
                              src={album.thumbnail || (album.images && album.images[0] ? album.images[0].src : '') || 'https://via.placeholder.com/300x150?text=No+Cover'} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>
                              {album.date}
                            </span>
                          </div>
                          <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {album.name}
                              </h4>
                              <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-4)' }}>
                                {album.images ? album.images.length : 0} image(s)
                              </p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }} onClick={e => e.stopPropagation()}>
                              <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => setCurrentAlbumId(album.id)}>
                                Manage
                              </button>
                              <button className="btn-icon btn-icon-delete" onClick={() => deleteAlbum(album.id)}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // ── IMAGES WITHIN SPECIFIC ALBUM VIEW ──
                <div>
                  {(() => {
                    const activeAlbum = galleryList.find(a => a.id === currentAlbumId);
                    if (!activeAlbum) return <button className="btn btn-outline" onClick={() => setCurrentAlbumId(null)}>← Back to Albums</button>;
                    return (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                          <button className="btn btn-outline" onClick={() => setCurrentAlbumId(null)}>
                            ← Back to Albums
                          </button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Album:</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{activeAlbum.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-4)', marginLeft: 8 }}>({activeAlbum.date})</span>
                          </div>
                        </div>

                        {/* Upload Zone */}
                        <div
                          className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                          onClick={() => fileInputRef.current.click()}
                          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          style={{ marginBottom: 20 }}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileInput}
                          />
                          <div className="upload-icon"><UploadCloud size={26} /></div>
                          <div className="upload-title">Click to Upload to Album or Drag & Drop</div>
                          <div className="upload-sub">Supports <span>JPG, PNG, WEBP, GIF</span> — Multiple files allowed</div>
                        </div>

                        {/* Images list */}
                        {activeAlbum.images && activeAlbum.images.length > 0 ? (
                          <div>
                            <div style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 10 }}>
                              {activeAlbum.images.length} images inside this album
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                              {activeAlbum.images.map(img => {
                                const isCover = activeAlbum.thumbnail === img.src;
                                return (
                                  <div key={img.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-light)', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: 110, position: 'relative', background: '#eef2f6' }}>
                                      <img src={img.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      {isCover && (
                                        <span style={{ position: 'absolute', top: 6, left: 6, background: 'var(--accent)', color: '#fff', fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                                          Cover Image
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ padding: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 6 }}>
                                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.name}>
                                        {img.name}
                                      </p>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button 
                                          className="btn" 
                                          style={{ 
                                            padding: '3px 8px', 
                                            fontSize: 9, 
                                            background: isCover ? '#eef2f6' : 'transparent',
                                            color: isCover ? 'var(--text-4)' : 'var(--accent)',
                                            border: isCover ? '1px solid transparent' : '1px solid var(--accent)'
                                          }} 
                                          disabled={isCover}
                                          type="button"
                                          onClick={() => setAlbumCover(img.src)}
                                        >
                                          {isCover ? 'Cover' : 'Set Cover'}
                                        </button>
                                        <button type="button" className="btn-icon btn-icon-delete" onClick={() => deleteAlbumImage(img.id)}>
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="card">
                            <div className="card-body">
                              <div className="empty-state">
                                <div className="empty-icon"><Image size={24} /></div>
                                No images inside this album yet. Upload some images above!
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ────────── CONTACT INFORMATION ────────── */}
          {activeTab === 'contact' && contactForm && (
            <form onSubmit={handleContactSave}>
              <div className="contact-info-grid">

                {/* Phone & WhatsApp */}
                <div className="contact-section">
                  <div className="contact-section-title"><Phone size={15} /> Phone & WhatsApp</div>
                  <div className="contact-fields">
                    <div className="form-field">
                      <label className="form-label">Primary Phone Number *</label>
                      <input className="form-input" required placeholder="+91 90596 13895" value={contactForm.primaryPhone} onChange={e => updateContact('primaryPhone', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Secondary Phone Number</label>
                      <input className="form-input" placeholder="+91 98765 43210" value={contactForm.secondaryPhone} onChange={e => updateContact('secondaryPhone', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">WhatsApp Number (without +)</label>
                      <input className="form-input" placeholder="919059613895" value={contactForm.whatsapp} onChange={e => updateContact('whatsapp', e.target.value)} />
                      <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Used for wa.me link (country code + number)</span>
                    </div>
                  </div>
                </div>

                {/* Email & Address */}
                <div className="contact-section">
                  <div className="contact-section-title"><Mail size={15} /> Email Address</div>
                  <div className="contact-fields">
                    <div className="form-field">
                      <label className="form-label">Email Address *</label>
                      <input className="form-input" required type="email" placeholder="info@klrinfra.com" value={contactForm.email} onChange={e => updateContact('email', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Office Hours — Days</label>
                      <input className="form-input" placeholder="Mon – Sat" value={contactForm.officeHoursDays} onChange={e => updateContact('officeHoursDays', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Office Hours — Timings</label>
                      <input className="form-input" placeholder="10:00 AM – 6:00 PM" value={contactForm.officeHoursTime} onChange={e => updateContact('officeHoursTime', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Office Address */}
                <div className="contact-section">
                  <div className="contact-section-title"><MapPin size={15} /> Office Address</div>
                  <div className="contact-fields">
                    <div className="form-field">
                      <label className="form-label">Address Line 1</label>
                      <input className="form-input" placeholder="Flat No, Building Name" value={contactForm.addressLine1} onChange={e => updateContact('addressLine1', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Address Line 2</label>
                      <input className="form-input" placeholder="Area, Road No" value={contactForm.addressLine2} onChange={e => updateContact('addressLine2', e.target.value)} />
                    </div>
                    <div className="contact-field-row">
                      <div className="form-field">
                        <label className="form-label">City</label>
                        <input className="form-input" placeholder="Hyderabad" value={contactForm.city} onChange={e => updateContact('city', e.target.value)} />
                      </div>
                      <div className="form-field">
                        <label className="form-label">State</label>
                        <input className="form-input" placeholder="Telangana" value={contactForm.state} onChange={e => updateContact('state', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label">Pincode</label>
                      <input className="form-input" placeholder="500068" value={contactForm.pincode} onChange={e => updateContact('pincode', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Social & Map */}
                <div className="contact-section">
                  <div className="contact-section-title"><Globe size={15} /> Social Media & Map</div>
                  <div className="contact-fields">
                    <div className="form-field">
                      <label className="form-label">Facebook Page URL</label>
                      <input className="form-input" placeholder="https://facebook.com/klrinfra" value={contactForm.facebook} onChange={e => updateContact('facebook', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Instagram Page URL</label>
                      <input className="form-input" placeholder="https://instagram.com/klrinfra" value={contactForm.instagram} onChange={e => updateContact('instagram', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">YouTube Channel URL</label>
                      <input className="form-input" placeholder="https://youtube.com/@klrinfra" value={contactForm.youtube} onChange={e => updateContact('youtube', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Google Maps Embed URL</label>
                      <input className="form-input" placeholder="https://maps.google.com/embed?..." value={contactForm.mapEmbedUrl} onChange={e => updateContact('mapEmbedUrl', e.target.value)} />
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

      {/* ── PROPERTY MODAL ── */}
      {propertyModalOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPropertyModalOpen(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <h3 className="modal-title">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button className="modal-close" onClick={() => setPropertyModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handlePropertySubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  {/* Thumbnail Image */}
                  <div className="form-field form-grid-1">
                    <label className="form-label" style={{ fontWeight: 600 }}>Property Thumbnail Image</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                      <div style={{ width: 88, height: 60, borderRadius: 8, background: '#eef2f6', overflow: 'hidden', flexShrink: 0, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {propForm.image ? (
                          <img src={propForm.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>No Image</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const r = new FileReader();
                              r.onload = (ev) => setPropForm(prev => ({ ...prev, image: ev.target.result }));
                              r.readAsDataURL(file);
                            }
                          }} 
                          style={{ fontSize: 12 }} 
                        />
                        {propForm.image && (
                          <button type="button" className="btn btn-outline" style={{ padding: '3px 8px', fontSize: 11, alignSelf: 'flex-start' }} onClick={() => setPropForm(prev => ({ ...prev, image: '' }))}>Remove Thumbnail</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div className="form-field form-grid-1">
                    <label className="form-label" style={{ fontWeight: 600 }}>Property Gallery Images</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={e => {
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
                        }} 
                        style={{ fontSize: 12 }} 
                      />
                      {propForm.gallery && propForm.gallery.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', background: 'var(--smoke)', padding: 10, borderRadius: 8, border: '1.5px solid var(--border)' }}>
                          {propForm.gallery.map((imgSrc, idx) => (
                            <div key={idx} style={{ position: 'relative', width: 70, height: 48, borderRadius: 6, overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                              <img src={imgSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button 
                                type="button" 
                                onClick={() => {
                                  setPropForm(prev => ({
                                    ...prev,
                                    gallery: prev.gallery.filter((_, i) => i !== idx)
                                  }));
                                }}
                                style={{ 
                                  position: 'absolute', 
                                  top: 2, 
                                  right: 2, 
                                  background: 'rgba(0,0,0,0.6)', 
                                  color: '#fff', 
                                  border: 'none', 
                                  borderRadius: '50%', 
                                  width: 16, 
                                  height: 16, 
                                  fontSize: 10, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  lineHeight: 1
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Property Name *</label>
                    <input className="form-input" required placeholder="e.g. Adibatla Premium Layout" value={propForm.name} onChange={e => setPropForm({ ...propForm, name: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Location / District *</label>
                    <input className="form-input" required placeholder="e.g. Adibatla, RR District" value={propForm.location} onChange={e => setPropForm({ ...propForm, location: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Pricing Range *</label>
                    <input className="form-input" required placeholder="e.g. ₹30 L – ₹65 L" value={propForm.price} onChange={e => setPropForm({ ...propForm, price: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Price per Sq. Yd</label>
                    <input className="form-input" placeholder="e.g. ₹4,200/Sq.Yd" value={propForm.pricePerSqYd} onChange={e => setPropForm({ ...propForm, pricePerSqYd: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Plot Sizes</label>
                    <input className="form-input" placeholder="e.g. 150 – 400 Sq.Yds" value={propForm.plotSizes} onChange={e => setPropForm({ ...propForm, plotSizes: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={propForm.status} onChange={e => setPropForm({ ...propForm, status: e.target.value })}>
                      <option>Available</option>
                      <option>Ready to Register</option>
                      <option>Limited Units</option>
                      <option>Sold Out</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Total Plots</label>
                    <input className="form-input" placeholder="e.g. 120" value={propForm.totalPlots} onChange={e => setPropForm({ ...propForm, totalPlots: e.target.value })} />
                  </div>

                  <div className="form-field form-grid-1">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" placeholder="Brief property description..." value={propForm.description} onChange={e => setPropForm({ ...propForm, description: e.target.value })} />
                  </div>
                  <div className="form-field form-grid-1">
                    <label className="form-label">Key Highlights (one per line)</label>
                    <textarea className="form-textarea" style={{ minHeight: '90px' }} placeholder="e.g.&#10;NH-44 Highway Frontage&#10;40ft Wide BT Roads" value={propForm.highlightsText} onChange={e => setPropForm({ ...propForm, highlightsText: e.target.value })} />
                  </div>
                  <div className="form-field form-grid-1">
                    <label className="form-label">Amenities (one per line)</label>
                    <textarea className="form-textarea" style={{ minHeight: '90px' }} placeholder="e.g.&#10;Water Supply&#10;Electricity&#10;24/7 Security" value={propForm.amenitiesText} onChange={e => setPropForm({ ...propForm, amenitiesText: e.target.value })} />
                  </div>
                  <div className="form-field form-grid-1">
                    <label className="form-label">Nearby Landmarks (one per line)</label>
                    <textarea className="form-textarea" style={{ minHeight: '90px' }} placeholder="e.g.&#10;10 min from ORR Exit&#10;5 km from Shadnagar Town" value={propForm.nearbyLandmarksText} onChange={e => setPropForm({ ...propForm, nearbyLandmarksText: e.target.value })} />
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

      {/* ── TESTIMONIAL MODAL ── */}
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

      {/* ── CREATE ALBUM MODAL ── */}
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

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  );
}
