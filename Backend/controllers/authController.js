const { Users } = require('../models/users');
const bcrypt = require('bcrypt');
const joi = require('joi');

exports.authenticate = async (request, reply) => {
  try {
    const { error } = validate(request.body);
    if (error) {
      return reply.code(400).send({ message: error.details[0].message });
    }

    const user = await Users.findOne({ where: { email: request.body.email } });
    const usee = await Users.findOne({ where: { NomUtilisateur: request.body.NomUtilisateur } });

    if (!user || !usee) {
      return reply.code(401).send({ message: "Utilisateur invalide" });
    }

    const validPassword = await bcrypt.compare(request.body.password, user.password);
    if (!validPassword) {
      return reply.code(401).send({ message: "Email ou mot de passe invalide" });
    }

    const token = user.generateAuthToken();
    reply.code(200).send({ data: token, role: user.role, userId: user.id, message: "Connexion réussie" });

  } catch (error) {
    console.log(error);
    return reply.code(500).send({ message: "Erreur interne du serveur" });
  }
};

const validate = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Mot de passe"),
    NomUtilisateur: joi.string().required().label("Nom d'utilisateur"),
  });
  return schema.validate(data);
};
