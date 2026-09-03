import TreinoDAO from "../dao/TreinoDAO.js";

const treinoDAO = new TreinoDAO();

export async function getAllTreinos(req, res) {
  const treinos = await treinoDAO.findAll();
  res.json(treinos);
}

export async function getTreinoById(req, res) {
  const treino = await treinoDAO.findById(req.params.id);
  treino ? res.json(treino) : res.status(404).send("Treino não encontrado");
}

export async function getTreinosByAluno(req, res) {
  const treinos = await treinoDAO.findByAlunoId(req.params.alunoId);
  res.json(treinos);
}

export async function createTreino(req, res) {
  const id = await treinoDAO.insert(req.body);
  res.status(201).json({ id });
}

export async function updateTreino(req, res) {
  const sucesso = await treinoDAO.update(req.body);
  sucesso ? res.sendStatus(200) : res.status(404).send("Treino não encontrado");
}

export async function deleteTreino(req, res) {
  const sucesso = await treinoDAO.delete(req.params.id);
  sucesso ? res.sendStatus(200) : res.status(404).send("Treino não encontrado");
}