// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcH5FzCUY-LjuotQ02balMOQQHBXvgm7M",
  authDomain: "loveboba-57e02.firebaseapp.com",
  projectId: "loveboba-57e02",
  storageBucket: "loveboba-57e02.firebasestorage.app",
  messagingSenderId: "935664712215",
  appId: "1:935664712215:web:c1447e66d73ddc680b3a52",
  measurementId: "G-986S0P3HDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;