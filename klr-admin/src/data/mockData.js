/* ─── existing exports ─── */
export const initialProperties = [
  {
    id: 'shadnagar-premium-plots',
    name: 'Shadnagar Premium Plots',
    location: 'Shadnagar, RR District',
    price: '₹18 L – ₹35 L',
    pricePerSqYd: '₹4,200/Sq.Yd',
    plotSizes: '100 – 300 Sq.Yds',
    status: 'Ready to Register',
    totalPlots: 120,
    rera: 'LP No: 123/2023',
    description: 'Premium DTCP-approved plotted layout on the outskirts of Shadnagar with NH-44 highway frontage.',
    highlights: [
      'NH-44 Highway Frontage',
      '40ft Wide BT Roads',
      'Underground Drainage',
      'Street Lights',
      '24/7 Security',
      'Parks & Open Spaces',
    ],
    amenities: [
      { icon: 'road', label: '40ft BT Roads' },
      { icon: 'droplets', label: 'Water Supply' },
      { icon: 'zap', label: 'Electricity' },
      { icon: 'shield', label: '24/7 Security' },
      { icon: 'trees', label: 'Parks & Greenery' },
      { icon: 'building2', label: 'Compound Wall' },
    ],
    nearbyLandmarks: ['10 min from ORR Exit', '5 km from Shadnagar Town', 'Near Pharma City']
  },
  {
    id: 'maheshwaram-open-plots',
    name: 'Maheshwaram Open Plots',
    location: 'Maheshwaram, RR District',
    price: '₹22 L – ₹48 L',
    pricePerSqYd: '₹5,500/Sq.Yd',
    plotSizes: '150 – 400 Sq.Yds',
    status: 'Available',
    totalPlots: 85,
    rera: 'RERA: P01100002345',
    description: 'RERA approved plots in the fast-growing IT expansion corridor near Amazon & Facebook.',
    highlights: [
      'Near IT Corridor',
      'Excellent Resale Value',
      'Tar Roads',
      'UGD & Water',
      'Compound Wall',
      'Ready Plots',
    ],
    amenities: [
      { icon: 'road', label: 'Tar Roads' },
      { icon: 'droplets', label: 'Borewell Water' },
      { icon: 'zap', label: 'EB Connection' },
      { icon: 'shield', label: 'Security' },
      { icon: 'trees', label: 'Avenue Trees' },
      { icon: 'landmark', label: 'Commercial Zone' },
    ],
    nearbyLandmarks: ['15 km from HITEC City', 'Near Amazon, Facebook Offices', '5 km from Narketpally']
  },
  {
    id: 'adibatla-premium-layout',
    name: 'Adibatla Premium Layout',
    location: 'Adibatla, RR District',
    price: '₹30 L – ₹65 L',
    pricePerSqYd: '₹7,000/Sq.Yd',
    plotSizes: '200 – 500 Sq.Yds',
    status: 'Limited Units',
    totalPlots: 65,
    rera: 'RERA: P01100004567',
    description: 'Gated township layout near Tata Advanced Systems and defense manufacturing zone.',
    highlights: [
      'Aerospace & Defence Hub',
      'Premium Gated Township',
      '60ft Main Road',
      'Clubhouse',
      'Swimming Pool',
      'High Appreciation Zone',
    ],
    amenities: [
      { icon: 'road', label: '60ft Wide Road' },
      { icon: 'droplets', label: 'Piped Water' },
      { icon: 'zap', label: 'Underground Cabling' },
      { icon: 'users', label: 'Clubhouse' },
      { icon: 'trees', label: 'Landscaped Parks' },
      { icon: 'camera', label: 'CCTV Security' },
    ],
    nearbyLandmarks: ['Near TATA Advanced Systems', 'Bharat Dynamics Ltd', '20 km from LB Nagar']
  },
  {
    id: 'yacharam-plots',
    name: 'Yacharam Investment Plots',
    location: 'Yacharam, RR District',
    price: '₹12 L – ₹25 L',
    pricePerSqYd: '₹2,800/Sq.Yd',
    plotSizes: '100 – 250 Sq.Yds',
    status: 'Available',
    totalPlots: 150,
    rera: 'LP No: 789/2023',
    description: 'Budget-friendly investment plots close to Hyderabad Pharma City SEZ.',
    highlights: [
      'Best Budget Plots',
      'Growing Infrastructure',
      'Near Hyderabad Pharma City',
      'Pucca Roads',
      'Good Connectivity',
      'High Future Value',
    ],
    amenities: [
      { icon: 'road', label: 'Pucca Roads' },
      { icon: 'droplets', label: 'Water Connection' },
      { icon: 'zap', label: 'Electricity' },
      { icon: 'shield', label: 'Gated Entry' },
      { icon: 'trees', label: 'Green Belt' },
      { icon: 'map-pin', label: 'Vastu Compliant' },
    ],
    nearbyLandmarks: ['Near Pharma City SEZ', '25 km from Hyderabad', 'Close to Srisailam Highway']
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

export const initialGallery = [
  {
    id: 'overview-aerials',
    name: 'Overview & Aerial Views',
    date: 'July 2026',
    thumbnail: '',
    images: [
      { id: 1, src: '', name: 'Aerial View' },
      { id: 2, src: '', name: 'Drone View' }
    ]
  },
  {
    id: 'infrastructure-layouts',
    name: 'Infrastructure & Site Layouts',
    date: 'June 2026',
    thumbnail: '',
    images: [
      { id: 3, src: '', name: 'Internal Roads' },
      { id: 4, src: '', name: 'Entrance Gate' },
      { id: 5, src: '', name: 'Greenery & Landscaping' }
    ]
  },
  {
    id: 'properties-portfolios',
    name: 'Our Property Sites',
    date: 'May 2026',
    thumbnail: '',
    images: [
      { id: 6, src: '', name: 'Shadnagar Plots' },
      { id: 7, src: '', name: 'Maheshwaram Layout' },
      { id: 8, src: '', name: 'Adibatla Township' },
      { id: 9, src: '', name: 'Yacharam Plots' },
      { id: 10, src: '', name: 'Kandukur Layout' }
    ]
  },
  {
    id: 'team-and-events',
    name: 'Events & Corporate Meet',
    date: 'April 2026',
    thumbnail: '',
    images: [
      { id: 11, src: '', name: 'KLR Corporate Team' }
    ]
  }
];

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
  if (!localStorage.getItem('klr_gallery') || localStorage.getItem('klr_gallery') === '[]')
    localStorage.setItem('klr_gallery', JSON.stringify(initialGallery));
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
