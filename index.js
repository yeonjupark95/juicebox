require("dotenv").config();
const PORT = 3000;
const express = require("express");
const morgan = require("morgan");
const app = express();
const { append } = require("express/lib/response");
const server = express();
const jwt = require("jsonwebtoken");

const token = jwt.sign({ id: 3, username: "joshua" }, "server secret", {
  expiresIn: "1h",
});

token;

const recoveredData = jwt.verify(token, "server secret");

recoveredData;

//wait 1 hour:
jwt.verify(token, "server secret");

server.use(morgan("dev")); //logs out the incoming requests
server.use(express.json()); //read incoming JSON from requests

const { client } = require("./db");
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

server.get("/background/:color", (req, res, next) => {
  res.send(
    `<h1>${req.params.first} + ${req.params.second} = ${
      Number(req.params.first) + Number(req.params.second)
    }</h1>`
  );
});

const apiRouter = require("./api");
server.use("/api", apiRouter);
