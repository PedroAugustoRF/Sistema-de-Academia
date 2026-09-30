import { loadEnvironment } from "../src/config/env.js";

loadEnvironment();

const { default: connection } = await import("../src/database/Connection.js");

try {
  const [rows] = await connection.query(
    "SELECT DATABASE() AS banco, VERSION() AS versao, (SELECT COUNT(*) FROM usuarios) AS usuarios",
  );
  const result = rows[0];
  console.log(`MySQL conectado: banco=${result.banco}, versão=${result.versao}, usuários=${result.usuarios}`);
} catch (error) {
  console.error(`Falha ao conectar ao MySQL: ${error.message}`);
  process.exitCode = 1;
} finally {
  await connection.end();
}
