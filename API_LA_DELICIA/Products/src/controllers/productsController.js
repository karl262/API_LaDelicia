const Product = require('../models/productsModel');

class ProductController {

    static async getAllProducts(req, res) {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Producto no encontrado con este id" });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProductsByName(req, res) {
        try {
            const products = await Product.findByName(req.params.name);
            if (products.length === 0) {
                return res.status(404).json({ message: "Producto no encontrado con este nombre" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProductsByPrice(req, res) {
        try {
            const products = await Product.findByPrice(req.params.price);
            if (products.length === 0) {
                return res.status(404).json({ message: "Producto no encontrado con este precio" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProductsByStock(req, res) {
        try {
            const products = await Product.findByStock(req.params.stock);
            if (products.length === 0) {
                return res.status(404).json({ message: "Producto no disponible en stock" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getProductsBySku(req, res) {
        try {
            const products = await Product.findBySku(req.params.sku);
            if (products.length === 0) {
                return res.status(404).json({ message: "Producto no encontrado con este SKU" });
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createProduct(req, res) {
        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateProduct(req, res) {
        try {
            const updatedProduct = await Product.update(req.params.id, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteProduct(req, res) {
        try {
            const deletedProduct = await Product.delete(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }
            res.json({ message: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = ProductController;
