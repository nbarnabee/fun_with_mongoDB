require("dotenv").config();
const dbString = process.env.DB_STRING,
  { MongoClient } = require("mongodb"),
  client = new MongoClient(dbString);

exports.nycEatsIndex = (req, res) => {
  try {
    res.render("./nyc_eats/index.ejs", {
      layout: "./layouts/nyc_eats",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.nycEatsSearch = async (req, res) => {
  try {
    const db = client.db("sample_restaurants");
    let results = await db
      .collection("restaurants")
      .find(
        { borough: req.query.borough, cuisine: req.query.cuisine },
        { projection: { _id: 0, address: 1, name: 1 } }
      )
      .limit(5)
      .toArray();
    res.render("./nyc_eats/results.ejs", {
      results,
      layout: "./layouts/nyc_eats",
    });
  } catch (error) {
    console.log(error);
    // } finally {
    //   await client.close();
    // Leaving this commented out.  If it's active, the program has trouble handling repeated searches; for some reason it doesn't want to reconnect.  Or maybe it's just being slow; I'm not sure.  I'm afraid this might create some issues further down the line, if I'm trying to open another connection.
  }
};
