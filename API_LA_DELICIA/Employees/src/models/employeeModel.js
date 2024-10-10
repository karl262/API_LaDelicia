const pool = require('../config/db');

class Employee {

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
            'SELECT * FROM employee WHERE name ILIKE $1 AND delete_at IS NULL',
            [`%${name}%`]
        );
        return result.rows;
    }

    static async findBySalary(salary) {
        const result = await pool.query(
            'SELECT * FROM employee WHERE salary = $1 AND delete_at IS NULL',
            [salary]
        );
        return result.rows;
    }

    static async create(name, email, cellphone_number, salary) {
        const result = await pool.query(
            'INSERT INTO employee (name, email, cellphone_number, salary) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, cellphone_number, salary]
        );
        return result.rows[0];
    }

    static async update(id, name, email, cellphone_number, salary) {
        const result = await pool.query(
            'UPDATE employee SET name = $1, email = $2, cellphone_number = $3, salary = $4, update_at = CURRENT_TIMESTAMP WHERE id = $5 AND delete_at IS NULL RETURNING *',
            [name, email, cellphone_number, salary, id]
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

module.exports = Employee;
