import connection from "../database/Connection.js";
import Usuarios from "../models/entities/Usuarios.js";

export default class UsuariosDAO {
    #toUsuario(row) {
        if (!row) return null;
        return new Usuarios(row.id, row.nome, row.cpf, row.email, row.senha, row.celular, row.aniversario, row.cargo);
    }

    async insert(usuario) {
        const sql = `INSERT INTO usuarios (aniversario, celular, cpf, nome, email, senha, cargo)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const parametros = [usuario.aniversario ?? null, usuario.celular ?? null, usuario.cpf ?? null, usuario.nome, usuario.email, usuario.senha, usuario.cargo ?? "aluno"];

        const [result] = await connection.execute(sql, parametros);
        return result.insertId;
    }

    async update(usuario) {
        const sql = `UPDATE usuarios
                     SET aniversario = ?, celular = ?, cpf = ?, nome = ?, email = ?, cargo = ?
                     WHERE id = ?`;
        const parametros = [usuario.aniversario ?? null, usuario.celular ?? null, usuario.cpf ?? null, usuario.nome, usuario.email, usuario.cargo, usuario.id];

        const [result] = await connection.execute(sql, parametros);
        return result.affectedRows > 0;
    }

    async updateSenha(id, senhaHash) {
        const sql = `UPDATE usuarios SET senha = ? WHERE id = ?`;
        const [result] = await connection.execute(sql, [senhaHash, id]);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = `DELETE FROM usuarios WHERE id = ?`;

        const [result] = await connection.execute(sql, [id]);
        return result.affectedRows > 0;
    }

    async findById(id) {
        const sql = `SELECT * FROM usuarios WHERE id = ?`;

        const [rows] = await connection.execute(sql, [id]);
        return this.#toUsuario(rows[0]);
    }

    async findByEmail(email) {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;

        const [rows] = await connection.execute(sql, [email]);
        return this.#toUsuario(rows[0]);
    }

    async findAll() {
        const sql = `SELECT * FROM usuarios`;

        const [rows] = await connection.execute(sql);
        return rows.map(row => this.#toUsuario(row));
    }
}
