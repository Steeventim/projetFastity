const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: "mysql", // ou "postgres", "sqlite", etc.
  logging: false, // Mettre à true pour activer le logging SQL
});

const db = {};

// Importer les modèles
db.User = require("./user")(sequelize);
db.Role = require("./role")(sequelize);
db.Action = require("./action")(sequelize);
db.Hierarchy = require("./hierarchy")(sequelize);

// Synchroniser les relations entre les modèles
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
