const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 100], // Limite la longueur du nom du rôle
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "roles",
    timestamps: true,
  }
);

// Relation avec User
Role.associate = (models) => {
  Role.hasMany(models.User, { foreignKey: "roleId" });
};

module.exports = Role;
