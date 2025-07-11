const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Food = require('./models/Food');
const User = require('./models/User');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to DB if not already (necessary for standalone script)
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('Scheduler connected to DB'))
        .catch(err => console.error('Scheduler DB error:', err));
}

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your sender email
        pass: process.env.EMAIL_PASS  // Your app password
    }
});

// Schedule to run once daily at 9 AM
cron.schedule('0 9 * * *', async () => {
    console.log('🔁 Running daily expiry check...');

    const today = new Date();

    try {
        const foods = await Food.find().populate('user');

        for (let food of foods) {
            const expiryDate = new Date(food.expiryDate);
            const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

            const notifyDays = [30, 15, 5];

            if (notifyDays.includes(diffDays) && !food.notified.includes(diffDays)) {
                // Send email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: food.user.email,
                    subject: `⏰ ${food.name} is expiring in ${diffDays} day(s)!`,
                    text: `Hey ${food.user.username},\n\nYour food item "${food.name}" is expiring in ${diffDays} day(s).\n\nDon't forget to use it!\n\n- Food Expiry Tracker`
                };

                await transporter.sendMail(mailOptions);
                console.log(`📧 Sent email to ${food.user.email} for ${food.name} (${diffDays} days left)`);

                // Update 'notified' field
                food.notified.push(diffDays);
                await food.save();
            }
        }
    } catch (err) {
        console.error('❌ Scheduler error:', err);
    }
});
