import express from "express";
import {
  getAllTreinos,
  getTreinoById,
  getTreinosByUsuario,
  createTreino,
  updateTreino,
  deleteTreino
} from "../controllers/TreinosController.js";
import { autenticar, autorizarCargos } from "../middlewares/auth.js";

const router = express.Router();

// Todas as rotas exigem login. Aluno só lê os próprios treinos (checado no
// controller); criação/edição/exclusão é de professor e administrador.
router.use(autenticar);

router.get("/", autorizarCargos("administrador", "professor"), getAllTreinos);
router.get("/usuario/:usuarioId", getTreinosByUsuario);
router.get("/:id", getTreinoById);
router.post("/", autorizarCargos("administrador", "professor"), createTreino);
router.put("/:id", autorizarCargos("administrador", "professor"), updateTreino);
router.delete("/:id", autorizarCargos("administrador", "professor"), deleteTreino);

export default router;
