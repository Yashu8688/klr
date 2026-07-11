// Property Data for K.L.R. Infra Developers

import heroImg from '../assets/hero.png';
import propShadnagarImg from '../assets/prop-shadnagar.png';
import propMaheshwaramImg from '../assets/prop-maheshwaram.png';
import propAdibatlaImg from '../assets/prop-adibatla.png';
import propYacharamImg from '../assets/prop-yacharam.png';
import propKandukurImg from '../assets/prop-kandukur.png';
import galleryRoadsImg from '../assets/gallery-roads.png';
import galleryEntranceImg from '../assets/gallery-entrance.png';
import galleryGreeneryImg from '../assets/gallery-greenery.png';
import galleryDroneImg from '../assets/gallery-drone.png';

export { heroImg, galleryRoadsImg, galleryEntranceImg, galleryGreeneryImg, galleryDroneImg };

export const properties = [
  {
    id: 'shadnagar-premium-plots',
    name: 'Shadnagar Premium Plots',
    location: 'Shadnagar, Ranga Reddy District',
    area: 'Shadnagar',
    price: '₹18 L – ₹35 L',
    pricePerSqYd: '₹4,200/Sq.Yd',
    plotSizes: '100 – 300 Sq.Yds',
    totalPlots: 120,
    approval: ['DTCP Approved', 'LP No: 123/2023'],
    status: 'Ready to Register',
    image: propShadnagarImg,
    gallery: [propShadnagarImg, galleryRoadsImg, galleryEntranceImg],
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
    nearbyLandmarks: ['10 min from ORR Exit', '5 km from Shadnagar Town', 'Near Pharma City'],
    loanAvailable: true,
    loanPartners: ['SBI', 'HDFC Bank', 'Axis Bank'],
    description:
      'Premium DTCP-approved plotted layout on the outskirts of Shadnagar with excellent connectivity to Hyderabad via NH-44. Ideal for residential construction and long-term investment with high appreciation potential.',
    shortDescription: 'DTCP-approved plotted layout with NH-44 connectivity & premium infrastructure.',
    coordinates: { lat: 17.0687, lng: 78.1519 },
    featured: true,
  },
  {
    id: 'maheshwaram-open-plots',
    name: 'Maheshwaram Open Plots',
    location: 'Maheshwaram, Ranga Reddy District',
    area: 'Maheshwaram',
    price: '₹22 L – ₹48 L',
    pricePerSqYd: '₹5,500/Sq.Yd',
    plotSizes: '150 – 400 Sq.Yds',
    totalPlots: 85,
    approval: ['DTCP Approved', 'RERA: P01100002345'],
    status: 'Available',
    image: propMaheshwaramImg,
    gallery: [propMaheshwaramImg, galleryRoadsImg, galleryDroneImg],
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
    nearbyLandmarks: ['15 km from HITEC City', 'Near Amazon, Facebook Offices', '5 km from Narketpally'],
    loanAvailable: true,
    loanPartners: ['ICICI Bank', 'LIC Housing', 'PNB Housing'],
    description:
      'Strategically located in the fast-growing Maheshwaram IT corridor. With major tech companies establishing nearby, these plots offer premium returns and excellent connectivity to Outer Ring Road.',
    shortDescription: 'DTCP & RERA approved plots in the heart of Hyderabad\'s IT expansion zone.',
    coordinates: { lat: 17.0982, lng: 78.4241 },
    featured: true,
  },
  {
    id: 'adibatla-premium-layout',
    name: 'Adibatla Premium Layout',
    location: 'Adibatla, Ranga Reddy District',
    area: 'Adibatla',
    price: '₹30 L – ₹65 L',
    pricePerSqYd: '₹7,000/Sq.Yd',
    plotSizes: '200 – 500 Sq.Yds',
    totalPlots: 65,
    approval: ['RERA Approved', 'DTCP Approved'],
    status: 'Limited Units',
    image: propAdibatlaImg,
    gallery: [propAdibatlaImg, galleryEntranceImg, galleryGreeneryImg],
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
    nearbyLandmarks: ['Near TATA Advanced Systems', 'Bharat Dynamics Ltd', '20 km from LB Nagar'],
    loanAvailable: true,
    loanPartners: ['SBI', 'HDFC', 'Bajaj Housing'],
    description:
      'Located in Adibatla — the aerospace and defence manufacturing hub of India — this premium gated township layout offers exceptional infrastructure and is surrounded by India\'s top industrial establishments.',
    shortDescription: 'Premium gated township near Hyderabad\'s Aerospace & Defence corridor.',
    coordinates: { lat: 17.3007, lng: 78.6421 },
    featured: true,
  },
  {
    id: 'yacharam-plots',
    name: 'Yacharam Investment Plots',
    location: 'Yacharam, Ranga Reddy District',
    area: 'Yacharam',
    price: '₹12 L – ₹25 L',
    pricePerSqYd: '₹2,800/Sq.Yd',
    plotSizes: '100 – 250 Sq.Yds',
    totalPlots: 150,
    approval: ['DTCP Approved'],
    status: 'Available',
    image: propYacharamImg,
    gallery: [propYacharamImg, galleryRoadsImg, galleryGreeneryImg],
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
    nearbyLandmarks: ['Near Pharma City SEZ', '25 km from Hyderabad', 'Close to Srisailam Highway'],
    loanAvailable: true,
    loanPartners: ['SBI', 'Union Bank'],
    description:
      'Affordable investment plots in Yacharam with excellent future potential due to proximity to Hyderabad Pharma City SEZ. DTCP approved with clear titles and straightforward documentation.',
    shortDescription: 'Budget-friendly DTCP plots with high appreciation potential near Pharma City.',
    coordinates: { lat: 17.1723, lng: 78.6802 },
    featured: false,
  },
  {
    id: 'kandukur-investment-plots',
    name: 'Kandukur Investment Plots',
    location: 'Kandukur, Ranga Reddy District',
    area: 'Kandukur',
    price: '₹15 L – ₹30 L',
    pricePerSqYd: '₹3,500/Sq.Yd',
    plotSizes: '100 – 300 Sq.Yds',
    totalPlots: 100,
    approval: ['DTCP Approved', 'LP No: 456/2024'],
    status: 'Available',
    image: propKandukurImg,
    gallery: [propKandukurImg, galleryDroneImg, galleryEntranceImg],
    highlights: [
      'NH-765 Connectivity',
      'Upcoming Smart City Zone',
      'BT Roads',
      'Clear Documentation',
      'Vastu Compliant Plots',
      'Easy Registration',
    ],
    amenities: [
      { icon: 'road', label: 'BT Roads' },
      { icon: 'droplets', label: 'Water Supply' },
      { icon: 'zap', label: 'EB Lines' },
      { icon: 'shield', label: 'Security Cabin' },
      { icon: 'trees', label: 'Avenue Plantation' },
      { icon: 'file-text', label: 'Clear Title Deeds' },
    ],
    nearbyLandmarks: ['Near Kandukur Town', 'NH-765 Frontage', 'Close to Nagarkurnool'],
    loanAvailable: true,
    loanPartners: ['SBI', 'Andhra Bank', 'HDFC'],
    description:
      'DTCP approved residential plots in Kandukur offering excellent connectivity via NH-765. Perfect for first-time investors seeking affordable, legally clear plots with straightforward registration process.',
    shortDescription: 'Affordable DTCP plots with NH-765 connectivity & clear documentation.',
    coordinates: { lat: 17.2124, lng: 78.2891 },
    featured: false,
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Ramesh Reddy',
    location: 'Dilsukhnagar, Hyderabad',
    rating: 5,
    review:
      'K.L.R. Infra Developers made my dream of owning a plot in Hyderabad come true. Their transparent process and honest guidance was exceptional. No hidden charges, no pressure. Highly recommend!',
    image: null,
    property: 'Shadnagar Premium Plots',
    date: 'March 2025',
  },
  {
    id: 2,
    name: 'Priya Laxmi',
    location: 'Kukatpally, Hyderabad',
    rating: 5,
    review:
      'I was looking for a safe investment, and KLR helped me select the best plot in Maheshwaram. The documentation was crystal clear, loan assistance was smooth, and the team was very professional.',
    image: null,
    property: 'Maheshwaram Open Plots',
    date: 'January 2025',
  },
  {
    id: 3,
    name: 'Venkat Suresh',
    location: 'Nagole, Hyderabad',
    rating: 5,
    review:
      'Amazing experience! The KLR team personally accompanied us for site visits, explained every detail, and helped us complete registration in just 2 weeks. Great value for the price paid.',
    image: null,
    property: 'Adibatla Premium Layout',
    date: 'November 2024',
  },
  {
    id: 4,
    name: 'Suresh Babu',
    location: 'LB Nagar, Hyderabad',
    rating: 5,
    review:
      'I bought a plot in Yacharam through KLR and the entire process was smooth from day one. The team was always available on call and cleared all my doubts patiently. The plot is exactly as shown. Very happy with my purchase!',
    image: null,
    property: 'Yacharam Investment Plots',
    date: 'September 2024',
  },
  {
    id: 5,
    name: 'Anitha Goud',
    location: 'Mehdipatnam, Hyderabad',
    rating: 5,
    review:
      'As a first-time buyer I was nervous, but KLR made it feel effortless. They handled all legal verification, explained DTCP approvals step by step, and even helped arrange a bank loan at a great rate. Would buy again!',
    image: null,
    property: 'Kandukur Investment Plots',
    date: 'August 2024',
  },
  {
    id: 6,
    name: 'Mohammed Farhan',
    location: 'Tolichowki, Hyderabad',
    rating: 5,
    review:
      'I compared multiple developers before choosing KLR Infra. Their plots in Shadnagar are genuinely DTCP approved with clear documentation. The infrastructure — roads, drainage, lighting — is all in place. Excellent investment.',
    image: null,
    property: 'Shadnagar Premium Plots',
    date: 'June 2024',
  },
  {
    id: 7,
    name: 'Kavitha Sharma',
    location: 'Uppal, Hyderabad',
    rating: 5,
    review:
      'The KLR team went above and beyond during our site visit. They arranged transportation, gave us a detailed tour, and answered every question thoroughly. Registration was done in one day. Truly a hassle-free experience.',
    image: null,
    property: 'Adibatla Premium Layout',
    date: 'May 2024',
  },
  {
    id: 8,
    name: 'Ravi Teja',
    location: 'Secunderabad, Hyderabad',
    rating: 5,
    review:
      'After retirement I wanted to invest safely. KLR Infra was recommended by my colleague and it was the best decision. The plot in Maheshwaram has already appreciated significantly. Professional, trustworthy, and highly reliable.',
    image: null,
    property: 'Maheshwaram Open Plots',
    date: 'March 2024',
  },
];

