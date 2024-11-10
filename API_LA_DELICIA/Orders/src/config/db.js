import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.ORDER_DB_USER || 'user',
    database: process.env.ORDER_DB_NAME || 'order_db',
    password: process.env.ORDER_DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432')
});

console.log('Database connection config:', {
    host: process.env.DB_HOST,
    database: process.env.ORDER_DB_NAME,
    port: process.env.DB_PORT
});

export default pool;