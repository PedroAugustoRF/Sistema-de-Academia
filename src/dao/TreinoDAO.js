import connection from "../database/Connection.js";
import Treino from "../models/entities/Treino.js";
import AlunosDAO from "./AlunosDAO.js";
import ExerciciosDAO from "./ExerciciosDAO.js";

export default class TreinoDAO {
    #alunosDAO = new AlunosDAO();
    #exerciciosDAO = new ExerciciosDAO();

    async #toTreino(row) {
        if (!row) return null;
        const aluno = await this.#alunosDAO.findById(row.alunoid);
        const exercicios = await this.#exerciciosDAO.findByTreinoId(row.id);
        return new Treino(row.id, aluno, row.diaSemana, exercicios);
    }

    async insert(treino) {
        const sql = `INSERT INTO treinos (alunoid, diaSemana)
                     VALUES (?, ?)`;
        const parametros = [treino.alunoid, treino.diaSemana];

        const [result] = await connection.execute(sql, parametros);
        return result.insertId;
    }

    async update(treino) {
        const sql = `UPDATE treinos
                     SET alunoid = ?, diaSemana = ?
                     WHERE id = ?`;
        const parametros = [treino.alunoid, treino.diaSemana, treino.id];

        const [result] = await connection.execute(sql, parametros);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = `DELETE FROM treinos WHERE id = ?`;

        const [result] = await connection.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async findById(id) {
        const sql = `SELECT * FROM treinos WHERE id = ?`;

        const [rows] = await connection.execute(sql, [id]);
        return this.#toTreino(rows[0]);
    }

    async findAll() {
        const sql = `SELECT * FROM treinos`;

        const [rows] = await connection.execute(sql);
        return Promise.all(rows.map(row => this.#toTreino(row)));
    }

    async findByAlunoId(alunoId) {
        const sql = `SELECT * FROM treinos WHERE alunoid = ?`;

        const [rows] = await connection.execute(sql, [alunoId]);
        return Promise.all(rows.map(row => this.#toTreino(row)));
    }
}