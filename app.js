const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const serverless=require("serverless-http")

require("dotenv").config();

const PORT = process.env.PORT || 5000;

let options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Api documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
    components: {
      
      securitySchemes: 
      
        {
          bearerAuth: { type: "http", scheme: "bearer",bearerFormat: "JWT"},
        
      },
    },
  },

  apis: ["./api/routes/user.js", "./api/routes/order.js"],
};

const swaggerSpec = swaggerJsDoc(options);
app.use("/api-docs/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static(path.join(__dirname, 'static')));



const orderRoute = require("./api/routes/order");
const userRoute = require("./api/routes/user");

mongoose.connect(process.env.DATABASE_URL)
.then(success=>{})
.catch(error=>{})

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
    res.header("Access-Control-Allow-Methods", "Authorization","PUT, GET, POST, PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'../front/index.html'));
});

// app.get("/signup", (req,res)=>{
//   res.render("register.html")
// })

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

app.listen(PORT, () => console.log(`app is running on port ${PORT}`))

module.exports = app;
