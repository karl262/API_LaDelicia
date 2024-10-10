const bcrypt = require('bcryptjs');
const pool = require('../config/db');

class authModel {
    static async getDataLogin({ email, username, password }) {
        try {
            console.log('Intentando login con:', { email, username });
            const result = await pool.query('SELECT * FROM auth_user WHERE email = $1 OR username = $2', [email, username]);
            console.log('Resultado de la consulta:', result.rows);
            
            const user = result.rows[0];
            
            if (user) {
                let isMatch;
                if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                    // La contraseña está hasheada
                    isMatch = await bcrypt.compare(password, user.password);
                } else {
                    // La contraseña no está hasheada (temporal, solo para migración)
                    isMatch = password === user.password;
                }
                console.log('¿Contraseña coincide?', isMatch);
                if (isMatch) {
                    const { password, ...userWithoutPassword } = user;
                    return userWithoutPassword;
                }
            }
            console.log('Usuario no encontrado o contraseña incorrecta');
            return null;
        } catch (error) {
            console.error('Error en la autenticación:', error);
            throw new Error('Error en la autenticación');
        }
    }

    static async register(email, username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO auth_user (email, username, password) VALUES ($1, $2, $3) RETURNING *',
            [email, username, hashedPassword]
        );
        return result.rows[0];
    }
}

module.exports = authModel;

