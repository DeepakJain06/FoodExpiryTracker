const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate token
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // ✅ updated
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// GET notification status
router.get('/notification', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // ✅ fixed
        res.json({ notificationEnabled: user.notificationEnabled });
    } catch (err) {
        console.error('🔴 Error fetching user for notification status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// TOGGLE notification
router.put('/notification', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId); // ✅ fixed
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.notificationEnabled = !user.notificationEnabled;
        await user.save();
        res.json({
            message: 'Notification preference updated',
            notificationEnabled: user.notificationEnabled
        });
    } catch (err) {
        console.error('🔴 Error toggling notification:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
