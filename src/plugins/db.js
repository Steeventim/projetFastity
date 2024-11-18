// src/plugins/db.js
const fp = require("fastify-plugin");

async function dbConnector(fastify, options) {
  fastify.register(require("fastify-postgres"), {
    connectionString: "postgres://user:password@localhost:5432/mydb",
  });
}

module.exports = fp(dbConnector);
