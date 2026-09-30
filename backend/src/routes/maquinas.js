import express from "express";
import {
  getAllMaquinas,
  getMaquinaById,
  createMaquina,
  updateMaquina,
  deleteMaquina
} from "../controllers/MaquinasController.js";
import { autenticar, autorizarCargos } from "../middlewares/auth.js";

const router = express.Router();

router.use(autenticar);

// Qualquer usuário logado pode consultar o catálogo; só o administrador
// altera o cadastro de máquinas.
router.get("/", getAllMaquinas);
router.get("/:id", getMaquinaById);
router.post("/", autorizarCargos("administrador"), createMaquina);
router.put("/:id", autorizarCargos("administrador"), updateMaquina);
router.delete("/:id", autorizarCargos("administrador"), deleteMaquina);

export default router;
