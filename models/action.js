const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Action = sequelize.define(
  "Action",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255], // Validation de la longueur
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true, // Active les colonnes createdAt et updatedAt
  }
);

module.exports = Action;
