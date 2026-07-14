// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDul-IaeGCpvBSTNrjZOtUSFlMEbH3M3sE",
  authDomain: "klr-developers.firebaseapp.com",
  projectId: "klr-developers",
  storageBucket: "klr-developers.firebasestorage.app",
  messagingSenderId: "82311180042",
  appId: "1:82311180042:web:f0ac017d39e99672a414f3",
  measurementId: "G-QNXGNBC02N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
