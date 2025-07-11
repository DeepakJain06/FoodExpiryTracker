const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    notified: { type: [Number], default: [] } // New: Store days that have already triggered notifications (e.g., [30, 15])
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
