import express from "express";
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  login
} from "../controllers/UsuariosController.js";
import { autenticar, autenticarOuBootstrap } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);

router.get("/", autenticar, getAllUsuarios);
router.get("/:id", autenticar, getUsuarioById);
router.post("/", autenticarOuBootstrap, createUsuario);
router.put("/:id", autenticar, updateUsuario);
router.delete("/:id", autenticar, deleteUsuario);

export default router;
