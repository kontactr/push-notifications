const httpServer = require("./httpserver");
const io = require("socket.io");

module.exports = io(httpServer);
