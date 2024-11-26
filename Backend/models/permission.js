const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:mkounga10@localhost:5432/DocumentSearch');

const Permission = sequelize.define('Permission', {
  idpermission: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  permission: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'permissions'
});

module.exports = Permission;
