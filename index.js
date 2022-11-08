/** @format */

const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

// middleware setUp
app.use(cors());
app.use(express.json());

// root
app.get("/", (req, res) => {
  res.send("Welcome!! S.M.'S Snap's SERVER IS RUNNING");
});

//database and client connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dhtiicz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const userCollection = client.db("sms-snaps-db").collection("users");
  } finally {
    // await client.close()
  }
}
run().catch((err) => console.log(err));

app.listen(port, (req, res) => {
  console.log(`S.M.'s SnaP server is running at port${port}`);
});
