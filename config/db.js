const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres", // ou 'mysql', 'sqlite', etc.
    logging: false,, // Activez ou désactivez les logs SQL (true pour activer, false pour désactiver)
    pool: {
      max: 5, // Nombre maximal de connexions
      min: 0, // Nombre minimal de connexions
      acquire: 30000, // Temps maximal pour obtenir une connexion avant d'abandonner
      idle: 10000 // Temps d'inactivité maximal d'une connexion
    }
  }
);

// Vérification de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

module.exports = sequelize;
