import express from "express";
import {
  getAllTreinos,
  getTreinoById,
  getTreinosByAluno,
  createTreino,
  updateTreino,
  deleteTreino
} from "../controllers/TreinosController.js";

const router = express.Router();

router.get("/", getAllTreinos);
router.get("/:id", getTreinoById);
router.get("/aluno/:alunoId", getTreinosByAluno);
router.post("/", createTreino);
router.put("/:id", updateTreino);
router.delete("/:id", deleteTreino);

export default router;