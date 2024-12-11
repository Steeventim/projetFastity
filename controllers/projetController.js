const { Projet } = require('../models');

const projetController = {
  createProjet: async (request, reply) => {
    const { NomProjet, Description } = request.body;

    try {
      const newProjet = await Projet.create({
        NomProjet,
        Description
      });

      return reply.status(201).send(newProjet);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }
};

module.exports = projetController;
