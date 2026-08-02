import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend III - API",
      version: "1.0.0",
      description: "API documentation for Backend III project — CoderHouse",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
