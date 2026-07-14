import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDul-IaeGCpvBSTNrjZOtUSFlMEbH3M3sE",
  authDomain: "klr-developers.firebaseapp.com",
  projectId: "klr-developers",
  storageBucket: "klr-developers.firebasestorage.app",
  messagingSenderId: "82311180042",
  appId: "1:82311180042:web:b1fc236c5909b79ea414f3",
  measurementId: "G-QQP9LC5S6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
