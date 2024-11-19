const users = []; // Remplacez cela par votre base de données

async function authRoutes(fastify, options) {
  // Route de signup
  fastify.post("/signup", async (request, reply) => {
    const { username, password } = request.body;

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return reply.status(400).send({ error: "User  already exists" });
    }

    // Stocker l'utilisateur dans la base de données (ici, un tableau pour l'exemple)
    users.push({ username, password }); // En pratique, hachez le mot de passe
    const token = fastify.jwt.sign({ username });
    return { token };
  });

  // Route de login
  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;

    // Vérifiez l'utilisateur dans la base de données
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) {
      return reply.status(401).send({ error: "Invalid username or password" });
    }

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
