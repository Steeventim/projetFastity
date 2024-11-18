// test/exampleRoute.test.js
const tap = require("tap");
const buildFastify = require("../src/server"); // Assure-toi que le chemin est correct
const supertest = require("supertest");

tap.test("Example routes", async (t) => {
  const fastify = buildFastify();
  await fastify.ready();

  t.teardown(() => fastify.close());

  // Test de la route /hello
  const helloResponse = await supertest(fastify.server).get("/example/hello");

  t.equal(
    helloResponse.status,
    200,
    "Hello route should respond with status 200"
  );
  t.same(
    helloResponse.body,
    { greeting: "Hello, world!" },
    "Hello route should return the correct greeting message"
  );
});
