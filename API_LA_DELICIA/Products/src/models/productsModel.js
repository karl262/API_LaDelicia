import  pool  from '../config/db.js';

export class Product {

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
        const result = await pool.query('SELECT * FROM products WHERE price_product = $1 AND delete_at IS NULL', [price]);
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
        const { name_product, price_product, stock, ingredients, baking_time } = product; // Cambié los nombres de las propiedades
        const result = await pool.query(
            'INSERT INTO products (name_product, price_product, stock, ingredients, baking_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name_product, price_product, stock, ingredients, baking_time]
        );
        return result.rows[0];
    }

    static async update(id, product) {
        const { name_product, price_product, stock, ingredients, baking_time } = product; // Cambié los nombres de las propiedades
        const result = await pool.query(
            'UPDATE products SET name_product = $1, price_product = $2, stock = $3, ingredients = $4, baking_time = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [name_product, price_product, stock, ingredients, baking_time, id]
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

export default Product;
