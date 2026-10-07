# ShopXpress - Vulnerable E-commerce Site

## Overview

ShopXpress is an intentionally vulnerable React-based e-commerce application designed for penetration testing and security research. This application demonstrates multiple security vulnerabilities in a realistic ecommerce scenario.

## Intended Use

**This application is NOT suitable for production use.** It is designed to:

1. **Educate developers** about common web application vulnerabilities
2. **Serve as a penetration testing testbed**
3. **Help security teams** validate their defensive measures
4. **Demonstrate exploitation techniques** for security awareness

## Security Vulnerabilities (For Research Only)

### 1. Authentication Flaws
- **Hardcoded Admin Credentials**: `admin@test.com` / `admin123`
- **No Password Hashing**: Passwords stored in plaintext
- **No Rate Limiting**: Brute-force attacks possible
- **Weak Session Management**: No timeout, vulnerable to session hijacking

### 2. Authorization Bypass
- **Missing Ownership Checks**: Users can modify any user's cart/orders
- **Admin Panel Access**: Simple password protection in client-side code
- **Insecure Direct Object References**: Direct access to other users' data

### 3. Data Exposure
- **Email Enumeration**: All registered emails accessible without authentication
- **Password Disclosure**: Passwords stored and displayed in plaintext
- **Price History**: Writable by all users (anyone can claim to change prices)

### 4. Injection Vulnerabilities
- **Firestore Query Injection**: Search functionality vulnerable to SQL-like injection
- **Raw User Input**: No sanitization of product names, categories, SKUs

### 5. Business Logic Flaws
- **Stock Manipulation**: Can go negative, unlimited quantities
- **Cart Modification**: Items can be changed without authorization
- **Fake Payment System**: No actual validation, order total can be edited

## How to Run

### Prerequisites
- Node.js v18+
- Firebase CLI
- Vercel CLI (optional for deployment)

### Development Setup
```bash
# Clone and navigate to the project
# Install dependencies
npm install

# Run the application
npm run dev
```

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database (test mode)
3. Enable Firebase Storage
4. Enable Email/Password authentication
5. Deploy vulnerable Firestore rules
6. Copy credentials to `.env.local`

### Environment Variables
Create `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_ADMIN_PASSWORD=admin123
```

## Key Directories

- `src/` - Source code
- `src/contexts/` - Authentication, Cart, and Product contexts
- `src/components/` - Reusable UI components
- `src/pages/` - Application pages
- `src/firebase/` - Firebase configuration

## Demonstration Scripts

The application includes demonstration scripts that show how to exploit vulnerabilities:

### Email Enumeration
```javascript
// All users are readable without authentication
const usersRef = collection(db, 'users');
const snapshot = await getDocs(usersRef);
snapshot.forEach(doc => console.log(doc.data().email));
```

### Brute Force Login
```javascript
// No rate limiting allows unlimited attempts
for (let password of ['admin123', 'password', '123456']) {
  await login('admin@test.com', password);
}
```

### Query Injection
```javascript
// Search form vulnerable to injection
// Input: " OR "1"=="1
// Returns all products instead of filtered results
```

### Cart Hijacking
```javascript
// Change URL from /cart/user1@test.com to /cart/admin@test.com
// Access another user's cart (no ownership check)
```

## Security Testing Guidelines

### Safe Testing Environment
- Use a test Firebase project
- Never deploy to production
- Rotate all credentials after testing
- Document findings for security improvement

### Ethical Considerations
- Only test environments you own or have permission to test
- Do not exploit vulnerabilities in production systems
- Report vulnerabilities responsibly
- Use findings to improve security, not exploit

## Files Structure

- `package.json` - Project configuration
- `vite.config.js` - Vite build configuration
- `src/firebase/config.js` - Firebase initialization
- `src/contexts/` - React context providers
- `src/components/` - UI components
- `src/pages/` - Application routes

## Credits

This vulnerable application was created for educational and security testing purposes. It demonstrates real-world security vulnerabilities in a controlled environment.

**Note**: Always practice ethical hacking and only test systems you have permission to test.