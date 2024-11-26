const { Sequelize, DataTypes } = require('sequelize');
const Permission = require('./permission');

const sequelize = new Sequelize('postgres://postgres:mkounga10@localhost:5432/DocumentSearch');

const Roles = sequelize.define('Roles', {
  idroles: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  libellerole: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'roles'
});

Roles.belongsToMany(Permission, { through: 'RolePermissions', foreignKey: 'roleId' });
Permission.belongsToMany(Roles, { through: 'RolePermissions', foreignKey: 'permissionId' });

module.exports = Roles;
