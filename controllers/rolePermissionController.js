const { Role, Permission } = require('../models');

// Assign Permission to Role
const assignPermissionToRole = async (request, reply) => {
    try {
        const { roleName, permissionName } = request.params;
        const role = await Role.findOne({ where: { name: roleName } });
        const permission = await Permission.findOne({ where: { LibellePerm: permissionName } });

        if (!role || !permission) {
            return reply.code(404).send({ error: 'Role or Permission not found' });
        }

        await role.addPermission(permission);
        reply.code(200).send({ message: 'Permission assigned to role successfully' });
    } catch (error) {
        reply.code(400).send({ error: error.message });
    }
};

module.exports = {
    assignPermissionToRole
};