export const stats = [
  { label: 'Year Established', value: 2022, suffix: '', isYear: true },
  { label: 'Happy Customers', value: 500, suffix: '+' },
  { label: 'Projects Assisted', value: 25, suffix: '+' },
  { label: 'Prime Locations', value: 10, suffix: '+' },
];

export const services = [
  {
    icon: 'search',
    title: 'Property Selection',
    description: 'We help you find the perfect plot matching your budget, location preference, and investment goals.',
  },
  {
    icon: 'car',
    title: 'Site Visits',
    description: 'Personal accompanied site visits to every property. See what you are buying before you invest.',
  },
  {
    icon: 'shield-check',
    title: 'Legal Verification',
    description: 'Complete verification of title deeds, DTCP/RERA approvals, and encumbrance certificates.',
  },
  {
    icon: 'file-text',
    title: 'Documentation',
    description: 'End-to-end paperwork assistance — from agreement of sale to registration and title transfer.',
  },
  {
    icon: 'credit-card',
    title: 'Loan Assistance',
    description: 'We partner with leading banks to help you secure the best home loan at competitive interest rates.',
  },
  {
    icon: 'trending-up',
    title: 'Investment Consultation',
    description: 'Expert guidance on high-appreciation zones, ROI analysis, and portfolio planning.',
  },
  {
    icon: 'stamp',
    title: 'Registration Support',
    description: 'Complete registration assistance at the Sub-Registrar Office with no hassle or confusion.',
  },
  {
    icon: 'headphones',
    title: 'After Sales Support',
    description: 'Post-purchase support for construction approvals, utility connections, and resale guidance.',
  },
];

export const whyChooseUs = [
  {
    icon: 'shield-check',
    title: 'Legal & Clear Titles',
    description: 'Every property is thoroughly verified with clear title deeds and all legal approvals in place.',
  },
  {
    icon: 'map-pin',
    title: 'Premium Locations',
    description: 'Handpicked locations in high-growth corridors of Hyderabad with excellent future value.',
  },
  {
    icon: 'indian-rupee',
    title: 'Affordable Pricing',
    description: 'Premium plots at middle-class-friendly prices. No compromise on quality or location.',
  },
  {
    icon: 'handshake',
    title: 'Transparent Deals',
    description: 'Zero hidden charges. What you see is what you pay. Complete transparency at every step.',
  },
  {
    icon: 'phone',
    title: 'Dedicated Support',
    description: '10:00 AM – 6:00 PM dedicated customer support. We are always there when you need us.',
  },
  {
    icon: 'trending-up',
    title: 'High ROI Investment',
    description: 'Properties in rapidly developing zones with proven track record of high appreciation.',
  },
];
