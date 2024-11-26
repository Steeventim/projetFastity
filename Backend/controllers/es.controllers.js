const { Client } = require('@elastic/elasticsearch-serverless');

const esClient = new Client({
  node: 'http://192.168.137.94:9200/',
});

exports.search = async (request, reply) => {
  try {
    const { index, body } = request.body;
    const response = await esClient.search({
      index,
      query: {
        match: {
          content: body,
        },
      },
    });
    if (response.hits.total.value === 0) {
      console.log('this index not yet exist');
    } else {
      console.log('je t\'ai trouvééééé');
    }
    console.log(response);
    reply.send(response);
  } catch (error) {
    console.error(error);
    reply.code(500).send({ error: 'Une erreur est survenue lors de la recherche' });
  }
};

exports.index = async (request, reply) => {
  try {
    const { index, id, body } = request.body;
    const response = await esClient.index({
      index,
      id,
      body: {
        query: {
          match: {
            _all: body,
          },
        },
      },
    });
    console.log('eeee');
    reply.send(response.body);
  } catch (error) {
    console.error(error);
    reply.code(406).send({ error: 'Une erreur est survenue lors de l\'indexation' });
  }
};
