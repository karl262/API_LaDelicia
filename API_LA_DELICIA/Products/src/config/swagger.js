import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Microservicio_Products",
      version: "1.0.0",
      description: `
      Este microservicio gestiona los productos en la plataforma **La Delicia**. Permite obtener, crear, actualizar y eliminar productos, además de realizar búsquedas de productos por diversos criterios como nombre, precio y cantidad en stock.

      ### Funcionalidades principales:
      - **Obtener todos los productos**
      - **Obtener un producto por ID**
      - **Obtener productos por nombre**
      - **Obtener productos por precio**
      - **Obtener productos por stock**
      - **Crear un nuevo producto**
      - **Actualizar un producto existente**
      - **Eliminar un producto**
    `,
    },
    servers: [
      {
        url: "http://localhost:3100",
      },
    ],
  },
  apis: ["./src/routes/productsRoutes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default function swaggerDocs(app) {
  app.use(
    "/docs/products/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
  console.log(
    "Swagger docs available at http://localhost:3100/docs/products/api-docs"
  );
}
