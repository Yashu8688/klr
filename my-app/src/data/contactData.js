/* ─── Default Contact Info (fallback if admin hasn't saved yet) ─── */
export const defaultContactInfo = {
  primaryPhone: '+91 90596 13895',
  secondaryPhone: '+91 81065 92143',
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

/* ─── Read contact info fallback ─── */
export function getContactInfo() {
  return defaultContactInfo;
}

/* ─── Helper: format whatsapp link ─── */
export function getWhatsAppLink(number, msg = '') {
  let clean = (number || '').replace(/\D/g, '');
  if (clean.length === 10) {
    clean = '91' + clean;
  }
  const text = msg ? `?text=${encodeURIComponent(msg)}` : '';
  return `https://wa.me/${clean}${text}`;
}

/* ─── Helper: format phone link ─── */
export function getPhoneLink(number) {
  let clean = (number || '').replace(/\D/g, '');
  if (clean.length === 10) {
    clean = '91' + clean;
  }
  return `tel:+${clean}`;
}

/* ─── Helper: full address string ─── */
export function getFullAddress(ci) {
  const parts = [ci.addressLine1, ci.addressLine2, ci.city, ci.state, ci.pincode].filter(Boolean);
  return parts.join(', ');
}
