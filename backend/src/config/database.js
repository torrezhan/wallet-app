const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:tore1234@localhost:5432/wallet_app', {
  dialect: 'postgres',
  logging: console.log, // false to hide SQL queries
  dialectOptions: {
    ssl: false
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; 