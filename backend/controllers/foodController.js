const Food = require('../models/Food');

exports.addFoodItem = async (req, res) => {
    try {
        const { name, quantity, expiryDate } = req.body;
        const newFood = new Food({
            name,
            quantity,
            expiryDate,
            user: req.userId, // Associate food with the logged-in user
        });
        await newFood.save();
        res.status(201).json({ message: 'Food item added', food: newFood });
    } catch (err) {
        console.error('Error adding food:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFoodItems = async (req, res) => {
    try {
        const foods = await Food.find({ user: req.userId }); // Filter by user
        res.json(foods);
    } catch (err) {
        console.error('Error fetching foods:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteFoodItem = async (req, res) => {
    try {
        await Food.deleteOne({ _id: req.params.id, user: req.userId }); // Secure deletion
        res.json({ message: 'Food item deleted' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateFoodItem = async (req, res) => {
    try {
        const updated = await Food.findOneAndUpdate(
            { _id: req.params.id, user: req.userId }, // Ensure user owns the item
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Food item not found or unauthorized' });
        res.json({ message: 'Food item updated', food: updated });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
