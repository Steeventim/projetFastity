const hierarchyController = require("../controllers/hierarchyController");

async function hierarchyRoutes(fastify, options) {
  // Récupérer toute la hiérarchie
  fastify.get("/hierarchy", hierarchyController.getHierarchy);

  // Ajouter un utilisateur à la hiérarchie
  fastify.post("/hierarchy", hierarchyController.addToHierarchy);

  // Mettre à jour un lien hiérarchique
  fastify.put("/hierarchy", hierarchyController.updateHierarchyLink);

  // Supprimer un utilisateur de la hiérarchie
  fastify.delete("/hierarchy/:userId", hierarchyController.removeFromHierarchy);
}

module.exports = hierarchyRoutes;
