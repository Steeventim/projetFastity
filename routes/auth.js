const authController = require("../controllers/authController");

module.exports = async function (fastify) {
  fastify.post("/auth/register", authController.register);
  fastify.post("/auth/login", authController.login);
  fastify.post("/auth/refresh-token", authController.refreshToken);
};
