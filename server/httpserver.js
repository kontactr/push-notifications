const app = require("./app");
const http = require("http");

let httpServer = http.createServer(app);

module.exports = httpServer;
