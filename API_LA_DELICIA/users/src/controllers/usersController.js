import User from "../models/usersMoldel.js";
import { body, validationResult } from "express-validator";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default class UserController {
  static async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Add default profile image
      const userData = {
        ...req.body,
        profile_image: process.env.DEFAULT_PROFILE_IMAGE
      };

      const user = await User.create(userData);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async createUserMobile(req, res) {
    try {
        // Log full request body for debugging
        console.log("Received user mobile creation request:", JSON.stringify(req.body, null, 2));

        // Add default profile image if not provided
        const userData = {
            ...req.body,
            profile_image: req.body.profile_image || process.env.DEFAULT_PROFILE_IMAGE
        };

        // Log processed user data
        console.log("Processed user data:", JSON.stringify(userData, null, 2));

        // Create user mobile with authentication and associated client
        const { user, client } = await User.createUserMobile(userData);

        // Log successful user and client creation
        console.log("User mobile and client created successfully:", {
            user: JSON.stringify(user, null, 2),
            client: JSON.stringify(client, null, 2)
        });

        // Respond with success message and created data
        res.status(201).json({
            message: "Usuario móvil y cliente creados exitosamente",
            user: user,
            client: client
        });
    } catch (error) {
        console.error("Error al crear usuario móvil:", {
            message: error.message,
            stack: error.stack,
            requestBody: req.body
        });

        // Handle specific error types
        if (error.message.includes("obligatorios")) {
            return res.status(400).json({
                error: "Error de validación",
                details: error.message
            });
        }

        if (error.message.includes("servicio de autenticación")) {
            return res.status(422).json({
                error: "Error de autenticación",
                details: JSON.stringify(error.message) || "Error desconocido en el servicio de autenticación"
            });
        }

        // Generic server error
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message
        });
    }
}



  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
  
      // If no users found, return appropriate response
      if (users.length === 0) {
        return res.status(404).json({ message: "No se encontraron usuarios" });
      }
  
      // Count users with and without authentication data
      const usersWithAuth = users.filter(u => u.auth !== null);
      const usersWithoutAuth = users.filter(u => u.auth === null);
  
      // Log a warning if some users lack authentication data
      if (usersWithoutAuth.length > 0) {
        console.warn(`${usersWithoutAuth.length} usuarios no tienen datos de autenticación`);
      }
  
      // Respond with user, auth, and client data
      res.status(200).json({
        total: users.length,
        usersWithAuth: usersWithAuth.length,
        usersWithoutAuth: usersWithoutAuth.length,
        data: users // Incluye user, auth y client para cada usuario
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({ 
        error: "Error al obtener usuarios", 
        details: error.message 
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const userData = await User.findById(req.params.id);
      if (!userData) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      
      // Destructure user data and auth data correctly
      const { auth: authData, ...userDetails } = userData;
      
      res.json({ 
        userData: userDetails, 
        authData: authData || null 
      });
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      res
        .status(500)
        .json({ error: "Error al buscar usuarios en la base de datos" });
    }
  }

  static async getUserByUserName(req, res) {
    try {
      const users = await User.findByUserName(req.params.name);
      if (users.length === 0) {
        return res
          .status(404)
          .json({ message: "Usuario no encontrado con este nombre" });
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static validateCreateUser = [
    body("first_name").notEmpty().withMessage("El nombre es requerido"),
    body("last_name").notEmpty().withMessage("El apellido es requerido"),
    body("date_of_birth")
      .notEmpty()
      .withMessage("La fecha de nacimiento es requerida"),
    body("phone_number")
      .notEmpty()
      .withMessage("El número de teléfono es requerido"),
    body("preferred_payment_method")
      .notEmpty()
      .withMessage("El método de pago es requerido"),
    // Añade más validaciones según sea necesario
  ];

  static async updateUser(req, res) {
    try {
      // Obtener el ID del usuario desde los parámetros de la ruta
      const { id } = req.params;
  
      // Eliminar valores undefined o null del cuerpo de la solicitud
      const updateData = Object.fromEntries(
        Object.entries(req.body).filter(([_, v]) => v != null)
      );
  
      // Realizar la actualización
      const updatedUser = await User.updateUser(id, updateData);
      
      // Responder con los datos del usuario y el cliente actualizados
      res.json({
        message: "Usuario actualizado exitosamente",
        data: updatedUser // Incluye user y client
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      
      // Manejar errores específicos
      if (error.message.includes("no encontrado")) {
        return res.status(404).json({ 
          error: "Usuario no encontrado", 
          details: error.message 
        });
      }
  
      if (error.message.includes("campos válidos")) {
        return res.status(400).json({ 
          error: "Datos de actualización inválidos", 
          details: error.message 
        });
      }
      
      // Error genérico del servidor
      res.status(500).json({ 
        error: "Error interno del servidor", 
        details: error.message 
      });
    }
  }

  static async updateUserProfileImage(req, res) {
    try {
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
          console.error("Error al subir imagen de perfil:", error);
          throw error;
        }
      };

      const imageUrl = await uploadImage(req.file.path);
      const updatedUser = await User.updateProfileImage(req.params.id, imageUrl);

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      // Obtener el ID del usuario desde los parámetros de la ruta
      const { id } = req.params;
  
      // Realizar la eliminación lógica del usuario
      const deletedUser = await User.delete(id);
  
      // Verificar si el usuario fue encontrado y eliminado
      if (!deletedUser) {
        return res.status(404).json({ 
          success: false,
          message: "Usuario no encontrado" 
        });
      }
  
      // Responder con el usuario eliminado
      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
        data: deletedUser
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
  
      // Manejar errores específicos
      if (error.message.includes("no encontrado")) {
        return res.status(404).json({ 
          success: false,
          error: "Usuario no encontrado", 
          details: error.message 
        });
      }
  
      // Error genérico del servidor
      res.status(500).json({ 
        success: false,
        error: "Error interno del servidor", 
        details: error.message 
      });
    }
  }
}