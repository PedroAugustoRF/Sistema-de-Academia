import MaquinasDAO from "../dao/MaquinasDAO.js";

const maquinasDAO = new MaquinasDAO();

export async function getAllMaquinas(req, res) {
  const maquinas = await maquinasDAO.findAll();
  res.json(maquinas);
}

export async function getMaquinaById(req, res) {
  const maquina = await maquinasDAO.findById(req.params.id);
  maquina ? res.json(maquina) : res.status(404).send("Máquina não encontrada");
}

export async function createMaquina(req, res) {
  const id = await maquinasDAO.insert(req.body);
  res.status(201).json({ id });
}

export async function updateMaquina(req, res) {
  const sucesso = await maquinasDAO.update(req.body);
  sucesso ? res.sendStatus(200) : res.status(404).send("Máquina não encontrada");
}

export async function deleteMaquina(req, res) {
  const sucesso = await maquinasDAO.delete(req.params.id);
  sucesso ? res.sendStatus(200) : res.status(404).send("Máquina não encontrada");
}