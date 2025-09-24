/*import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/database";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";


/*const firebaseConfig = {
  apiKey: "AIzaSyBOIVay3_mPI3e5qj6m7-o00b2BPBgIaQY",
  authDomain: "hackverse-5ecdd.firebaseapp.com",
  databaseURL: "https://hackverse-5ecdd-default-rtdb.firebaseio.com",
  projectId: "hackverse-5ecdd",
  storageBucket: "hackverse-5ecdd.appspot.com",
  messagingSenderId: "316801498344",
  appId: "1:316801498344:web:f70c7cb41d44f5bcf21d5d",
  measurementId: "G-E8W4PT6DS5"
};
*/

/*const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
//export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);
export const db = getDatabase();
*/


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// --- THIS IS THE FIX (Part 1) ---
// Your Firebase configuration is now loaded securely from environment variables.
// It is no longer hardcoded in your file.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// --- THIS IS THE FIX (Part 2) ---
// This code prevents Firebase from being initialized more than once,
// which is a common error in Next.js development.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);
// --- THIS IS THE FIX (Part 3) ---
// The Realtime Database instance must also be connected to your app.
export const db = getDatabase(app);
