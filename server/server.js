
const app = require("./app");
const port = process.env.PORT || 5000;

const server = require('http').createServer({
  maxHeaderSize: 16384  // Set the desired header size limit in bytes (16KB in this example)
},app);

server.listen(port, () => {
  console.log("Listening on " + port);
});