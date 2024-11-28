const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

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

// Exemple d'association (si vous avez un modèle User)
Hierarchy.associate = (models) => {
  Hierarchy.belongsTo(models.User, {
    foreignKey: "supervisorId",
    as: "supervisor",
  });
  Hierarchy.belongsTo(models.User, {
    foreignKey: "subordinateId",
    as: "subordinate",
  });
};

module.exports = Hierarchy;
