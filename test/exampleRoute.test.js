// test/exampleRoute.test.js
const tap = require("tap");
const buildFastify = require("../src/server");
const supertest = require("supertest");

tap.test("Example routes", async (t) => {
  const app = buildFastify();
  await app.ready();

  t.teardown(() => app.close());

  // Test de la route /hello
  const helloResponse = await supertest(app.server).get("/example/hello");

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
