const {
  getHierarchy,
  createHierarchy,
} = require("../controllers/hierarchyController");

async function hierarchyRoutes(fastify, options) {
  fastify.get("/hierarchy", getHierarchy);
  fastify.post("/hierarchy", createHierarchy);
}

module.exports = hierarchyRoutes;
