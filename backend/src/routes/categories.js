const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create category
router.post('/', auth, async (req, res) => {
  try {
    const category = await Category.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update category
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = await Category.findByPk(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 