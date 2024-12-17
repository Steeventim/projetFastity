const { Permission } = require('../models');

// Create Permission
const createPermission = async (request, reply) => {
    try {
        const { LibellePerm, description } = request.body;
        const [permission, created] = await Permission.findOrCreate({
            where: { LibellePerm },
            defaults: { description }
        });
        reply.code(201).send(permission);
    } catch (error) {
        reply.code(400).send({ error: error.message });
    }
};

// Update Permission
const updatePermission = async (request, reply) => {
    try {
        const { permissionId } = request.params;
        const { LibellePerm, description } = request.body;
        const [updated] = await Permission.update(
            { LibellePerm, description },
            { where: { id: permissionId } }
        );

        if (updated) {
            const updatedPermission = await Permission.findByPk(permissionId);
            reply.code(200).send(updatedPermission);
        } else {
            reply.code(404).send({ error: 'Permission not found' });
        }
    } catch (error) {
        reply.code(400).send({ error: error.message });
    }
};

// Delete Permission
const deletePermission = async (request, reply) => {
    try {
        const { permissionId } = request.params;
        const deleted = await Permission.destroy({
            where: { id: permissionId }
        });

        if (deleted) {
            reply.code(204).send();
        } else {
            reply.code(404).send({ error: 'Permission not found' });
        }
    } catch (error) {
        reply.code(400).send({ error: error.message });
    }
};

module.exports = {
    createPermission,
    updatePermission,
    deletePermission
};