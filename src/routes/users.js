// src/routes/users.js
async function userRoutes(fastify, options) {
  // Créer un utilisateur
  fastify.post("/users", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { username, password, email } = request.body;
      const result = await client.query(
        "INSERT INTO users(username, password, email) VALUES($1, $2, $3) RETURNING *",
        [username, password, email]
      );
      reply.code(201).send(result.rows[0]);
    } catch (err) {
      reply.code(500).send(err);
    } finally {
      client.release();
    }
  });

  // Lire tous les utilisateurs
  fastify.get("/users", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const result = await client.query("SELECT * FROM users");
      reply.send(result.rows);
    } catch (err) {
      reply.code(500).send(err);
    } finally {
      client.release();
    }
  });

  // Lire un utilisateur par ID
  fastify.get("/users/:id", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const result = await client.query("SELECT * FROM users WHERE id = $1", [
        request.params.id,
      ]);
      if (result.rows.length === 0) {
        reply.code(404).send({ message: "User not found" });
      } else {
        reply.send(result.rows[0]);
      }
    } catch (err) {
      reply.code(500).send(err);
    } finally {
      client.release();
    }
  });

  // Mettre à jour un utilisateur
  fastify.put("/users/:id", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { username, password, email } = request.body;
      const result = await client.query(
        "UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4 RETURNING *",
        [username, password, email, request.params.id]
      );
      if (result.rows.length === 0) {
        reply.code(404).send({ message: "User not found" });
      } else {
        reply.send(result.rows[0]);
      }
    } catch (err) {
      reply.code(500).send(err);
    } finally {
      client.release();
    }
  });

  // Supprimer un utilisateur
  fastify.delete("/users/:id", async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const result = await client.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [request.params.id]
      );
      if (result.rows.length === 0) {
        reply.code(404).send({ message: "User not found" });
      } else {
        reply.send({ message: "User deleted successfully" });
      }
    } catch (err) {
      reply.code(500).send(err);
    } finally {
      client.release();
    }
  });
}

module.exports = userRoutes;
