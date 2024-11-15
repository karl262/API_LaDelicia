import axios from 'axios';


const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
  }

  try {
    const response = await axios.post('http://auth-service:3000/api/auth/verify-token', null, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    req.user = response.data.user;
    next();
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ message: error.response.data.message });
    }
    console.error('Error al verificar el token:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export default authMiddleware;