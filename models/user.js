const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const validator = require('validator');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    idUser: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    NomUser: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nom User cannot be empty' }
      }
    },
    PrenomUser: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Invalid email format' }
      }
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 128],
          msg: 'Password must be between 8 and 128 characters'
        },
        isStrongPassword: {
          args: [8, 128],
          msg: 'Password must include uppercase, lowercase, number, and special character'
        }
      }
    },
    Telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
          msg: 'Invalid phone number format'
        }
      }
    },
    LastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS) || 12);
        user.Password = await bcrypt.hash(user.Password, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed('Password')) {
          const salt = await bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS) || 12);
          user.Password = await bcrypt.hash(user.Password, salt);
        }
      }
    }
  });

  const userSchema = Joi.object({
    NomUser: Joi.string().required().min(2).max(50),
    PrenomUser: Joi.string().optional().min(2).max(50),
    Email: Joi.string().email().required(),
    Password: Joi.string()
      .required()
      .min(8)
      .max(128)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
      .message('Password must include uppercase, lowercase, number, and special character'),
    Telephone: Joi.string()
      .required()
      .pattern(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$'))
  });

  User.validate = (user) => userSchema.validate(user);

  User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.Password);
  };

  User.associate = (models) => {
    User.hasMany(models.Commentaire, { foreignKey: 'userId' });
    User.belongsToMany(models.Role, { through: 'UserRoles', foreignKey: 'userId' });
    User.hasMany(models.Signature, { foreignKey: 'userId' });
    User.belongsTo(models.Structure, { foreignKey: 'structureId' });
  };

  return User;
};