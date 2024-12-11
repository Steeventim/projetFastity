'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add new validation for password strength
      await queryInterface.addConstraint('Users', {
        fields: ['Password'],
        type: 'check',
        name: 'password_strength_check',
        transaction,
        where: {
          Password: {
            [Sequelize.Op.regexp]: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          }
        }
      });
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove the check constraint
      await queryInterface.removeConstraint('Users', 'password_strength_check', { transaction });
    });
  }
};
