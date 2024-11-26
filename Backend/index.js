require('dotenv').config();
const fastify = require('fastify')();
const cors = require('fastify-cors');
const connection = require('./bd');

const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const structure = require('./routes/structures');
const Document = require('./routes/DocumentSearch');
const division = require('./routes/division');

const fs = require('fs');
const checkRoleAndPermissions = require('./middleware/roleCheck');

// Register middlewares
fastify.register(require('fastify-jsonbody'));
fastify.register(cors);

// Register routes
fastify.register(userRoutes, { prefix: '/api/users', preHandler: checkRoleAndPermissions });
fastify.register(authRoutes, { prefix: '/api/auths', preHandler: checkRoleAndPermissions });
fastify.register(Document, { prefix: '/api/document', preHandler: checkRoleAndPermissions });
fastify.register(division, { prefix: '/api/division', preHandler: checkRoleAndPermissions });
fastify.register(structure, { prefix: '/api/structure', preHandler: checkRoleAndPermissions });

const port = process.env.PORT || 8081;
fastify.listen(port, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});