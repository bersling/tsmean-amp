"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const server = express();
server.use(cors({ origin: ["http://localhost:8082", "https://www.tsmean.com"], credentials: true }));
server.use('/', express.static(__dirname + '/dist', { extensions: ['html'] }));
const port = process.argv[2] || 8082;
server.listen(port, function () {
    console.log(`listening on port ${port}`);
});
