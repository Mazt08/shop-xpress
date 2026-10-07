const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc } = require('firebase/firestore');

// From your .env.local / firebase config
const config = {
  apiKey: "AIzaSyCIQaujk43exsbUnvwXD9hvMpoHZPE5U8A",
  authDomain: "shopxpress-76296.firebaseapp.com",
  projectId: "shopxpress-76296",
  storageBucket: "shopxpress-76296.firebasestorage.app",
  messagingSenderId: "338549365581",
  appId: "1:338549365581:web:8364b963867d3282f73504"
};

const seedData = require('./firestore-data.json');

async function importData() {
  const app = initializeApp(config, 'seed-app');
  const db = getFirestore(app);

  // Import users
  for (const user of seedData.collections.users) {
    await setDoc(doc(db, 'users', user.id), user);
  }

  // Import products
  for (const product of seedData.collections.products) {
    await addDoc(collection(db, 'products'), product);
  }

  // Import carts
  for (const cart of seedData.collections.carts) {
    await setDoc(doc(db, 'carts', cart.id), cart);
  }

  // Import orders
  for (const order of seedData.collections.orders) {
    await addDoc(collection(db, 'orders'), order);
  }

  // Import priceHistory
  // Note: priceHistory uses productId as sub-collection
  // Adjust based on your structure
  console.log('Import complete. Data loaded:', Object.keys(seedData.collections).join(', '));
}

importData().catch(console.error);
