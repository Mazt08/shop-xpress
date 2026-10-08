const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc, getDocs, deleteDoc } = require('firebase/firestore');

// Config loaded from .env.local / environment — no hardcoded secrets
const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || ""
};

const app = initializeApp(config);
const db = getFirestore(app);

async function seed() {
  // Clean products with real-world descriptions — no vulnerability references
  const products = [
    { name: 'Premium Smartphone', description: 'High-end mobile with crisp display and long battery life.', price: 799, category: 'Electronics', stock: 5, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', sku: 'PHONE-001', createdAt: new Date() },
    { name: 'Smart Fitness Watch', description: 'Track workouts, heart rate, and sleep patterns.', price: 199, category: 'Electronics', stock: 10, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', sku: 'WATCH-002', createdAt: new Date() },
    { name: 'Wireless Mesh Router', description: 'Whole-home coverage with stable high-speed connection.', price: 89, category: 'Electronics', stock: 20, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b5?w=400&q=80', sku: 'ROUTER-003', createdAt: new Date() },
    { name: 'Modern Hardcover', description: 'A well-designed book for everyday reading.', price: 15, category: 'Books', stock: 50, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80', sku: 'BOOK-004', createdAt: new Date() },
    { name: 'Organic Cotton Tee', description: 'Soft, breathable shirt with a clean modern cut.', price: 25, category: 'Clothing', stock: 100, imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', sku: 'SHIRT-005', createdAt: new Date() }
  ];

  // Seed products
  for (const p of products) {
    await addDoc(collection(db, 'products'), p);
  }

  // Admin user via Firestore roles (manual entry — set role to admin manually)
  await setDoc(doc(db, 'users', 'admin@shopxpress.local'), {
    email: 'admin@shopxpress.local',
    role: 'admin',
    createdAt: new Date()
  }, { merge: true });

  console.log('Seed complete: products imported, admin role set manually');
}

seed().catch(console.error);
