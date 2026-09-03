import connection from "../database/Connection.js";
import Exercicios from "../models/entities/Exercicios.js";
import MaquinasDAO from "./MaquinasDAO.js";

export default class ExerciciosDAO {
    #maquinasDAO = new MaquinasDAO();

    async #toExercicio(row) {
        if (!row) return null;
        const maquina = await this.#maquinasDAO.findById(row.maquinaid);
        return new Exercicios(row.id, null, maquina, row.series, row.repeticoes, row.carga);
    }

    async insert(exercicio) {
        const sql = `INSERT INTO exercicios (carga, maquinaid, repeticoes, series, treinoid)
                     VALUES (?, ?, ?, ?, ?)`;
        const parametros = [exercicio.carga, exercicio.maquinaid, exercicio.repeticoes,
            exercicio.series, exercicio.treinoid
        ];

        const [result] = await connection.execute(sql, parametros);
        return result.insertId;
    }

    async update(exercicio) {
        const sql = `UPDATE exercicios
                     SET carga = ?, maquinaid = ?, repeticoes = ?, series = ?, treinoid = ?
                     WHERE id = ?`;
        const parametros = [exercicio.carga, exercicio.maquinaid, exercicio.repeticoes,
            exercicio.series, exercicio.treinoid, exercicio.id
        ];

        const [result] = await connection.execute(sql, parametros);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = `DELETE FROM exercicios WHERE id = ?`;

        const [result] = await connection.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async findById(id) {
        const sql = `SELECT * FROM exercicios WHERE id = ?`;

        const [rows] = await connection.execute(sql, [id]);
        return this.#toExercicio(rows[0]);
    }

    async findAll() {
        const sql = `SELECT * FROM exercicios`;

        const [rows] = await connection.execute(sql);
        return Promise.all(rows.map(row => this.#toExercicio(row)));
    }

    async findByTreinoId(treinoId) {
        const sql = `SELECT * FROM exercicios WHERE treinoid = ?`;

        const [rows] = await connection.execute(sql, [treinoId]);
        return Promise.all(rows.map(row => this.#toExercicio(row)));
    }
}