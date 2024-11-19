// test/users.test.js
const tap = require("tap");
const buildFastify = require("../src/server");
const supertest = require("supertest");

tap.test("User routes", async (t) => {
  const fastify = buildFastify();
  await fastify.ready();

  t.teardown(() => fastify.close());

  // Test de la création d'un utilisateur
  const createUserResponse = await supertest(fastify.server)
    .post("/users")
    .send({
      username: "testuser",
      password: "testpassword",
      email: "test@example.com",
    });

  t.equal(
    createUserResponse.status,
    201,
    "Create user route should respond with status 201"
  );
  t.ok(
    createUserResponse.body.id,
    "Create user route should return the created user with an ID"
  );

  const userId = createUserResponse.body.id;

  // Test de la récupération de tous les utilisateurs
  const getUsersResponse = await supertest(fastify.server).get("/users");

  t.equal(
    getUsersResponse.status,
    200,
    "Get users route should respond with status 200"
  );
  t.ok(
    Array.isArray(getUsersResponse.body),
    "Get users route should return an array"
  );

  // Test de la récupération d'un utilisateur par ID
  const getUserResponse = await supertest(fastify.server).get(
    `/users/${userId}`
  );

  t.equal(
    getUserResponse.status,
    200,
    "Get user by ID route should respond with status 200"
  );
  t.same(
    getUserResponse.body.username,
    "testuser",
    "Get user by ID route should return the correct user"
  );

  // Test de la mise à jour d'un utilisateur
  const updateUserResponse = await supertest(fastify.server)
    .put(`/users/${userId}`)
    .send({
      username: "updateduser",
      password: "updatedpassword",
      email: "updated@example.com",
    });

  t.equal(
    updateUserResponse.status,
    200,
    "Update user route should respond with status 200"
  );
  t.same(
    updateUserResponse.body.username,
    "updateduser",
    "Update user route should return the updated user"
  );

  // Test de la suppression d'un utilisateur
  const deleteUserResponse = await supertest(fastify.server).delete(
    `/users/${userId}`
  );

  t.equal(
    deleteUserResponse.status,
    200,
    "Delete user route should respond with status 200"
  );
  t.same(
    deleteUserResponse.body.message,
    "User deleted successfully",
    "Delete user route should confirm deletion"
  );
});
