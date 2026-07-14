import { db } from '../firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

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
    dtcpApproved: true,
    readyToRegister: true,
    hidden: false,
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
    nearbyLandmarks: ['10 min from ORR Exit', '5 km from Shadnagar Town', 'Near Pharma City'],
    image: '',
    gallery: []
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
    dtcpApproved: true,
    readyToRegister: false,
    hidden: false,
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
    nearbyLandmarks: ['15 km from HITEC City', 'Near Amazon, Facebook Offices', '5 km from Narketpally'],
    image: '',
    gallery: []
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
    dtcpApproved: false,
    readyToRegister: false,
    hidden: false,
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
    nearbyLandmarks: ['Near TATA Advanced Systems', 'Bharat Dynamics Ltd', '20 km from LB Nagar'],
    image: '',
    gallery: []
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
    dtcpApproved: true,
    readyToRegister: true,
    hidden: false,
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
    nearbyLandmarks: ['Near Pharma City SEZ', '25 km from Hyderabad', 'Close to Srisailam Highway'],
    image: '',
    gallery: []
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
    date: 'July 09, 2026',
    source: 'home'
  },
  {
    id: 2,
    name: 'Priya Narayanan',
    phone: '9000188223',
    email: 'priya.n@yahoo.com',
    property: 'Maheshwaram Open Plots',
    message: 'Please send RERA copy and layout plan.',
    status: 'Contacted',
    date: 'July 08, 2026',
    source: 'contact'
  },
  {
    id: 3,
    name: 'Vikas Goud',
    phone: '8106592233',
    email: 'vikas.goud@hotmail.com',
    property: 'Adibatla Premium Layout',
    message: 'Is bank loan available from HDFC? Looking to visit site this Sunday.',
    status: 'Interested',
    date: 'July 06, 2026',
    source: 'home'
  },
  {
    id: 4,
    name: 'Anil Kumar',
    phone: '7702931102',
    email: 'anil.k@gmail.com',
    property: 'Yacharam Investment Plots',
    message: 'Enquiry for lowest price plot in Yacharam.',
    status: 'Closed',
    date: 'July 03, 2026',
    source: 'contact'
  }
];

