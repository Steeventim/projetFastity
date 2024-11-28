const hierarchyService = require("../services/hierarchyService");

module.exports = {
  /**
   * Récupérer toute la hiérarchie (utilisateurs et rôles).
   * @param {Object} req - La requête HTTP.
   * @param {Object} res - La réponse HTTP.
   */
  async getHierarchy(req, res) {
    try {
      const hierarchy = await hierarchyService.getHierarchy();
      return res.send({ hierarchy });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la récupération de la hiérarchie." });
    }
  },

  /**
   * Ajouter un utilisateur à la hiérarchie.
   * @param {Object} req - La requête HTTP.
   * @param {Object} res - La réponse HTTP.
   */
  async addToHierarchy(req, res) {
    try {
      const { userId, parentId } = req.body;
      const result = await hierarchyService.addToHierarchy(userId, parentId);
      return res.status(201).send({
        message: "Utilisateur ajouté à la hiérarchie avec succès.",
        hierarchy: result,
      });
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: error.message });
    }
  },

  /**
   * Mettre à jour un lien hiérarchique.
   * @param {Object} req - La requête HTTP.
   * @param {Object} res - La réponse HTTP.
   */
  async updateHierarchyLink(req, res) {
    try {
      const { userId, newParentId } = req.body;
      const updatedHierarchy = await hierarchyService.updateHierarchyLink(
        userId,
        newParentId
      );
      return res.send({
        message: "Lien hiérarchique mis à jour avec succès.",
        hierarchy: updatedHierarchy,
      });
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: error.message });
    }
  },

  /**
   * Supprimer un utilisateur de la hiérarchie.
   * @param {Object} req - La requête HTTP.
   * @param {Object} res - La réponse HTTP.
   */
  async removeFromHierarchy(req, res) {
    try {
      const { userId } = req.params;
      await hierarchyService.removeFromHierarchy(userId);
      return res.send({
        message: "Utilisateur supprimé de la hiérarchie avec succès.",
      });
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: error.message });
    }
  },
};
