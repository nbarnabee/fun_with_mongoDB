require("dotenv").config();
const dbString = process.env.DB_STRING,
  { MongoClient } = require("mongodb"),
  client = new MongoClient(dbString);

/* This does at least something to reduce the number of fast food returns, but it could be better.  There are a lot of variations on Jimbo's and Mcdonald'S, and a better $nor statement would trigger on a partial match.
        Fortunately I am sure that I will learn this new secret soon. */
let ffList = [
  { name: "Mcdonald'S" },
  { name: "Wendy'S" },
  { name: "White Castle" },
  { name: "Burger King" },
  { name: "Burger King, Popeye'S" },
  { name: "Jimbo'S Hamburger Palace" },
  { name: "Jimbos Hamburger Palace" },
  { name: "Checkers" },
  { name: "Popeyes Chicken & Biscuits" },
  { name: "Crown Fried Chicken" },
];

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
    let dbQuery =
      req.query.fastFood === "noFF"
        ? {
            borough: req.query.borough,
            cuisine: req.query.cuisine,
            $nor: ffList,
          }
        : {
            borough: req.query.borough,
            cuisine: req.query.cuisine,
          };
    const db = client.db("sample_restaurants");
    let results = await db
      .collection("restaurants")
      .find(dbQuery, { projection: { _id: 0, address: 1, name: 1 } })
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
    // Leaving this commented out.  If it's active, the program has trouble handling repeated searches; for some reason it doesn't want to reconnect.  Or maybe it's just being slow; I'm not sure.  I'm afraid this might create some issues further down the line if I'm trying to open another connection.  More research required.
  }
};
