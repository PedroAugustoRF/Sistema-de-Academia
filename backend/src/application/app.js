import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import usuariosRoutes from "../routes/usuarios.js";
import treinosRoutes from "../routes/treinos.js";
import exerciciosRoutes from "../routes/exercicios.js";
import maquinasRoutes from "../routes/maquinas.js";

const app = express();
const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const diretorioFrontend = path.resolve(diretorioAtual, "../../../public/gym");

app.use(express.json());
app.use(cors());

// O mesmo processo entrega o front-end e a API. Assim, um único `npm run dev`
// basta para abrir o sistema completo em http://localhost:3000/gym/.
app.use("/gym", express.static(diretorioFrontend));

app.get("/", (req, res) => {
    res.json({ nome: "Sistema de Academia — API", status: "ok" });
});

app.use("/usuarios", usuariosRoutes);
app.use("/treinos", treinosRoutes);
app.use("/exercicios", exerciciosRoutes);
app.use("/maquinas", maquinasRoutes);

app.use((req, res) => {
    res.status(404).json({ erro: `Rota ${req.method} ${req.originalUrl} não existe` });
});

// Erros não tratados (ex.: banco fora do ar) viram JSON em vez de HTML.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err);
    if (err?.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({ erro: "Registro relacionado não existe (usuário, treino ou máquina)" });
    }
    if (err?.code === "WARN_DATA_TRUNCATED" || err?.code === "ER_BAD_NULL_ERROR") {
        return res.status(400).json({ erro: "Dados inválidos: verifique o agrupamento, dia da semana ou campos obrigatórios" });
    }
    if (err?.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({ erro: "Registro em uso por outros cadastros e não pode ser excluído" });
    }
    if (err?.code === "ECONNREFUSED" || err?.code === "ER_ACCESS_DENIED_ERROR" || err?.code === "ER_BAD_DB_ERROR") {
        return res.status(503).json({ erro: "Não foi possível conectar ao banco de dados MySQL" });
    }
    res.status(500).json({ erro: "Erro interno do servidor" });
});

export default app;
