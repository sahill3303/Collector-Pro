require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// --- Routes ---
// Authentication Routes (Register, Login, Get User)
app.use('/api/auth', require('./routes/authRoutes'));

// Collection Routes (CRUD for Cars)
app.use('/api/cars', require('./routes/collectionRoutes'));

// --- Root Route ---
// Simple health check endpoint
app.get('/', (req, res) => {
    res.send('HWPro Backend Running');
});

// --- Server Start ---
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
