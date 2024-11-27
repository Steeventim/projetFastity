const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Auth = sequelize.define(
  "Auth",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "auths",
    timestamps: true,
  }
);

module.exports = Auth;
