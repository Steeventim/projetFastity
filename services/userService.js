const { User, Role } = require("../models");

/**
 * Service pour récupérer un utilisateur par son ID.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object>} - Les informations de l'utilisateur ou `null` si introuvable.
 */
async function getUserById(userId) {
  return await User.findByPk(userId, {
    include: [{ model: Role, attributes: ["name"] }],
    attributes: { exclude: ["password"] },
  });
}

/**
 * Service pour vérifier si un utilisateur existe par son ID.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<boolean>} - `true` si l'utilisateur existe, sinon `false`.
 */
async function userExists(userId) {
  const user = await User.findByPk(userId);
  return !!user;
}

/**
 * Service pour créer un utilisateur.
 * @param {Object} data - Les données de l'utilisateur.
 * @param {string} data.username - Le nom d'utilisateur.
 * @param {string} data.password - Le mot de passe (déjà haché).
 * @param {number} data.roleId - L'ID du rôle.
 * @returns {Promise<Object>} - Les informations de l'utilisateur créé.
 */
async function createUser(data) {
  return await User.create(data);
}

/**
 * Service pour mettre à jour un utilisateur.
 * @param {number} userId - L'ID de l'utilisateur à mettre à jour.
 * @param {Object} data - Les données à mettre à jour.
 * @returns {Promise<Object>} - Les informations de l'utilisateur mis à jour.
 */
async function updateUser(userId, data) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  Object.assign(user, data);
  await user.save();
  return user;
}

/**
 * Service pour supprimer un utilisateur par son ID.
 * @param {number} userId - L'ID de l'utilisateur à supprimer.
 * @returns {Promise<void>} - Confirmation de la suppression.
 */
async function deleteUser(userId) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  await user.destroy();
}

/**
 * Service pour vérifier si un utilisateur possède un rôle spécifique.
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {string} roleName - Le nom du rôle à vérifier.
 * @returns {Promise<boolean>} - `true` si l'utilisateur a le rôle, sinon `false`.
 */
async function userHasRole(userId, roleName) {
  const user = await User.findByPk(userId, {
    include: [{ model: Role, where: { name: roleName } }],
  });

  return !!user;
}

module.exports = {
  getUserById,
  userExists,
  createUser,
  updateUser,
  deleteUser,
  userHasRole,
};
