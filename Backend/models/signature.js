const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:mkounga10@localhost:5432/DocumentSearch');

const Signature = sequelize.define('Signature', {
  IdSignature: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  signature: {
    type: DataTypes.STRING,
    allowNull: false
  },
  signatureDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'signatures'
});

module.exports = Signature;
