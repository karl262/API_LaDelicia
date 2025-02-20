import axios from "axios";

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "No se proporcionó token de autenticación" });
  }

  try {
    const response = await axios.post(
      "http://auth-service:3000/api/auths/verify-token",
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { username, email, role } = response.data.usuario;

    req.user = {
      username,
      email,
      role
    };

    next();
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ message: error.response.data.mensaje });
    }
    console.error("Error al verificar el token:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: "Acceso denegado. Rol insuficiente.",
        userRole: req.user.role,
        allowedRoles 
      });
    }

    next();
  };
};

export default authMiddleware;
