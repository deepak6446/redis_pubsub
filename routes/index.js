/**
 * router defination file
 */

const express = require("express");
const router = express.Router();

const { startListener, stopListener, publish } = require("../controllers/listeners");

router.get("*", function(req, res, next) {
  console.info(`URL: ${req.url}`);
  return next();
});

/**
 * send ok if all prerequisite are satisfied
 */
router.get("/ping", async (req, res) => {
    res.sendStatus(200);
});

// routes
router.post("/api/v1/start-listening", startListener);
router.delete("/api/v1/stopt-listening/:channel", stopListener)
router.post("/api/v1/publish", publish);
module.exports = router;
