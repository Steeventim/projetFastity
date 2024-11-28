const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserRole = sequelize.define(
  "User Role",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users", // Référence à la table users
        key: "id",
      },
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles", // Référence à la table roles
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "user_roles",
    timestamps: false, // Pas besoin de timestamps ici
  }
);

// Relation plusieurs-à-plusieurs avec Users et Roles
UserRole.associate = (models) => {
  // Un utilisateur peut avoir plusieurs rôles
  models.User.belongsToMany(models.Role, {
    through: UserRole,
    foreignKey: "userId",
  });

  // Un rôle peut être attribué à plusieurs utilisateurs
  models.Role.belongsToMany(models.User, {
    through: UserRole,
    foreignKey: "roleId",
  });
};

// Méthodes d'instance pour ajouter et supprimer des rôles
UserRole.addRoleToUser = async (userId, roleId) => {
  return await UserRole.create({ userId, roleId });
};

UserRole.removeRoleFromUser = async (userId, roleId) => {
  return await UserRole.destroy({
    where: {
      userId,
      roleId,
    },
  });
};

module.exports = UserRole;
