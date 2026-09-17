import express from "express";
import {
  getAllTreinos,
  getTreinoById,
  getTreinosByUsuario,
  createTreino,
  updateTreino,
  deleteTreino
} from "../controllers/TreinosController.js";

const router = express.Router();

router.get("/", getAllTreinos);
router.get("/:id", getTreinoById);
router.get("/usuario/:usuarioId", getTreinosByUsuario);
router.post("/", createTreino);
router.put("/:id", updateTreino);
router.delete("/:id", deleteTreino);

export default router;