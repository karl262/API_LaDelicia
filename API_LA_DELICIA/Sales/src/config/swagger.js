import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Microservicio_Ventas - La Delicia",
      version: "1.0.0",
      description: `
      Este microservicio gestiona las ventas en la plataforma **La Delicia**. Permite obtener información sobre las ventas realizadas, consultar los detalles de una venta específica y eliminar ventas.

      ### Funcionalidades principales:
      - **Obtener todas las ventas**
      - **Obtener detalles de una venta por ID**
      - **Eliminar una venta**
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

const swaggerDocs = (app) => {
  app.use(
    "/docs/sales/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
  console.log(
    "Swagger docs available at https://stirred-sculpin-carefully.ngrok-free.app/docs/sales/api-docs"
  );
};

export default swaggerDocs;
