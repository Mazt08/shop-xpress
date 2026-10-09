import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = globalThis.__FIREBASE_CONFIG__ || {
  apiKey: "AIzaSyCIQaujk43exsbUnvwXD9hvMpoHZPE5U8A",
  authDomain: "shopxpress-76296.firebaseapp.com",
  projectId: "shopxpress-76296",
  storageBucket: "shopxpress-76296.firebasestorage.app",
  messagingSenderId: "338549365581",
  appId: "1:338549365581:web:8364b963867d3282f73504",
  measurementId: "G-PXL3YW7TSH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

// Clean up duplicate apps in development (HMR)
if (typeof window !== "undefined" && getApps().length > 1) {
  const apps = getApps();
  apps.forEach((currentApp, index) => {
    if (index > 0) {
      deleteApp(currentApp);
    }
  });
}
