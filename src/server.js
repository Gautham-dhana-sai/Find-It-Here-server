const express = require("express")();
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const mongoConnection = require('./db')
const index = require("./index");

const PORT = process.env.SERVER_PORT;

const server = http.createServer(express);

mongoConnection()
express.use(bodyParser.json());
express.use(cors());
express.use(index);

server.listen(PORT, (req, res) => {
  console.log("server started");
});

module.exports = server;
