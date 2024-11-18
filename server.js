"use strict";

const path = require("node:path");
const AutoLoad = require("@fastify/autoload");
const fastifyJwt = require("fastify-jwt");

module.exports = async function (fastify, opts) {
  // Gestion des erreurs
  fastify.setErrorHandler((error, request, reply) => {
    console.error(error); // Journaliser l'erreur
    reply.status(500).send({ error: "Une erreur est survenue" });
  });

  // Configurer le plugin JWT
  fastify.register(fastifyJwt, {
    secret: "supersecretkey", // Utilise une clé secrète forte
  });

  // Middleware d'authentification
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Chargement des plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // Chargement des routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};

if (require.main === module) {
  const fastify = require("fastify")({ logger: true });
  fastify.register(module.exports);

  fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
  });
}
