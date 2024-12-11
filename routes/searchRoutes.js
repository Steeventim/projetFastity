const searchController = require('../controllers/searchController');

module.exports = async function (fastify, opts) {
  // Search for documents
  fastify.get('/search', searchController.searchDocuments);
};
