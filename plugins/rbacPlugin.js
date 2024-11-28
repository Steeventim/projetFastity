module.exports = async function rbacPlugin(fastify, options) {
  fastify.decorate("checkRole", async (roleRequired, userRole) => {
    const hierarchy = ["collaborateur", "chef de service", "directeur"];
    const userLevel = hierarchy.indexOf(userRole);
    const requiredLevel = hierarchy.indexOf(roleRequired);

    return userLevel >= requiredLevel;
  });
};
