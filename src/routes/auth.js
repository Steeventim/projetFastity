// src/routes/auth.js
async function authRoutes(fastify, options) {
  // Route de signup
  fastify.post("/signup", async (request, reply) => {
    const { username, password } = request.body;
    // Stocker l'utilisateur dans la base de données (code à implémenter)
    const token = fastify.jwt.sign({ username });
    return { token };
  });

  // Route de login
  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;
    // Vérifier l'utilisateur dans la base de données (code à implémenter)
    const token = fastify.jwt.sign({ username });
    return { token };
  });

  // Route protégée
  fastify.get(
    "/protected",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      return { message: "This is a protected route" };
    }
  );
}

module.exports = authRoutes;
