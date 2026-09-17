import connection from "../database/Connection.js";
import Treino from "../models/entities/Treino.js";
import UsuariosDAO from "./UsuariosDAO.js";
import ExerciciosDAO from "./ExerciciosDAO.js";

export default class TreinoDAO {
    #usuariosDAO = new UsuariosDAO();
    #exerciciosDAO = new ExerciciosDAO();

    async #toTreino(row) {
        if (!row) return null;
        const usuario = await this.#usuariosDAO.findById(row.usuarioid);
        const exercicios = await this.#exerciciosDAO.findByTreinoId(row.id);
        return new Treino(row.id, usuario, row.diaSemana, exercicios);
    }

    async insert(treino) {
        const sql = `INSERT INTO treinos (usuarioid, diaSemana)
                     VALUES (?, ?)`;
        const parametros = [treino.usuarioid, treino.diaSemana];

        const [result] = await connection.execute(sql, parametros);
        return result.insertId;
    }

    async update(treino) {
        const sql = `UPDATE treinos
                     SET usuarioid = ?, diaSemana = ?
                     WHERE id = ?`;
        const parametros = [treino.usuarioid, treino.diaSemana, treino.id];

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

    async findByUsuarioId(usuarioId) {
        const sql = `SELECT * FROM treinos WHERE usuarioid = ?`;

        const [rows] = await connection.execute(sql, [usuarioId]);
        return Promise.all(rows.map(row => this.#toTreino(row)));
    }
}