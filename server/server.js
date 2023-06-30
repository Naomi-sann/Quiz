const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const capitals = require("./capitals");
const math = require("./math");

const app = express();
const port = 9000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/questions/:category", (req, res) => {
  const category = req.params.category;

  if (category === "geography") {
    res.json(capitals);
  } else if (category === "math") {
    res.json(math);
  } else {
    res.status(400);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
