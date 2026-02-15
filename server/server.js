require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cars', require('./routes/collectionRoutes'));

// Verify Route
app.get('/', (req, res) => {
    res.send('HWPro Backend Running');
});

// Database Connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hwpro')
//     .then(() => console.log('MongoDB Connected'))
//     .catch(err => console.log('MongoDB Connection Error:', err));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
