const express = require("express");
const app = express();

app.set("port", 8080);

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile("index.html");
// });
app.use(express.static(__dirname));

var server = app.listen(app.get("port"), function () {
  var port = server.address().port;
  console.log(`Open: http://localhost:${port}`);
});
