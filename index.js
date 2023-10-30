// Import external packages
const {error} =require('./src/lib-handler')
const express = require("express");
const treblle = require("@treblle/express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
// const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require('./src/doc/swagger.json')

// Import internal modules
const { connectToMongoDb, environmentVariables } = require("./src/config");
const apiRoutes = require("./src/routes");

// Express app
const app = express();

// Middleware
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configure Treblle middleware for request monitoring and protection
// app.use(
//   treblle({
//     apiKey: process.env.TREBLLE_API_KEY,
//     projectId: process.env.TREBLLE_PROJECT_ID,
//     additionalFieldsToMask: [],
//   })
// );


  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));


  console.log(
    `Version 1 Docs are available on http://localhost:${environmentVariables.APP_PORT}/api/v1/docs`
  );

app.use(helmet());
app.use(
  helmet({
    frameguard: {
      action: "deny",
    },
  })
);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60, // 60 requests per hour
});

// Apply rate limiting middleware
app.use(limiter);


// Middleware to set the Allow header
const setAllowHeader = (req, res, next) => {
  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  next();
};

app.use(setAllowHeader);

app.get("/", (req, res) => {
  res.send({ message: "todo API working fine now" });
});

// Use routes
app.use("/api/v1", apiRoutes);


// global error handler
app.use(error.handler);

const main = async () => {
  console.info("Starting server");
  await connectToMongoDb();
  console.info("Connected to MongoDB");
  app.listen(environmentVariables.APP_PORT || 8000, (err) => {
    try {
      console.info(
        `Server running on ${environmentVariables.APP_HOST}:${environmentVariables.APP_PORT}`
      );
    } catch (error) {
      console.log(error);
    }

  });
};

main();

