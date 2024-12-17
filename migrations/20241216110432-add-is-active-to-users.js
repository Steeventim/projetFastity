'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'IsActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: true, // Optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'IsActive');
  }
};