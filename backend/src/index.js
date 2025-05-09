const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
// Import models with associations
require('./models/associations');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/transactions', require('./routes/transactions'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

// Function to initialize database
const initializeDatabase = async () => {
  try {
    // First, try to authenticate
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Then sync the models
    await sequelize.sync({ alter: true });
    console.log('Database models have been synchronized.');

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to initialize database:', error);
    process.exit(1);
  }
};

// Initialize the application
initializeDatabase(); 