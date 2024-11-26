// src/plugins/sequelize.js
const fp = require("fastify-plugin");
const { Sequelize } = require("sequelize");

async function sequelizeConnector(fastify, options) {
  // Récupération des informations de connexion à partir des variables d'environnement
  const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = fastify.config;

  // Initialisation de Sequelize avec les variables d'environnement
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: "postgres", // ou "mysql", selon votre configuration
    logging: false, // Optionnel : désactivez le logging SQL si non nécessaire
  });

  try {
    // Tentative de connexion à la base de données
    await sequelize.authenticate();
    fastify.log.info(
      `Connexion à la base de données PostgreSQL "${DB_NAME}" réussie.`
    );

    // Décorateur pour rendre l'instance de Sequelize accessible dans tout l'app
    fastify.decorate("sequelize", sequelize);
  } catch (error) {
    fastify.log.error("Échec de la connexion à la base de données :");
    fastify.log.error(error);
    // Vous pouvez aussi retourner une réponse d'erreur détaillée
    throw new Error(
      "Impossible de se connecter à la base de données PostgreSQL."
    );
  }
}

// Enregistrement du plugin en utilisant fastify-plugin pour garantir une gestion correcte de l'ordre de chargement
module.exports = fp(sequelizeConnector);
