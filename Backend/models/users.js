const { Sequelize, DataTypes, Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
require("dotenv").config();

const Structures = require('./structures');
const Roles = require('./roles');
const Signature = require('./signature');

const sequelize = new Sequelize('postgres://postgres:elviram@localhost:5432/DocumentSearch');

// Définition du modèle User avec Sequelize
class Users extends Model {
  generateAuthToken() {
    const token = jwt.sign({ id: this.id }, process.env.JWTPRIVATEKEY);
    return token;
  }
}

Users.init({
  // UUID comme identifiant unique
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  NomUtilisateur: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'utilisateur'
  },
  structureId: {
    type: DataTypes.UUID,
    references: {
      model: 'structures', // Nom de la table de la structure
      key: 'id'
    }
  }
}, {
  sequelize,

  tableName: 'users'
});

// Fonction de validation des données avec Joi
const validateUser = (data) => {
  const schema = Joi.object({
    NomUtilisateur: Joi.string().required().label("Nom d'utilisateur"),
    password: passwordComplexity().required().label("Mot de passe"),
    email: Joi.string().email().required().label("Email"),
    role: Joi.string().optional().label("Rôle"),
    structureId: Joi.string().optional().label("Structure ID"),
  });
  return schema.validate(data);
};

Users.belongsTo(Structures, { foreignKey: 'structureId' });
Structures.hasMany(Users, { foreignKey: 'structureId' });

Users.belongsTo(Roles, { foreignKey: 'roleId' });
Roles.hasMany(Users, { foreignKey: 'roleId' });

Users.hasOne(Signature, { foreignKey: 'userId' });
Signature.belongsTo(Users, { foreignKey: 'userId' });

sequelize.sync()
.then(() => {
  console.log('Tables créées avec succès');
})
.catch(err => {
  console.error('Erreur lors de la création des tables :', err);
});
// Exportation du modèle User et la fonction de validation
module.exports = { Users, validateUser, sequelize };
