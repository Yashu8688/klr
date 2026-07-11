import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Home, Users, MessageSquare,
  Plus, Edit2, Trash2, Search, Phone, Mail,
  MapPin, TrendingUp, FileText, X, UserCheck,
  Menu, Quote, AlertCircle, ImagePlus, PhoneCall,
  Clock, Globe,
  CheckCircle, UploadCloud, Image
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
    name: '', location: '', price: '', plotSizes: '',
    status: 'Available', totalPlots: '', rera: '', description: ''
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
    setPropForm({ name: '', location: '', price: '', plotSizes: '100 – 300 Sq.Yds', status: 'Available', totalPlots: '', rera: '', description: '' });
    setPropertyModalOpen(true);
  };
  const openEditProperty = (prop) => {
    setEditingProperty(prop);
    setPropForm({ ...prop });
    setPropertyModalOpen(true);
  };
  const handlePropertySubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingProperty) {
      updated = propertiesList.map(p => p.id === editingProperty.id ? { ...p, ...propForm } : p);
    } else {
      updated = [...propertiesList, { ...propForm, id: Date.now().toString() }];
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
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (allowed.length === 0) { showToast('Only image files allowed!', 'error'); return; }

    allowed.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryList(prev => {
          const updated = [...prev, {
            id: Date.now() + Math.random(),
            src: e.target.result,
            name: file.name,
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            size: (file.size / 1024).toFixed(0) + ' KB'
          }];
          saveGallery(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    showToast(`${allowed.length} image(s) uploaded!`);
  };

  const handleFileInput = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const deleteGalleryImage = (id) => {
    const updated = galleryList.filter(g => g.id !== id);
    setGalleryList(updated);
    saveGallery(updated);
    showToast('Image removed.', 'error');
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
          <div className="topbar-right">
            <div className="admin-info">
              <div className="admin-name">Yashwanth</div>
              <div className="admin-role">Super Admin</div>
            </div>
            <div className="admin-avatar">Y</div>
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
                    <div>
                      <div className="card-title">Leads Received Trend</div>
                      <div className="card-subtitle">Submissions over the past months</div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="chart-container">
                      <svg viewBox="0 0 500 150" preserveAspectRatio="none" width="100%" height="150">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e8a020" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#e8a020" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#eeeeee" strokeWidth="1" />
                        <line x1="0" y1="85" x2="500" y2="85" stroke="#eeeeee" strokeWidth="1" />
                        <line x1="0" y1="130" x2="500" y2="130" stroke="#eeeeee" strokeWidth="1" />
                        <path d="M0 150 L0 130 Q90 110 170 70 T330 35 Q420 52 500 28 L500 150Z" fill="url(#chartGrad)" />
                        <path d="M0 130 Q90 110 170 70 T330 35 Q420 52 500 28" fill="none" stroke="#e8a020" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="170" cy="70" r="4.5" fill="#fff" stroke="#e8a020" strokeWidth="2.5" />
                        <circle cx="330" cy="35" r="4.5" fill="#fff" stroke="#e8a020" strokeWidth="2.5" />
                        <circle cx="500" cy="28" r="4.5" fill="#fff" stroke="#e8a020" strokeWidth="2.5" />
                      </svg>
                    </div>
                    <div className="chart-labels">
                      <span className="chart-label">Mar</span>
                      <span className="chart-label">Apr</span>
                      <span className="chart-label">May</span>
                      <span className="chart-label">Jun</span>
                      <span className="chart-label">Jul</span>
                    </div>
                  </div>
                </div>

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
                      <th>Property Name</th><th>Location</th><th>Pricing</th><th>Plots</th><th>Status</th><th>RERA / LP</th><th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map(prop => (
                      <tr key={prop.id}>
                        <td className="td-name">{prop.name}</td>
                        <td className="td-muted"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} style={{ color: '#aaa', flexShrink: 0 }} /> {prop.location}</span></td>
                        <td className="td-price">{prop.price}</td>
                        <td className="td-muted">{prop.totalPlots}</td>
                        <td><span className={statusBadgeClass(prop.status)}>{prop.status}</span></td>
                        <td className="td-muted">{prop.rera || '—'}</td>
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
              {/* Upload Zone */}
              <div
                className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                />
                <div className="upload-icon"><UploadCloud size={26} /></div>
                <div className="upload-title">Click to Upload or Drag & Drop</div>
                <div className="upload-sub">Supports <span>JPG, PNG, WEBP, GIF</span> — Multiple files allowed</div>
              </div>

              {/* Gallery Grid */}
              {galleryList.length > 0 ? (
                <>
                  <div className="gallery-count">{galleryList.length} image{galleryList.length !== 1 ? 's' : ''} in gallery</div>
                  <div className="gallery-grid">
                    {galleryList.map(img => (
                      <div className="gallery-item" key={img.id}>
                        <img src={img.src} alt={img.name} />
                        <div className="gallery-name">{img.name}</div>
                        <div className="gallery-overlay">
                          <button
                            className="gallery-delete"
                            onClick={e => { e.stopPropagation(); deleteGalleryImage(img.id); }}
                            title="Remove image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <div className="empty-state">
                      <div className="empty-icon"><Image size={24} /></div>
                      No images yet. Click the upload area above to add images.
                    </div>
                  </div>
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
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button className="modal-close" onClick={() => setPropertyModalOpen(false)}><X size={17} /></button>
            </div>
            <form onSubmit={handlePropertySubmit}>
              <div className="modal-body">
                <div className="form-grid">
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
                    <label className="form-label">RERA / LP Number</label>
                    <input className="form-input" placeholder="e.g. RERA: P01100004567" value={propForm.rera} onChange={e => setPropForm({ ...propForm, rera: e.target.value })} />
                  </div>
                  <div className="form-field form-grid-1">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" placeholder="Brief property description..." value={propForm.description} onChange={e => setPropForm({ ...propForm, description: e.target.value })} />
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

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

    </div>
  );
}
