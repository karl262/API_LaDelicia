import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';


const pool = new Pool({
    host: process.env.DB_HOST,  // 'employee-db'
    user: process.env.EMPLOYEE_DB_USER,  // 'user'
    password: process.env.EMPLOYEE_DB_PASSWORD,  // 'password'
    database: process.env.EMPLOYEE_DB_NAME,  // 'employee_db'
    port: process.env.DB_PORT || 5432  // Asegúrate de que este puerto sea 5432
});

console.log('Database connection config:', {
    host: process.env.DB_HOST,
    user: process.env.EMPLOYEE_DB_USER,
    database: process.env.EMPLOYEE_DB_NAME,
    port: process.env.DB_PORT || 5432
});

// export default pool;
export { pool };