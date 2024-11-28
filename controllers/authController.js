const { User, Role } = require("../models");
const authService = require("../services/authService");

module.exports = {
  /**
   * Inscription d'un nouvel utilisateur.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async register(req, res) {
    try {
      const { username, password, roleId } = req.body;

      // Vérifier si le rôle est valide
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(400).send({ error: "Rôle invalide." });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res
          .status(400)
          .send({ error: "Nom d'utilisateur déjà utilisé." });
      }

      // Créer l'utilisateur
      const hashedPassword = await authService.hashPassword(password);
      const newUser = await User.create({
        username,
        password: hashedPassword,
        roleId,
      });

      return res.status(201).send({
        message: "Utilisateur créé avec succès.",
        user: { id: newUser.id, username: newUser.username },
      });
    } catch (error) {
      req.log.error(error);
      return res.status(500).send({ error: "Erreur lors de l'inscription." });
    }
  },

  /**
   * Connexion d'un utilisateur existant.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res
          .status(400)
          .send({ error: "Nom d'utilisateur ou mot de passe incorrect." });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await authService.verifyPassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .send({ error: "Nom d'utilisateur ou mot de passe incorrect." });
      }

      // Générer un token JWT
      const token = authService.generateToken({
        id: user.id,
        roleId: user.roleId,
      });

      return res.send({
        message: "Connexion réussie.",
        token,
        user: { id: user.id, username: user.username, roleId: user.roleId },
      });
    } catch (error) {
      req.log.error(error);
      return res.status(500).send({ error: "Erreur lors de la connexion." });
    }
  },

  /**
   * Rafraîchit un jeton JWT.
   * @param {Object} req - La requête entrante.
   * @param {Object} res - La réponse sortante.
   */
  async refreshToken(req, res) {
    try {
      const { token } = req.body;

      // Vérifier et décoder le jeton
      const decoded = authService.verifyToken(token);

      // Générer un nouveau token
      const newToken = authService.generateToken({
        id: decoded.id,
        roleId: decoded.roleId,
      });

      return res.send({ token: newToken });
    } catch (error) {
      req.log.error(error);
      return res.status(400).send({ error: "Jeton invalide ou expiré." });
    }
  },
};
