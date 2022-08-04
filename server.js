const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

app.use(express.static("public"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
// I did the above so that I could get at the subfolders in the /views folder

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/nyc-eats", require("./routes/nyc_eatsRoutes"));
// So the routes in that file will handle any requests coming in at the "/nyc-eats" endpoint

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