export const initialTestimonials = [
  {
    id: 1,
    name: 'Ramesh Reddy',
    location: 'Dilsukhnagar, Hyderabad',
    property: 'Shadnagar Premium Plots',
    review: 'K.L.R. Infra Developers made my dream of owning a plot come true. Very honest guidance.',
    hidden: false
  },
  {
    id: 2,
    name: 'Priya Laxmi',
    location: 'Kukatpally, Hyderabad',
    property: 'Maheshwaram Open Plots',
    review: 'Safe investment, clear documentation. The team was highly professional throughout.',
    hidden: false
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
  statYear: '2022',
  statCustomers: '500',
  statProjects: '25',
  statLocations: '10',
};

export const initialGallery = [
  {
    id: 'overview-aerials',
    name: 'Overview & Aerial Views',
    date: 'July 2026',
    thumbnail: '',
    images: [
      { id: 1, src: '', name: 'Aerial View', hidden: false },
      { id: 2, src: '', name: 'Drone View', hidden: false }
    ]
  },
  {
    id: 'infrastructure-layouts',
    name: 'Infrastructure & Site Layouts',
    date: 'June 2026',
    thumbnail: '',
    images: [
      { id: 3, src: '', name: 'Internal Roads', hidden: false },
      { id: 4, src: '', name: 'Entrance Gate', hidden: false },
      { id: 5, src: '', name: 'Greenery & Landscaping', hidden: false }
    ]
  },
  {
    id: 'properties-portfolios',
    name: 'Our Property Sites',
    date: 'May 2026',
    thumbnail: '',
    images: [
      { id: 6, src: '', name: 'Shadnagar Plots', hidden: false },
      { id: 7, src: '', name: 'Maheshwaram Layout', hidden: false },
      { id: 8, src: '', name: 'Adibatla Township', hidden: false },
      { id: 9, src: '', name: 'Yacharam Plots', hidden: false },
      { id: 10, src: '', name: 'Kandukur Layout', hidden: false }
    ]
  },
  {
    id: 'team-and-events',
    name: 'Events & Corporate Meet',
    date: 'April 2026',
    thumbnail: '',
    images: [
      { id: 11, src: '', name: 'KLR Corporate Team', hidden: false }
    ]
  }
];

export const initialEventsGallery = [
  {
    id: 'shadnagar-launch',
    name: 'Shadnagar Site Launch',
    date: 'July 2026',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    images: [
      { id: 'img-1', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80', name: 'Site Launch Ribbon Cutting', hidden: false },
      { id: 'img-2', src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', name: 'Layout Discussion', hidden: false }
    ]
  },
  {
    id: 'maheshwaram-tour',
    name: 'Maheshwaram Site Tour',
    date: 'June 2026',
    thumbnail: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    images: [
      { id: 'img-3', src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80', name: 'Client Gathering', hidden: false },
      { id: 'img-4', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', name: 'Plots Walkthrough', hidden: false }
    ]
  },
  {
    id: 'adibatla-meet',
    name: 'Adibatla Layout Launch',
    date: 'May 2026',
    thumbnail: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80',
    images: [
      { id: 'img-5', src: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80', name: 'Layout Launch Ceremony', hidden: false },
      { id: 'img-6', src: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=600&q=80', name: 'Premium Plots Walkthrough', hidden: false }
    ]
  },
  {
    id: 'corporate-meet',
    name: 'Annual Corporate Meet',
    date: 'April 2026',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    images: [
      { id: 'img-7', src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80', name: 'Team Dinner', hidden: false }
    ]
  },
  {
    id: 'site-pooja',
    name: 'Bhumi Pooja Ceremony',
    date: 'March 2026',
    thumbnail: 'https://images.unsplash.com/photo-1545235621-3d607aa521d8?auto=format&fit=crop&w=600&q=80',
    images: [
      { id: 'img-8', src: 'https://images.unsplash.com/photo-1545235621-3d607aa521d8?auto=format&fit=crop&w=600&q=80', name: 'Site Pooja Ceremony', hidden: false },
      { id: 'img-9', src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', name: 'Bhoomi Pooja Ceremony', hidden: false }
    ]
  },
  {
    id: 'customers-meet',
    name: 'Customer Meet Shadnagar',
    date: 'February 2026',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b8130581f186?auto=format&fit=crop&w=600&q=80',
    images: [
      { id: 'img-10', src: 'https://images.unsplash.com/photo-1556761175-b8130581f186?auto=format&fit=crop&w=600&q=80', name: 'Customer Briefing Session', hidden: false },
      { id: 'img-11', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80', name: 'Q&A Round', hidden: false }
    ]
  }
];

export const initialClientsGallery = [
  { id: 'client-1', src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80', name: 'Happy Client Shadnagar', size: '240 KB', hidden: false },
  { id: 'client-2', src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80', name: 'Happy Client Maheshwaram', size: '180 KB', hidden: false },
  { id: 'client-3', src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', name: 'Client Handover Adibatla', size: '320 KB', hidden: false },
  { id: 'client-4', src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&h=800&q=80', name: 'Client Layout Tour', size: '410 KB', hidden: false },
  { id: 'client-5', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=900&q=80', name: 'Plot Handover Ceremony', size: '380 KB', hidden: false },
  { id: 'client-6', src: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=600&h=400&q=80', name: 'Client Property Visit', size: '290 KB', hidden: false },
  { id: 'client-7', src: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=600&h=800&q=80', name: 'Layout Tour Walkthrough', size: '335 KB', hidden: false },
  { id: 'client-8', src: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&h=900&q=80', name: 'Premium Client Handover', size: '480 KB', hidden: false },
  { id: 'client-9', src: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80', name: 'Happy Plot Purchaser', size: '390 KB', hidden: false }
];

/* ─── Timeout helper (prevents hanging when Firestore rules block) ─── */
function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms — check Security Rules`)), ms)
    )
  ]);
}

/* ─── Properties ─── */
export async function getProperties() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "properties")));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    if (list.length === 0) {
      for (const prop of initialProperties) {
        await setDoc(doc(db, "properties", prop.id), prop);
        list.push(prop);
      }
    }
    return list;
  } catch (err) {
    console.error("Error reading properties: ", err);
    return initialProperties;
  }
}

export async function saveProperties(data) {
  try {
    const colRef = collection(db, "properties");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(doc => doc.id);
    const newIds = data.map(item => item.id);
    for (const id of existingIds) {
      if (!newIds.includes(id)) {
        await deleteDoc(doc(db, "properties", id));
      }
    }
    for (const item of data) {
      await setDoc(doc(db, "properties", item.id), item);
    }
  } catch (err) {
    console.error("Error syncing properties: ", err);
  }
}

/* ─── Leads ─── */
export async function getLeads() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "leads")));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    if (list.length === 0) {
      for (const lead of initialLeads) {
        await setDoc(doc(db, "leads", lead.id.toString()), lead);
        list.push(lead);
      }
    }
    return list;
  } catch (err) {
    console.error("Error reading leads: ", err);
    return initialLeads;
  }
}

export async function saveLeads(data) {
  try {
    const colRef = collection(db, "leads");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(doc => doc.id);
    const newIds = data.map(item => item.id.toString());
    for (const id of existingIds) {
      if (!newIds.includes(id)) {
        await deleteDoc(doc(db, "leads", id));
      }
    }
    for (const item of data) {
      await setDoc(doc(db, "leads", item.id.toString()), item);
    }
  } catch (err) {
    console.error("Error syncing leads: ", err);
  }
}

/* ─── Testimonials ─── */
export async function getTestimonials() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "testimonials")));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    if (list.length === 0) {
      for (const test of initialTestimonials) {
        await setDoc(doc(db, "testimonials", test.id.toString()), test);
        list.push(test);
      }
    }
    return list;
  } catch (err) {
    console.error("Error reading testimonials: ", err);
    return initialTestimonials;
  }
}

export async function saveTestimonials(data) {
  try {
    const colRef = collection(db, "testimonials");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(doc => doc.id);
    const newIds = data.map(item => item.id.toString());
    for (const id of existingIds) {
      if (!newIds.includes(id)) {
        await deleteDoc(doc(db, "testimonials", id));
      }
    }
    for (const item of data) {
      await setDoc(doc(db, "testimonials", item.id.toString()), item);
    }
  } catch (err) {
    console.error("Error syncing testimonials: ", err);
  }
}

/* ─── Gallery ─── */
export async function getGallery() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "gallery")));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    if (list.length === 0) {
      for (const gal of initialGallery) {
        await setDoc(doc(db, "gallery", gal.id), gal);
        list.push(gal);
      }
    }
    return list;
  } catch (err) {
    console.error("Error reading gallery: ", err);
    return initialGallery;
  }
}

export async function saveGallery(data) {
  try {
    const colRef = collection(db, "gallery");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(doc => doc.id);
    const newIds = data.map(item => item.id);
    for (const id of existingIds) {
      if (!newIds.includes(id)) {
        await deleteDoc(doc(db, "gallery", id));
      }
    }
    for (const item of data) {
      await setDoc(doc(db, "gallery", item.id), item);
    }
  } catch (err) {
    console.error("Error syncing gallery: ", err);
  }
}

/* ─── Contact Info ─── */
export async function getContactInfo() {
  try {
    const docSnap = await withTimeout(getDoc(doc(db, "settings", "contact")));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      await setDoc(doc(db, "settings", "contact"), initialContactInfo);
      return initialContactInfo;
    }
  } catch (err) {
    console.error("Error reading contact info: ", err);
    return initialContactInfo;
  }
}

export async function saveContactInfo(data) {
  try {
    await setDoc(doc(db, "settings", "contact"), data);
  } catch (err) {
    console.error("Error saving contact info: ", err);
  }
}

/* ─── Events Gallery ─── */
export async function getEventsGallery() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "gallery_events")));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    
    const forceReseed = typeof window !== 'undefined' && localStorage.getItem('seeded_events_v4') !== 'true';
    if (list.length === 0 || forceReseed) {
      if (forceReseed) {
        for (const docObj of querySnapshot.docs) {
          await deleteDoc(docObj.ref);
        }
        list.length = 0;
      }
      for (const gal of initialEventsGallery) {
        await setDoc(doc(db, "gallery_events", gal.id), gal);
        list.push(gal);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('seeded_events_v4', 'true');
      }
    }
    return list;
  } catch (err) {
    console.error("Error reading events gallery: ", err);
    return initialEventsGallery;
  }
}

export async function saveEventsGallery(data) {
  try {
    const colRef = collection(db, "gallery_events");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(doc => doc.id);
    const newIds = data.map(item => item.id);
    for (const id of existingIds) {
      if (!newIds.includes(id)) {
        await deleteDoc(doc(db, "gallery_events", id));
      }
    }
    for (const item of data) {
      await setDoc(doc(db, "gallery_events", item.id), item);
    }
  } catch (err) {
    console.error("Error syncing events gallery: ", err);
  }
}

/* ─── Clients Gallery ─── */
export async function getClientsGallery() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "gallery_clients")));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    
    const forceReseed = typeof window !== 'undefined' && localStorage.getItem('seeded_clients_v4') !== 'true';
    if (list.length === 0 || forceReseed) {
      if (forceReseed) {
        for (const docObj of querySnapshot.docs) {
          await deleteDoc(docObj.ref);
        }
        list.length = 0;
      }
      for (const gal of initialClientsGallery) {
        await setDoc(doc(db, "gallery_clients", gal.id), gal);
        list.push(gal);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('seeded_clients_v4', 'true');
      }
    }
    return list;
  } catch (err) {
    console.error("Error reading clients gallery: ", err);
    return initialClientsGallery;
  }
}

export async function saveClientsGallery(data) {
  try {
    const colRef = collection(db, "gallery_clients");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(doc => doc.id);
    const newIds = data.map(item => item.id);
    for (const id of existingIds) {
      if (!newIds.includes(id)) {
        await deleteDoc(doc(db, "gallery_clients", id));
      }
    }
    for (const item of data) {
      await setDoc(doc(db, "gallery_clients", item.id), item);
    }
  } catch (err) {
    console.error("Error syncing clients gallery: ", err);
  }
}
