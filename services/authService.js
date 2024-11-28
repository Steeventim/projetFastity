const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecretkey"; // Remplacez par une clé sécurisée et utilisez les variables d'environnement en production.
const TOKEN_EXPIRATION = "1h"; // Définir la durée de validité des jetons.

/**
 * Hache un mot de passe à l'aide de bcrypt.
 * @param {string} password - Le mot de passe en clair à hacher.
 * @returns {Promise<string>} - Le mot de passe haché.
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare un mot de passe en clair avec un mot de passe haché.
 * @param {string} password - Le mot de passe en clair.
 * @param {string} hashedPassword - Le mot de passe haché.
 * @returns {Promise<boolean>} - Résultat de la comparaison.
 */
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Génère un jeton JWT.
 * @param {Object} payload - Les données à inclure dans le jeton.
 * @param {string} [expiration=TOKEN_EXPIRATION] - Durée de validité du jeton (ex. : "1h", "7d").
 * @returns {string} - Le jeton JWT généré.
 */
function generateToken(payload, expiration = TOKEN_EXPIRATION) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: expiration });
}

/**
 * Vérifie et décode un jeton JWT.
 * @param {string} token - Le jeton JWT à vérifier.
 * @returns {Object} - Les données décodées du jeton.
 * @throws {Error} - Si le jeton est invalide ou expiré.
 */
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

/**
 * Rafraîchit un jeton JWT en générant un nouveau jeton avec les mêmes données.
 * @param {string} token - Le jeton JWT existant.
 * @returns {string} - Un nouveau jeton JWT.
 */
function refreshJwtToken(token) {
  const decoded = verifyToken(token);
  const { iat, exp, ...payload } = decoded; // Exclure les champs iat et exp du nouveau jeton.
  return generateToken(payload);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  refreshJwtToken,
};
