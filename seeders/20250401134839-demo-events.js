// seeders/...-demo-events.js
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Events', [{
      name: 'Tech Conference',
      venue: 'Convention Center',
      date_time: new Date('2023-12-15 09:00:00'),
      vendor: 'Tech Events Inc',
      description: 'Annual technology conference',
      available_seats: 150,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Events', null, {});
  }
};