import User from '../models/usersMoldel.js';
import {body, validationResult} from 'express-validator';

export default class UserController {

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
            const { user: userData, auth: authData } = user;
            res.json({ userData, authData });
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            res.status(500).json({ error: 'Error al buscar usuarios en la base de datos' });
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
        body('first_name').notEmpty().withMessage('El nombre es requerido'),
        body('last_name').notEmpty().withMessage('El apellido es requerido'),
        body('date_of_birth').notEmpty().withMessage('La fecha de nacimiento es requerida'),
        body('phone_number').notEmpty().withMessage('El número de teléfono es requerido'),
        body('preferred_payment_method').notEmpty().withMessage('El método de pago es requerido')
        // Añade más validaciones según sea necesario
    ];

    static async createUser(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { first_name, last_name, date_of_birth, phone_number, preferred_payment_method, auth_user_id } = req.body;
        try {
            const newUser = await User.create(first_name, last_name, date_of_birth, phone_number, preferred_payment_method, auth_user_id);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        const { first_name, last_name, date_of_birth, phone_number, preferred_payment_method } = req.body;
        try {
            const updatedUser = await User.update(req.params.id, first_name, last_name, date_of_birth, phone_number, preferred_payment_method);
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
