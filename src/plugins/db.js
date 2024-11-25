"use strict";

const fastifyPlugin = require("fastify-plugin");
const { Sequelize } = require("sequelize");

async function dbConnector(fastify, options) {
  const sequelize = new Sequelize(
    process.env.DB_NAME || "suivi_dossier",
    process.env.DB_USER || "suivi_user",
    process.env.DB_PASSWORD || "password",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres", // ou 'mysql', 'sqlite', 'mssql' selon la base
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie.");
  } catch (error) {
    console.error("Impossible de se connecter à la base de données :", error);
  }

  fastify.decorate("sequelize", sequelize);
  fastify.addHook("onClose", async (instance, done) => {
    await sequelize.close();
    done();
  });
}

module.exports = fastifyPlugin(dbConnector);
