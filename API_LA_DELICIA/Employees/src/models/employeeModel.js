// import pool from '../config/db.js';
import { pool } from '../config/db.js';

export default class Employee {

    static async findAll() {
        const result = await pool.query('SELECT * FROM employee WHERE delete_at IS NULL');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM employee WHERE id = $1 AND delete_at IS NULL', [id]);
        return result.rows[0];
    }

    static async findByName(name) {
        const result = await pool.query(
            'SELECT * FROM employee WHERE name_employee ILIKE $1 AND delete_at IS NULL',
            [`%${name}%`]
        );
        return result.rows;
    }

    static async create(name_employee, middle_name, last_name, street_address, city_address, postal_code, cellphone_number) {
        const result = await pool.query(
            'INSERT INTO employee (name_employee, middle_name, last_name, street_address, city_address, postal_code, cellphone_number, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) RETURNING *',
            [name_employee, middle_name, last_name, street_address, city_address, postal_code, cellphone_number]
        );
        return result.rows[0];
    }

    static async update(id, name_employee, middle_name, last_name, street_address, city_address, postal_code, cellphone_number) {
        const result = await pool.query(
            'UPDATE employee SET name_employee = $1, middle_name = $2, last_name = $3, street_address = $4, city_address = $5, postal_code = $6, cellphone_number = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
            [name_employee, middle_name, last_name, street_address, city_address, postal_code, cellphone_number, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query(
            'UPDATE employee SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}

// export default Employee;