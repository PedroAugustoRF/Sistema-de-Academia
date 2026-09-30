import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../src/application/app.js";

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("GET / informa que a API está saudável", async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    nome: "Sistema de Academia — API",
    status: "ok",
  });
});

test("GET /gym/ entrega a aplicação web", async () => {
  const response = await fetch(`${baseUrl}/gym/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(await response.text(), /GymControl/);
});

test("GET /gym/js/config.js entrega os módulos do front-end", async () => {
  const response = await fetch(`${baseUrl}/gym/js/config.js`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /javascript/);
});

test("rota inexistente retorna erro JSON 404", async () => {
  const response = await fetch(`${baseUrl}/rota-inexistente`);
  assert.equal(response.status, 404);
  assert.match((await response.json()).erro, /não existe/);
});
