/** @format */

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
// requiring json web token
const jwt = require("jsonwebtoken");

// middleware setUp
app.use(cors());
app.use(express.json());
// requiring dotenv
require("dotenv").config();

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

// jwt verification
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  // const token = authHeader.split(" ")[1];

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
  //   if (err) {
  //     return res.status(403).send({ message: "Forbidden access" });
  //   }
  //   req.decoded = decoded;

  // });
  next();
}
async function run() {
  try {
    // all db collections
    const usersCollection = client.db("sms-snaps-db").collection("users");
    const servicesCollection = client.db("sms-snaps-db").collection("services");
    const reviewCollection = client.db("sms-snaps-db").collection("reviews");

    // jwt
    app.post("/jwt", (req, res) => {
      const user = req.body;

      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });
    // getting all services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // creating new service
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);

      res.send(result);
    });
    // getting 3 services for home
    app.get("/home/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    // getting single service
    app.get("/services/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = servicesCollection.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });
    // getting all reviews and queries and jwt
    app.get("/reviews", verifyJWT, async (req, res) => {
      let query = {};
      // for specific service
      if (req.query.title) {
        query = {
          title: req.query.title,
        };
        const cursor = reviewCollection.find(query).sort({ date: -1 });
        const reviews = await cursor.toArray();
        res.send(reviews);
      }
      // for specific user
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
      }
    });
    // adding user review and jwt
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);

      res.send(result);
    });
    // updating user review and jwt
    app.patch("/reviews/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const updatedReviewText = req.body;
      filter = { _id: ObjectId(id) };
      // console.log(updatedReviewText);
      // console.log(id);
      const updatedReview = {
        $set: {
          reviewText: updatedReviewText.updatedReviewText,
        },
      };
      const result = await reviewCollection.updateOne(filter, updatedReview);

      res.send(result);
    });
    // deleting single review and jwt
    app.delete("/reviews/:id", verifyJWT, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(filter);
      console.log(result);
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`S.M.'s SnaP server is running at port${port}`);
});
