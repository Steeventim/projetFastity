const fastify = require('fastify')();
const cors = require('fastify-cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const fastifyRoleRoutes = require('./routes/fastifyRoleRoutes');
const fastifyPermissionRoutes = require('./routes/fastifyPermissionRoutes');
const structureRoutes = require('./routes/structureRoutes');
const commentaireRoutes = require('./routes/commentaireRoutes');
const etapeRoutes = require('./routes/etapeRoutes');
const projetRoutes = require('./routes/projetRoutes');
const searchRoutes = require('./routes/searchRoutes');

// CORS Configuration
fastify.register(cors, {
  origin: '*'
});

// Use a Fastify-compatible rate limiter
fastify.register(require('fastify-rate-limit'), {
  max: 100,
  timeWindow: '15 minutes'
});

// Register the routes with debugging
try {
  fastify.register(userRoutes);
  console.log('User routes registered successfully');
} catch (err) {
  console.error('Error registering user routes:', err);
}

try {
  fastify.register(fastifyPermissionRoutes);
  console.log('Permission routes registered successfully');
} catch (err) {
  console.error('Error registering permission routes:', err);
}

// Repeat for all route files...

// Global Error Handler
fastify.setErrorHandler((error, request, reply) => {
  console.error('Error occurred:', error);
  reply.status(500).send({ error: 'An unexpected error occurred' });
});

// Start the server
const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected...');
    await fastify.listen({ 
      port: parseInt(process.env.PORT) || 3000,
      host: process.env.HOST || 'localhost'
    });
    console.log(`Server is running on http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
