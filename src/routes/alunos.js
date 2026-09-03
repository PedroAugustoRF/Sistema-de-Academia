import express from "express";
import {
  getAllAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno
} from "../controllers/AlunosController.js";

const router = express.Router();

router.get("/", getAllAlunos);
router.get("/:id", getAlunoById);
router.post("/", createAluno);
router.put("/:id", updateAluno);
router.delete("/:id", deleteAluno);

export default router;