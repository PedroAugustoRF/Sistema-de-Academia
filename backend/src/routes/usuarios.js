import express from "express";
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  login,
  me
} from "../controllers/UsuariosController.js";
import { autenticar, autenticarOuBootstrap, autorizarCargos } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", autenticar, me);

router.get("/", autenticar, getAllUsuarios);
router.get("/:id", autenticar, getUsuarioById);
router.post("/", autenticarOuBootstrap, createUsuario);
router.put("/:id", autenticar, updateUsuario);
router.delete("/:id", autenticar, autorizarCargos("administrador", "professor"), deleteUsuario);

export default router;
