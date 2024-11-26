const { Client } = require('@elastic/elasticsearch-serverless');
require('dotenv').config();

const esClient = new Client({
  node: 'http://10.42.0.35:9200/',
});

// Function to handle Elasticsearch search
exports.search = async (request, reply) => {
  const body = request.params.body;
  try {
    const response = await esClient.search({
      index: process.env.INDEX,
      body: {
        query: {
          match: {
            content: body
          }
        }
      }
    });
    if (response.hits.total.value == 0) {
      console.log("this index not yet exist");
    } else {
      console.log("je t'ai trouvééééé");
      console.log("hum maitenant affiche alors")
    }

    console.log(response)
    reply.send(response);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche' });
  }
};

// You can add more controller functions here for other routes
