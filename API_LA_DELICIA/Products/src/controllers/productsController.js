import { Product } from "../models/productsModel.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ProductController {
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
        return res
          .status(404)
          .json({ message: "Producto no encontrado con este id" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductsByName(req, res) {
    try {
      const products = await Product.findByName(req.params.name_product);
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "Producto no encontrado con este nombre" });
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductsByPrice(req, res) {
    try {
      const products = await Product.findByPrice(req.params.price_product);
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "Producto no encontrado con este precio" });
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
        return res
          .status(404)
          .json({ message: "Producto no disponible en stock" });
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
        return res
          .status(404)
          .json({ message: "Producto no encontrado con este SKU" });
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const {
        name_product,
        price_product,
        categoryid,
        stock,
        ingredients,
        baking_time,
      } = req.body;

      if (
        !name_product ||
        !price_product ||
        !categoryid ||
        !stock ||
        !ingredients ||
        !baking_time
      ) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No se proporcionó una imagen" });
      }

      const uploadImage = async (imagePath) => {
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        };
        try {
          const result = await cloudinary.uploader.upload(imagePath, options);
          return result.url;
        } catch (error) {
          console.error("Error al subir imagen:", error);
          throw error;
        }
      };

      const imageUrl = await uploadImage(req.file.path);

      const newProduct = {
        name_product,
        price_product,
        categoryid,
        stock,
        ingredients,
        baking_time,
        image: imageUrl,
      };

      const result = await Product.create(newProduct);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const {
        name_product,
        price_product,
        categoryid,
        stock,
        ingredients,
        baking_time,
      } = req.body;

      const bakingTimeInterval = `${baking_time} minutes`;

      if (
        !name_product ||
        !price_product ||
        !categoryid ||
        !stock ||
        !ingredients ||
        !baking_time
      ) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No se proporcionó una imagen" });
      }

      const uploadImage = async (imagePath) => {
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        };
        try {
          const result = await cloudinary.uploader.upload(imagePath, options);
          return result.url;
        } catch (error) {
          console.error("Error al subir imagen:", error);
          throw error;
        }
      };

      const imageUrl = await uploadImage(req.file.path);

      const updatedProductData = {
        name_product,
        price_product,
        categoryid,
        stock,
        ingredients,
        baking_time: bakingTimeInterval,
        image: imageUrl,
      };

      const updatedProduct = await Product.update(
        req.params.id,
        updatedProductData
      );
      return res.json(updatedProduct);
    } catch (error) {
      if (error.message.includes("No se encontró el producto")) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      console.error(error);
      return res.status(500).json({ error: error.message });
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

export default ProductController;
