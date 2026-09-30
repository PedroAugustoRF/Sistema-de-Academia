import mysql from "mysql2/promise";

/**
 * Conexão com o MySQL.
 *
 * As credenciais vêm de variáveis de ambiente (arquivo backend/.env carregado
 * na inicialização). Os valores padrão abaixo servem apenas para
 * desenvolvimento local e nunca chegam ao navegador — o front-end fala só
 * com a API REST.
 */
const connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "academia",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connection;
