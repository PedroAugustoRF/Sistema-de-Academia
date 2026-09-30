import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UsuariosDAO from "../dao/UsuariosDAO.js";
import { JWT_SECRET, CARGOS, podeGerenciar } from "../middlewares/auth.js";

const usuariosDAO = new UsuariosDAO();
const SALT_ROUNDS = 10;

function respostaErroBanco(err, res) {
    if (err?.code === "ER_DUP_ENTRY") {
        const campo = /email/i.test(err.message) ? "e-mail" : /cpf/i.test(err.message) ? "CPF" : "registro";
        res.status(409).json({ erro: `Já existe um usuário com este ${campo}` });
        return true;
    }
    return false;
}

export async function getAllUsuarios(req, res) {
    const usuarios = await usuariosDAO.findAll();
    // Aluno não enxerga a lista de usuários — apenas a si mesmo.
    if (req.usuarioLogado.cargo === "aluno") {
        return res.json(usuarios.filter(u => u.id === req.usuarioLogado.id));
    }
    res.json(usuarios);
}

export async function getUsuarioById(req, res) {
    const id = Number(req.params.id);
    if (req.usuarioLogado.cargo === "aluno" && req.usuarioLogado.id !== id) {
        return res.status(403).json({ erro: "Um aluno só pode consultar o próprio cadastro" });
    }
    const usuario = await usuariosDAO.findById(id);
    usuario ? res.json(usuario) : res.status(404).json({ erro: "Usuario não encontrado" });
}

export async function createUsuario(req, res) {
    const dados = req.body;

    if (!dados.nome || !dados.email || !dados.senha) {
        return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios" });
    }
    if (!CARGOS.includes(dados.cargo)) {
        return res.status(400).json({ erro: "Cargo inválido" });
    }

    dados.senha = await bcrypt.hash(dados.senha, SALT_ROUNDS);

    try {
        const id = await usuariosDAO.insert(dados);
        res.status(201).json({ id });
    } catch (err) {
        if (!respostaErroBanco(err, res)) throw err;
    }
}

export async function updateUsuario(req, res) {
    const id = Number(req.params.id);
    const dados = { ...req.body, id };
    const logado = req.usuarioLogado;

    const atual = await usuariosDAO.findById(id);
    if (!atual) return res.status(404).json({ erro: "Usuario não encontrado" });

    const editandoASiMesmo = logado.id === id;
    if (!editandoASiMesmo && !podeGerenciar(logado.cargo, atual.cargo)) {
        return res.status(403).json({ erro: "Você não pode editar este usuário" });
    }

    // Só quem pode gerenciar o cargo de destino pode alterá-lo; ninguém
    // promove a si mesmo.
    if (dados.cargo && dados.cargo !== atual.cargo) {
        if (editandoASiMesmo || !podeGerenciar(logado.cargo, dados.cargo)) {
            return res.status(403).json({ erro: "Você não pode alterar o cargo para este valor" });
        }
        if (!CARGOS.includes(dados.cargo)) return res.status(400).json({ erro: "Cargo inválido" });
    }

    const atualizado = {
        id,
        nome: dados.nome ?? atual.nome,
        email: dados.email ?? atual.email,
        cpf: dados.cpf ?? atual.cpf,
        celular: dados.celular ?? atual.celular,
        aniversario: dados.aniversario ?? atual.aniversario,
        cargo: dados.cargo ?? atual.cargo
    };

    try {
        await usuariosDAO.update(atualizado);
        if (dados.senha) {
            const hash = await bcrypt.hash(String(dados.senha), SALT_ROUNDS);
            await usuariosDAO.updateSenha(id, hash);
        }
        res.sendStatus(200);
    } catch (err) {
        if (!respostaErroBanco(err, res)) throw err;
    }
}

export async function deleteUsuario(req, res) {
    const id = Number(req.params.id);
    const logado = req.usuarioLogado;

    if (logado.id === id) {
        return res.status(400).json({ erro: "Você não pode excluir o próprio usuário" });
    }

    const alvo = await usuariosDAO.findById(id);
    if (!alvo) return res.status(404).json({ erro: "Usuario não encontrado" });

    if (!podeGerenciar(logado.cargo, alvo.cargo)) {
        return res.status(403).json({ erro: "Você não pode excluir este usuário" });
    }

    const sucesso = await usuariosDAO.delete(id);
    sucesso ? res.sendStatus(200) : res.status(404).json({ erro: "Usuario não encontrado" });
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

    // usuario.toJSON() nunca inclui a senha (hash).
    res.json({ token, usuario: usuario.toJSON() });
}

/** Retorna o usuário dono do token atual (usado pelo front ao recarregar). */
export async function me(req, res) {
    const usuario = await usuariosDAO.findById(req.usuarioLogado.id);
    usuario ? res.json(usuario) : res.status(404).json({ erro: "Usuario não encontrado" });
}
