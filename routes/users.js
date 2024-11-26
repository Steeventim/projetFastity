"use strict";

module.exports = async function (fastify) {
  const { User } = fastify.models;

  fastify.post("/users", async (request, reply) => {
    const { username, password, role } = request.body;

    try {
      const user = await User.create({ username, password, role });
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  fastify.get("/users", async (request, reply) => {
    const users = await User.findAll();
    reply.send(users);
  });
};
