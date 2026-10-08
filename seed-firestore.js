const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc } = require('firebase/firestore');

const config = {
  apiKey: "AIzaSyCIQaujk43exsbUnvwXD9hvMpoHZPE5U8A",
  authDomain: "shopxpress-76296.firebaseapp.com",
  projectId: "shopxpress-76296",
  storageBucket: "shopxpress-76296.firebasestorage.app",
  messagingSenderId: "338549365581",
  appId: "1:338549365581:web:8364b963867d3282f73504"
};

const app = initializeApp(config);
const db = getFirestore(app);

async function seed() {
  // Admin user (plaintext password - vulnerable)
  await setDoc(doc(db, 'users', 'admin@test.com'), {
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date()
  });
  
  await setDoc(doc(db, 'users', 'customer1@test.com'), {
    email: 'customer1@test.com',
    password: 'password123',
    role: 'customer',
    createdAt: new Date()
  });

  // Products
  const products = [
    { name: 'Vulnerable Phone', description: 'Phone with known exploits', price: 799, category: 'Electronics', stock: 5, imageUrl: 'https://via.placeholder.com/200', sku: 'PHONE-001', createdAt: new Date() },
    { name: 'Hackable Watch', description: 'Smartwatch with open APIs', price: 199, category: 'Electronics', stock: 10, imageUrl: 'https://via.placeholder.com/200', sku: 'WATCH-002', createdAt: new Date() },
    { name: 'Leaky Router', description: 'Router with no firewall', price: 89, category: 'Electronics', stock: 20, imageUrl: 'https://via.placeholder.com/200', sku: 'ROUTER-003', createdAt: new Date() },
    { name: 'Broken Book', description: 'Book with injection vulnerabilities', price: 15, category: 'Books', stock: 50, imageUrl: 'https://via.placeholder.com/200', sku: 'BOOK-004', createdAt: new Date() },
    { name: 'Insecure Shirt', description: 'Shirt with plaintext tags', price: 25, category: 'Clothing', stock: 100, imageUrl: 'https://via.placeholder.com/200', sku: 'SHIRT-005', createdAt: new Date() }
  ];
  
  for (const p of products) {
    await addDoc(collection(db, 'products'), p);
  }

  // Cart with sample data (vulnerable: no ownership check)
  await setDoc(doc(db, 'carts', 'customer1@test.com'), {
    items: [
      { productId: 'PHONE-001', quantity: 1, price: 799 },
      { productId: 'WATCH-002', quantity: 2, price: 199 }
    ],
    updatedAt: new Date()
  });

  // Order (vulnerable: writable by all)
  await addDoc(collection(db, 'orders'), {
    items: [{ productId: 'PHONE-001', quantity: 1, price: 799 }],
    total: 799,
    status: 'completed',
    orderDate: new Date(),
    transactionId: 'fake-uuid-1234'
  });

  // Price history (vulnerable: writable by all users)
  await addDoc(collection(db, 'priceHistory', 'PHONE-001'), {
    price: 799,
    changedAt: new Date(),
    changedBy: 'admin@test.com'
  });

  console.log('Firestore seed data created successfully');
}

seed().catch(console.error);
