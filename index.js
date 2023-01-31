// Packages
const logger = require("morgan");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");
var schedule = require("node-schedule");
const serverless = require('serverless-http');

// Express object
const app = express();

// env import
dotenv.config();

//Add files
require("./models/index");
const constant = require("./constants");
//Add particular function from file
const {authenticate} = require("./middlewares/auth");

const authRoutes = require("./routes/v1")(express);

app.use(logger("dev"));
app.use(cors());
//Middleware for parsing json objects
app.use(bodyParser.json());
//Middleware for parsing bodies from URL
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());
app.use("/api/v1/auth", authRoutes.auth); //For sign up or login

//Authenticaion middleware

app.get('/', function (req, res) {
  res.send('Hello My babe')
})

app.get('/hello', function (req, res) {
  res.send('Hello World!')
})
app.get('/test', function (req, res) {
    res.send('server testing!')
  })
app.use("/api/v1", authenticate);
Object.keys(authRoutes).map((route) => {
  if (route !== "auth") app.use(`/api/v1/${route}`, authRoutes[route]); //this line is used for routing
});

// const port = process.env.PORT || 5000;
// app.set("port", port);

// const date = new Date(2022, 1, 22, 10, 10, 0);

// const job1 = schedule.scheduleJob("SSH",date, function(){
//   console.log('The world is going to end today.');
// });
// console.log(job1)

const server = http.createServer(app);
require("./services/socket.io").init(server);

server.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on  mode", process.env.PORT || 3000);
});






module.exports.handler = serverless(app);