const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Commentaire = sequelize.define('Commentaire', {
    idComment: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    Contenu: DataTypes.STRING,
  });

  Commentaire.associate = (models) => {
    Commentaire.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Commentaire;
};