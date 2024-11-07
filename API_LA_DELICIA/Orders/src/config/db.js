const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.ORDER_DB_USER,
    database: process.env.ORDER_DB_NAME,
    password: process.env.ORDER_DB_PASSWORD,
    port: process.env.DB_PORT || 5432
});

console.log('Database connection config:', {
    host: process.env.DB_HOST,
    user: process.env.ORDER_DB_USER,
    database: process.env.ORDER_DB_NAME,
    password: process.env.ORDER_DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = pool;