const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.AUTH_DB_USER,
    password: process.env.AUTH_DB_PASSWORD,
    database: process.env.AUTH_DB_NAME,
    port: process.env.DB_PORT || 5432
});

console.log('Database connection config:', {
    host: process.env.DB_HOST,
    user: process.env.AUTH_DB_USER,
    database: process.env.AUTH_DB_NAME,
    port: process.env.DB_PORT || 5432
});

module.exports = pool;