import { loadEnvironment } from "../config/env.js";

loadEnvironment();

const { default: app } = await import("./app.js");

const porta = Number(process.env.PORT || 3000);

const servidor = app.listen(porta, () => {
  console.log(`GymControl: http://localhost:${porta}/gym/`);
  console.log(`API:        http://localhost:${porta}/`);
});

function encerrar(sinal) {
  console.log(`\n${sinal} recebido. Encerrando o servidor...`);
  servidor.close(() => process.exit(0));
}

process.on("SIGINT", () => encerrar("SIGINT"));
process.on("SIGTERM", () => encerrar("SIGTERM"));
