const fastify = require('fastify')();
const divisionController = require('../controllers/divisionController');

// Créer une nouvelle division
fastify.post('/divisions', divisionController.createDivision);

// Récupérer toutes les divisions
fastify.get('/divisions', divisionController.getAllDivisions);

// Récupérer une division par ID
fastify.get('/divisions/:id', divisionController.getDivisionById);

// Mettre à jour une division
fastify.patch('/divisions/:id', divisionController.updateDivision);

// Supprimer une division
fastify.delete('/divisions/:id', divisionController.deleteDivision);

module.exports = fastify;
