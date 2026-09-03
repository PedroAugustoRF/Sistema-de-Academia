import AlunosDAO from "../dao/AlunosDAO.js";

const alunosDAO = new AlunosDAO;

export async function getAllAlunos(req, res) {
    const alunos = await alunosDAO.findAll();
    res.json(alunos);
}

export async function getAlunoById(req, res) {
    const aluno = await alunosDAO.findById(req.params.id);
    aluno ? res.json(aluno) : res.status(404).send("Aluno não encontrado");
}
export async function createAluno(req, res) {
    const id = await alunosDAO.insert(req.body);
    res.status(201).json({ id });
}

export async function updateAluno(req, res) {
    const sucesso = await alunosDAO.update(req.body);
    sucesso ? res.sendStatus(200) : res.status(404).send("Aluno não encontrado");
}

export async function deleteAluno(req, res) {
    const sucesso = await alunosDAO.delete(req.params.id);
    sucesso ? res.sendStatus(200) : res.status(404).send("Aluno não encontrado");
}