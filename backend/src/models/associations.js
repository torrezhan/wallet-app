const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');

// User associations
User.hasMany(Category, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
User.hasMany(Transaction, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

// Category associations
Category.belongsTo(User, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Category.hasMany(Transaction, { 
  foreignKey: 'categoryId',
  onDelete: 'CASCADE'
});

// Transaction associations
Transaction.belongsTo(User, { 
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Transaction.belongsTo(Category, { 
  foreignKey: 'categoryId',
  as: 'category',
  onDelete: 'SET NULL'
});

module.exports = {
  User,
  Category,
  Transaction
}; 