const {
  createAction,
  getDocumentActions,
} = require("../controllers/actionController");

async function actionRoutes(fastify, options) {
  fastify.post("/actions", createAction);
  fastify.get("/documents/:id", getDocumentActions);
}

module.exports = actionRoutes;
