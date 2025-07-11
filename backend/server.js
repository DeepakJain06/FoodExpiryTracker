const express = require('express');
const mongoose = require('mongoose');
require("./emailScheduler"); 
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

// Make sure path is correct
// Ensure the email scheduler is imported after the server starts
// This will allow the email scheduler to run in the background without blocking the server startup

const app = express();
app.use(cors());
app.use(express.json());

// Mounting the routes correctly
app.use('/api/auth', authRoutes);     // Register: /api/auth/register, Login: /api/auth/login
app.use('/api/foods', foodRoutes);
app.use('/api/user', userRoutes);

// Add/Get Food: /api/foods

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(5000, () => console.log('Server running on http://localhost:5000'));
    })
    .catch(err => console.error('MongoDB connection error:', err));
