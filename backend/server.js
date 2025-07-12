const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const userRoutes = require('./routes/userRoutes');
require('./emailScheduler'); // Ensure this runs after .env is loaded

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);    // Register/Login: /api/auth/*
app.use('/api/foods', foodRoutes);   // Food CRUD: /api/foods/*
app.use('/api/user', userRoutes);

app.get('/api/test-db', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({
            status: 'success',
            message: 'MongoDB is connected!',
            collections: collections.map(col => col.name)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch collections' });
    }
});
// User management: /api/user/*

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');
        app.listen(5000, () => console.log('🚀 Server running at http://localhost:5000'));
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

