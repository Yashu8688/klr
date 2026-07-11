/* ─── existing exports ─── */
export const initialProperties = [
  {
    id: 'shadnagar-premium-plots',
    name: 'Shadnagar Premium Plots',
    location: 'Shadnagar, RR District',
    price: '₹18 L – ₹35 L',
    plotSizes: '100 – 300 Sq.Yds',
    status: 'Ready to Register',
    totalPlots: 120,
    rera: 'LP No: 123/2023',
    description: 'Premium DTCP-approved plotted layout on the outskirts of Shadnagar with NH-44 highway frontage.'
  },
  {
    id: 'maheshwaram-open-plots',
    name: 'Maheshwaram Open Plots',
    location: 'Maheshwaram, RR District',
    price: '₹22 L – ₹48 L',
    plotSizes: '150 – 400 Sq.Yds',
    status: 'Available',
    totalPlots: 85,
    rera: 'RERA: P01100002345',
    description: 'RERA approved plots in the fast-growing IT expansion corridor near Amazon & Facebook.'
  },
  {
    id: 'adibatla-premium-layout',
    name: 'Adibatla Premium Layout',
    location: 'Adibatla, RR District',
    price: '₹30 L – ₹65 L',
    plotSizes: '200 – 500 Sq.Yds',
    status: 'Limited Units',
    totalPlots: 65,
    rera: 'RERA: P01100004567',
    description: 'Gated township layout near Tata Advanced Systems and defense manufacturing zone.'
  },
  {
    id: 'yacharam-plots',
    name: 'Yacharam Investment Plots',
    location: 'Yacharam, RR District',
    price: '₹12 L – ₹25 L',
    plotSizes: '100 – 250 Sq.Yds',
    status: 'Available',
    totalPlots: 150,
    rera: 'LP No: 789/2023',
    description: 'Budget-friendly investment plots close to Hyderabad Pharma City SEZ.'
  }
];

export const initialLeads = [
  {
    id: 1,
    name: 'Satish Reddy',
    phone: '9848022338',
    email: 'satish.reddy@gmail.com',
    property: 'Shadnagar Premium Plots',
    message: 'Interested in buying a 200 Sq.Yd plot. Please share payment plans.',
    status: 'New',
    date: 'July 09, 2026'
  },
  {
    id: 2,
    name: 'Priya Narayanan',
    phone: '9000188223',
    email: 'priya.n@yahoo.com',
    property: 'Maheshwaram Open Plots',
    message: 'Please send RERA copy and layout plan.',
    status: 'Contacted',
    date: 'July 08, 2026'
  },
  {
    id: 3,
    name: 'Vikas Goud',
    phone: '8106592233',
    email: 'vikas.goud@hotmail.com',
    property: 'Adibatla Premium Layout',
    message: 'Is bank loan available from HDFC? Looking to visit site this Sunday.',
    status: 'Interested',
    date: 'July 06, 2026'
  },
  {
    id: 4,
    name: 'Anil Kumar',
    phone: '7702931102',
    email: 'anil.k@gmail.com',
    property: 'Yacharam Investment Plots',
    message: 'Enquiry for lowest price plot in Yacharam.',
    status: 'Closed',
    date: 'July 03, 2026'
  }
];

export const initialTestimonials = [
  {
    id: 1,
    name: 'Ramesh Reddy',
    location: 'Dilsukhnagar, Hyderabad',
    property: 'Shadnagar Premium Plots',
    review: 'K.L.R. Infra Developers made my dream of owning a plot come true. Very honest guidance.'
  },
  {
    id: 2,
    name: 'Priya Laxmi',
    location: 'Kukatpally, Hyderabad',
    property: 'Maheshwaram Open Plots',
    review: 'Safe investment, clear documentation. The team was highly professional throughout.'
  }
];

export const initialContactInfo = {
  primaryPhone: '+91 90596 13895',
  secondaryPhone: '',
  whatsapp: '919059613895',
  email: 'info@klrinfra.com',
  addressLine1: 'Flat-102, 1st Floor, Renuka Enclave Apartment',
  addressLine2: 'Mamatha Nagar, Road No-6, Nagole',
  city: 'Hyderabad',
  state: 'Telangana',
  pincode: '500068',
  officeHoursDays: 'Mon – Sat',
  officeHoursTime: '10:00 AM – 6:00 PM',
  mapEmbedUrl: '',
  facebook: '',
  instagram: '',
  youtube: '',
};

/* ─── Initialize ─── */
export function initializeDatabase() {
  if (!localStorage.getItem('klr_properties'))
    localStorage.setItem('klr_properties', JSON.stringify(initialProperties));
  if (!localStorage.getItem('klr_leads'))
    localStorage.setItem('klr_leads', JSON.stringify(initialLeads));
  if (!localStorage.getItem('klr_testimonials'))
    localStorage.setItem('klr_testimonials', JSON.stringify(initialTestimonials));
  if (!localStorage.getItem('klr_contact_info'))
    localStorage.setItem('klr_contact_info', JSON.stringify(initialContactInfo));
  if (!localStorage.getItem('klr_gallery'))
    localStorage.setItem('klr_gallery', JSON.stringify([]));
}

/* ─── Properties ─── */
export function getProperties() { initializeDatabase(); return JSON.parse(localStorage.getItem('klr_properties')); }
export function saveProperties(data) { localStorage.setItem('klr_properties', JSON.stringify(data)); }

/* ─── Leads ─── */
export function getLeads() { initializeDatabase(); return JSON.parse(localStorage.getItem('klr_leads')); }
export function saveLeads(data) { localStorage.setItem('klr_leads', JSON.stringify(data)); }

/* ─── Testimonials ─── */
export function getTestimonials() { initializeDatabase(); return JSON.parse(localStorage.getItem('klr_testimonials')); }
export function saveTestimonials(data) { localStorage.setItem('klr_testimonials', JSON.stringify(data)); }

/* ─── Gallery ─── */
export function getGallery() { initializeDatabase(); return JSON.parse(localStorage.getItem('klr_gallery')); }
export function saveGallery(data) { localStorage.setItem('klr_gallery', JSON.stringify(data)); }

/* ─── Contact Info ─── */
export function getContactInfo() { initializeDatabase(); return JSON.parse(localStorage.getItem('klr_contact_info')); }
export function saveContactInfo(data) { localStorage.setItem('klr_contact_info', JSON.stringify(data)); }
