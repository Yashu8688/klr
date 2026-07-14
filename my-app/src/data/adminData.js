import { db } from '../firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

/* ─── Timeout helper ─── */
function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms)
    )
  ]);
}

/* ─── Properties ─── */
export async function getProperties() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "properties")));
    const list = [];
    querySnapshot.forEach((d) => list.push({ ...d.data(), id: d.id }));
    return list;
  } catch (err) {
    console.error("Error reading properties: ", err);
    return [];
  }
}

export async function saveProperties(data) {
  try {
    const colRef = collection(db, "properties");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(d => d.id);
    const newIds = data.map(item => item.id);
    for (const id of existingIds) {
      if (!newIds.includes(id)) await deleteDoc(doc(db, "properties", id));
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
    querySnapshot.forEach((d) => list.push({ ...d.data(), id: d.id }));
    return list;
  } catch (err) {
    console.error("Error reading leads: ", err);
    return [];
  }
}

export async function saveLeads(data) {
  try {
    const colRef = collection(db, "leads");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(d => d.id);
    const newIds = data.map(item => item.id.toString());
    for (const id of existingIds) {
      if (!newIds.includes(id)) await deleteDoc(doc(db, "leads", id));
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
    querySnapshot.forEach((d) => list.push({ ...d.data(), id: d.id }));
    return list;
  } catch (err) {
    console.error("Error reading testimonials: ", err);
    return [];
  }
}

export async function saveTestimonials(data) {
  try {
    const colRef = collection(db, "testimonials");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(d => d.id);
    const newIds = data.map(item => item.id.toString());
    for (const id of existingIds) {
      if (!newIds.includes(id)) await deleteDoc(doc(db, "testimonials", id));
    }
    for (const item of data) {
      await setDoc(doc(db, "testimonials", item.id.toString()), item);
    }
  } catch (err) {
    console.error("Error syncing testimonials: ", err);
  }
}

/* ─── Events Gallery ─── */
export async function getEventsGallery() {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "gallery_events")));
    const list = [];
    querySnapshot.forEach((d) => list.push({ ...d.data(), id: d.id }));
    return list;
  } catch (err) {
    console.error("Error reading events gallery: ", err);
    return [];
  }
}

export async function saveEventsGallery(data) {
  try {
    const colRef = collection(db, "gallery_events");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(d => d.id);
    const newIds = data.map(item => item.id);
    for (const id of existingIds) {
      if (!newIds.includes(id)) await deleteDoc(doc(db, "gallery_events", id));
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
    querySnapshot.forEach((d) => list.push({ ...d.data(), id: d.id }));
    return list;
  } catch (err) {
    console.error("Error reading clients gallery: ", err);
    return [];
  }
}

export async function saveClientsGallery(data) {
  try {
    const colRef = collection(db, "gallery_clients");
    const snapshot = await withTimeout(getDocs(colRef));
    const existingIds = snapshot.docs.map(d => d.id);
    const newIds = data.map(item => item.id);
    for (const id of existingIds) {
      if (!newIds.includes(id)) await deleteDoc(doc(db, "gallery_clients", id));
    }
    for (const item of data) {
      await setDoc(doc(db, "gallery_clients", item.id), item);
    }
  } catch (err) {
    console.error("Error syncing clients gallery: ", err);
  }
}

/* ─── Contact Info ─── */
export async function getContactInfo() {
  try {
    const docSnap = await withTimeout(getDoc(doc(db, "settings", "contact")));
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (err) {
    console.error("Error reading contact info: ", err);
    return null;
  }
}

export async function saveContactInfo(data) {
  try {
    await setDoc(doc(db, "settings", "contact"), data);
  } catch (err) {
    console.error("Error saving contact info: ", err);
  }
}
