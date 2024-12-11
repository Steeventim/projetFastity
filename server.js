const fastify = require('fastify')();
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const db = require('./models');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const structureRoutes = require('./routes/structureRoutes');
const commentaireRoutes = require('./routes/commentaireRoutes');
const etapeRoutes = require('./routes/etapeRoutes');
const projetRoutes = require('./routes/projetRoutes');
const searchRoutes = require('./routes/searchRoutes');

// CORS Configuration
fastify.register(cors, {
  origin: '*'
});

// Define the rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});

// Register the rate limiter as a Fastify plugin
fastify.register(require('fastify-express')).then(() => {
  fastify.use(limiter);
});

// Register the routes
fastify.register(userRoutes);
fastify.register(roleRoutes);
fastify.register(structureRoutes);
fastify.register(etapeRoutes);
fastify.register(commentaireRoutes);
fastify.register(projetRoutes);
fastify.register(searchRoutes);

// Global Error Handler
fastify.setErrorHandler((error, request, reply) => {
  // Handle the error
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