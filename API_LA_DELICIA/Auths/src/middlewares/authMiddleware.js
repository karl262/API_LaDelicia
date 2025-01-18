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
    return { status: 200, user: decoded, message: "Token válido" };
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

export { generateAccessToken, validateJwtToken };
