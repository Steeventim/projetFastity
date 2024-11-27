"use strict";

const path = require("node:path");
const fs = require("node:fs");
const AutoLoad = require("@fastify/autoload");
const fastifyJwt = require("@fastify/jwt");
const fastify = require("fastify");
const fastifyEnv = require("@fastify/env");
const { Sequelize } = require("sequelize");

// Configuration de Sequelize pour la connexion à la base de données
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "postgres", // ou 'postgres', 'sqlite', etc.
});

// Chargement des variables d'environnement
const schema = {
  type: "object",
  required: ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD", "JWT_SECRET"],
  properties: {
    DB_HOST: { type: "string" },
    DB_NAME: { type: "string" },
    DB_USER: { type: "string" },
    DB_PASSWORD: { type: "string" },
    JWT_SECRET: { type: "string" },
    PORT: { type: "number", default: 3000 },
  },
};

async function buildFastify() {
  const app = fastify({ logger: true });

  // Charger les variables d'environnement
  await app.register(fastifyEnv, {
    dotenv: true,
    schema,
  });

  // Synchronisation des modèles
  const models = {};
  const modelsPath = path.join(__dirname, "models");

  // Chargement des modèles
  fs.readdirSync(modelsPath).forEach((file) => {
    const model = require(path.join(modelsPath, file))(sequelize);
    models[model.name] = model;
  });

  // Associer les modèles
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  // Synchronisation avec la base de données
  await sequelize.sync({ alter: true });
  app.decorate("sequelize", sequelize);
  app.decorate("models", models);

  // Gestion des erreurs globales
  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    reply.status(error.statusCode || 500).send({ error: error.message });
  });

  // Configuration du plugin JWT
  app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
  });

  // Middleware d'authentification
  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Non autorisé" });
    }
  });

  // Chargement des plugins Fastify
  app.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: { sequelize, models },
  });

  // Chargement des routes
  app.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: { sequelize, models },
  });

  return app;
}

// Démarrage du serveur
if (require.main === module) {
  buildFastify()
    .then((app) => {
      app.listen({ port: app.config.PORT }, (err, address) => {
        if (err) {
          app.log.error(err);
          process.exit(1);
        }
        app.log.info(`Serveur en écoute sur ${address}`);
      });
    })
    .catch((err) => {
      console.error("Erreur au démarrage du serveur :", err);
    });
}
