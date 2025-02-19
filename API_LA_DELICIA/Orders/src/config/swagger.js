import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Microservicio_Pedidos - La Delicia",
      version: "1.0.0",
      description: `
        Este microservicio gestiona las ventas y pedidos de la plataforma **La Delicia**.
        Ofrece endpoints para convertir pedidos en ventas, crear nuevos pedidos, obtener información sobre pedidos específicos y actualizar el estado de los pedidos.

        ### Funcionalidades principales:
        - **Convertir un pedido en una venta**
        - **Crear un nuevo pedido**
        - **Obtener pedido por ID**
        - **Actualizar el estado de un pedido**
      `,
    },
    servers: [
      {
        url: "https://stirred-sculpin-carefully.ngrok-free.app",
      },
    ],
  },
  apis: ["./src/routes/orderRoutes.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use(
    "/docs/orders/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
};

export default setupSwagger;
