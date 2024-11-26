const fastify = require('fastify')();
const { Users } = require("../models/users"); // Modèle Sequelize
const joi = require("joi");
const bcrypt = require("bcrypt");

fastify.post("/", async (request, reply) => {
  try {
    // Validation des données d'entrée
    const { error } = validate(request.body);
    if (error) {
      return reply.code(400).send({ message: error.details[0].message });
    }

    // Requête pour vérifier l'email et le NomUtilisateur
    const user = await Users.findOne({ where: { email: request.body.email } });
    const usee = await Users.findOne({ where: { NomUtilisateur: request.body.NomUtilisateur } });

    if (!user || !usee) {
      return reply.code(401).send({ message: "Utilisateur invalide" });
    }

    // Comparaison du mot de passe avec bcrypt
    const validPassword = await bcrypt.compare(request.body.password, user.password);
    if (!validPassword) {
      return reply.code(401).send({ message: "Email ou mot de passe invalide" });
    }

    // Génération du token JWT
    const token = user.generateAuthToken();
    reply.code(200).send({ data: token, role: user.role, userId: user.id, message: "Connexion réussie" });

    console.log(user.role);
    console.log(user.id);
    
  } catch (error) {
    console.log(error);
    return reply.code(500).send({ message: "Erreur interne du serveur" });
  }
});

// Fonction de validation des données
const validate = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Mot de passe"),
    NomUtilisateur: joi.string().required().label("Nom d'utilisateur"),
  });
  return schema.validate(data);
};

module.exports = fastify;
