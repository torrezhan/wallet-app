const express = require('express');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Category,
        as: 'category'
      }],
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/', auth, async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user.id
    });
    
    const transactionWithCategory = await Transaction.findByPk(transaction.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    
    res.status(201).json(transactionWithCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = await Transaction.findByPk(req.params.id, {
      include: [{
        model: Category,
        as: 'category'
      }]
    });
    
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 