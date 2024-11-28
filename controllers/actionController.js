const { Action } = require("../models/action");

const createAction = async (req, reply) => {
  const { type, comment, authorId, documentId } = req.body;
  const action = await Action.create({ type, comment, authorId, documentId });
  reply.status(201).send(action);
};

const getDocumentActions = async (req, reply) => {
  const { id } = req.params;
  const actions = await Action.findAll({ where: { documentId: id } });
  reply.send(actions);
};

module.exports = { createAction, getDocumentActions };
