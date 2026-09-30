import express from "express";
import {
  getAllExercicios,
  getExercicioById,
  getExerciciosByTreino,
  createExercicio,
  updateExercicio,
  deleteExercicio
} from "../controllers/ExerciciosController.js";
import { autenticar, autorizarCargos } from "../middlewares/auth.js";

const router = express.Router();

router.use(autenticar);

// Leitura liberada a qualquer usuário logado (o aluno precisa ver os
// exercícios da própria ficha); escrita apenas para professor/administrador.
router.get("/", autorizarCargos("administrador", "professor"), getAllExercicios);
router.get("/:id", getExercicioById);
router.get("/treino/:treinoId", getExerciciosByTreino);
router.post("/", autorizarCargos("administrador", "professor"), createExercicio);
router.put("/:id", autorizarCargos("administrador", "professor"), updateExercicio);
router.delete("/:id", autorizarCargos("administrador", "professor"), deleteExercicio);

export default router;
