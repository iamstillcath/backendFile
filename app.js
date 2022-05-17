const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// let api=require('./api/routes/order')
// let user=require('./api/routes/user')

let options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Api documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
    components: {
      securitySchemes: 
      
        {
          bearerAuth: { type: "http", scheme: "bearer",bearerFormat: "JWT"},
          // name: "bearerAuth",
          // in: "header",
          // type: "http",
          // scheme: "bearer",
          // bearerFormat: "JWT",
          // Authorization: 'Bearer'
      },
      
    },
  },

  apis: ["./api/routes/user.js", "./api/routes/order.js"],
};

const swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const orderRoute = require("./api/routes/order");
const userRoute = require("./api/routes/user");

mongoose.connect(
  "mongodb+srv://lucia:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.sgtjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    // useMongoClient:true
  }
);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type",
    "Accept",
    "Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/parcels", orderRoute);
app.use("/user", userRoute);

app.use((req, res, next) => {
  const error = new Error("wrong route input");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
