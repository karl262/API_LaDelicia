import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,  // 'product-db'
    user: process.env.PRODUCT_DB_USER,  // 'user'
    password: process.env.PRODUCT_DB_PASSWORD,  // 'password'
    database: process.env.PRODUCT_DB_NAME,  // 'product_db'
    port: process.env.DB_PORT || 5432  // Asegúrate de que este puerto sea 5432
});

console.log('Database connection config:', {
    host: process.env.DB_HOST,
    user: process.env.PRODUCT_DB_USER,
    database: process.env.PRODUCT_DB_NAME,
    port: process.env.DB_PORT || 5432
});

export default pool;