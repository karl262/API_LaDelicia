const pool = require('../config/db');

class Product {

    static async findAll() {
        const result = await pool.query('SELECT * FROM products WHERE delete_at IS NULL');
        return result.rows;
    }

    static async findById(id) {
        const result = await pool.query('SELECT * FROM products WHERE id = $1 AND delete_at IS NULL', [id]);
        return result.rows[0];
    }

    static async findByName(name) {
        const result = await pool.query('SELECT * FROM products WHERE name ILIKE $1 AND delete_at IS NULL', [`%${name}%`]);
        return result.rows;
    }

    static async findByPrice(price) {
        const result = await pool.query('SELECT * FROM products WHERE price = $1 AND delete_at IS NULL', [price]);
        return result.rows;
    }

    static async findByStock(stock) {
        const result = await pool.query('SELECT * FROM products WHERE stock = $1 AND delete_at IS NULL', [stock]);
        return result.rows;
    }

    static async findBySku(sku) {
        const result = await pool.query('SELECT * FROM products WHERE sku ILIKE $1 AND delete_at IS NULL', [`%${sku}%`]);
        return result.rows;
    }

    static async create(product) {
        const { name, price, minimum_stock, maximum_stock, stock, sku } = product;
        const result = await pool.query(
            'INSERT INTO products (name, price, minimum_stock, maximun_stock, stock, sku) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, price, minimum_stock, maximum_stock, stock, sku]
        );
        return result.rows[0];
    }

    static async update(id, product) {
        const { name, price, minimum_stock, maximum_stock, stock, sku } = product;
        const result = await pool.query(
            'UPDATE products SET name = $1, price = $2, minimum_stock = $3, maximun_stock = $4, stock = $5, sku = $6, update_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
            [name, price, minimum_stock, maximum_stock, stock, sku, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query(
            'UPDATE products SET delete_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}

module.exports = Product;
