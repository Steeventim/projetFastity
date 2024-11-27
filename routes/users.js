const userController = require("../controllers/userController");

module.exports = async function (fastify) {
  fastify.get(
    "/users",
    { preValidation: [fastify.authenticate] },
    userController.getAllUsers
  );
  fastify.get(
    "/users/:id",
    { preValidation: [fastify.authenticate] },
    userController.getUserById
  );
  fastify.post(
    "/users",
    { preValidation: [fastify.authenticate] },
    userController.createUser
  );
  fastify.put(
    "/users/:id",
    { preValidation: [fastify.authenticate] },
    userController.updateUser
  );
  fastify.delete(
    "/users/:id",
    { preValidation: [fastify.authenticate] },
    userController.deleteUser
  );
};
