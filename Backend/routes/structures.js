const fastify = require('fastify')();
const structureController = require('../controllers/structureController');

// Créer une nouvelle structure
fastify.post('/', structureController.createStructure);

// Récupérer toutes les structures
fastify.get('/list', structureController.getAllStructures);

// Récupérer une structure par son ID
fastify.get('/:id', structureController.getStructureById);

// Mettre à jour une structure
fastify.patch('/:id', structureController.updateStructure);

// Supprimer une structure
fastify.delete('/:id', structureController.deleteStructure);

// Récupérer les utilisateurs d'une structure
/*fastify.get('/:structureId/users', async (request, reply) => {
  try {
    const { structureId } = request.params;
    const users = await Users.findAll({ where: { structureId } });

    reply.code(200).send(users);
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
    reply.code(500).send({ message: 'Erreur lors du chargement des utilisateurs' });
  }
});*/

module.exports = fastify;
