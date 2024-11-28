const roleController = require("../controllers/roleController");

module.exports = async function (fastify) {
  fastify.get("/roles", roleController.getAllRoles);
  fastify.get("/roles/:id", roleController.getRoleById);
  fastify.post("/roles", roleController.createRole);
  fastify.put("/roles/:id", roleController.updateRole);
  fastify.delete("/roles/:id", roleController.deleteRole);
};
