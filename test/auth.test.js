// test/auth.test.js
const tap = require("tap");
const buildFastify = require("../src/server");
const supertest = require("supertest");

tap.test("Authentication routes", async (t) => {
  const app = buildFastify();
  await app.ready();

  t.teardown(() => app.close());

  // Test de la route signup
  const signupResponse = await supertest(app.server)
    .post("/auth/signup")
    .send({ username: "testuser", password: "testpassword" });

  t.equal(
    signupResponse.status,
    200,
    "Signup route should respond with status 200"
  );
  t.ok(signupResponse.body.token, "Signup route should return a token");

  const token = signupResponse.body.token;

  // Test de la route protégée
  const protectedResponse = await supertest(app.server)
    .get("/auth/protected")
    .set("Authorization", `Bearer ${token}`);

  t.equal(
    protectedResponse.status,
    200,
    "Protected route should respond with status 200"
  );
  t.equal(
    protectedResponse.body.message,
    "This is a protected route",
    "Protected route should return the correct message"
  );
});
