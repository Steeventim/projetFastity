const { User, Role } = require("../models"); // Importer les modèles nécessaires
const { hashPassword } = require("../services/authService"); // Service pour hacher les mots de passe

module.exports = {
  /**
   * Récupère tous les utilisateurs.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        include: [{ model: Role, attributes: ["name"] }], // Inclure les rôles des utilisateurs
        attributes: { exclude: ["password"] }, // Exclure les mots de passe
      });
      return res.send(users);
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Impossible de récupérer les utilisateurs." });
    }
  },

  /**
   * Récupère un utilisateur par ID.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        include: [{ model: Role, attributes: ["name"] }],
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).send({ error: "Utilisateur introuvable." });
      }
      return res.send(user);
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la récupération de l'utilisateur." });
    }
  },

  /**
   * Crée un nouvel utilisateur.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async createUser(req, res) {
    try {
      const { username, password, roleId } = req.body;

      // Vérifier si le rôle existe
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(400).send({ error: "Rôle invalide." });
      }

      // Hacher le mot de passe
      const hashedPassword = await hashPassword(password);

      // Créer l'utilisateur
      const newUser = await User.create({
        username,
        password: hashedPassword,
        roleId,
      });
      return res
        .status(201)
        .send({ message: "Utilisateur créé avec succès.", user: newUser });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la création de l'utilisateur." });
    }
  },

  /**
   * Met à jour un utilisateur existant.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, password, roleId } = req.body;

      // Trouver l'utilisateur
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: "Utilisateur introuvable." });
      }

      // Mettre à jour les informations
      user.username = username || user.username;
      if (password) {
        user.password = await hashPassword(password);
      }
      if (roleId) {
        const role = await Role.findByPk(roleId);
        if (!role) {
          return res.status(400).send({ error: "Rôle invalide." });
        }
        user.roleId = roleId;
      }

      await user.save();
      return res.send({ message: "Utilisateur mis à jour avec succès.", user });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la mise à jour de l'utilisateur." });
    }
  },

  /**
   * Supprime un utilisateur par ID.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Trouver et supprimer l'utilisateur
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: "Utilisateur introuvable." });
      }

      await user.destroy();
      return res.send({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
      req.log.error(error);
      return res
        .status(500)
        .send({ error: "Erreur lors de la suppression de l'utilisateur." });
    }
  },
};
