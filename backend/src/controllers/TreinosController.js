import TreinoDAO from "../dao/TreinoDAO.js";

const treinoDAO = new TreinoDAO();

const ehAluno = (req) => req.usuarioLogado?.cargo === "aluno";

export async function getAllTreinos(req, res) {
  const treinos = await treinoDAO.findAll();
  res.json(treinos);
}

export async function getTreinoById(req, res) {
  const treino = await treinoDAO.findById(req.params.id);
  if (!treino) return res.status(404).json({ erro: "Treino não encontrado" });
  if (ehAluno(req) && treino.usuario?.id !== req.usuarioLogado.id) {
    return res.status(403).json({ erro: "Um aluno só pode consultar os próprios treinos" });
  }
  res.json(treino);
}

export async function getTreinosByUsuario(req, res) {
  const usuarioId = Number(req.params.usuarioId);
  if (ehAluno(req) && usuarioId !== req.usuarioLogado.id) {
    return res.status(403).json({ erro: "Um aluno só pode consultar os próprios treinos" });
  }
  const treinos = await treinoDAO.findByUsuarioId(usuarioId);
  res.json(treinos);
}

export async function createTreino(req, res) {
  const { usuarioid, diaSemana } = req.body ?? {};
  if (!usuarioid || !diaSemana) {
    return res.status(400).json({ erro: "usuarioid e diaSemana são obrigatórios" });
  }
  const id = await treinoDAO.insert(req.body);
  res.status(201).json({ id });
}

export async function updateTreino(req, res) {
  const sucesso = await treinoDAO.update({ ...req.body, id: Number(req.params.id) });
  sucesso ? res.sendStatus(200) : res.status(404).json({ erro: "Treino não encontrado" });
}

export async function deleteTreino(req, res) {
  const sucesso = await treinoDAO.delete(req.params.id);
  sucesso ? res.sendStatus(200) : res.status(404).json({ erro: "Treino não encontrado" });
}
