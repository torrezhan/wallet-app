const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');

// Associations
User.hasMany(Category, {
  foreignKey: 'userId',
  as: 'categories'
});
Category.belongsTo(User, {
  foreignKey: 'userId'
});

User.hasMany(Transaction, {
  foreignKey: 'userId',
  as: 'transactions'
});
Transaction.belongsTo(User, {
  foreignKey: 'userId'
});

Category.hasMany(Transaction, {
  foreignKey: 'categoryId',
  as: 'transactions'
});
Transaction.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

module.exports = {
  User,
  Category,
  Transaction
}; 