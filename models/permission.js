const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    idPermission: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    LibellePerm: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Permission name cannot be empty' },
        is: {
          args: /^[a-zA-Z0-9_:.-]+$/,
          msg: 'Permission name can only contain letters, numbers, underscores, colons, periods, and hyphens'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  });

  const permissionSchema = Joi.object({
    LibellePerm: Joi.string()
      .required()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z0-9_:.-]+$/)
      .messages({
        'string.pattern.base': 'Permission name must contain only letters, numbers, underscores, colons, periods, and hyphens'
      }),
    description: Joi.string()
      .optional()
      .allow(null)
      .max(500),
  });

  Permission.validate = (permission) => permissionSchema.validate(permission);

  Permission.associate = (models) => {
    // Many-to-Many relationship with Roles
    Permission.belongsToMany(models.Role, { 
      through: 'RolePermissions', 
      foreignKey: 'permissionId' 
    });
  };

  return Permission;
};