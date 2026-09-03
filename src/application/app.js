import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import alunosRoutes from "../routes/alunos.js";
import treinosRoutes from "../routes/treinos.js";
import exerciciosRoutes from "../routes/exercicios.js";
import maquinasRoutes from "../routes/maquinas.js";

const app = express();
const porta = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/alunos", alunosRoutes);
app.use("/treinos", treinosRoutes);
app.use("/exercicios", exerciciosRoutes);
app.use("/maquinas", maquinasRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(porta, () => { console.log(`http://localhost:${porta}`); });