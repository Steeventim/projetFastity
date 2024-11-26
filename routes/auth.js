"use strict";

module.exports = async function (fastify) {
  fastify.post("/auth/login", async (request, reply) => {
    const { username, password } = request.body;

    // Remplacez par une vraie logique de vérification avec la base de données
    if (username === "admin" && password === "password") {
      const token = fastify.jwt.sign(
        { username, role: "admin" },
        { expiresIn: "1h" }
      );
      return reply.send({ token });
    }

    return reply.status(401).send({ error: "Identifiants invalides" });
  });
};
