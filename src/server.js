"use strict";

const path = require("node:path");
const AutoLoad = require("@fastify/autoload");
const fastifyJwt = require("fastify-jwt");
const fastify = require("fastify");

module.exports = function buildFastify() {
  const app = fastify({ logger: true });

  // Gestion des erreurs
  app.setErrorHandler((error, request, reply) => {
    console.error(error); // Journaliser l'erreur
    reply.status(500).send({ error: "Une erreur est survenue" });
  });

  // Configurer le plugin JWT
  app.register(fastifyJwt, {
    secret: "supersecretkey", // Utilise une clé secrète forte
  });

  // Middleware d'authentification
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Chargement des plugins
  app.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: {},
  });

  // Chargement des routes
  app.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: {},
  });

  return app;
};

if (require.main === module) {
  const app = buildFastify();

  app.listen({ port: 3000 }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
  });
}
