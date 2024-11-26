const structures = require('../models/structures');

exports.createStructure = async (request, reply) => {
  try {
    const { nom, adresseStructure } = request.body;
    const existingStructure = await structures.findOne({ where: { nom } });
    if (existingStructure) {
      return reply.code(409).send({ message: 'La structure existe déjà' });
    }
    const newStructure = await structures.create({ nom, adresseStructure });
    reply.code(201).send({ message: 'Structure créée avec succès', newStructure });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: 'Erreur interne du serveur' });
  }
};

exports.getAllStructures = async (request, reply) => {
  try {
    const structure = await structures.findAll();
    reply.send(structure);
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};

exports.getStructureById = async (request, reply) => {
  try {
    const { id } = request.params;
    const structure = await structures.findByPk(id);
    if (!structure) {
      return reply.code(404).send({ message: 'Structure non trouvée' });
    }
    reply.send(structure);
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};

exports.updateStructure = async (request, reply) => {
  try {
    const { id } = request.params;
    const { nom } = request.body;
    const structure = await structures.findByPk(id);
    if (!structure) {
      return reply.code(404).send({ message: 'Structure non trouvée' });
    }
    structure.nom = nom || structure.nom;
    await structure.save();
    reply.send({ message: 'Structure mise à jour avec succès', structure });
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};

exports.deleteStructure = async (request, reply) => {
  try {
    const { id } = request.params;
    const structure = await structures.findByPk(id);
    if (!structure) {
      return reply.code(404).send({ message: 'Structure non trouvée' });
    }
    await structure.destroy();
    reply.send({ message: 'Structure supprimée avec succès' });
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};
