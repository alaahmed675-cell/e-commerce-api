// routes/seed.routes.js
const express = require("express");
const seedRouter = express.Router();
const seedController = require("../controllers/seedController.js");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

seedRouter.post(
  "/",
  authMiddleware,
  authorize("admin"),
  seedController.runSeed,
);

module.exports = seedRouter;
