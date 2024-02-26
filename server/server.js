
const app = require("./app");
const port = process.env.PORT || 5000;

const server = require('http').createServer(app);

server.listen(port, () => {
  console.log("Listening on " + port);
});