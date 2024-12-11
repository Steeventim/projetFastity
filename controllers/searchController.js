const axios = require('axios');

const searchController = {
  searchDocuments: async (request, reply) => {
    const { query } = request.query; // Assuming the search query is passed as a query parameter

    if (!query) {
      return reply.status(400).send({ error: 'Search query is required' });
    }

    try {
      // Make a request to the external API
      const response = await axios.get(`http://external-api.com/search`, {
        params: { query }
      });

      return reply.status(200).send(response.data);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: 'Error searching documents' });
    }
  }
};

module.exports = searchController;
