const express = require("express");
const router = express.Router();
const controllers = require("../controllers/nyc_eatsControllers");

router.get("/", controllers.nycEatsIndex);

router.get("/search", controllers.nycEatsSearch);

module.exports = router;
