const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
const dbString = process.env.DB_STRING,
  { MongoClient } = require("mongodb"),
  dbName = "sample_restaurants";
let db;

MongoClient.connect(dbString, { useUnifiedTopology: true }).then((client) => {
  console.log(`Connected to ${dbName}`);
  db = client.db(dbName);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/nycEats", (req, res) => {
  try {
    res.render("./nyc_eats/index.ejs", {
      layout: "./layouts/nyc_eats",
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/nycEats/search", async (req, res) => {
  let results = await db
    .collection("restaurants")
    .find(
      { borough: req.query.borough, cuisine: req.query.cuisine },
      { projection: { _id: 0, address: 1, name: 1 } }
    )
    .limit(5)
    .toArray();
  console.log(results);
  res.render("./nyc_eats/results.ejs", {
    results,
    layout: "./layouts/nyc_eats",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
