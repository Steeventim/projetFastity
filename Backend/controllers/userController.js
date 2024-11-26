const { Users, validateUser } = require('../models/users');
const bcrypt = require('bcrypt');

exports.createUser = async (request, reply) => {
  try {
    const { error } = validateUser(request.body);
    if (error) {
      return reply.code(400).send({ message: error.details[0].message });
    }

    const user = await Users.findOne({ where: { email: request.body.email } });
    const nameuser = await Users.findOne({ where: { NomUtilisateur: request.body.NomUtilisateur } });

    if (user || nameuser) {
      return reply.code(409).send({ message: "Email ou nom d'utilisateur déjà pris" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(request.body.password, salt);

    await Users.create({ ...request.body, password: hashPassword });

    reply.code(201).send({ message: "Utilisateur créé avec succès" });

  } catch (error) {
    console.log(error);
    return reply.code(500).send({ message: "Erreur interne du serveur" });
  }
};

exports.getAllUsers = async (request, reply) => {
  try {
    const users = await Users.findAll();
    reply.send(users);
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};
