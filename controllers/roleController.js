const { Role } = require('../models');

const roleController = {
  updateRole: async (request, reply) => {
    const { idRole } = request.params;
    const { name, description, isSystemRole } = request.body;

    try {
      const [updated] = await Role.update(
        { name, description, isSystemRole },
        { where: { idRole } }
      );

      if (!updated) {
        return reply.status(404).send({ error: 'Role not found' });
      }

      return reply.send({ message: 'Role updated successfully' });
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  },

  deleteRole: async (request, reply) => {
    const { idRole } = request.params;

    try {
      const deleted = await Role.destroy({ where: { idRole } });

      if (!deleted) {
        return reply.status(404).send({ error: 'Role not found' });
      }

      return reply.status(204).send(); // No content
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }
};

module.exports = roleController;
