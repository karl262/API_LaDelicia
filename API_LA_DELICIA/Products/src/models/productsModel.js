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

    static async findByName(name_product) {
        const result = await pool.query('SELECT * FROM products WHERE name_product ILIKE $1 AND delete_at IS NULL', [`%${name_product}%`]);
        return result.rows;
    }

    static async findByPrice(price_product) {
        const result = await pool.query('SELECT * FROM products WHERE price_product = $1 AND delete_at IS NULL', [price_product]);
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
        if (!product) {
            throw new Error('El objeto product es requerido');
        }
    
        const { name_product, price_product, categoryid, stock, ingredients, baking_time, image } = product;
    
        const imageValue = image || 'default-image-url.jpg';

        // Convertir baking_time a un intervalo de minutos
        const bakingTimeInterval = `${baking_time} minutes`;
    
        const result = await pool.query(
            'INSERT INTO products (name_product, price_product, categoryid, stock, ingredients, baking_time, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name_product, price_product, categoryid, stock, ingredients, bakingTimeInterval, imageValue]
        );
    
        return result.rows[0];
    }
    

    static async update(id, product) {
        if (!product) {
           throw new Error('El objeto product es requerido');
        }
        const { name_product, price_product, categoryid, stock, ingredients, baking_time, image } = product;
        const imageValue = image || 'default-image-url.jpg';
        
        // Convertir baking_time a un intervalo de minutos
        const bakingTimeInterval = `${baking_time} minutes`;
       
        const result = await pool.query(
           'UPDATE products SET name_product = $1, price_product = $2, categoryid = $3, stock = $4, ingredients = $5, baking_time = $6, image = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
           [name_product, price_product, categoryid, stock, ingredients, bakingTimeInterval, imageValue, id]
        );
        if (result.rowCount === 0) {
           throw new Error(`No se encontró el producto con id ${id}`);
        }
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
