const User = require('../models/usersMoldel');
const { body, validationResult } = require('express-validator');

class UserController {

    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserByUserName(req, res) {
        try {
            const users = await User.findByUserName(req.params.name);
            if (users.length === 0) {
                return res.status(404).json({ message: "Usuario no encontrado con este nombre" });
            }
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static validateCreateUser = [
        body('name').notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Email inválido'),
        // Añade más validaciones según sea necesario
    ];

    static async createUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email } = req.body;
        try {
            const newUser = await User.create(name, email);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        const { name, email } = req.body;
        try {
            const updatedUser = await User.update(req.params.id, name, email);
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
            const deletedUser = await User.delete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.json(deletedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}
module.exports = UserController;
