const { Role } = require('../models');

// Create Role
const createRole = async (request, reply) => {
    try {
        const { name, description, isSystemRole } = request.body;
        const [role, created] = await Role.findOrCreate({
            where: { name },
            defaults: { description, isSystemRole }
        });
        reply.code(201).send(role);
    } catch (error) {
        reply.code(400).send({ error: error.message });
    }
};

// Update Role
const updateRole = async (request, reply) => {
    try {
        const { roleId } = request.params;
        const { name, description, isSystemRole } = request.body;
        const [updated] = await Role.update(
            { name, description, isSystemRole },
            { where: { id: roleId } }
        );

        if (updated) {
            const updatedRole = await Role.findByPk(roleId);
            reply.code(200).send(updatedRole);
        } else {
            reply.code(404).send({ error: 'Role not found' });
        }
    } catch (error) {
        reply.code(400).send({ error: error.message });
    }
};

// Delete Role
const deleteRole = async (request, reply) => {
    try {
        const { roleId } = request.params;
        const deleted = await Role.destroy({
            where: { id: roleId }
        });

        if (deleted) {
            reply.code(204).send();
        } else {
            reply.code(404).send({ error: 'Role not found' });
        }
    } catch (error) {
        reply.code(400).send({ error: error.message });
    }
};

module.exports = {
    createRole,
    updateRole,
    deleteRole
};