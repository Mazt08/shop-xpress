const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

admin.initializeApp();

const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());

// Set up a general rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Set up a STRICT rate limiter just for login attempts (5 tries)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 tries!
  message: { error: "Too many login attempts. Account locked for 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the general rate limiting middleware to all requests to this app
app.use(apiLimiter);

// A special route just to check if the user is allowed to log in (rate limited to 5)
app.post("/login-check", loginLimiter, (req, res) => {
  res.send({ allowed: true });
});

// A simple GET route so you can test the rate limiter by refreshing your browser!
app.get("/", (req, res) => {
  res.send("Refresh this page 11 times to see the rate limiter block you!");
});

// Example endpoint: Securely add inventory via the backend API instead of directly from React
app.post("/addInventory", async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    
    // 1. Validate Input Data (Mitigates NoSQL Injection / Bad Data)
    if (!name || typeof price !== 'number' || typeof stock !== 'number') {
      return res.status(400).send({ error: "Invalid data format or missing fields" });
    }

    // 2. Add to Firestore using the Admin SDK
    const docRef = await admin.firestore().collection("products").add({
        name,
        price,
        stock,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Error adding inventory", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Export the Express API as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
