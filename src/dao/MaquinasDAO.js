import connection from "../database/Connection.js";
import Maquinas from "../models/entities/Maquinas.js";

export default class MaquinasDAO {
    #toMaquina(row) {
        if (!row) return null;
        return new Maquinas(row.id, row.nome, row.agrupamento, row.fabricante);
    }

    async insert(maquina) {
        const sql = `INSERT INTO maquinas (fabricante, nome, agrupamento)
                     VALUES (?, ?, ?)`;
        const parametros = [maquina.fabricante, maquina.nome, maquina.agrupamento];

        const [result] = await connection.execute(sql, parametros);
        return result.insertId;
    }

    async update(maquina) {
        const sql = `UPDATE maquinas
                     SET fabricante = ?, nome = ?, agrupamento = ?
                     WHERE id = ?`;
        const parametros = [maquina.fabricante, maquina.nome, maquina.agrupamento, maquina.id];

        const [result] = await connection.execute(sql, parametros);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = `DELETE FROM maquinas WHERE id = ?`;

        const [result] = await connection.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async findById(id) {
        const sql = `SELECT * FROM maquinas WHERE id = ?`;

        const [rows] = await connection.execute(sql, [id]);
        return this.#toMaquina(rows[0]);
    }

    async findAll() {
        const sql = `SELECT * FROM maquinas`;

        const [rows] = await connection.execute(sql);
        return rows.map(row => this.#toMaquina(row));
    }
}