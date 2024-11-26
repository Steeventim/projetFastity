const { Users } = require('../models/users');

// Middleware to check user role and permissions
async function checkRoleAndPermissions(request, reply, done) {
  try {
    const userId = request.user.id; // Assuming user ID is available in request.user
    const user = await Users.findByPk(userId, {
      include: ['Roles', 'Permissions']
    });

    if (!user) {
      return reply.code(401).send({ message: 'User not found' });
    }

    const userRoles = user.Roles.map(role => role.libellerole);
    const userPermissions = user.Permissions.map(permission => permission.permission);

    // Check if user has required role and permissions
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

    if (!hasRole || !hasPermission) {
      return reply.code(403).send({ message: 'Access denied' });
    }

    done();
  } catch (error) {
    console.error('Error checking roles and permissions:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = checkRoleAndPermissions;
