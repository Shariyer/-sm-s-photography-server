/** @format */

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

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
async function run() {
  try {
    // all db collections
    const usersCollection = client.db("sms-snaps-db").collection("users");
    const servicesCollection = client.db("sms-snaps-db").collection("services");
    const reviewCollection = client.db("sms-snaps-db").collection("reviews");
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
    // getting all reviews and queries
    app.get("/reviews", async (req, res) => {
      let query = {};
      // for specific service
      if (req.query.title) {
        query = {
          title: req.query.title,
        };
      }
      // for specific user
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    // adding user review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);

      res.send(result);
    });
    // updating user review
    app.patch("/reviews/:id", async (req, res) => {
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
    // deleting single review
    app.delete("/reviews/:id", async (req, res) => {
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
