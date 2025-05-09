const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:tore1234@localhost:5432/wallet_app', {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: false
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; 