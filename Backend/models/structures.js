const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('postgres://postgres:elviram@localhost:5432/DocumentSearch');


const structures = sequelize.define('structures', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adresseStructure: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  
}, {
  tableName: 'structures' 
});


sequelize.sync()
  .then(() => {
    console.log('Tables créées avec succès');
  })
  .catch(err => {
    console.error('Erreur lors de la création des tables :', err);
  });


module.exports = structures;
