// src/plugins/sequelize.js
const fp = require("fastify-plugin");
const { Sequelize } = require("sequelize");

async function sequelizeConnector(fastify, options) {
  const sequelize = new Sequelize("mydb", "user", "password", {
    host: "localhost",
    dialect: "postgres",
  });

  try {
    await sequelize.authenticate();
    fastify.log.info(
      "Connection to PostgreSQL has been established successfully."
    );
    fastify.decorate("sequelize", sequelize);
  } catch (error) {
    fastify.log.error("Unable to connect to the database:", error);
  }
}

module.exports = fp(sequelizeConnector);
