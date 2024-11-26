"use strict";

module.exports = async function (fastify) {
  const { Document } = fastify.models;

  fastify.post("/documents", async (request, reply) => {
    const { title, createdBy } = request.body;

    try {
      const document = await Document.create({ title, createdBy });
      reply.send(document);
    } catch (error) {
      reply.status(500).send({ error: error.message });
    }
  });

  fastify.get("/documents", async (request, reply) => {
    const documents = await Document.findAll();
    reply.send(documents);
  });
};
