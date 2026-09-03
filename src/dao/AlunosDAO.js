import connection from "../database/Connection.js";
import Alunos from "../models/entities/Alunos.js";

export default class AlunosDAO {
    #toAluno(row) {
        if (!row) return null;
        return new Alunos(row.id, row.nome, row.cpf, row.celular, row.aniversario);
    }

    async insert(aluno) {
        const sql = `INSERT INTO alunos (aniversario, celular, cpf, nome)
                     VALUES (?, ?, ?, ?)`;
        const parametros = [aluno.aniversario, aluno.celular, aluno.cpf, aluno.nome];

        const [result] = await connection.execute(sql, parametros);
        return result.insertId;
    }

    async update(aluno) {
        const sql = `UPDATE alunos
                     SET aniversario = ?, celular = ?, cpf = ?, nome = ?
                     WHERE id = ?`;
        const parametros = [aluno.aniversario, aluno.celular, aluno.cpf, aluno.nome, aluno.id];

        const [result] = await connection.execute(sql, parametros);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = `DELETE FROM alunos WHERE id = ?`;

        const [result] = await connection.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async findById(id) {
        const sql = `SELECT * FROM alunos WHERE id = ?`;

        const [rows] = await connection.execute(sql, [id]);
        return this.#toAluno(rows[0]);
    }

    async findAll() {
        const sql = `SELECT * FROM alunos`;

        const [rows] = await connection.execute(sql);
        return rows.map(row => this.#toAluno(row));
    }
}