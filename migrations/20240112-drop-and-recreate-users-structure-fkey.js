'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the existing foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      DROP CONSTRAINT IF EXISTS "Users_structureId_fkey";
    `);

    // Alter the structureId column to UUID
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "structureId" TYPE UUID 
      USING "structureId"::UUID;
    `);

    // Recreate the foreign key constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ADD CONSTRAINT "Users_structureId_fkey" 
      FOREIGN KEY ("structureId") 
      REFERENCES "Structures" ("idStructure");
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert changes
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      DROP CONSTRAINT IF EXISTS "Users_structureId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" 
      ALTER COLUMN "structureId" TYPE VARCHAR(255);
    `);
  }
};
