import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.SALE_DB_USER || "user",
  password: process.env.SALE_DB_PASSWORD || "password",
  database: process.env.SALE_DB_NAME || "sale_db",
  port: parseInt(process.env.DB_PORT || "5432"),
});

console.log("Database connection config:", {
  host: process.env.DB_HOST,
  user: process.env.USER_DB_USER,
  database: process.env.USER_DB_NAME,
  port: process.env.DB_PORT || 5432,
});

export { pool };
