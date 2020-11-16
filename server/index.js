const httpServer = require("./httpserver");
require("./events");
require("./routes");

httpServer.listen(4000, () => {
  console.log("server is running on *:4000");
});
