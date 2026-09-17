import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsuariosDAO from "../dao/UsuariosDAO.js";
import { JWT_SECRET } from "../middlewares/auth.js";

const usuariosDAO = new UsuariosDAO;
const SALT_ROUNDS = 10;

export async function getAllUsuarios(req, res) {
    const usuarios = await usuariosDAO.findAll();
    res.json(usuarios);
}

export async function getUsuarioById(req, res) {
    const usuario = await usuariosDAO.findById(req.params.id);
    usuario ? res.json(usuario) : res.status(404).send("Usuario não encontrado");
}

export async function createUsuario(req, res) {
    const dados = req.body;

    if (!dados.senha) {
        return res.status(400).json({ erro: "Senha é obrigatória" });
    }

    dados.senha = await bcrypt.hash(dados.senha, SALT_ROUNDS);

    const id = await usuariosDAO.insert(dados);
    res.status(201).json({ id });
}

export async function updateUsuario(req, res) {
    const sucesso = await usuariosDAO.update(req.body);
    sucesso ? res.sendStatus(200) : res.status(404).send("Usuario não encontrado");
}

export async function deleteUsuario(req, res) {
    const sucesso = await usuariosDAO.delete(req.params.id);
    sucesso ? res.sendStatus(200) : res.status(404).send("Usuario não encontrado");
}

export async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const usuario = await usuariosDAO.findByEmail(email);
    if (!usuario) {
        return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);
    if (!senhaConfere) {
        return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, cargo: usuario.cargo },
        JWT_SECRET,
        { expiresIn: "8h" }
    );

    res.json({ token, usuario: usuario.toJSON() });
}
