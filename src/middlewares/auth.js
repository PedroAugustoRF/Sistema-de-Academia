import jwt from "jsonwebtoken";
import UsuariosDAO from "../dao/UsuariosDAO.js";

const usuariosDAO = new UsuariosDAO();

// Em produção, isso deve vir de uma variável de ambiente (.env), nunca hardcoded.
export const JWT_SECRET = process.env.JWT_SECRET || "chave-secreta-trabalho-faculdade";

export function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ erro: "Token não informado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.usuarioLogado = payload; // { id, nome, cargo }
        next();
    } catch (err) {
        return res.status(401).json({ erro: "Token inválido ou expirado" });
    }
}

// Regras: administrador cria professor e aluno; professor cria apenas aluno.
const HIERARQUIA = {
    administrador: ["administrador", "professor", "aluno"],
    professor: ["aluno"],
    aluno: []
};

// Permite criar o primeiro usuário (administrador) sem token, apenas quando
// o sistema ainda não tem nenhum usuário cadastrado. Depois disso, toda
// criação passa a exigir login + hierarquia de cargos normalmente.
export async function autenticarOuBootstrap(req, res, next) {
    const usuarios = await usuariosDAO.findAll();

    if (usuarios.length === 0) {
        req.body.cargo = "administrador";
        return next();
    }

    return autenticar(req, res, () => autorizarCriacaoDeCargo(req, res, next));
}

export function autorizarCriacaoDeCargo(req, res, next) {
    const cargoDoCriador = req.usuarioLogado?.cargo;
    const cargoDesejado = req.body?.cargo;

    if (!cargoDoCriador || !HIERARQUIA[cargoDoCriador]) {
        return res.status(403).json({ erro: "Cargo do usuário logado não reconhecido" });
    }

    if (!cargoDesejado || !HIERARQUIA[cargoDoCriador].includes(cargoDesejado)) {
        return res.status(403).json({
            erro: `Um usuário com cargo '${cargoDoCriador}' não pode criar um usuário com cargo '${cargoDesejado}'`
        });
    }

    next();
}
