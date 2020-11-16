const io = require("../socket");

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat", (msg) => {
    console.log("message: " + msg);
    socket.emit("chat", "Only me");
    socket.broadcast.emit("chat", "Everyone except sender");
    io.emit("chat", "All");
  });
});
