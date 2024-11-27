const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Hierarchy = sequelize.define(
  "Hierarchy",
  {
    supervisorId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    subordinateId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "hierarchies",
    timestamps: true,
  }
);

module.exports = Hierarchy;
