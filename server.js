"use strict";

const path = require("node:path");
const AutoLoad = require("@fastify/autoload");
const fastifyJwt = require("@fastify/jwt");
const fastify = require("fastify");
const { sequelize, initDb } = require("./config/db"); // Configuration de Sequelize

// Fonction pour construire et configurer l'application Fastify
function buildFastify() {
  const app = fastify({ logger: true });

  // Gestionnaire d'erreurs global
  app.setErrorHandler((error, request, reply) => {
    console.error(error); // Loguer l'erreur pour le débogage
    reply.status(500).send({ error: "Une erreur est survenue." });
  });

  // Plugin JWT pour l'authentification
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecretkey", // Clé secrète JWT
  });

  // Décorateur pour vérifier les tokens JWT
  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Non autorisé" });
    }
  });

  // Charger les plugins personnalisés
  app.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: { prefix: "/api" }, // Ajouter un préfixe global pour les API
  });

  // Charger les routes
  app.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: { prefix: "/api" }, // Ajouter un préfixe global pour les routes
  });

  return app;
}

// Vérifier et initialiser la base de données
async function startServer() {
  const app = buildFastify();

  try {
    // Synchroniser la base de données
    await initDb();

    // Lancer le serveur sur le port 3000
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Serveur démarré sur http://localhost:3000");
  } catch (err) {
    console.error("Erreur au démarrage du serveur :", err);
    process.exit(1);
  }
}

// Si ce fichier est exécuté directement, démarrer le serveur
if (require.main === module) {
  startServer();
}

// Exporter la fonction pour les tests ou les utilisations externes
module.exports = buildFastify;
