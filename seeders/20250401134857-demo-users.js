'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('password123', 10); // Hash the default password
    const now = new Date();
    
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: password,
        role: 'ADMIN',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Regular User 1',
        email: 'user1@example.com',
        password: password,
        role: 'CUSTOMER',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Regular User 2',
        email: 'user2@example.com',
        password: password,
        role: 'CUSTOMER',
        createdAt: now,
        updatedAt: now
      },
      {
        name: 'Event Vendor',
        email: 'vendor@example.com',
        password: password,
        role: 'CUSTOMER',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};