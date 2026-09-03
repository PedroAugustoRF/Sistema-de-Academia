import mysql from "mysql2/promise";

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "2709",
    database: "academia",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connection;