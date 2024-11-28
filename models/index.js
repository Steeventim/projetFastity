const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");

// Import des modèles
const Action = require("./action");
const User = require("./User");
const Role = require("./Role");
const Hierarchy = require("./hierarchy");
const UserRoles = require("./userRole");

// Définir les relations entre les modèles
const defineRelations = () => {
  // Relation entre User et Role via UserRoles (relation Many-to-Many)
  User.belongsToMany(Role, { through: UserRoles, foreignKey: "userId" });
  Role.belongsToMany(User, { through: UserRoles, foreignKey: "roleId" });

  // Relation entre Action et User
  Action.belongsTo(User, { foreignKey: "userId", as: "author" });
  User.hasMany(Action, { foreignKey: "userId", as: "actions" });

  // Relation entre Hierarchy et Role
  Hierarchy.belongsTo(Role, { foreignKey: "roleId", as: "role" });
  Role.hasOne(Hierarchy, { foreignKey: "roleId", as: "hierarchy" });
};

// Appliquer les relations
defineRelations();

// Méthode pour synchroniser la base de données
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Utilisez { force: true } pour réinitialiser la base
    console.log("Base de données synchronisée avec succès.");
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation de la base de données :",
      error
    );
  }
};

// Appeler la méthode de synchronisation
syncDatabase();

// Exportation des modèles et de Sequelize
module.exports = {
  sequelize, // Pour synchroniser ou configurer manuellement la base
  Sequelize, // Accès à Sequelize si nécessaire
  Action,
  User,
  Role,
  Hierarchy,
  UserRoles,
};
