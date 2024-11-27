const { User, Hierarchy } = require("../models");

/**
 * Récupérer toute la hiérarchie des utilisateurs.
 * @returns {Promise<Array>} - Liste des relations hiérarchiques.
 */
async function getHierarchy() {
  return await Hierarchy.findAll({
    include: [
      { model: User, as: "user" },
      { model: User, as: "parent" },
    ],
  });
}

/**
 * Ajouter un utilisateur à la hiérarchie.
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {number} parentId - L'ID du parent.
 * @returns {Promise<Object>} - La relation hiérarchique créée.
 */
async function addToHierarchy(userId, parentId) {
  const user = await User.findByPk(userId);
  const parent = await User.findByPk(parentId);

  if (!user) throw new Error("Utilisateur non trouvé.");
  if (!parent) throw new Error("Parent non trouvé.");

  return await Hierarchy.create({ userId, parentId });
}

/**
 * Mettre à jour un lien hiérarchique.
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {number} newParentId - Le nouvel ID du parent.
 * @returns {Promise<Object>} - La relation mise à jour.
 */
async function updateHierarchyLink(userId, newParentId) {
  const hierarchy = await Hierarchy.findOne({ where: { userId } });

  if (!hierarchy) throw new Error("Lien hiérarchique non trouvé.");
  hierarchy.parentId = newParentId;

  await hierarchy.save();
  return hierarchy;
}

/**
 * Supprimer un utilisateur de la hiérarchie.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<void>}
 */
async function removeFromHierarchy(userId) {
  const hierarchy = await Hierarchy.findOne({ where: { userId } });

  if (!hierarchy) throw new Error("Lien hiérarchique non trouvé.");
  await hierarchy.destroy();
}

module.exports = {
  getHierarchy,
  addToHierarchy,
  updateHierarchyLink,
  removeFromHierarchy,
};
