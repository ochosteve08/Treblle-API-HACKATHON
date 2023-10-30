
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");




const swaggerOptions = {
  definition: {
    openapi: "3.0.0", 
    info: {
      title: "TODO API Documentation",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
  },

  apis: ["../controllers/index.js"],
};




const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Function to setup our docs
const swaggerDocs = (app, port) => {
 
  app.use("api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
  app.get("api/v1/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(
    `Version 1 Docs are available on http://localhost:${port}/api/v1/docs`
  );
   
};



module.exports = { swaggerDocs };
