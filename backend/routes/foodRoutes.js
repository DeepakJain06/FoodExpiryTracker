const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addFoodItem,
  getFoodItems,
  deleteFoodItem,
  updateFoodItem
} = require('../controllers/foodController');

router.post('/', authMiddleware, addFoodItem);
router.get('/', authMiddleware, getFoodItems);
router.delete('/:id', authMiddleware, deleteFoodItem);
router.put('/:id', authMiddleware, updateFoodItem);

module.exports = router;
