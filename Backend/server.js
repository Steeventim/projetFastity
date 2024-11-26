const fastify = require('fastify')({ logger: true });
const esRouter = require('./routes/es.routes');

// Register routes
fastify.register(esRouter, { prefix: '/api/es' });

// Start the server
fastify.listen(31100, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});