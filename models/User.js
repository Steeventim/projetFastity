const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles", // Table référence "roles"
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

// Relation avec Role
User.associate = (models) => {
  User.belongsTo(models.Role, { foreignKey: "roleId" });
};

module.exports = User;
