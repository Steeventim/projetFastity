"use strict";

const fastifyPlugin = require("fastify-plugin");

async function roleChecker(fastify, options) {
  fastify.decorate("checkRole", (role) => {
    return async (request, reply) => {
      const user = request.user;

      if (user.role !== role) {
        reply.status(403).send({ error: "Accès refusé" });
      }
    };
  });
}

module.exports = fastifyPlugin(roleChecker);
