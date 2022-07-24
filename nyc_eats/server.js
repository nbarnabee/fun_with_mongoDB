const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");

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
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
