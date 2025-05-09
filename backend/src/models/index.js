const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');

User.hasMany(Category, {
  foreignKey: 'userId',
  as: 'categories',
  onDelete: 'CASCADE'
});
User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions',
  onDelete: 'CASCADE'
});

Category.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
Category.hasMany(Transaction, {
  foreignKey: 'categoryId',
  as: 'transactions',
  onDelete: 'CASCADE'
});

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