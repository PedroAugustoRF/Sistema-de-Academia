import ExerciciosDAO from "../dao/ExerciciosDAO.js";

const exerciciosDAO = new ExerciciosDAO();

export async function getAllExercicios(req, res) {
  const exercicios = await exerciciosDAO.findAll();
  res.json(exercicios);
}

export async function getExercicioById(req, res) {
  const exercicio = await exerciciosDAO.findById(req.params.id);
  exercicio ? res.json(exercicio) : res.status(404).send("Exercício não encontrado");
}

export async function getExerciciosByTreino(req, res) {
  const exercicios = await exerciciosDAO.findByTreinoId(req.params.treinoId);
  res.json(exercicios);
}

export async function createExercicio(req, res) {
  const id = await exerciciosDAO.insert(req.body);
  res.status(201).json({ id });
}

export async function updateExercicio(req, res) {
  const sucesso = await exerciciosDAO.update(req.body);
  sucesso ? res.sendStatus(200) : res.status(404).send("Exercício não encontrado");
}

export async function deleteExercicio(req, res) {
  const sucesso = await exerciciosDAO.delete(req.params.id);
  sucesso ? res.sendStatus(200) : res.status(404).send("Exercício não encontrado");
}