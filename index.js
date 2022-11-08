/** @format */

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// middleware setUp
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome!! S.M.'S Snap's SERVER IS RUNNING");
});

app.listen(port, (req, res) => {
  console.log(`S.M.'s SnaP server is running at port${port}`);
});
