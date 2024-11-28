require("dotenv").config();
const { Sequelize } = require("sequelize");

// Initialisation de Sequelize pour PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false, // Optionnel: pour désactiver les logs SQL
  }
);

// Fonction pour synchroniser les modèles avec la base de données
async function initDb() {
  try {
    await sequelize.sync({ alter: true }); // Synchronise les modèles avec la base
    console.log("Les modèles ont été synchronisés avec succès.");
  } catch (err) {
    console.error("Erreur lors de la synchronisation des modèles :", err);
    throw err; // Relancer l'erreur pour un meilleur diagnostic
  }
}

// Exportation de Sequelize et de initDb
module.exports = { sequelize, initDb };
