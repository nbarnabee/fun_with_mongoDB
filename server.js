const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const PORT = process.env.PORT || 5000;
const nyc_EatsRoutes = require("./routes/nyc_eatsRoutes");
require("dotenv").config();

app.use(express.static("public"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/nycEats", nyc_EatsRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
