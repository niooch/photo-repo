// config/db.js
require('dotenv').config(); //zczytanie zmiennych srodowiskowych z pliku .env
const mysql = require('mysql2/promise'); //polaczenie do interfejs asynchronicznego mysql

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});

module.exports = pool;
