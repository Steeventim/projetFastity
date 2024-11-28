const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

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
      validate: {
        len: [0, 255], // Limite la longueur du jeton
      },
    },
  },
  {
    tableName: "auths",
    timestamps: true,
  }
);

// Exemple d'association (si vous avez un modèle User)
Auth.associate = (models) => {
  Auth.belongsTo(models.User, { foreignKey: "userId" });
};

module.exports = Auth;
