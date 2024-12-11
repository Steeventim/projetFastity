const { Structure } = require('../models');

const structureController = {
  createStructure: async (request, reply) => {
    const { NomStructure, LogoStructure, EmailStructure, AddressStructure } = request.body;

    try {
      const newStructure = await Structure.create({
        NomStructure,
        LogoStructure,
        EmailStructure,
        AddressStructure
      });

      return reply.status(201).send(newStructure);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  }
};

module.exports = structureController;
