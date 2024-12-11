const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = async function (fastify, opts) {
  // Update a role
  fastify.put('/roles/:idRole', { 
    preHandler: [authMiddleware.requireRole(['admin'])] 
  }, roleController.updateRole);

  // Delete a role
  fastify.delete('/roles/:idRole', { 
    preHandler: [authMiddleware.requireRole(['admin'])] 
  }, roleController.deleteRole);
};
