const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

const authMiddleware = {
  // Verify JWT Token
  verifyToken: async (request, reply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return reply.status(401).send({ 
          statusCode: 401, 
          error: 'Unauthorized', 
          message: 'No token provided' 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user with roles and permissions
      const user = await User.findByPk(decoded.id, {
        include: [
          {
            model: Role,
            include: [Permission]
          }
        ]
      });

      if (!user) {
        return reply.status(401).send({ 
          statusCode: 401, 
          error: 'Unauthorized', 
          message: 'Invalid token' 
        });
      }

      // Attach user and permissions to request
      request.user = {
        id: user.idUser,
        email: user.Email,
        roles: user.Roles.map(role => role.name),
        permissions: user.Roles.flatMap(role => 
          role.Permissions.map(perm => perm.LibellePerm)
        )
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return reply.status(401).send({ 
          statusCode: 401, 
          error: 'Unauthorized', 
          message: 'Token expired' 
        });
      }
      return reply.status(403).send({ 
        statusCode: 403, 
        error: 'Forbidden', 
        message: 'Invalid token' 
      });
    }
  },

  // Role-Based Access Control
  requireRole: (allowedRoles) => {
    return async (request, reply) => {
      await authMiddleware.verifyToken(request, reply);
      
      const userRoles = request.user.roles || [];
      const hasPermission = userRoles.some(role => allowedRoles.includes(role));

      if (!hasPermission) {
        return reply.status(403).send({ 
          statusCode: 403, 
          error: 'Forbidden', 
          message: 'Insufficient role permissions' 
        });
      }
    };
  },

  // Permission-Based Access Control
  requirePermission: (requiredPermissions) => {
    return async (request, reply) => {
      await authMiddleware.verifyToken(request, reply);
      
      const userPermissions = request.user.permissions || [];
      const hasPermission = requiredPermissions.some(perm => 
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        return reply.status(403).send({ 
          statusCode: 403, 
          error: 'Forbidden', 
          message: 'Insufficient specific permissions' 
        });
      }
    };
  },

  // Generate JWT Token
  generateToken: (user, roles = [], permissions = []) => {
    return jwt.sign(
      { 
        id: user.idUser, 
        email: user.Email, 
        roles: roles.map(role => role.name),
        permissions: permissions.map(perm => perm.LibellePerm)
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.JWT_EXPIRATION || '1h' 
      }
    );
  },
};

module.exports = authMiddleware;
