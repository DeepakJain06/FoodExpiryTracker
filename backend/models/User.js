const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notificationEnabled: { type: Boolean, default: true }, // ✅ NEW FIELD
});

module.exports = mongoose.model('User', userSchema);
