const { Role } = require("../models");
const { Op } = require("sequelize");

/**
 * Récupérer tous les rôles depuis la base de données.
 * @returns {Promise<Array>} - Liste des rôles.
 */
async function getAllRoles() {
  return await Role.findAll();
}

/**
 * Récupérer un rôle par son ID.
 * @param {number} roleId - L'ID du rôle.
 * @returns {Promise<Object|null>} - Le rôle trouvé ou null s'il n'existe pas.
 */
async function getRoleById(roleId) {
  return await Role.findByPk(roleId);
}

/**
 * Créer un nouveau rôle.
 * @param {Object} roleData - Les données du rôle (nom, description).
 * @returns {Promise<Object>} - Le rôle créé.
 * @throws {Error} - Si un rôle avec le même nom existe déjà.
 */
async function createRole(roleData) {
  const existingRole = await Role.findOne({ where: { name: roleData.name } });
  if (existingRole) {
    throw new Error("Un rôle avec ce nom existe déjà.");
  }

  return await Role.create(roleData);
}

/**
 * Mettre à jour un rôle existant.
 * @param {number} roleId - L'ID du rôle à mettre à jour.
 * @param {Object} updatedData - Les nouvelles données du rôle.
 * @returns {Promise<Object>} - Le rôle mis à jour.
 * @throws {Error} - Si le rôle n'existe pas ou si un autre rôle a le même nom.
 */
async function updateRole(roleId, updatedData) {
  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new Error("Rôle non trouvé.");
  }

  const existingRole = await Role.findOne({
    where: {
      name: updatedData.name,
      id: { [Op.ne]: roleId },
    },
  });

  if (existingRole) {
    throw new Error("Un rôle avec ce nom existe déjà.");
  }

  role.name = updatedData.name || role.name;
  role.description = updatedData.description || role.description;

  await role.save();
  return role;
}

/**
 * Supprimer un rôle par son ID.
 * @param {number} roleId - L'ID du rôle à supprimer.
 * @returns {Promise<void>} - Vide si la suppression réussit.
 * @throws {Error} - Si le rôle n'existe pas.
 */
async function deleteRole(roleId) {
  const role = await Role.findByPk(roleId);
  if (!role) {
    throw new Error("Rôle non trouvé.");
  }

  await role.destroy();
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
