'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      idUser: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      NomUser: Sequelize.STRING,
      PrenomUser: Sequelize.STRING,
      Email: Sequelize.STRING,
      Password: Sequelize.STRING,
      Telephone: Sequelize.STRING,
      structureId: {
        type: Sequelize.UUID,
        references: {
          model: 'Structures',
          key: 'idStructure'
        },
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};