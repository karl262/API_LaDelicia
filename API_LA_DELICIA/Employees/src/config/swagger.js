import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Microservicio_Empleados - La Delicia",
      version: "1.0.0",
      description: `
        Este microservicio gestiona la información de empleados de la plataforma **La Delicia**.
        Proporciona endpoints para crear, leer, actualizar y eliminar información de empleados.

        ### Funcionalidades principales:
        - **Obtener todos los empleados**
        - **Obtener empleado por ID**
        - **Obtener empleado por nombre**
        - **Crear un nuevo empleado**
        - **Actualizar un empleado existente**
        - **Eliminar un empleado**
      `,
    },
    servers: [
      {
        url: "https://stirred-sculpin-carefully.ngrok-free.app",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use(
    "/docs/employees/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};

export default setupSwagger;
