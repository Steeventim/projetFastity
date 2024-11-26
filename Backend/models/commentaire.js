const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:mkounga10@localhost:5432/DocumentSearch');

const Commentaire = sequelize.define('Commentaire', {
  Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'commentaires'
});

module.exports = Commentaire;
