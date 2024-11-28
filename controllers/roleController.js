const { Role } = require("../models");

module.exports = {
  /**
   * Récupérer la liste de tous les rôles.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async getAllRoles(req, res) {
    try {
      const roles = await Role.findAll();
      return res.send({ roles });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la récupération des rôles." });
    }
  },

  /**
   * Récupérer un rôle par ID.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);

      if (!role) {
        return res.status(404).send({ error: "Rôle non trouvé." });
      }

      return res.send({ role });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la récupération du rôle." });
    }
  },

  /**
   * Créer un nouveau rôle.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async createRole(req, res) {
    try {
      const { name, description } = req.body;

      // Vérifier si le rôle existe déjà
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res
          .status(400)
          .send({ error: "Un rôle avec ce nom existe déjà." });
      }

      const newRole = await Role.create({ name, description });
      return res
        .status(201)
        .send({ message: "Rôle créé avec succès.", role: newRole });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la création du rôle." });
    }
  },

  /**
   * Mettre à jour un rôle existant.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).send({ error: "Rôle non trouvé." });
      }

      // Vérifier si un autre rôle a déjà ce nom
      const existingRole = await Role.findOne({
        where: { name, id: { [Op.ne]: id } },
      });
      if (existingRole) {
        return res
          .status(400)
          .send({ error: "Un rôle avec ce nom existe déjà." });
      }

      role.name = name || role.name;
      role.description = description || role.description;
      await role.save();

      return res.send({ message: "Rôle mis à jour avec succès.", role });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la mise à jour du rôle." });
    }
  },

  /**
   * Supprimer un rôle par ID.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async deleteRole(req, res) {
    try {
      const { id } = req.params;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).send({ error: "Rôle non trouvé." });
      }

      await role.destroy();
      return res.send({ message: "Rôle supprimé avec succès." });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la suppression du rôle." });
    }
  },
};
