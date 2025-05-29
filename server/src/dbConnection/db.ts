import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // If true, the pool will queue connections when no connections are available
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // No limit to the number of requests that can be queued
});

pool.getConnection().then((connection) => {
    console.log("Connected to the database");
    connection.release();
}).catch((err) => {
    console.error("Error connecting to the MYSQL: ", err);
    process.exit(1);
})

export default pool
