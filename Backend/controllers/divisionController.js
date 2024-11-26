const Division = require('../models/divisions');

exports.createDivision = async (request, reply) => {
  try {
    const { libelleDivision, description, structure} = request.body;
    const division = await Division.create({ libelleDivision, description, structure });
    reply.code(201).send(division);
  } catch (error) {
    reply.code(400).send({ message: error.message });
  }
};

exports.getAllDivisions = async (request, reply) => {
  try {
    const divisions = await Division.findAll();
    reply.send(divisions);
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};

exports.getDivisionById = async (request, reply) => {
  try {
    const { id } = request.params;
    const division = await Division.findByPk(id);
    if (!division) {
      return reply.code(404).send({ message: 'Division non trouvée' });
    }
    reply.send(division);
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};

exports.updateDivision = async (request, reply) => {
  try {
    const { id } = request.params;
    const { libelleDivision, description, structureId } = request.body;
    const division = await Division.findByPk(id);
    if (!division) {
      return reply.code(404).send({ message: 'Division non trouvée' });
    }
    division.libelleDivision = libelleDivision || division.libelleDivision;
    division.description = description || division.description;
    await division.save();
    reply.send(division);
  } catch (error) {
    reply.code(400).send({ message: error.message });
  }
};

exports.deleteDivision = async (request, reply) => {
  try {
    const { id } = request.params;
    const division = await Division.findByPk(id);
    if (!division) {
      return reply.code(404).send({ message: 'Division non trouvée' });
    }
    await division.destroy();
    reply.send({ message: 'Division supprimée avec succès' });
  } catch (error) {
    reply.code(500).send({ message: error.message });
  }
};
