const PORT = 3000;
const express = require("express");
const morgan = require("morgan");
const app = express();
const { append } = require("express/lib/response");
const server = express();

server.use(morgan("dev")); //logs out the incoming requests
server.use(express.json()); //read incoming JSON from requests

const {client} = require('./db');
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);
