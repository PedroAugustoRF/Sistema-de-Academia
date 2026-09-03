import express from "express";
import {
  getAllMaquinas,
  getMaquinaById,
  createMaquina,
  updateMaquina,
  deleteMaquina
} from "../controllers/MaquinasController.js";

const router = express.Router();

router.get("/", getAllMaquinas);
router.get("/:id", getMaquinaById);
router.post("/", createMaquina);
router.put("/:id", updateMaquina);
router.delete("/:id", deleteMaquina);

export default router;