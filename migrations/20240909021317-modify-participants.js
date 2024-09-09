'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Participants', 'bus', Sequelize.STRING)
    await queryInterface.removeColumn('Participants', 'bus_number')
    await queryInterface.removeColumn('Participants', 'get_on_bus')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Participants', 'bus')
    await queryInterface.addColumn('Participants', 'bus_number', Sequelize.STRING)
    await queryInterface.addColumn('Participants', 'get_on_bus', Sequelize.STRING)
  }
};
