import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET no está definido en las variables de entorno");
  process.exit(1);
}

function generateAccessToken(user) {
  const payload = {
    username: user.username,
    email: user.email,
    role: user.role || 'user'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

function createErrorResponse(status, message) {
  return { status, message, user: null };
}

function validateJwtToken(token, res) {
  if (!token) {
    return res
      .status(401)
      .json(
        createErrorResponse(401, "Acceso denegado. No se proporcionó token.")
      );
  }

  if (!token.startsWith("Bearer ")) {
    return res
      .status(401)
      .json(
        createErrorResponse(
          401,
          "Tipo de token inválido. Se requiere token Bearer."
        )
      );
  }

  const actualToken = token.split(" ")[1];

  try {
    const decoded = jwt.verify(actualToken, JWT_SECRET);
    return { 
      status: 200, 
      user: {
        username: decoded.username,
        email: decoded.email,
        role: decoded.role || 'user'
      }, 
      message: "Token válido" 
    };
  } catch (error) {
    console.error("Error al verificar el token:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json(createErrorResponse(401, "Token expirado."));
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(403)
        .json(createErrorResponse(403, "Token inválido. Firma no válida."));
    } else {
      return res
        .status(500)
        .json(
          createErrorResponse(
            500,
            "Error interno del servidor durante la validación del token."
          )
        );
    }
  }
}

function checkRole(roles) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Acceso denegado. Rol insuficiente." });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido" });
    }
  };
}

export { generateAccessToken, validateJwtToken, checkRole };
