import express from "express";
import {
  getAllExercicios,
  getExercicioById,
  getExerciciosByTreino,
  createExercicio,
  updateExercicio,
  deleteExercicio
} from "../controllers/ExerciciosController.js";

const router = express.Router();

router.get("/", getAllExercicios);
router.get("/:id", getExercicioById);
router.get("/treino/:treinoId", getExerciciosByTreino);
router.post("/", createExercicio);
router.put("/:id", updateExercicio);
router.delete("/:id", deleteExercicio);

export default router;